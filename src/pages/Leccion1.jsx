import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { hablar, setVozActiva } from '../utils/voz'
import { esInvidente } from '../utils/modo'

const ABECEDARIO_BRAILLE = {
  A: [1,0,0, 0,0,0], B: [1,1,0, 0,0,0], C: [1,0,0, 1,0,0], D: [1,0,0, 1,1,0], E: [1,0,0, 0,1,0],
  F: [1,1,0, 1,0,0], G: [1,1,0, 1,1,0], H: [1,1,0, 0,1,0], I: [0,1,0, 1,0,0], J: [0,1,0, 1,1,0],
  K: [1,0,1, 0,0,0], L: [1,1,1, 0,0,0], M: [1,0,1, 1,0,0], N: [1,0,1, 1,1,0], O: [1,0,1, 0,1,0],
  P: [1,1,1, 1,0,0], Q: [1,1,1, 1,1,0], R: [1,1,1, 0,1,0], S: [0,1,1, 1,0,0], T: [0,1,1, 1,1,0],
  U: [1,0,1, 0,0,1], V: [1,1,1, 0,0,1], W: [0,1,0, 1,1,1], X: [1,0,1, 1,0,1], Y: [1,0,1, 1,1,1], Z: [1,0,1, 0,1,1],
}

const LETRAS = ['A', 'B', 'C', 'D', 'E']
const TECLA_A_PUNTO = { 'd': 0, 'f': 1, 'g': 2, 'h': 3, 'j': 4, 'k': 5 }

const LAYOUT = [
  { indice: 0, col: 0, fila: 0, numero: 1, tecla: 'D' },
  { indice: 1, col: 0, fila: 1, numero: 2, tecla: 'F' },
  { indice: 2, col: 0, fila: 2, numero: 3, tecla: 'G' },
  { indice: 3, col: 1, fila: 0, numero: 4, tecla: 'H' },
  { indice: 4, col: 1, fila: 1, numero: 5, tecla: 'J' },
  { indice: 5, col: 1, fila: 2, numero: 6, tecla: 'K' },
]

