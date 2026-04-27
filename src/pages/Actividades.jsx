import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { hablar, setVozActiva } from '../utils/voz'
import { esInvidente } from '../utils/modo'
import {
  BRAILLE, LAYOUT, TECLA_A_PUNTO,
  NIVELES, LOGROS,
  generarSecuencia, generarOpciones, calcularEstrellas,
  leerProgreso, guardarProgreso,
} from '../data/niveles'
import MatrizBraille from '../components/MatrizBraille'
import PantallaFinNivel from '../components/PantallaFinNivel'

export default function Actividades() {
  const { nivelId } = useParams()
  const navigate = useNavigate()
  const invidente = esInvidente()

  const nivel = NIVELES.find(n => n.id === parseInt(nivelId))

  // ── Estado del juego ─────────────────────────────────────────────────────
  const [secuencia, setSecuencia] = useState([])
  const [indiceActual, setIndiceActual] = useState(0)
  const [matriz, setMatriz] = useState([0,0,0,0,0,0])
  const [estado, setEstado] = useState('jugando') // jugando|correcto|incorrecto|completado
  const [aciertos, setAciertos] = useState(0)
  const [intentos, setIntentos] = useState(0)
  const [mostrarPista, setMostrarPista] = useState(false)
  const [teclaPulsada, setTeclaPulsada] = useState(null)
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null)
  const [tiempo, setTiempo] = useState(nivel?.tiempoLimite || 0)
  const [juegoIniciado, setJuegoIniciado] = useState(false)

  // Para resultado final
  const [logroNuevo, setLogroNuevo] = useState(null)
  const [xpGanado, setXpGanado] = useState(0)
  const [estrellasFinal, setEstrellasFinal] = useState(0)

  const timerRef = useRef(null)

  // ── Inicialización ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!nivel) { navigate('/dashboard'); return }
    setVozActiva(invidente)
    const seq = generarSecuencia(nivel)
    setSecuencia(seq)
    setJuegoIniciado(true)
    if (invidente) {
      setTimeout(() => hablar(`Nivel ${nivel.id}: ${nivel.titulo}. ${nivel.descripcion}`), 400)
    }
  }, [])

  // Pista automática
  useEffect(() => {
    if (nivel?.pistaAutomatica) setMostrarPista(true)
  }, [indiceActual, nivel])

  // Anunciar pregunta nueva
  useEffect(() => {
    if (!juegoIniciado || secuencia.length === 0) return
    const p = secuencia[indiceActual]
    if (!p) return
    if (p.tipo === 'escribir' || p.tipo === 'completar') {
      setTimeout(() => hablar(`Escribe la letra ${p.letra} en braille`), 300)
    } else {
      setTimeout(() => hablar(`¿Qué letra es esta matriz?`), 300)
    }
  }, [indiceActual, juegoIniciado])

  // Timer
  useEffect(() => {
    if (!nivel?.tiempoBonus || !juegoIniciado) return
    timerRef.current = setInterval(() => {
      setTiempo(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          finalizarNivel()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [juegoIniciado])

  // ── Pregunta actual ──────────────────────────────────────────────────────
  const pregunta = secuencia[indiceActual]
  const correcta = pregunta ? BRAILLE[pregunta.letra] : null
  const progreso = secuencia.length > 0 ? Math.round((indiceActual / secuencia.length) * 100) : 0

  // Puntos pre-marcados para tipo 'completar'
  const puntosPreMarcados = useCallback(() => {
    if (!correcta || pregunta?.tipo !== 'completar') return []
    const activos = correcta.map((v,i) => v ? i : -1).filter(i => i !== -1)
    const n = nivel.puntosPreMarcados || 2
    const shuffled = [...activos].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(n, shuffled.length))
  }, [pregunta, correcta, nivel])

  const [puntosFijos, setPuntosFijos] = useState([])

  useEffect(() => {
    if (pregunta?.tipo === 'completar') {
      const fijos = puntosPreMarcados()
      setPuntosFijos(fijos)
      const nueva = [0,0,0,0,0,0]
      fijos.forEach(i => { nueva[i] = 1 })
      setMatriz(nueva)
    } else {
      setPuntosFijos([])
      setMatriz([0,0,0,0,0,0])
    }
    setMostrarPista(nivel?.pistaAutomatica || false)
    setOpcionSeleccionada(null)
    setEstado('jugando')
  }, [indiceActual, secuencia])

  // ── Opciones múltiples ───────────────────────────────────────────────────
  const opciones = useCallback(() => {
    if (!pregunta || (pregunta.tipo !== 'leer' && pregunta.tipo !== 'mixto')) return []
    const cant = nivel.opcionesPorPregunta || 4
    return generarOpciones(pregunta.letra, cant)
  }, [pregunta, nivel])

  const [opcionesActuales, setOpcionesActuales] = useState([])
  useEffect(() => {
    if (pregunta?.tipo === 'leer' || (pregunta?.tipo === 'mixto' && pregunta.tipoReal === 'leer')) {
      setOpcionesActuales(opciones())
    }
  }, [indiceActual, secuencia])

  // ── Validar respuesta ────────────────────────────────────────────────────
  const validar = useCallback(() => {
    if (estado !== 'jugando' || !pregunta) return

    let esCorrecta = false

    if (pregunta.tipo === 'leer') {
      esCorrecta = opcionSeleccionada === pregunta.letra
    } else {
      // escribir o completar
      esCorrecta = matriz.every((v, i) => v === correcta[i])
    }

    setIntentos(prev => prev + 1)

    if (esCorrecta) {
      setEstado('correcto')
      setAciertos(prev => prev + 1)
      hablar(`¡Correcto! Letra ${pregunta.letra}`)

      setTimeout(() => {
        if (indiceActual + 1 >= secuencia.length) {
          clearInterval(timerRef.current)
          finalizarNivel()
        } else {
          setIndiceActual(prev => prev + 1)
          setEstado('jugando')
        }
      }, 900)
    } else {
      setEstado('incorrecto')
      hablar(`Incorrecto. Intenta de nuevo con ${pregunta.letra}`)
      setTimeout(() => {
        setEstado('jugando')
        if (pregunta.tipo !== 'leer') {
          // Restaurar solo los puntos no fijos
          const nueva = [0,0,0,0,0,0]
          puntosFijos.forEach(i => { nueva[i] = 1 })
          setMatriz(nueva)
        }
        setOpcionSeleccionada(null)
      }, 900)
    }
  }, [estado, pregunta, matriz, correcta, opcionSeleccionada, indiceActual, secuencia, puntosFijos])

  const limpiar = useCallback(() => {
    if (estado !== 'jugando') return
    const nueva = [0,0,0,0,0,0]
    puntosFijos.forEach(i => { nueva[i] = 1 })
    setMatriz(nueva)
    setEstado('jugando')
    setMostrarPista(nivel?.pistaAutomatica || false)
    hablar('Matriz limpiada')
  }, [puntosFijos, nivel, estado])

  // ── Fin de nivel ─────────────────────────────────────────────────────────
  const finalizarNivel = useCallback(() => {
    const totalPregs = secuencia.length
    const precision = totalPregs > 0 ? Math.round((aciertos / totalPregs) * 100) : 0
    const estrellas = calcularEstrellas(precision, nivel)
    const xp = nivel.xpPorAcierto * aciertos

    // Bonus tiempo
    const bonusTiempo = nivel.tiempoBonus && tiempo > 0 ? Math.round(tiempo * 0.5) : 0
    const xpTotal = xp + bonusTiempo

    // Guardar progreso
    const prog = leerProgreso()
    prog.xp = (prog.xp || 0) + xpTotal
    if (!prog.nivelesCompletados) prog.nivelesCompletados = []
    if (!prog.nivelesCompletados.includes(nivel.id)) {
      prog.nivelesCompletados.push(nivel.id)
    }
    if (!prog.estrellasNivel) prog.estrellasNivel = {}
    prog.estrellasNivel[nivel.id] = Math.max(prog.estrellasNivel[nivel.id] || 0, estrellas)
    if (!prog.precisionNivel) prog.precisionNivel = {}
    prog.precisionNivel[nivel.id] = precision
    if (!prog.logros) prog.logros = []

    // Verificar logros
    let logroDesbloqueado = null
    for (const logro of LOGROS) {
      if (!prog.logros.includes(logro.id) && logro.condicion(prog)) {
        prog.logros.push(logro.id)
        logroDesbloqueado = logro
        hablar(`¡Logro desbloqueado! ${logro.titulo}. ${logro.desc}`)
        break
      }
    }

    guardarProgreso(prog)
    setXpGanado(xpTotal)
    setEstrellasFinal(estrellas)
    setLogroNuevo(logroDesbloqueado)
    setEstado('completado')

    if (invidente) hablar(`Nivel completado. Ganaste ${xpTotal} puntos de experiencia.`)
  }, [secuencia, aciertos, nivel, tiempo, invidente])

  // ── Teclado ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tecla = e.key.toLowerCase()

      if (estado !== 'jugando' || !pregunta) return

      const esEscribir = pregunta.tipo === 'escribir' || pregunta.tipo === 'completar'
      if (esEscribir && TECLA_A_PUNTO.hasOwnProperty(tecla)) {
        e.preventDefault()
        const indice = TECLA_A_PUNTO[tecla]
        if (puntosFijos.includes(indice)) return // no tocar puntos fijos
        setTeclaPulsada(tecla)
        setMatriz(prev => {
          const nueva = [...prev]
          nueva[indice] = nueva[indice] === 1 ? 0 : 1
          hablar(nueva[indice] ? `Punto ${LAYOUT[indice].numero} activado` : `Punto ${LAYOUT[indice].numero} desactivado`)
          return nueva
        })
        setTimeout(() => setTeclaPulsada(null), 150)
      }
      if (e.key === 'Enter') validar()
      if (e.key === 'Escape') limpiar()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [validar, limpiar, estado, pregunta, puntosFijos])

  const togglePunto = (indice) => {
    if (estado !== 'jugando') return
    if (puntosFijos.includes(indice)) return
    const nueva = [...matriz]
    nueva[indice] = nueva[indice] === 1 ? 0 : 1
    setMatriz(nueva)
    hablar(nueva[indice] ? `Punto ${LAYOUT[indice].numero} activado` : `Punto ${indice + 1} desactivado`)
  }

  // ── Pantalla completado ──────────────────────────────────────────────────
  if (estado === 'completado') {
    const sigNivel = NIVELES.find(n => n.id === nivel.id + 1)
    const prog = leerProgreso()
    return (
      <PantallaFinNivel
        nivel={nivel}
        aciertos={aciertos}
        totalPreguntas={secuencia.length}
        intentos={intentos}
        xpGanado={xpGanado}
        estrellas={estrellasFinal}
        logroNuevo={logroNuevo}
        invidente={invidente}
        xpTotal={prog.xp}
        onSiguiente={sigNivel ? () => navigate(`/actividades/${sigNivel.id}`) : null}
        onReintentar={() => {
          setSecuencia(generarSecuencia(nivel))
          setIndiceActual(0)
          setAciertos(0)
          setIntentos(0)
          setEstado('jugando')
          setTiempo(nivel.tiempoLimite || 0)
        }}
        onVolver={() => navigate('/dashboard')}
      />
    )
  }

  if (!pregunta || secuencia.length === 0) return null

  const esEscribir = pregunta.tipo === 'escribir' || pregunta.tipo === 'completar'
  const esLeer = pregunta.tipo === 'leer'

  // ── MODO INVIDENTE ────────────────────────────────────────────────────────
  if (invidente) {
    return (
      <div style={si.page}>
        {/* Header */}
        <div style={si.header}>
          <button style={si.btnVolver} onClick={() => navigate('/dashboard')}
            onFocus={() => hablar('Volver al panel principal')}>← Volver</button>
          <span style={si.headerTitulo} tabIndex={0}
            onFocus={() => hablar(`Nivel ${nivel.id}: ${nivel.titulo}`)}>
            Nv.{nivel.id} {nivel.titulo}
          </span>
          <span style={si.headerContador} tabIndex={0}
            onFocus={() => hablar(`Pregunta ${indiceActual + 1} de ${secuencia.length}`)}>
            {indiceActual + 1}/{secuencia.length}
          </span>
        </div>

        {/* Barra progreso */}
        <div style={si.progressBar}>
          <div style={{ ...si.progressFill, width:`${progreso}%` }}/>
        </div>

        {/* Timer */}
        {nivel.tiempoBonus && (
          <div style={{ background: tiempo < 20 ? '#7f1d1d' : '#2e2a5e', borderRadius:8, padding:'8px 12px', textAlign:'center', color: tiempo < 20 ? '#fca5a5' : '#c4b5fd', fontWeight:800, fontSize:14 }} tabIndex={0}
            onFocus={() => hablar(`Tiempo restante: ${tiempo} segundos`)}>
            ⏱ {tiempo}s
          </div>
        )}

        {/* Letra / Pregunta */}
        <div style={si.letraCard} tabIndex={0}
          onFocus={() => hablar(esEscribir ? `Escribe la letra ${pregunta.letra} en braille` : `¿Qué letra es esta matriz?`)}
          onMouseEnter={() => hablar(esEscribir ? `Escribe la letra ${pregunta.letra}` : `Identifica la letra`)}>
          {esEscribir ? (
            <>
              <span style={si.letraGrande}>{pregunta.letra}</span>
              <span style={si.letraDesc}>{pregunta.tipo === 'completar' ? 'Completa la matriz' : 'Escribe en braille'}</span>
            </>
          ) : (
            <>
              <span style={{ color:'#c4b5fd', fontSize:15 }}>¿Qué letra es?</span>
              <span style={{ color:'#a78bfa', fontSize:12 }}>Elige la correcta</span>
            </>
          )}
        </div>

        {/* Matriz (para escribir/completar) o matriz solo lectura (para leer) */}
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:20, padding:8 }}>
          <MatrizBraille
            matriz={matriz}
            correcta={correcta}
            estado={estado}
            onToggle={esEscribir ? togglePunto : null}
            teclaPulsada={teclaPulsada}
            mostrarPista={mostrarPista}
            invidente={true}
          />

          {/* Referencia teclas */}
          {esEscribir && (
            <div style={{ background:'#2e2a5e', borderRadius:10, padding:10 }}>
              <div style={{ color:'#c4b5fd', fontSize:11, fontWeight:700, marginBottom:6, textAlign:'center' }}>Teclas</div>
              <div style={{ display:'grid', gridTemplateColumns:'32px 32px', gap:5 }}>
                {LAYOUT.map(({ numero, tecla, indice }) => (
                  <div key={indice} style={{
                    width:32, height:32, borderRadius:6,
                    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                    background: teclaPulsada === tecla.toLowerCase() ? '#7c3aed' : puntosFijos.includes(indice) ? '#16a34a' : '#1e1b4b',
                    color: teclaPulsada === tecla.toLowerCase() ? 'white' : '#c4b5fd',
                    fontWeight:700, fontSize:12,
                  }}>
                    <span>{tecla}</span>
                    <span style={{ fontSize:8, opacity:0.7 }}>P{numero}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:9, color:'#7c6fad', marginTop:6, textAlign:'center', lineHeight:1.6 }}>
                Enter=validar<br/>Esc=limpiar
              </div>
            </div>
          )}
        </div>

        {/* Opciones múltiples */}
        {esLeer && opcionesActuales.length > 0 && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {opcionesActuales.map(op => (
              <button key={op}
                style={{
                  padding:'14px', borderRadius:10, fontWeight:800, fontSize:20,
                  border: `2px solid ${opcionSeleccionada === op ? (estado === 'correcto' ? '#22c55e' : estado === 'incorrecto' ? '#ef4444' : '#7c3aed') : '#3b3570'}`,
                  background: opcionSeleccionada === op ? (estado === 'correcto' ? '#14532d' : estado === 'incorrecto' ? '#7f1d1d' : '#4c1d95') : '#2e2a5e',
                  color: 'white', cursor:'pointer',
                }}
                onClick={() => { setOpcionSeleccionada(op); hablar(op) }}
                tabIndex={0}
                onFocus={() => hablar(`Opción ${op}`)}>
                {op}
              </button>
            ))}
          </div>
        )}

        {/* Feedback */}
        {estado === 'correcto' && <div style={si.feedbackOk} role="alert">✅ ¡Correcto!</div>}
        {estado === 'incorrecto' && <div style={si.feedbackMal} role="alert">❌ Inténtalo de nuevo</div>}

        {/* Botones */}
        <div style={si.botones}>
          {esEscribir && (
            <>
              <button style={si.btnSec} onClick={limpiar} onFocus={() => hablar('Limpiar, o presiona Escape')}>🗑</button>
              {!nivel.pistaAutomatica && (
                <button style={{ ...si.btnSec, background: mostrarPista ? '#7c3aed' : '#2e2a5e' }}
                  onClick={() => { setMostrarPista(!mostrarPista); hablar(mostrarPista ? 'Pista ocultada' : 'Pista activada') }}
                  onFocus={() => hablar('Pista')}>
                  💡
                </button>
              )}
            </>
          )}
          <button style={si.btnPrimario} onClick={validar} onFocus={() => hablar('Validar, o presiona Enter')}>
            ✓ Validar
          </button>
        </div>

        {/* Stats */}
        <div style={si.statsRow}>
          {[
            { v:aciertos, l:'Aciertos', c:'#22c55e', desc:`Aciertos: ${aciertos}` },
            { v:intentos, l:'Intentos', c:'#ea580c', desc:`Intentos: ${intentos}` },
            { v:secuencia.length - indiceActual, l:'Restantes', c:'#a78bfa', desc:`Restantes: ${secuencia.length - indiceActual}` },
          ].map((s,i) => (
            <div key={i} style={si.statItem} tabIndex={0} onFocus={() => hablar(s.desc)}>
              <span style={{ fontSize:18, fontWeight:800, color:s.c }}>{s.v}</span>
              <span style={{ fontSize:11, color:'#c4b5fd' }}>{s.l}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── MODO VIDENTE ─────────────────────────────────────────────────────────
  return (
    <div style={sv.page}>
      {/* Header */}
      <div style={sv.header}>
        <button style={sv.btnVolver} onClick={() => navigate('/dashboard')}>← Volver</button>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontWeight:700, fontSize:16 }}>Nivel {nivel.id} — {nivel.titulo}</div>
          <div style={{ color:'#888', fontSize:13 }}>{nivel.descripcion}</div>
        </div>
        <div style={{ fontSize:13, color:'#888', fontWeight:600 }}>{indiceActual+1}/{secuencia.length}</div>
      </div>

      {/* Progreso + Timer */}
      <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:16 }}>
        <div style={{ flex:1, height:10, background:'#e5e7eb', borderRadius:99, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${progreso}%`, background:'linear-gradient(90deg,#7c3aed,#2563eb)', borderRadius:99, transition:'width 0.4s ease' }}/>
        </div>
        {nivel.tiempoBonus && (
          <div style={{
            padding:'4px 14px', borderRadius:20,
            background: tiempo < 20 ? '#fee2e2' : '#f0fdf4',
            color: tiempo < 20 ? '#dc2626' : '#16a34a',
            fontWeight:800, fontSize:15, minWidth:70, textAlign:'center',
          }}>⏱ {tiempo}s</div>
        )}
      </div>

      <div style={sv.mainCard}>

        {/* Pregunta */}
        {esEscribir ? (
          <div style={sv.letraDisplay}>
            <div style={sv.letraGrande}>{pregunta.letra}</div>
            <div style={{ color:'#888', fontSize:14, marginTop:4 }}>
              {pregunta.tipo === 'completar'
                ? `Completa la matriz para la letra ${pregunta.letra}`
                : `Escribe la letra ${pregunta.letra} en braille`}
            </div>
          </div>
        ) : (
          <div style={{ textAlign:'center', marginBottom:16 }}>
            <div style={{ fontSize:32, color:'#7c3aed', fontWeight:700, marginBottom:8 }}>¿Qué letra es?</div>
            <div style={{ color:'#888', fontSize:14 }}>Identifica la letra braille y elige la opción correcta</div>
          </div>
        )}

        {/* Matriz */}
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:40, marginBottom:24 }}>
          <MatrizBraille
            matriz={matriz}
            correcta={correcta}
            estado={estado}
            onToggle={esEscribir ? togglePunto : null}
            teclaPulsada={teclaPulsada}
            mostrarPista={mostrarPista}
            invidente={false}
          />

          {/* Referencia teclas (solo escribir) */}
          {esEscribir && (
            <div style={{ background:'#f8f7ff', borderRadius:12, padding:16, minWidth:90 }}>
              <div style={{ fontSize:12, color:'#888', marginBottom:8, textAlign:'center', fontWeight:600 }}>Teclas</div>
              <div style={{ display:'grid', gridTemplateColumns:'36px 36px', gap:8 }}>
                {LAYOUT.map(({ numero, tecla, indice }) => (
                  <div key={indice} style={{
                    width:36, height:36, borderRadius:8, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontWeight:700, cursor:'default',
                    background: teclaPulsada === tecla.toLowerCase() ? '#7c3aed' : puntosFijos.includes(indice) ? '#22c55e' : '#ede9fe',
                    color: teclaPulsada === tecla.toLowerCase() ? 'white' : puntosFijos.includes(indice) ? 'white' : '#7c3aed',
                    transition:'all 0.1s',
                  }}>
                    <span style={{ fontSize:14, fontWeight:800 }}>{tecla}</span>
                    <span style={{ fontSize:9, opacity:0.7 }}>P{numero}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:10, color:'#aaa', marginTop:8, textAlign:'center' }}>
                Enter=validar<br/>Esc=limpiar
              </div>
            </div>
          )}
        </div>

        {/* Opciones múltiples */}
        {esLeer && opcionesActuales.length > 0 && (
          <div style={{ display:'grid', gridTemplateColumns:`repeat(${Math.min(opcionesActuales.length, 4)}, 1fr)`, gap:10, marginBottom:16 }}>
            {opcionesActuales.map(op => {
              const sel = opcionSeleccionada === op
              const bg = sel
                ? estado === 'correcto' ? '#f0fdf4'
                : estado === 'incorrecto' ? '#fef2f2'
                : '#f5f3ff'
                : '#f9fafb'
              const border = sel
                ? estado === 'correcto' ? '#22c55e'
                : estado === 'incorrecto' ? '#ef4444'
                : '#7c3aed'
                : '#e5e7eb'
              return (
                <button key={op}
                  style={{
                    padding:'16px 8px', borderRadius:12, fontWeight:800, fontSize:28,
                    border:`2px solid ${border}`,
                    background:bg, cursor:'pointer', transition:'all 0.15s',
                    transform: sel ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: sel ? `0 4px 12px ${border}44` : 'none',
                  }}
                  onClick={() => { setOpcionSeleccionada(op) }}>
                  {op}
                </button>
              )
            })}
          </div>
        )}

        {/* Feedback */}
        {estado === 'correcto' && <div style={sv.feedbackCorrecto}>✅ ¡Correcto!</div>}
        {estado === 'incorrecto' && <div style={sv.feedbackIncorrecto}>❌ Incorrecto, intenta de nuevo</div>}

        {/* Botones */}
        <div style={sv.botones}>
          {esEscribir && (
            <>
              <button style={sv.btnSecundario} onClick={limpiar}>🗑 Limpiar</button>
              {!nivel.pistaAutomatica && (
                <button style={{ ...sv.btnSecundario, background: mostrarPista ? '#ede9fe' : '#f5f5f5' }}
                  onClick={() => setMostrarPista(!mostrarPista)}>
                  💡 Pista
                </button>
              )}
            </>
          )}
          <button style={sv.btnPrimario} onClick={validar}>✓ Validar</button>
        </div>

        <p style={{ textAlign:'center', fontSize:12, color:'#aaa', marginTop:10 }}>
          {esEscribir ? <>Usa <strong>D F G H J K</strong> · <strong>Enter</strong> validar · <strong>Esc</strong> limpiar</> : 'Elige la letra y presiona Validar'}
        </p>
      </div>

      {/* Stats */}
      <div style={sv.statsBar}>
        {[
          { v:aciertos, l:'Aciertos', c:'#22c55e' },
          { v:intentos, l:'Intentos', c:'#ea580c' },
          { v:Math.round((aciertos/Math.max(intentos,1))*100)+'%', l:'Precisión', c:'#7c3aed' },
          { v:secuencia.length - indiceActual, l:'Restantes', c:'#2563eb' },
        ].map((s,i) => (
          <div key={i} style={sv.statItem}>
            <span style={{ fontSize:20, fontWeight:800, color:s.c }}>{s.v}</span>
            <span style={{ fontSize:12, color:'#888' }}>{s.l}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── ESTILOS ──────────────────────────────────────────────────────────────────
const si = {
  page:{ maxWidth:420, margin:'0 auto', padding:12, background:'#1e1b4b', minHeight:'100vh', display:'flex', flexDirection:'column', gap:8 },
  header:{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'#2e2a5e', borderRadius:10, padding:'10px 14px' },
  btnVolver:{ background:'none', border:'none', cursor:'pointer', fontWeight:700, color:'#c4b5fd', fontSize:14 },
  headerTitulo:{ color:'white', fontWeight:800, fontSize:13 },
  headerContador:{ color:'#a78bfa', fontWeight:700, fontSize:13 },
  progressBar:{ height:6, background:'#2e2a5e', borderRadius:99, overflow:'hidden' },
  progressFill:{ height:'100%', background:'linear-gradient(90deg,#2563eb,#7c3aed)', borderRadius:99, transition:'width 0.4s' },
  letraCard:{ background:'#2e2a5e', borderRadius:10, padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' },
  letraGrande:{ fontSize:64, fontWeight:900, color:'#a78bfa', lineHeight:1 },
  letraDesc:{ color:'#c4b5fd', fontSize:13 },
  feedbackOk:{ textAlign:'center', color:'#86efac', fontWeight:800, fontSize:15, background:'#14532d', padding:10, borderRadius:8 },
  feedbackMal:{ textAlign:'center', color:'#fca5a5', fontWeight:800, fontSize:15, background:'#7f1d1d', padding:10, borderRadius:8 },
  botones:{ display:'flex', gap:8 },
  btnPrimario:{ flex:2, padding:'13px', background:'#7c3aed', color:'white', border:'none', borderRadius:8, fontSize:15, fontWeight:800, cursor:'pointer' },
  btnSec:{ flex:1, padding:'13px', background:'#2e2a5e', color:'#c4b5fd', border:'2px solid #7c3aed', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer' },
  statsRow:{ display:'flex', justifyContent:'space-around', background:'#2e2a5e', borderRadius:10, padding:'10px 16px' },
  statItem:{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 },
}

const sv = {
  page:{ maxWidth:600, margin:'0 auto', padding:24, background:'#f0f4ff', minHeight:'100vh' },
  header:{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'white', borderRadius:12, padding:'14px 20px', marginBottom:12, boxShadow:'0 2px 8px #0001' },
  btnVolver:{ background:'none', border:'none', cursor:'pointer', fontWeight:600, color:'#555', fontSize:14 },
  mainCard:{ background:'white', borderRadius:16, padding:32, boxShadow:'0 4px 24px #0001', marginBottom:16 },
  letraDisplay:{ textAlign:'center', marginBottom:16 },
  letraGrande:{ fontSize:96, fontWeight:900, color:'#7c3aed', lineHeight:1 },
  feedbackCorrecto:{ textAlign:'center', color:'#16a34a', fontWeight:700, fontSize:18, marginBottom:16, background:'#f0fdf4', padding:10, borderRadius:8 },
  feedbackIncorrecto:{ textAlign:'center', color:'#dc2626', fontWeight:700, fontSize:18, marginBottom:16, background:'#fef2f2', padding:10, borderRadius:8 },
  botones:{ display:'flex', gap:12, justifyContent:'center' },
  btnPrimario:{ background:'#7c3aed', color:'white', border:'none', borderRadius:10, padding:'12px 28px', fontWeight:700, fontSize:15, cursor:'pointer' },
  btnSecundario:{ background:'#f5f5f5', color:'#444', border:'none', borderRadius:10, padding:'12px 20px', fontWeight:600, fontSize:14, cursor:'pointer' },
  statsBar:{ display:'flex', justifyContent:'center', gap:32, background:'white', borderRadius:12, padding:16, boxShadow:'0 2px 8px #0001' },
  statItem:{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 },
}