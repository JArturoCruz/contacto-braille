import { useNavigate } from 'react-router-dom'
import { hablar, setVozActiva } from '../utils/voz'
import { getModo, setModo, esInvidente } from '../utils/modo'
import { useEffect, useState } from 'react'
import { NIVELES, LOGROS, leerProgreso } from '../data/niveles'

const UNIDADES = [
  {
    name: 'Fundamentos del Braille',
    desc: 'Aprende los conceptos básicos y las primeras letras',
    color: '#e0e7ff',
    nivelesIds: [1, 2, 3, 4],
    requiereNivel: null,
    emoji: '📚',
  },
  {
    name: 'Expandiendo el Alfabeto',
    desc: 'Domina más letras y combinaciones',
    color: '#ede9fe',
    nivelesIds: [5, 6, 7],
    requiereNivel: 4,
    emoji: '🔤',
  },
  {
    name: 'Maestría Braille',
    desc: 'Lectura, velocidad y dominio total',
    color: '#fce7f3',
    nivelesIds: [8, 9, 10],
    requiereNivel: 7,
    emoji: '🏆',
  },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const nombre = sessionStorage.getItem('nombre') || 'Usuario'
  const invidente = esInvidente()
  const [progreso, setProgreso] = useState(leerProgreso())

  useEffect(() => {
    setVozActiva(invidente)
    setProgreso(leerProgreso())
    if (invidente) {
      setTimeout(() => hablar(`Panel principal. Hola ${nombre}. Usa Tab para navegar.`), 400)
    }
  }, [])

  const toggleModo = () => {
    const nuevo = invidente ? 'vidente' : 'invidente'
    setModo(nuevo)
    setVozActiva(nuevo === 'invidente')
    if (nuevo === 'invidente') hablar('Modo invidente activado.')
    window.location.reload()
  }

  const nivelesCompletados = progreso.nivelesCompletados?.length || 0
  const xp = progreso.xp || 0
  const nivel = Math.floor(xp / 500) + 1
  const xpEnNivel = xp % 500
  const logrosCount = progreso.logros?.length || 0

  // ──────── MODO INVIDENTE ────────────────────────────────────────────────────
  if (invidente) {
    return (
      <div style={si.page}>
        <div style={si.header}>
          <span style={si.titulo} tabIndex={0}
            onFocus={() => hablar('Panel principal de ConTacto')}>
            ⠿ Aprende Braille
          </span>
          <div style={{ display:'flex', gap:8 }}>
            <button style={si.modeBtn} onClick={toggleModo} tabIndex={0}
              onFocus={() => hablar('Cambiar a modo vidente')}>
              👁 Vidente
            </button>
            <button style={si.modeBtn} onClick={() => navigate('/')} tabIndex={0}
              onFocus={() => hablar('Cerrar sesión')}>
              ↩ Salir
            </button>
          </div>
        </div>

        <div style={si.statsRow}>
          {[
            { label:'Nivel', value:nivel, color:'#2563eb', desc:`Nivel ${nivel}` },
            { label:'XP', value:xp, color:'#f59e0b', desc:`${xp} puntos de experiencia` },
            { label:'Completados', value:nivelesCompletados, color:'#22c55e', desc:`${nivelesCompletados} niveles completados` },
            { label:'Logros', value:logrosCount, color:'#7c3aed', desc:`${logrosCount} logros` },
          ].map((s,i) => (
            <div key={i} style={{ ...si.statCard, background:s.color }} tabIndex={0}
              onFocus={() => hablar(s.desc)}>
              <span style={si.statVal}>{s.value}</span>
              <span style={si.statLbl}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Botón tutorial */}
        <button
          style={si.btnTutorial}
          onClick={() => navigate('/tutorial')}
          tabIndex={0}
          onFocus={() => hablar('Botón tutorial de teclado. Aprende a ubicar tus dedos para escribir braille. Es opcional. Presiona Enter para abrir.')}
          onMouseEnter={() => hablar('Tutorial de teclado')}>
          <span style={{ fontSize:20 }}>⌨️</span>
          <div style={{ flex:1, textAlign:'left' }}>
            <div style={{ color:'white', fontWeight:800, fontSize:14 }}>Tutorial de Teclado</div>
            <div style={{ color:'#a78bfa', fontSize:12 }}>Aprende a posicionar tus dedos · Opcional</div>
          </div>
          <span style={{ color:'#7c6fad', fontSize:14 }}>→</span>
        </button>

        {UNIDADES.map((u, ui) => {
          const bloqueada = u.requiereNivel && !progreso.nivelesCompletados?.includes(u.requiereNivel)
          return (
            <div key={ui}>
              <div style={si.unitHeader} tabIndex={0}
                onFocus={() => hablar(bloqueada ? `Unidad ${u.name} bloqueada` : u.name)}>
                <span style={{ color:'white', fontWeight:800, fontSize:14 }}>{bloqueada ? '🔒 ' : `${u.emoji} `}{u.name}</span>
              </div>
              {!bloqueada && u.nivelesIds.map(nid => {
                const n = NIVELES.find(x => x.id === nid)
                const completado = progreso.nivelesCompletados?.includes(nid)
                const estrellas = progreso.estrellasNivel?.[nid] || 0
                const prevCompletado = nid === 1 || progreso.nivelesCompletados?.includes(nid - 1) || u.nivelesIds[0] === nid
                const disponible = prevCompletado
                return (
                  <button key={nid}
                    style={{ ...si.nivelBtn, background: completado ? '#1a3a1a' : disponible ? '#2e2a5e' : '#1e1b4b', opacity: disponible ? 1 : 0.5 }}
                    disabled={!disponible}
                    onClick={() => disponible && navigate(`/actividades/${nid}`)}
                    tabIndex={disponible ? 0 : -1}
                    onFocus={() => hablar(`Nivel ${nid}: ${n.titulo}. ${completado ? `Completado con ${estrellas} estrellas.` : disponible ? 'Disponible.' : 'Bloqueado.'} ${n.descripcion}`)}>
                    <span style={{ color: completado ? '#22c55e' : '#a78bfa', fontWeight:800, fontSize:13 }}>
                      Nv.{nid} {n.titulo}
                    </span>
                    <span style={{ color:'#7c6fad', fontSize:11 }}>
                      {completado ? '⭐'.repeat(estrellas) : disponible ? '▶' : '🔒'}
                    </span>
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }

  // ──────── MODO VIDENTE ──────────────────────────────────────────────────────
  return (
    <div style={sv.page}>
      <div style={sv.header}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={sv.logoSmall}>⠿</div>
          <div>
            <div style={{ fontWeight:700, fontSize:16 }}>ConTacto</div>
            <div style={{ color:'#888', fontSize:13 }}>Hola, {nombre}</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <button style={sv.modeBtn} onClick={toggleModo}>🦯 Modo Invidente</button>
          <button style={sv.logoutBtn} onClick={() => navigate('/')}>↩</button>
        </div>
      </div>

      {/* Stats */}
      <div style={sv.stats}>
        {[
          { label:'Nivel Jugador', value:nivel, sub:`${xpEnNivel}/500 XP`, color:'#2563eb' },
          { label:'XP Total', value:xp, sub:'Puntos de experiencia', color:'#f59e0b' },
          { label:'Niveles Completados', value:nivelesCompletados, sub:`de ${NIVELES.length} totales`, color:'#22c55e' },
          { label:'Logros', value:logrosCount, sub:`de ${LOGROS.length} posibles`, color:'#7c3aed' },
        ].map((s,i) => (
          <div key={i} style={{ ...sv.statCard, background:s.color }}>
            <div style={sv.statValue}>{s.value}</div>
            <div style={sv.statLabel}>{s.label}</div>
            <div style={sv.statSub}>{s.sub}</div>
          </div>
        ))}
      </div>

    

      {/* Logros recientes */}
      {progreso.logros?.length > 0 && (
        <div style={{ background:'white', borderRadius:12, padding:'16px 20px', marginBottom:24, boxShadow:'0 2px 8px #0001' }}>
          <div style={{ fontWeight:700, fontSize:14, marginBottom:12, color:'#555' }}>🏅 Tus logros</div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {progreso.logros.map(lid => {
              const l = LOGROS.find(x => x.id === lid)
              if (!l) return null
              return (
                <div key={lid} title={l.desc} style={{ background:`${l.color}22`, border:`1.5px solid ${l.color}`, borderRadius:10, padding:'8px 12px', display:'flex', gap:8, alignItems:'center' }}>
                  <span style={{ fontSize:22 }}>{l.emoji}</span>
                  <div>
                    <div style={{ fontWeight:700, fontSize:12, color:l.color }}>{l.titulo}</div>
                    <div style={{ fontSize:11, color:'#888' }}>{l.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Banner tutorial */}
      <div style={sv.tutorialBanner} onClick={() => navigate('/tutorial')}>
        <div style={{ fontSize:36 }}>⌨️</div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, fontSize:15, color:'#1f2937' }}>Tutorial de Teclado</div>
          <div style={{ color:'#6b7280', fontSize:13, marginTop:2 }}>
            ¿Primera vez? Aprende a ubicar tus dedos para escribir braille — tarda menos de 3 minutos
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={sv.badgeOpcional}>Opcional</span>
          <span style={{ color:'#7c3aed', fontWeight:700, fontSize:18 }}>→</span>
        </div>
      </div>

      <h2 style={sv.sectionTitle}>Unidades de Aprendizaje</h2>
      <p style={{ color:'#888', marginBottom:20 }}>Completa niveles en orden para desbloquear nuevas unidades</p>

      {UNIDADES.map((u, ui) => {
        const bloqueada = u.requiereNivel && !progreso.nivelesCompletados?.includes(u.requiereNivel)
        const nivelesDeUnidad = u.nivelesIds.map(id => NIVELES.find(n => n.id === id))
        const completadosEnUnidad = u.nivelesIds.filter(id => progreso.nivelesCompletados?.includes(id)).length
        const pct = Math.round((completadosEnUnidad / u.nivelesIds.length) * 100)

        return (
          <div key={ui} style={{ ...sv.unitCard, background: bloqueada ? '#f9fafb' : 'white', opacity: bloqueada ? 0.75 : 1 }}>
            <div style={{ ...sv.unitIcon, background: u.color }}>{bloqueada ? '🔒' : u.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:17, color: bloqueada ? '#aaa' : '#111', marginBottom:4 }}>
                {u.name}
                {bloqueada && <span style={{ fontSize:12, color:'#f59e0b', marginLeft:8 }}>🔒 Completa el nivel {u.requiereNivel}</span>}
              </div>
              <div style={{ color:'#888', fontSize:13, marginBottom:10 }}>{u.desc}</div>

              {/* Progreso de unidad */}
              <div style={{ marginBottom:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#888', marginBottom:4 }}>
                  <span>Progreso</span>
                  <span>{completadosEnUnidad}/{u.nivelesIds.length} niveles</span>
                </div>
                <div style={sv.progressBar}>
                  <div style={{ ...sv.progressFill, width:`${pct}%` }}/>
                </div>
              </div>

              {/* Chips de niveles */}
              {!bloqueada && (
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {nivelesDeUnidad.map((n, ni) => {
                    const completado = progreso.nivelesCompletados?.includes(n.id)
                    const estrellas  = progreso.estrellasNivel?.[n.id] || 0
                    const prevOk = n.id === 1 || progreso.nivelesCompletados?.includes(n.id - 1) || u.nivelesIds[0] === n.id
                    return (
                      <button key={n.id}
                        disabled={!prevOk}
                        onClick={() => prevOk && navigate(`/actividades/${n.id}`)}
                        style={{
                          padding:'6px 12px',
                          borderRadius:20,
                          border: completado ? '2px solid #22c55e' : prevOk ? '2px solid #7c3aed' : '2px solid #ddd',
                          background: completado ? '#f0fdf4' : prevOk ? '#f5f3ff' : '#f9f9f9',
                          color: completado ? '#16a34a' : prevOk ? '#7c3aed' : '#bbb',
                          fontWeight:700, fontSize:12, cursor: prevOk ? 'pointer' : 'default',
                          display:'flex', gap:4, alignItems:'center',
                        }}>
                        {completado ? '⭐'.repeat(estrellas) + ' ' : prevOk ? '▶ ' : '🔒 '}
                        Nv.{n.id} {n.titulo}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )
      })}
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
  statVal: { display:'block', fontSize:20, fontWeight:800 },
  statLbl: { display:'block', fontSize:10, opacity:0.85 },
  unitHeader: { background:'#3b3670', borderRadius:8, padding:'8px 12px', cursor:'default' },
  nivelBtn: { width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', border:'none', borderRadius:8, padding:'10px 14px', marginTop:4, cursor:'pointer', textAlign:'left' },
  btnTutorial: { display:'flex', alignItems:'center', gap:12, background:'#2e2a5e', border:'1.5px dashed #7c3aed', borderRadius:10, padding:'12px 14px', cursor:'pointer', width:'100%', transition:'background 0.15s' },
}

const sv = {
  page: { maxWidth:900, margin:'0 auto', padding:24, background:'#f0f4ff', minHeight:'100vh' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', background:'white', borderRadius:12, padding:'16px 24px', marginBottom:24, boxShadow:'0 2px 8px #0001' },
  logoSmall: { fontSize:28, background:'#ede9fe', borderRadius:8, padding:'4px 8px' },
  modeBtn: { background:'#f5f3ff', border:'1px solid #ddd', borderRadius:8, padding:'8px 16px', cursor:'pointer', fontWeight:600 },
  logoutBtn: { background:'#fee2e2', border:'none', borderRadius:8, padding:'8px 12px', cursor:'pointer', fontSize:16 },
  stats: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 },
  statCard: { borderRadius:12, padding:20, color:'white' },
  statValue: { fontSize:30, fontWeight:800 },
  statLabel: { fontWeight:600, marginTop:8 },
  statSub: { fontSize:12, opacity:0.85, marginTop:4 },
  sectionTitle: { fontSize:22, fontWeight:700, marginBottom:4 },
  unitCard: { display:'flex', gap:20, alignItems:'flex-start', borderRadius:12, padding:20, marginBottom:16, boxShadow:'0 2px 8px #0001' },
  unitIcon: { width:56, height:56, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 },
  progressBar: { height:6, background:'#e5e7eb', borderRadius:99, overflow:'hidden' },
  progressFill: { height:'100%', background:'linear-gradient(90deg,#7c3aed,#2563eb)', borderRadius:99, transition:'width 0.5s' },
  startBtn: { background:'#111', color:'white', border:'none', borderRadius:8, padding:'10px 20px', fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' },
  tutorialBanner: { display:'flex', alignItems:'center', gap:16, background:'white', border:'2px dashed #c4b5fd', borderRadius:12, padding:'16px 20px', marginBottom:24, cursor:'pointer', transition:'border-color 0.2s, box-shadow 0.2s', boxShadow:'0 2px 8px #0001' },
  badgeOpcional: { background:'#f5f3ff', color:'#7c3aed', border:'1px solid #ddd6fe', borderRadius:20, padding:'3px 10px', fontSize:12, fontWeight:700, whiteSpace:'nowrap' },
}