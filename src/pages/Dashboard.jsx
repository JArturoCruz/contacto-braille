import { useNavigate } from 'react-router-dom'
import { hablar, setVozActiva } from '../utils/voz'
import { getModo, setModo, esInvidente } from '../utils/modo'
import { useEffect } from 'react'

const units = [
  { name:'Fundamentos del Braille', desc:'Aprende los conceptos básicos y las primeras letras', color:'#e0e7ff', locked:false, ruta:'/leccion1' },
  { name:'Expandiendo el Alfabeto', desc:'Domina más letras y combinaciones', color:'#ede9fe', locked:true, req:5 },
  { name:'Números y Símbolos', desc:'Aprende a escribir números en braille', color:'#fce7f3', locked:true, req:10 },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const nombre = sessionStorage.getItem('nombre') || 'Usuario'
  const invidente = esInvidente()

  useEffect(() => {
    // Aplicar voz según modo actual al entrar al dashboard
    setVozActiva(invidente)
    if (invidente) {
      setTimeout(() => hablar(`Panel principal. Hola ${nombre}. Usa Tab para navegar entre elementos.`), 400)
    }
  }, [])

  const toggleModo = () => {
    const nuevo = invidente ? 'vidente' : 'invidente'
    setModo(nuevo)
    setVozActiva(nuevo === 'invidente')
    if (nuevo === 'invidente') {
      hablar('Modo invidente activado. La voz guiada está encendida.')
    }
    window.location.reload()
  }

  if (invidente) {
    return (
      <div style={si.page}>

        <div style={si.header}>
          <span style={si.titulo} tabIndex={0}
            onFocus={() => hablar('Panel principal de ConTacto. Aprende Braille')}
            onMouseEnter={() => hablar('Panel principal de ConTacto')}>
            ⠿ Aprende Braille
          </span>
          <div style={{display:'flex', gap:8}}>
            <button style={si.modeBtn} onClick={toggleModo} tabIndex={0}
              onFocus={() => hablar('Botón cambiar a modo vidente. La voz se desactivará')}
              onMouseEnter={() => hablar('Cambiar a modo vidente')}>
              👁 Vidente
            </button>
            <button style={si.modeBtn} onClick={() => navigate('/')} tabIndex={0}
              onFocus={() => hablar('Botón cerrar sesión')}
              onMouseEnter={() => hablar('Cerrar sesión')}>
              ↩ Salir
            </button>
          </div>
        </div>

        <div style={si.statsRow}>
          {[
            {label:'Nivel', value:1, color:'#2563eb', desc:'Nivel actual: 1. Cero de 500 puntos de experiencia'},
            {label:'Estrellas', value:0, color:'#d97706', desc:'Cero estrellas. Completa lecciones para ganar estrellas'},
            {label:'Racha', value:0, color:'#ea580c', desc:'Cero días de racha. Practica cada día'},
            {label:'Logros', value:0, color:'#7c3aed', desc:'Cero logros desbloqueados'},
          ].map((s,i) => (
            <div key={i} style={{...si.statCard, background:s.color}} tabIndex={0}
              onFocus={() => hablar(s.desc)}
              onMouseEnter={() => hablar(s.desc)}>
              <span style={si.statVal}>{s.value}</span>
              <span style={si.statLbl}>{s.label}</span>
            </div>
          ))}
        </div>

        <h2 style={si.seccion} tabIndex={0}
          onFocus={() => hablar('Sección unidades de aprendizaje. Completa lecciones para desbloquear nuevas unidades')}
          onMouseEnter={() => hablar('Unidades de aprendizaje')}>
          Unidades
        </h2>

        {units.map((u, i) => (
          <div key={i} style={si.unitCard} tabIndex={0}
            onFocus={() => hablar(u.locked
              ? u.name + ', bloqueado. Requiere ' + u.req + ' estrellas. ' + u.desc
              : u.name + ', disponible. ' + u.desc + '. Presiona Tab para llegar al botón comenzar')}
            onMouseEnter={() => hablar(u.locked
              ? u.name + ', bloqueado'
              : u.name + ', disponible')}>
            <div style={{flex:1}}>
              <div style={si.unitNombre}>{u.locked ? '🔒 ' : '📚 '}{u.name}</div>
              <div style={si.unitDesc}>{u.desc}</div>
            </div>
            {!u.locked && (
              <button style={si.btnComenzar} tabIndex={0}
                onClick={() => navigate(u.ruta)}
                onFocus={() => hablar('Botón comenzar ' + u.name + '. Presiona Enter para iniciar')}
                onMouseEnter={() => hablar('Comenzar ' + u.name)}>
                ▶ Comenzar
              </button>
            )}
          </div>
        ))}

        <div style={si.ayuda} tabIndex={0}
          onFocus={() => hablar('Ayuda de navegación. Usa la tecla Tab para moverte entre elementos. Presiona Enter para activar botones.')}>
          ℹ️ Usa <strong>Tab</strong> para navegar · <strong>Enter</strong> para activar
        </div>

      </div>
    )
  }

  // MODO VIDENTE
  return (
    <div style={sv.page}>
      <div style={sv.header}>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <div style={sv.logoSmall}>⠿</div>
          <div>
            <div style={{fontWeight:700, fontSize:16}}>Aprende Braille</div>
            <div style={{color:'#888', fontSize:13}}>Hola, {nombre}</div>
          </div>
        </div>
        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          <button style={sv.modeBtn} onClick={toggleModo}>
            🦯 Modo Invidente
          </button>
          <button style={sv.logoutBtn} onClick={() => navigate('/')}>↩</button>
        </div>
      </div>

      <div style={sv.stats}>
        {[
          {label:'Nivel Actual', value:1, sub:'0 de 500 XP', color:'#2563eb'},
          {label:'Estrellas', value:0, sub:'0 lecciones completadas', color:'#d97706'},
          {label:'Días de Racha', value:0, sub:'¡Sigue así!', color:'#ea580c'},
          {label:'Logros', value:0, sub:'Desbloquea más', color:'#7c3aed'},
        ].map((s,i) => (
          <div key={i} style={{...sv.statCard, background:s.color}}>
            <div style={sv.statValue}>{s.value}</div>
            <div style={sv.statLabel}>{s.label}</div>
            <div style={sv.statSub}>{s.sub}</div>
          </div>
        ))}
      </div>

      <h2 style={sv.sectionTitle}>Unidades de Aprendizaje</h2>
      <p style={{color:'#888', marginBottom:20}}>Completa lecciones para desbloquear nuevas unidades</p>

      {units.map((u, i) => (
        <div key={i} style={{...sv.unitCard, background: u.locked ? '#f9fafb' : 'white'}}>
          <div style={{...sv.unitIcon, background: u.color}}>{u.locked ? '🔒' : '📚'}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:700, fontSize:16, color: u.locked ? '#aaa' : '#111'}}>
              {u.name} {u.locked && <span style={{fontSize:12, color:'#f59e0b'}}>🔒 Requiere {u.req} ⭐</span>}
            </div>
            <div style={{color:'#888', fontSize:13, marginTop:4}}>{u.desc}</div>
            <div style={{marginTop:10}}>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:12, color:'#888', marginBottom:4}}>
                <span>Progreso</span><span>0/5 lecciones</span>
              </div>
              <div style={sv.progressBar}><div style={{...sv.progressFill, width:'0%'}}/></div>
            </div>
          </div>
          {!u.locked && (
            <button style={sv.startBtn} onClick={() => navigate(u.ruta)}>▶ Comenzar</button>
          )}
        </div>
      ))}
    </div>
  )
}