export default function Leccion1() {
  const navigate = useNavigate()
  const invidente = esInvidente()
  const [letraActual, setLetraActual] = useState(0)
  const [matriz, setMatriz] = useState([0,0,0,0,0,0])
  const [estado, setEstado] = useState('jugando')
  const [intentos, setIntentos] = useState(0)
  const [aciertos, setAciertos] = useState(0)
  const [mostrarPista, setMostrarPista] = useState(false)
  const [teclaPulsada, setTeclaPulsada] = useState(null)
  
  // Para la animación final de estrellas
  const [estrellasAnimadas, setEstrellasAnimadas] = useState(0)

  const letra = LETRAS[letraActual]
  const correcta = ABECEDARIO_BRAILLE[letra]

  useEffect(() => {
    setVozActiva(invidente)
  }, [])

  useEffect(() => {
    if (estado === 'jugando') {
      setTimeout(() => hablar(`Escribe la letra ${letra} en braille`), 300)
    }
  }, [letraActual, estado])

  useEffect(() => {
    if (estado === 'completado') {
      const precisionCalculada = intentos > 0 ? Math.round((aciertos / intentos) * 100) : 100
      const estrellasTotales = precisionCalculada === 100 ? 3 : precisionCalculada >= 70 ? 2 : 1
      
      let contador = 0
      const intervalo = setInterval(() => {
        contador++
        setEstrellasAnimadas(contador)
        if (contador >= estrellasTotales) clearInterval(intervalo)
      }, 300)
      return () => clearInterval(intervalo)
    }
  }, [estado, aciertos, intentos])

  const validar = useCallback(() => {
    if (estado !== 'jugando') return
    const esCorrecta = matriz.every((v, i) => v === correcta[i])
    setIntentos(prev => prev + 1)

    if (esCorrecta) {
      setEstado('correcto')
      setAciertos(prev => prev + 1)
      hablar(`¡Correcto! Esa es la letra ${letra}`)
      setTimeout(() => {
        if (letraActual + 1 >= LETRAS.length) {
          setEstado('completado')
          hablar('¡Felicidades! Completaste la lección.')
        } else {
          setLetraActual(prev => prev + 1)
          setMatriz([0,0,0,0,0,0])
          setEstado('jugando')
          setMostrarPista(false)
        }
      }, 1500)
    } else {
      setEstado('incorrecto')
      hablar(`Incorrecto, intenta de nuevo con la letra ${letra}`)
      setTimeout(() => {
        setEstado('jugando')
        setMatriz([0,0,0,0,0,0])
      }, 1500)
    }
  }, [matriz, correcta, estado, letraActual, letra])

  const limpiar = useCallback(() => {
    setMatriz([0,0,0,0,0,0])
    setEstado('jugando')
    setMostrarPista(false)
    hablar('Matriz limpiada')
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tecla = e.key.toLowerCase()
      if (TECLA_A_PUNTO.hasOwnProperty(tecla) && estado === 'jugando') {
        e.preventDefault()
        const indice = TECLA_A_PUNTO[tecla]
        setTeclaPulsada(tecla)
        setMatriz(prev => {
          const nueva = [...prev]
          nueva[indice] = nueva[indice] === 1 ? 0 : 1
          hablar(nueva[indice] === 1 ? `Punto ${LAYOUT[indice].numero} activado` : `Punto ${LAYOUT[indice].numero} desactivado`)
          return nueva
        })
        setTimeout(() => setTeclaPulsada(null), 150)
      }
      if (e.key === 'Enter') validar()
      if (e.key === 'Escape') limpiar()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [validar, limpiar, estado])

  const togglePunto = (indice) => {
    if (estado !== 'jugando') return
    const nueva = [...matriz]
    nueva[indice] = nueva[indice] === 1 ? 0 : 1
    setMatriz(nueva)
    hablar(nueva[indice] === 1 ? `Punto ${LAYOUT[indice].numero} activado` : `Punto ${LAYOUT[indice].numero} desactivado`)
  }

  const colorPunto = (indice) => {
    if (estado === 'correcto') return matriz[indice] ? '#22c55e' : '#e5e7eb'
    if (estado === 'incorrecto') return matriz[indice] ? '#ef4444' : '#e5e7eb'
    if (mostrarPista && correcta[indice]) return '#a78bfa'
    return matriz[indice] ? '#2563eb' : '#e5e7eb'
  }

  const progreso = Math.round((letraActual / LETRAS.length) * 100)

  if (estado === 'completado') {
    const precisionCalculada = intentos > 0 ? Math.round((aciertos / intentos) * 100) : 100

    return (
      <div style={invidente ? si.page : sv.page}>
        <div style={invidente ? si.completadoCard : sv.completadoCard}>
          <div style={{fontSize: invidente ? 60 : 80, marginBottom:8}}>🏆</div>
          <h1 style={invidente ? si.completadoTitulo : sv.completadoTitulo}>
            ¡Lección Completada!
          </h1>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, margin: '16px 0 24px' }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{
                fontSize: 56,
                filter: s <= estrellasAnimadas ? 'none' : 'grayscale(1) opacity(0.2)',
                transform: s <= estrellasAnimadas ? 'scale(1.2) rotate(5deg)' : 'scale(1)',
                textShadow: s <= estrellasAnimadas ? '0 0 20px #f59e0b' : 'none',
                transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)'
              }}>⭐</div>
            ))}
          </div>

          <p style={invidente ? si.completadoSub : sv.completadoSub}>
            Completaste los primeros fundamentos del abecedario braille
          </p>
          <div style={invidente ? si.resultados : sv.resultados}>
            <div style={invidente ? si.resultItem : sv.resultItem}>
              <span style={{fontSize: invidente ? 28:32, fontWeight:800, color:'#2563eb'}}>{aciertos}</span>
              <span style={{fontSize:13, color: invidente ? '#c4b5fd':'#888'}}>Aciertos</span>
            </div>
            <div style={invidente ? si.resultItem : sv.resultItem}>
              <span style={{fontSize: invidente ? 28:32, fontWeight:800, color:'#ea580c'}}>{intentos}</span>
              <span style={{fontSize:13, color: invidente ? '#c4b5fd':'#888'}}>Intentos</span>
            </div>
            <div style={invidente ? si.resultItem : sv.resultItem}>
              <span style={{fontSize: invidente ? 28:32, fontWeight:800, color:'#22c55e'}}>{precisionCalculada}%</span>
              <span style={{fontSize:13, color: invidente ? '#c4b5fd':'#888'}}>Precisión</span>
            </div>
          </div>
          <button
            style={invidente ? si.btnPrimario : sv.btnPrimario}
            onClick={() => navigate('/dashboard')}
            onFocus={() => hablar('Botón volver al inicio')}
            onMouseEnter={() => hablar('Volver al panel principal')}>
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  if (invidente) {
    return (
      <div style={si.page}>
        <div style={si.header}>
          <button style={si.btnVolver} onClick={() => navigate('/dashboard')} onFocus={() => hablar('Volver al panel principal')}>← Volver</button>
          <span style={si.headerTitulo}>Abecedario Braille</span>
          <span style={si.headerContador} onFocus={() => hablar(`Letra ${letraActual + 1} de ${LETRAS.length}`)}>{letraActual + 1}/{LETRAS.length}</span>
        </div>
        <div style={si.progressBar}><div style={{...si.progressFill, width: progreso + '%'}} /></div>
        <div style={si.letraCard} tabIndex={0} onFocus={() => hablar(`Escribe la letra ${letra} en braille`)}>
          <span style={si.letraGrande}>{letra}</span>
          <span style={si.letraDesc}>Letra {letraActual + 1} de {LETRAS.length}</span>
        </div>
        <div style={si.matrizArea}>
          <div style={si.matrizWrapper}>
            <div style={{display:'flex', gap:8, marginBottom:4, marginLeft:20}}>
              <span style={si.axisLabel}>C1</span><span style={si.axisLabel}>C2</span>
            </div>
            <div style={{display:'flex', gap:6}}>
              <div style={{display:'flex', flexDirection:'column', justifyContent:'space-around'}}>
                {['F1','F2','F3'].map(f => <span key={f} style={{...si.axisLabel, height:52, display:'flex', alignItems:'center'}}>{f}</span>)}
              </div>
              <div style={si.grid}>
                {LAYOUT.map(({ indice, col, fila, numero, tecla }) => (
                  <button key={indice} tabIndex={0} style={{
                      ...si.punto, gridColumn: col + 1, gridRow: fila + 1, background: colorPunto(indice),
                      transform: matriz[indice] ? 'scale(1.08)' : 'scale(1)', outline: teclaPulsada === tecla.toLowerCase() ? '3px solid white' : 'none',
                    }} onClick={() => togglePunto(indice)} onFocus={() => hablar(`Punto ${numero}, tecla ${tecla}, ${matriz[indice] ? 'activado' : 'desactivado'}`)}>
                    <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:1}}>
                      <span style={{fontSize:14, color: matriz[indice] ? 'white':'#aaa', fontWeight:800, lineHeight:1}}>{numero}</span>
                      <span style={{fontSize:9, color: matriz[indice] ? 'rgba(255,255,255,0.8)':'#888', fontWeight:600, lineHeight:1}}>{tecla}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={si.referencia}>
            <div style={{color:'#c4b5fd', fontSize:12, fontWeight:700, marginBottom:8, textAlign:'center'}}>Teclas</div>
            <div style={si.referenciaGrid}>
              {LAYOUT.map(({ numero, tecla, indice }) => (
                <div key={indice} style={{
                  ...si.referenciaItem, background: teclaPulsada === tecla.toLowerCase() ? '#7c3aed' : '#2e2a5e', color: teclaPulsada === tecla.toLowerCase() ? 'white' : '#c4b5fd',
                }}>
                  <span style={{fontSize:14, fontWeight:800}}>{tecla}</span><span style={{fontSize:9, opacity:0.7}}>P{numero}</span>
                </div>
              ))}
            </div>
            <div style={{fontSize:10, color:'#7c6fad', marginTop:8, textAlign:'center', lineHeight:1.6}}>Enter=validar<br/>Esc=limpiar</div>
          </div>
        </div>
        {estado === 'correcto' && <div style={si.feedbackOk} role="alert">✅ ¡Correcto!</div>}
        {estado === 'incorrecto' && <div style={si.feedbackMal} role="alert">❌ Incorrecto, intenta de nuevo</div>}
        <div style={si.botones}>
          <button style={si.btnSec} onClick={limpiar} onFocus={() => hablar('Botón limpiar')}>🗑 Limpiar</button>
          <button style={{...si.btnSec, background: mostrarPista ? '#7c3aed' : '#2e2a5e'}} onClick={() => setMostrarPista(!mostrarPista)} onFocus={() => hablar('Botón pista')}>💡 Pista</button>
          <button style={si.btnPrimario} onClick={validar} onFocus={() => hablar('Botón validar')}>✓ Validar</button>
        </div>
        <div style={si.statsRow}>
          <div style={si.statItem} tabIndex={0}><span style={{fontSize:18, fontWeight:800, color:'#22c55e'}}>{aciertos}</span><span style={{fontSize:11, color:'#c4b5fd'}}>Aciertos</span></div>
          <div style={si.statItem} tabIndex={0}><span style={{fontSize:18, fontWeight:800, color:'#ea580c'}}>{intentos}</span><span style={{fontSize:11, color:'#c4b5fd'}}>Intentos</span></div>
          <div style={si.statItem} tabIndex={0}><span style={{fontSize:18, fontWeight:800, color:'#a78bfa'}}>{LETRAS.length - letraActual}</span><span style={{fontSize:11, color:'#c4b5fd'}}>Restantes</span></div>
        </div>
      </div>
    )
  }

  return (
    <div style={sv.page}>
      <div style={sv.header}>
        <button style={sv.btnVolver} onClick={() => navigate('/dashboard')}>← Volver</button>
        <div style={{textAlign:'center'}}>
          <div style={{fontWeight:700, fontSize:16}}>Fundamentos del Braille</div>
          <div style={{color:'#888', fontSize:13}}>Lección 1 — El Abecedario</div>
        </div>
        <div style={{fontSize:13, color:'#888', fontWeight:600}}>{letraActual + 1} / {LETRAS.length}</div>
      </div>
      <div style={sv.progressBar}><div style={{...sv.progressFill, width: progreso + '%'}} /></div>
      <div style={sv.mainCard}>
        <div style={sv.letraDisplay}>
          <div style={sv.letraGrande}>{letra}</div>
          <div style={{color:'#888', fontSize:14, marginTop:8}}>Letra {letraActual + 1} de {LETRAS.length}</div>
        </div>
        <p style={sv.instruccion}>Llena la matriz braille para la letra <strong>{letra}</strong></p>
        <div style={sv.matrizContainer}>
          <div style={sv.matrizWrapper}>
            <div style={{display:'flex', gap:10, marginBottom:6, marginLeft:24}}><div style={sv.colLabel}>Col 1</div><div style={sv.colLabel}>Col 2</div></div>
            <div style={{display:'flex', alignItems:'stretch', gap:6}}>
              <div style={{display:'flex', flexDirection:'column', justifyContent:'space-around'}}>
                {['F1','F2','F3'].map(f => <span key={f} style={{fontSize:11, color:'#aaa', fontWeight:600, height:56, display:'flex', alignItems:'center'}}>{f}</span>)}
              </div>
              <div style={sv.grid}>
                {LAYOUT.map(({ indice, col, fila, numero, tecla }) => (
                  <button key={indice} tabIndex={0} style={{
                      ...sv.punto, gridColumn: col + 1, gridRow: fila + 1, background: colorPunto(indice),
                      transform: (matriz[indice] || teclaPulsada === tecla.toLowerCase()) ? 'scale(1.1)' : 'scale(1)',
                      boxShadow: matriz[indice] ? '0 4px 12px #2563eb44' : '0 2px 4px #0001', outline: teclaPulsada === tecla.toLowerCase() ? '3px solid #2563eb' : 'none',
                    }} onClick={() => togglePunto(indice)}>
                    <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:1}}>
                      <span style={{fontSize:13, color: matriz[indice] ? 'white':'#999', fontWeight:800, lineHeight:1}}>{numero}</span>
                      <span style={{fontSize:9, color: matriz[indice] ? 'rgba(255,255,255,0.8)':'#bbb', fontWeight:600, lineHeight:1}}>{tecla}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={sv.referencia}>
            <div style={{fontSize:12, color:'#888', marginBottom:10, textAlign:'center', fontWeight:600}}>Teclas</div>
            <div style={sv.referenciaGrid}>
              {LAYOUT.map(({ numero, tecla, indice }) => (
                <div key={indice} style={{
                  ...sv.referenciaItem, background: teclaPulsada === tecla.toLowerCase() ? '#7c3aed' : '#ede9fe', color: teclaPulsada === tecla.toLowerCase() ? 'white' : '#7c3aed', transition:'all 0.1s'
                }}>
                  <span style={{fontSize:14, fontWeight:800}}>{tecla}</span><span style={{fontSize:9, opacity:0.7}}>P{numero}</span>
                </div>
              ))}
            </div>
            <div style={{fontSize:10, color:'#aaa', marginTop:8, textAlign:'center'}}>Enter = validar<br/>Esc = limpiar</div>
          </div>
        </div>
        {estado === 'correcto' && <div style={sv.feedbackCorrecto}>✅ ¡Correcto!</div>}
        {estado === 'incorrecto' && <div style={sv.feedbackIncorrecto}>❌ Incorrecto, intenta de nuevo</div>}
        <div style={sv.botones}>
          <button style={sv.btnSecundario} onClick={limpiar}>🗑 Limpiar</button>
          <button style={{...sv.btnSecundario, background: mostrarPista ? '#ede9fe' : '#f5f5f5'}} onClick={() => setMostrarPista(!mostrarPista)}>💡 Pista</button>
          <button style={sv.btnPrimario} onClick={validar}>✓ Validar</button>
        </div>
      </div>
      <div style={sv.statsBar}>
        <div style={sv.statItem}><span style={{fontSize:20, fontWeight:800, color:'#22c55e'}}>{aciertos}</span><span style={{fontSize:12, color:'#888'}}>Aciertos</span></div>
        <div style={sv.statItem}><span style={{fontSize:20, fontWeight:800, color:'#ea580c'}}>{intentos}</span><span style={{fontSize:12, color:'#888'}}>Intentos</span></div>
        <div style={sv.statItem}><span style={{fontSize:20, fontWeight:800, color:'#7c3aed'}}>{LETRAS.length - letraActual}</span><span style={{fontSize:12, color:'#888'}}>Restantes</span></div>
      </div>
    </div>
  )
}

const si = {
  page: { maxWidth:420, margin:'0 auto', padding:12, background:'#1e1b4b', minHeight:'100vh', display:'flex', flexDirection:'column', gap:8 },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', background:'#2e2a5e', borderRadius:10, padding:'10px 14px' },
  btnVolver: { background:'none', border:'none', cursor:'pointer', fontWeight:700, color:'#c4b5fd', fontSize:14 },
  headerTitulo: { color:'white', fontWeight:800, fontSize:15 },
  headerContador: { color:'#a78bfa', fontWeight:700, fontSize:14 },
  progressBar: { height:6, background:'#2e2a5e', borderRadius:99, overflow:'hidden' },
  progressFill: { height:'100%', background:'linear-gradient(90deg,#2563eb,#7c3aed)', borderRadius:99, transition:'width 0.4s ease' },
  letraCard: { background:'#2e2a5e', borderRadius:10, padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'default' },
  letraGrande: { fontSize:64, fontWeight:900, color:'#a78bfa', lineHeight:1 },
  letraDesc: { color:'#c4b5fd', fontSize:13 },
  matrizArea: { display:'flex', justifyContent:'center', alignItems:'center', gap:20 },
  matrizWrapper: { display:'flex', flexDirection:'column', alignItems:'flex-start' },
  axisLabel: { width:52, textAlign:'center', fontSize:10, color:'#7c6fad', fontWeight:700 },
  grid: { display:'grid', gridTemplateColumns:'52px 52px', gridTemplateRows:'52px 52px 52px', gap:8 },
  punto: { width:52, height:52, borderRadius:'50%', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.12s ease' },
  referencia: { background:'#2e2a5e', borderRadius:10, padding:12 },
  referenciaGrid: { display:'grid', gridTemplateColumns:'36px 36px', gap:6 },
  referenciaItem: { width:36, height:36, borderRadius:8, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontWeight:700, cursor:'default', transition:'all 0.1s' },
  feedbackOk: { textAlign:'center', color:'#86efac', fontWeight:800, fontSize:16, background:'#14532d', padding:'10px', borderRadius:8 },
  feedbackMal: { textAlign:'center', color:'#fca5a5', fontWeight:800, fontSize:16, background:'#7f1d1d', padding:'10px', borderRadius:8 },
  botones: { display:'flex', gap:8 },
  btnPrimario: { flex:2, padding:'13px', background:'#7c3aed', color:'white', border:'none', borderRadius:8, fontSize:15, fontWeight:800, cursor:'pointer' },
  btnSec: { flex:1, padding:'13px', background:'#2e2a5e', color:'#c4b5fd', border:'2px solid #7c3aed', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer' },
  statsRow: { display:'flex', justifyContent:'space-around', background:'#2e2a5e', borderRadius:10, padding:'10px 16px' },
  statItem: { display:'flex', flexDirection:'column', alignItems:'center', gap:2, cursor:'default' },
  completadoCard: { background:'#2e2a5e', borderRadius:16, padding:28, textAlign:'center', marginTop:20, display:'flex', flexDirection:'column', alignItems:'center', gap:8 },
  completadoTitulo: { color:'white', fontSize:24, fontWeight:800 },
  completadoSub: { color:'#c4b5fd', fontSize:15 },
  resultados: { display:'flex', gap:24, justifyContent:'center', margin:'8px 0' },
  resultItem: { display:'flex', flexDirection:'column', alignItems:'center', gap:2 },
}

const sv = {
  page: { maxWidth:600, margin:'0 auto', padding:24, background:'#f0f4ff', minHeight:'100vh' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', background:'white', borderRadius:12, padding:'14px 20px', marginBottom:12, boxShadow:'0 2px 8px #0001' },
  btnVolver: { background:'none', border:'none', cursor:'pointer', fontWeight:600, color:'#555', fontSize:14 },
  progressBar: { height:8, background:'#e5e7eb', borderRadius:99, marginBottom:20, overflow:'hidden' },
  progressFill: { height:'100%', background:'linear-gradient(90deg,#2563eb,#7c3aed)', borderRadius:99, transition:'width 0.4s ease' },
  mainCard: { background:'white', borderRadius:16, padding:32, boxShadow:'0 4px 24px #0001', marginBottom:16 },
  letraDisplay: { textAlign:'center', marginBottom:16, cursor:'default' },
  letraGrande: { fontSize:96, fontWeight:900, color:'#7c3aed', lineHeight:1 },
  instruccion: { textAlign:'center', color:'#666', marginBottom:24, fontSize:15 },
  matrizContainer: { display:'flex', justifyContent:'center', alignItems:'center', gap:40, marginBottom:24 },
  matrizWrapper: { display:'flex', flexDirection:'column', alignItems:'flex-start' },
  colLabel: { width:56, textAlign:'center', fontSize:11, color:'#aaa', fontWeight:600 },
  grid: { display:'grid', gridTemplateColumns:'56px 56px', gridTemplateRows:'56px 56px 56px', gap:10 },
  punto: { width:56, height:56, borderRadius:'50%', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s ease' },
  referencia: { background:'#f8f7ff', borderRadius:12, padding:16, minWidth:90 },
  referenciaGrid: { display:'grid', gridTemplateColumns:'36px 36px', gap:8 },
  referenciaItem: { width:36, height:36, borderRadius:8, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontWeight:700, cursor:'default' },
  feedbackCorrecto: { textAlign:'center', color:'#16a34a', fontWeight:700, fontSize:18, marginBottom:16, background:'#f0fdf4', padding:10, borderRadius:8 },
  feedbackIncorrecto: { textAlign:'center', color:'#dc2626', fontWeight:700, fontSize:18, marginBottom:16, background:'#fef2f2', padding:10, borderRadius:8 },
  botones: { display:'flex', gap:12, justifyContent:'center' },
  btnPrimario: { background:'#7c3aed', color:'white', border:'none', borderRadius:10, padding:'12px 28px', fontWeight:700, fontSize:15, cursor:'pointer' },
  btnSecundario: { background:'#f5f5f5', color:'#444', border:'none', borderRadius:10, padding:'12px 20px', fontWeight:600, fontSize:14, cursor:'pointer' },
  statsBar: { display:'flex', justifyContent:'center', gap:32, background:'white', borderRadius:12, padding:16, boxShadow:'0 2px 8px #0001' },
  statItem: { display:'flex', flexDirection:'column', alignItems:'center', gap:2, cursor:'default' },
  completadoCard: { background:'white', borderRadius:20, padding:48, textAlign:'center', boxShadow:'0 4px 24px #0001', marginTop:40 },
  completadoTitulo: { fontSize:32, fontWeight:800, color:'#7c3aed', marginBottom:8 },
  completadoSub: { color:'#555', fontSize:18, marginBottom:24 },
  resultados: { display:'flex', gap:32, justifyContent:'center', marginBottom:32 },
  resultItem: { display:'flex', flexDirection:'column', alignItems:'center', gap:4 },
}