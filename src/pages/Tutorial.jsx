import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { hablar, setVozActiva } from '../utils/voz'
import { esInvidente } from '../utils/modo'

// ─── Datos de cada paso del tutorial ─────────────────────────────────────────
const PASOS = [
  {
    id: 'intro',
    titulo: 'Orientación en el teclado',
    subtitulo: 'Antes de practicar braille, ubica tus dedos correctamente',
    icono: '⌨️',
    voz: 'Tutorial de orientación en el teclado. Antes de practicar braille, aprenderás a ubicar tus dedos correctamente sobre las teclas.',
    contenidoVidente: (
      <div>
        <p style={{ color:'#555', lineHeight:1.7, marginBottom:16 }}>
          Para escribir braille en este teclado usarás <strong>6 teclas específicas</strong> que
          corresponden a los 6 puntos de la celda braille. No necesitas memorizar ningún patrón
          especial — tus dedos ya están en la posición correcta cuando reposas en la fila de inicio.
        </p>
        <div style={{ background:'#f5f3ff', border:'1px solid #ddd6fe', borderRadius:12, padding:16 }}>
          <p style={{ color:'#5b21b6', fontWeight:700, fontSize:14, margin:'0 0 8px' }}>
            💡 ¿Sabías que...?
          </p>
          <p style={{ color:'#6d28d9', fontSize:14, margin:0, lineHeight:1.6 }}>
            Las teclas <strong>F</strong> y <strong>J</strong> tienen un pequeño relieve táctil —
            una pequeña protuberancia que puedes sentir con el dedo. Son las guías de posición
            estándar de todos los teclados del mundo.
          </p>
        </div>
      </div>
    ),
    contenidoInvidente: 'En este tutorial aprenderás a ubicar tus dedos sobre las 6 teclas que usarás para escribir braille. La clave está en dos teclas especiales: la F y la J. Ambas tienen un pequeño relieve táctil que puedes sentir con la yema del dedo. Son las guías de posición estándar en todos los teclados.',
  },
  {
    id: 'relieve',
    titulo: 'Encuentra el relieve táctil',
    subtitulo: 'Las teclas F y J son tu punto de partida',
    icono: '👆',
    voz: 'Paso 1. Encuentra el relieve táctil. Coloca tu mano sobre el teclado y desliza el dedo índice izquierdo hasta sentir una pequeña protuberancia. Esa es la tecla F. Haz lo mismo con el índice derecho para encontrar la J. Estas dos marcas son tu ancla de posición.',
    contenidoVidente: (
      <div>
        <div style={{ display:'flex', gap:16, marginBottom:20 }}>
          <div style={{ flex:1, background:'#fef9c3', border:'2px solid #f59e0b', borderRadius:12, padding:16, textAlign:'center' }}>
            <div style={{ fontSize:40, marginBottom:8 }}>👈</div>
            <div style={{ fontWeight:800, fontSize:20, color:'#92400e', marginBottom:6 }}>Tecla F</div>
            <div style={{ fontSize:13, color:'#78350f', lineHeight:1.6 }}>
              Índice izquierdo.<br/>
              Tiene una pequeña raya o punto en relieve.<br/>
              <strong>Punto 2</strong> del braille.
            </div>
          </div>
          <div style={{ flex:1, background:'#fef9c3', border:'2px solid #f59e0b', borderRadius:12, padding:16, textAlign:'center' }}>
            <div style={{ fontSize:40, marginBottom:8 }}>👉</div>
            <div style={{ fontWeight:800, fontSize:20, color:'#92400e', marginBottom:6 }}>Tecla J</div>
            <div style={{ fontSize:13, color:'#78350f', lineHeight:1.6 }}>
              Índice derecho.<br/>
              Tiene el mismo relieve táctil.<br/>
              <strong>Punto 5</strong> del braille.
            </div>
          </div>
        </div>
        <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:10, padding:14 }}>
          <p style={{ color:'#166534', fontSize:14, margin:0, lineHeight:1.7 }}>
            🖐 <strong>Ejercicio:</strong> Cierra los ojos, coloca ambas manos sobre el teclado y
            localiza F y J solo con el tacto. Cuando las encuentres, tus dedos estarán
            listos para la posición braille.
          </p>
        </div>
      </div>
    ),
    contenidoInvidente: 'Coloca tu mano izquierda sobre el teclado y desliza el dedo índice hasta sentir una pequeña protuberancia o rayita en relieve. Esa es la tecla F, y corresponde al Punto 2 del braille. Ahora haz lo mismo con la mano derecha: el índice derecho debe encontrar la tecla J, que tiene el mismo tipo de relieve. La J corresponde al Punto 5. Estas dos marcas son tu ancla. Practícalo: cierra los ojos y búscalas solo con el tacto.',
  },
  {
    id: 'posicion',
    titulo: 'Posición de los 6 dedos',
    subtitulo: 'De F y J, el resto se desprende naturalmente',
    icono: '🤲',
    voz: 'Paso 2. Posición de los seis dedos. Una vez que tienes el índice izquierdo en F y el derecho en J, los demás dedos caen solos. El dedo medio izquierdo queda sobre la G, y el anular izquierdo sobre la D. Del lado derecho, el dedo medio queda en H y el anular en K. Esas son las seis teclas que usarás.',
    contenidoVidente: (
      <div>
        <p style={{ color:'#555', fontSize:14, marginBottom:16, lineHeight:1.6 }}>
          Con los índices en <strong>F</strong> y <strong>J</strong>, los demás dedos caen
          naturalmente sobre su tecla:
        </p>
        {/* Diagrama visual del teclado */}
        <TecladoDiagrama resaltadas={['D','F','G','H','J','K']} />
        <div style={{ marginTop:16, display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {[
            { tecla:'D', dedo:'Anular izq.', color:'#dbeafe', borde:'#93c5fd', texto:'#1d4ed8' },
            { tecla:'K', dedo:'Anular der.', color:'#dbeafe', borde:'#93c5fd', texto:'#1d4ed8' },
            { tecla:'F', dedo:'Índice izq.  ★', color:'#fef9c3', borde:'#f59e0b', texto:'#92400e' },
            { tecla:'J', dedo:'Índice der.  ★', color:'#fef9c3', borde:'#f59e0b', texto:'#92400e' },
            { tecla:'G', dedo:'Medio izq.', color:'#f3e8ff', borde:'#c4b5fd', texto:'#6d28d9' },
            { tecla:'H', dedo:'Medio der.', color:'#f3e8ff', borde:'#c4b5fd', texto:'#6d28d9' },
          ].map(({ tecla, dedo, color, borde, texto }) => (
            <div key={tecla} style={{ background:color, border:`1.5px solid ${borde}`, borderRadius:10, padding:'10px 14px', display:'flex', gap:10, alignItems:'center' }}>
              <div style={{ width:36, height:36, borderRadius:8, background:borde, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:18, color: texto, flexShrink:0 }}>{tecla}</div>
              <span style={{ fontSize:13, color:texto, fontWeight:600 }}>{dedo}</span>
            </div>
          ))}
        </div>
        <p style={{ color:'#888', fontSize:12, marginTop:12, textAlign:'center' }}>
          ★ Estas teclas tienen relieve táctil
        </p>
      </div>
    ),
    contenidoInvidente: 'Con el índice izquierdo en F y el derecho en J, los demás dedos caen solos. Mano izquierda: el anular queda sobre la D, el medio sobre la G, y el índice ya está en F. Mano derecha: el índice está en J, el medio cae sobre H, y el anular sobre K. Esas son las seis teclas: D, F, G en la mano izquierda, y H, J, K en la mano derecha.',
  },
  {
    id: 'coordenadas',
    titulo: 'Cada tecla es un punto braille',
    subtitulo: 'Las 6 teclas = los 6 puntos de la celda braille',
    icono: '⠿',
    voz: 'Paso 3. Cada tecla corresponde a un punto de la celda braille. La celda braille es una matriz de 3 filas y 2 columnas. La columna izquierda tiene los puntos 1, 2 y 3. La columna derecha tiene los puntos 4, 5 y 6. Tecla D es el punto 1, tecla F es el punto 2, tecla G es el punto 3, tecla H es el punto 4, tecla J es el punto 5, tecla K es el punto 6.',
    contenidoVidente: (
      <div>
        <p style={{ color:'#555', fontSize:14, marginBottom:20, lineHeight:1.6 }}>
          La celda braille es una <strong>matriz de 3 filas × 2 columnas</strong>.
          Cada tecla activa exactamente uno de esos 6 puntos:
        </p>
        <MapeoTeclasPuntos />
      </div>
    ),
    contenidoInvidente: 'La celda braille es una matriz de 3 filas por 2 columnas, con 6 puntos en total. La columna izquierda tiene los puntos 1, 2 y 3 de arriba hacia abajo. La columna derecha tiene los puntos 4, 5 y 6 también de arriba hacia abajo. Tus teclas de la mano izquierda controlan la columna izquierda: D activa el punto 1 que está arriba a la izquierda, F activa el punto 2 que está en el centro izquierdo, y G activa el punto 3 abajo a la izquierda. Tus teclas de la mano derecha controlan la columna derecha: H activa el punto 4 arriba a la derecha, J activa el punto 5 en el centro derecho, y K activa el punto 6 abajo a la derecha.',
  },
  {
    id: 'practica',
    titulo: '¡Listo para practicar!',
    subtitulo: 'Ya tienes todo lo que necesitas',
    icono: '🚀',
    voz: 'Paso final. ¡Estás listo para practicar! Recuerda: busca el relieve en F y J para posicionarte. D F G controlan la columna izquierda, puntos 1, 2 y 3. H J K controlan la columna derecha, puntos 4, 5 y 6. Presiona Enter para validar tu respuesta y Escape para limpiar la matriz. ¡Mucho éxito!',
    contenidoVidente: (
      <div>
        <ResumenFinal />
      </div>
    ),
    contenidoInvidente: 'Recuerda los tres puntos clave. Primero: usa el relieve táctil de F y J para posicionarte sin mirar. Segundo: D, F, G controlan la columna izquierda, puntos 1, 2 y 3. Tercero: H, J, K controlan la columna derecha, puntos 4, 5 y 6. Durante las actividades, presiona Enter para validar y Escape para limpiar. Ya tienes todo lo que necesitas. ¡Buena suerte!',
  },
]

// ─── Sub-componente: diagrama visual del teclado ──────────────────────────────
function TecladoDiagrama({ resaltadas }) {
  const fila = ['Q','W','E','R','T','Y','U','I','O','P']
  const fila2 = ['A','S','D','F','G','H','J','K','L','Ñ']
  const fila3 = ['Z','X','C','V','B','N','M',',','.','-']

  const colorTecla = (t) => {
    if (!resaltadas.includes(t)) return { bg:'#f1f5f9', color:'#94a3b8', borde:'#e2e8f0' }
    if (t === 'F' || t === 'J') return { bg:'#fef08a', color:'#92400e', borde:'#f59e0b' }
    if (t === 'D' || t === 'K') return { bg:'#bfdbfe', color:'#1d4ed8', borde:'#93c5fd' }
    return { bg:'#e9d5ff', color:'#6d28d9', borde:'#c4b5fd' }
  }

  return (
    <div style={{ background:'#1e293b', borderRadius:14, padding:16, display:'inline-block', width:'100%' }}>
      {[fila, fila2, fila3].map((row, ri) => (
        <div key={ri} style={{ display:'flex', gap:5, justifyContent:'center', marginBottom: ri < 2 ? 5 : 0 }}>
          {row.map(t => {
            const c = colorTecla(t)
            const esRelieve = t === 'F' || t === 'J'
            return (
              <div key={t} style={{
                width:32, height:32, borderRadius:6,
                background:c.bg, border:`2px solid ${c.borde}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontWeight:800, fontSize:12, color:c.color,
                position:'relative', flexShrink:0,
                boxShadow: resaltadas.includes(t) ? `0 0 8px ${c.borde}88` : 'none',
              }}>
                {t}
                {esRelieve && (
                  <div style={{ position:'absolute', bottom:3, left:'50%', transform:'translateX(-50%)', width:6, height:3, background:'#f59e0b', borderRadius:99 }}/>
                )}
              </div>
            )
          })}
        </div>
      ))}
      <div style={{ textAlign:'center', marginTop:10, fontSize:11, color:'#64748b' }}>
        <span style={{ marginRight:12 }}>
          <span style={{ display:'inline-block', width:10, height:10, background:'#fef08a', border:'1px solid #f59e0b', borderRadius:2, marginRight:4 }}/>
          Relieve táctil (F y J)
        </span>
        <span style={{ marginRight:12 }}>
          <span style={{ display:'inline-block', width:10, height:10, background:'#bfdbfe', border:'1px solid #93c5fd', borderRadius:2, marginRight:4 }}/>
          Anular (D y K)
        </span>
        <span>
          <span style={{ display:'inline-block', width:10, height:10, background:'#e9d5ff', border:'1px solid #c4b5fd', borderRadius:2, marginRight:4 }}/>
          Medio (G y H)
        </span>
      </div>
    </div>
  )
}

// ─── Sub-componente: mapeo teclas ↔ puntos braille ────────────────────────────
function MapeoTeclasPuntos() {
  const items = [
    { tecla:'D', punto:1, fila:'F1', col:'Col 1', dedo:'Anular izq.', colorTecla:'#bfdbfe', colorPunto:'#2563eb' },
    { tecla:'F', punto:2, fila:'F1', col:'Col 2', dedo:'Medio der.',  colorTecla:'#e9d5ff', colorPunto:'#7c3aed' },
    { tecla:'G', punto:3, fila:'F2', col:'Col 1', dedo:'Índice izq. ★', colorTecla:'#fef08a', colorPunto:'#d97706' },
    { tecla:'H', punto:4, fila:'F2', col:'Col 2', dedo:'Índice der. ★', colorTecla:'#fef08a', colorPunto:'#d97706' },
    { tecla:'J', punto:5, fila:'F3', col:'Col 1', dedo:'Medio izq.',  colorTecla:'#e9d5ff', colorPunto:'#7c3aed' },
    { tecla:'K', punto:6, fila:'F3', col:'Col 2', dedo:'Anular der.', colorTecla:'#bfdbfe', colorPunto:'#2563eb' },
  ]

  return (
    <div style={{ display:'flex', gap:24, alignItems:'flex-start', flexWrap:'wrap' }}>
      {/* Celda braille visual */}
      <div style={{ flexShrink:0 }}>
        <div style={{ fontSize:12, color:'#888', textAlign:'center', marginBottom:8, fontWeight:600 }}>Celda Braille</div>
        <div style={{ display:'grid', gridTemplateColumns:'64px 64px', gap:10, background:'white', borderRadius:12, padding:14, border:'2px solid #e5e7eb' }}>
          {[
            { n:1, tecla:'D', color:'#2563eb' },
            { n:4, tecla:'H', color:'#7c3aed' },
            { n:2, tecla:'F', color:'#d97706' },
            { n:5, tecla:'J', color:'#d97706' },
            { n:3, tecla:'G', color:'#7c3aed' },
            { n:6, tecla:'K', color:'#2563eb' },
          ].map(({ n, tecla, color }) => (
            <div key={n} style={{
              width:64, height:64, borderRadius:'50%',
              background:`${color}22`, border:`3px solid ${color}`,
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2,
            }}>
              <span style={{ fontSize:16, fontWeight:900, color }}>P{n}</span>
              <span style={{ fontSize:11, fontWeight:700, color, opacity:0.8 }}>{tecla}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize:11, color:'#aaa', textAlign:'center', marginTop:8 }}>
          P = Punto  |  Letra = Tecla
        </div>
      </div>

      {/* Tabla */}
      <div style={{ flex:1, minWidth:240 }}>
        <div style={{ fontSize:12, color:'#888', fontWeight:600, marginBottom:8 }}>Referencia completa</div>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {items.map(({ tecla, punto, fila, col, dedo, colorTecla: ct, colorPunto: cp }) => (
            <div key={tecla} style={{
              display:'flex', alignItems:'center', gap:10,
              background:ct + '55', border:`1.5px solid ${ct}`,
              borderRadius:8, padding:'7px 12px',
            }}>
              <div style={{ width:30, height:30, borderRadius:6, background:ct, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:16, flexShrink:0 }}>{tecla}</div>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ color:'#555', fontSize:13 }}>{dedo}</span>
                <span style={{ color:'#bbb', fontSize:12 }}>→</span>
              </div>
              <div style={{ marginLeft:'auto', display:'flex', gap:6, alignItems:'center' }}>
                <span style={{ background:cp, color:'white', borderRadius:20, padding:'2px 8px', fontWeight:800, fontSize:12 }}>P{punto}</span>
                <span style={{ color:'#aaa', fontSize:11 }}>{col} · {fila}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Sub-componente: resumen final ────────────────────────────────────────────
function ResumenFinal() {
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
        {[
          { titulo:'Ancla táctil', desc:'Busca el relieve en F (índice izq.) y J (índice der.) antes de empezar', emoji:'👆', color:'#fef9c3', borde:'#f59e0b' },
          { titulo:'Mano izquierda', desc:'D → P1   F → P2   G → P3\nColumna izquierda de la celda', emoji:'🤚', color:'#dbeafe', borde:'#93c5fd' },
          { titulo:'Mano derecha', desc:'H → P4   J → P5   K → P6\nColumna derecha de la celda', emoji:'✋', color:'#ede9fe', borde:'#c4b5fd' },
          { titulo:'Comandos', desc:'Enter → validar\nEscape → limpiar matriz', emoji:'⌨️', color:'#f0fdf4', borde:'#86efac' },
        ].map(({ titulo, desc, emoji, color, borde }) => (
          <div key={titulo} style={{ background:color, border:`1.5px solid ${borde}`, borderRadius:12, padding:14 }}>
            <div style={{ fontSize:24, marginBottom:6 }}>{emoji}</div>
            <div style={{ fontWeight:700, fontSize:13, color:'#1f2937', marginBottom:4 }}>{titulo}</div>
            <div style={{ fontSize:12, color:'#555', lineHeight:1.7, whiteSpace:'pre-line' }}>{desc}</div>
          </div>
        ))}
      </div>
      <div style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)', borderRadius:12, padding:16, textAlign:'center' }}>
        <p style={{ color:'white', fontWeight:700, fontSize:15, margin:0 }}>
          ¡Ya estás listo! Ve al Dashboard y comienza el Nivel 1 🚀
        </p>
      </div>
    </div>
  )
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function Tutorial() {
  const navigate = useNavigate()
  const invidente = esInvidente()
  const [pasoActual, setPasoActual] = useState(0)
  const [entrando, setEntrando] = useState(false)
  const btnRef = useRef(null)

  const paso = PASOS[pasoActual]
  const esPrimero = pasoActual === 0
  const esUltimo = pasoActual === PASOS.length - 1

  useEffect(() => {
    setVozActiva(invidente)
    if (invidente) {
      setTimeout(() => hablar(PASOS[0].voz), 500)
    }
  }, [])

  useEffect(() => {
    if (invidente) hablar(paso.voz)
    if (invidente) btnRef.current?.focus()
  }, [pasoActual])

  const irA = (nuevo) => {
    setEntrando(true)
    setTimeout(() => {
      setPasoActual(nuevo)
      setEntrando(false)
    }, 200)
  }

  // ── MODO INVIDENTE ─────────────────────────────────────────────────────────
  if (invidente) {
    return (
      <div style={si.page}>
        <div style={si.header}>
          <button style={si.btnVolver} onClick={() => navigate('/dashboard')}
            onFocus={() => hablar('Botón volver al panel principal')}>
            ← Volver
          </button>
          <span style={si.titulo} tabIndex={0}
            onFocus={() => hablar('Tutorial de orientación en el teclado. Paso ' + (pasoActual + 1) + ' de ' + PASOS.length)}>
            Tutorial — Paso {pasoActual + 1}/{PASOS.length}
          </span>
        </div>

        {/* Barra progreso */}
        <div style={{ height:6, background:'#2e2a5e', borderRadius:99, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${((pasoActual+1)/PASOS.length)*100}%`, background:'linear-gradient(90deg,#2563eb,#7c3aed)', borderRadius:99, transition:'width 0.4s' }}/>
        </div>

        {/* Contenido del paso */}
        <div style={si.card} tabIndex={0}
          onFocus={() => hablar(paso.voz)}
          onMouseEnter={() => hablar(paso.titulo)}>
          <div style={{ fontSize:48, textAlign:'center', marginBottom:8 }}>{paso.icono}</div>
          <div style={{ color:'white', fontWeight:800, fontSize:18, textAlign:'center', marginBottom:6 }}>{paso.titulo}</div>
          <div style={{ color:'#c4b5fd', fontSize:13, textAlign:'center', marginBottom:16 }}>{paso.subtitulo}</div>
          <div style={{ color:'#a78bfa', fontSize:14, lineHeight:1.8 }}>{paso.contenidoInvidente}</div>
        </div>

        {/* Botón releer */}
        <button style={si.btnReleer}
          onClick={() => hablar(paso.voz)}
          onFocus={() => hablar('Botón releer este paso')}>
          🔊 Repetir explicación
        </button>

        {/* Navegación */}
        <div style={{ display:'flex', gap:8 }}>
          {!esPrimero && (
            <button style={si.btnSec} onClick={() => irA(pasoActual - 1)}
              onFocus={() => hablar('Botón paso anterior')}>
              ← Anterior
            </button>
          )}
          {!esUltimo ? (
            <button ref={btnRef} style={si.btnPrimario} onClick={() => irA(pasoActual + 1)}
              onFocus={() => hablar('Botón siguiente paso. Presiona Enter para continuar')}>
              Siguiente →
            </button>
          ) : (
            <button ref={btnRef} style={{ ...si.btnPrimario, background:'#22c55e' }}
              onClick={() => navigate('/dashboard')}
              onFocus={() => hablar('Botón finalizar tutorial y volver al panel principal')}>
              ✓ Finalizar tutorial
            </button>
          )}
        </div>

        {/* Puntos de navegación */}
        <div style={{ display:'flex', justifyContent:'center', gap:8, paddingTop:4 }}>
          {PASOS.map((_, i) => (
            <button key={i}
              style={{ width:8, height:8, borderRadius:'50%', border:'none', background: i === pasoActual ? '#7c3aed' : '#3b3570', cursor:'pointer', padding:0 }}
              onClick={() => irA(i)}
              tabIndex={-1}/>
          ))}
        </div>
      </div>
    )
  }

  // ── MODO VIDENTE ──────────────────────────────────────────────────────────
  return (
    <div style={sv.page}>
      {/* Header */}
      <div style={sv.header}>
        <button style={sv.btnVolver} onClick={() => navigate('/dashboard')}>← Volver al Dashboard</button>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontWeight:700, fontSize:16 }}>Tutorial de Teclado</div>
          <div style={{ color:'#888', fontSize:13 }}>Orientación táctil para braille</div>
        </div>
        <div style={{ color:'#888', fontSize:13, fontWeight:600 }}>
          {pasoActual + 1} / {PASOS.length}
        </div>
      </div>

      {/* Barra progreso */}
      <div style={{ height:8, background:'#e5e7eb', borderRadius:99, marginBottom:28, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${((pasoActual+1)/PASOS.length)*100}%`, background:'linear-gradient(90deg,#7c3aed,#2563eb)', borderRadius:99, transition:'width 0.5s ease' }}/>
      </div>

      {/* Dots de navegación */}
      <div style={{ display:'flex', justifyContent:'center', gap:10, marginBottom:28 }}>
        {PASOS.map((p, i) => (
          <button key={i}
            onClick={() => irA(i)}
            title={p.titulo}
            style={{
              width: i === pasoActual ? 28 : 10,
              height:10, borderRadius:99, border:'none',
              background: i === pasoActual ? '#7c3aed' : i < pasoActual ? '#a78bfa' : '#e5e7eb',
              cursor:'pointer', transition:'all 0.3s ease', padding:0,
            }}/>
        ))}
      </div>

      {/* Tarjeta principal */}
      <div style={{
        ...sv.card,
        opacity: entrando ? 0 : 1,
        transform: entrando ? 'translateX(20px)' : 'translateX(0)',
        transition:'all 0.2s ease',
      }}>
        {/* Icono + título */}
        <div style={sv.cardHeader}>
          <div style={sv.iconoGrande}>{paso.icono}</div>
          <div>
            <h2 style={{ fontSize:24, fontWeight:800, color:'#1f2937', margin:0 }}>{paso.titulo}</h2>
            <p style={{ color:'#888', margin:'6px 0 0', fontSize:15 }}>{paso.subtitulo}</p>
          </div>
        </div>

        <div style={sv.divisor}/>

        {/* Contenido */}
        <div>{paso.contenidoVidente}</div>
      </div>

      {/* Navegación */}
      <div style={{ display:'flex', gap:12, marginTop:24 }}>
        {!esPrimero && (
          <button style={sv.btnSec} onClick={() => irA(pasoActual - 1)}>← Anterior</button>
        )}
        <div style={{ flex:1 }}/>
        {!esUltimo ? (
          <button style={sv.btnPrimario} onClick={() => irA(pasoActual + 1)}>
            Siguiente paso →
          </button>
        ) : (
          <button style={{ ...sv.btnPrimario, background:'linear-gradient(135deg,#22c55e,#16a34a)' }}
            onClick={() => navigate('/dashboard')}>
            ✓ ¡Listo! Ir al Dashboard
          </button>
        )}
      </div>

      {/* Badge opcional */}
      <p style={{ textAlign:'center', color:'#bbb', fontSize:12, marginTop:16 }}>
        Este tutorial es opcional — puedes cerrarlo en cualquier momento
      </p>
    </div>
  )
}

// ─── ESTILOS ──────────────────────────────────────────────────────────────────
const si = {
  page:{ maxWidth:440, margin:'0 auto', padding:14, background:'#1e1b4b', minHeight:'100vh', display:'flex', flexDirection:'column', gap:10 },
  header:{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'#2e2a5e', borderRadius:10, padding:'10px 14px' },
  btnVolver:{ background:'none', border:'none', cursor:'pointer', fontWeight:700, color:'#c4b5fd', fontSize:14 },
  titulo:{ color:'white', fontWeight:800, fontSize:14 },
  card:{ background:'#2e2a5e', borderRadius:12, padding:18, flex:1 },
  btnReleer:{ background:'#3b3670', color:'#a78bfa', border:'1px solid #7c3aed', borderRadius:8, padding:'10px 16px', fontWeight:700, fontSize:13, cursor:'pointer', textAlign:'center' },
  btnPrimario:{ flex:1, padding:'13px', background:'#7c3aed', color:'white', border:'none', borderRadius:10, fontWeight:800, fontSize:15, cursor:'pointer' },
  btnSec:{ flex:1, padding:'13px', background:'#2e2a5e', color:'#c4b5fd', border:'2px solid #4b4280', borderRadius:10, fontWeight:700, fontSize:14, cursor:'pointer' },
}

const sv = {
  page:{ maxWidth:760, margin:'0 auto', padding:24, background:'#f0f4ff', minHeight:'100vh' },
  header:{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'white', borderRadius:12, padding:'14px 22px', marginBottom:24, boxShadow:'0 2px 8px #0001' },
  btnVolver:{ background:'none', border:'none', cursor:'pointer', fontWeight:600, color:'#555', fontSize:14 },
  card:{ background:'white', borderRadius:16, padding:32, boxShadow:'0 4px 24px #0001' },
  cardHeader:{ display:'flex', gap:16, alignItems:'center', marginBottom:20 },
  iconoGrande:{ fontSize:52, background:'#f5f3ff', borderRadius:12, width:72, height:72, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  divisor:{ height:1, background:'#f1f5f9', margin:'0 0 24px' },
  btnPrimario:{ padding:'13px 32px', background:'linear-gradient(135deg,#7c3aed,#2563eb)', color:'white', border:'none', borderRadius:10, fontWeight:700, fontSize:15, cursor:'pointer', boxShadow:'0 4px 16px #7c3aed33' },
  btnSec:{ padding:'13px 24px', background:'white', color:'#555', border:'1.5px solid #e5e7eb', borderRadius:10, fontWeight:600, fontSize:14, cursor:'pointer' },
}