const si = {
  page: { maxWidth:480, margin:'0 auto', padding:12, background:'#1e1b4b', minHeight:'100vh', display:'flex', flexDirection:'column', gap:8 },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', background:'#2e2a5e', borderRadius:10, padding:'12px 16px' },
  titulo: { color:'white', fontSize:18, fontWeight:800, cursor:'default' },
  modeBtn: { background:'#7c3aed', color:'white', border:'none', borderRadius:8, padding:'8px 12px', cursor:'pointer', fontWeight:700, fontSize:13 },
  statsRow: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 },
  statCard: { borderRadius:8, padding:10, color:'white', textAlign:'center', cursor:'default' },
  statVal: { display:'block', fontSize:22, fontWeight:800 },
  statLbl: { display:'block', fontSize:11, opacity:0.85 },
  seccion: { color:'white', fontSize:16, fontWeight:800, margin:0, cursor:'default' },
  unitCard: { background:'#2e2a5e', borderRadius:10, padding:'12px 16px', display:'flex', alignItems:'center', gap:12, cursor:'default' },
  unitNombre: { color:'white', fontWeight:700, fontSize:15 },
  unitDesc: { color:'#c4b5fd', fontSize:13, marginTop:2 },
  btnComenzar: { background:'#7c3aed', color:'white', border:'none', borderRadius:8, padding:'10px 16px', fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' },
  ayuda: { background:'#2e2a5e', borderRadius:8, padding:'10px 14px', color:'#a78bfa', fontSize:13, textAlign:'center', cursor:'default' },
}

const sv = {
  page: { maxWidth:900, margin:'0 auto', padding:24, background:'#f0f4ff', minHeight:'100vh' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', background:'white', borderRadius:12, padding:'16px 24px', marginBottom:24, boxShadow:'0 2px 8px #0001' },
  logoSmall: { fontSize:28, background:'#ede9fe', borderRadius:8, padding:'4px 8px', cursor:'default' },
  modeBtn: { background:'#f5f3ff', border:'1px solid #ddd', borderRadius:8, padding:'8px 16px', cursor:'pointer', fontWeight:600 },
  logoutBtn: { background:'#fee2e2', border:'none', borderRadius:8, padding:'8px 12px', cursor:'pointer', fontSize:16 },
  stats: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:32 },
  statCard: { borderRadius:12, padding:20, color:'white', cursor:'default' },
  statValue: { fontSize:32, fontWeight:800 },
  statLabel: { fontWeight:600, marginTop:8 },
  statSub: { fontSize:12, opacity:0.85, marginTop:4 },
  sectionTitle: { fontSize:22, fontWeight:700, marginBottom:4 },
  unitCard: { display:'flex', gap:20, alignItems:'center', borderRadius:12, padding:20, marginBottom:16, boxShadow:'0 2px 8px #0001', cursor:'default' },
  unitIcon: { width:56, height:56, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 },
  progressBar: { height:6, background:'#e5e7eb', borderRadius:99, overflow:'hidden' },
  progressFill: { height:'100%', background:'#2563eb', borderRadius:99 },
  startBtn: { background:'#111', color:'white', border:'none', borderRadius:8, padding:'10px 20px', fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' }
}