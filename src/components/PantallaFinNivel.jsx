import { useEffect, useState } from 'react'
import { hablar } from '../utils/voz'
import { LOGROS } from '../data/niveles'

/**
 * PantallaFinNivel
 * Props:
 *   nivel           objeto del nivel completado
 *   aciertos        int
 *   totalPreguntas  int
 *   intentos        int
 *   xpGanado        int
 *   estrellas       1|2|3
 *   logroNuevo      logro desbloqueado (o null)
 *   invidente       bool
 *   onSiguiente     () => void
 *   onReintentar    () => void
 *   onVolver        () => void
 *   xpTotal         int  (XP acumulado tras este nivel)
 */
export default function PantallaFinNivel({
  nivel,
  aciertos,
  totalPreguntas,
  intentos,
  xpGanado,
  estrellas,
  logroNuevo,
  invidente,
  onSiguiente,
  onReintentar,
  onVolver,
  xpTotal,
}) {
  const precision = totalPreguntas > 0 ? Math.round((aciertos / totalPreguntas) * 100) : 0
  const [step, setStep] = useState(0)
  const [estrellasAnimadas, setEstrellasAnimadas] = useState(0)
  const [mostrarLogro, setMostrarLogro] = useState(false)

  useEffect(() => {
    // Animación escalonada
    const t1 = setTimeout(() => setStep(1), 300)
    const t2 = setTimeout(() => setStep(2), 900)
    const t3 = setTimeout(() => {
      setStep(3)
      animarEstrellas()
    }, 1500)
    const t4 = setTimeout(() => {
      setStep(4)
      if (logroNuevo) setTimeout(() => setMostrarLogro(true), 400)
    }, 2200)

    if (invidente) {
      hablar(estrellas === 3
        ? `¡Perfecto! Nivel ${nivel.id} completado con ${precision} por ciento de precisión. Ganaste ${xpGanado} puntos de experiencia.`
        : `Nivel ${nivel.id} completado. ${aciertos} aciertos de ${totalPreguntas}. Ganaste ${xpGanado} XP.`)
    }

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  const animarEstrellas = () => {
    let s = 0
    const iv = setInterval(() => {
      s++
      setEstrellasAnimadas(s)
      if (s >= estrellas) clearInterval(iv)
    }, 300)
  }

  const inv = invidente

  // ─── Paleta de colores según estrellas ─────────────────────────────────────
  const paleta = estrellas === 3
    ? { fondo:'#1a1232', card:'#2e2a5e', accent:'#f59e0b', glow:'#f59e0b44' }
    : estrellas === 2
    ? { fondo:'#1a1232', card:'#2e2a5e', accent:'#a78bfa', glow:'#7c3aed44' }
    : { fondo:'#1a1232', card:'#2e2a5e', accent:'#60a5fa', glow:'#2563eb33' }

  if (inv) {
    return (
      <div style={{ background: paleta.fondo, minHeight:'100vh', padding:12, display:'flex', flexDirection:'column', gap:10, maxWidth:420, margin:'0 auto' }}>

        {/* Trofeo */}
        <div style={{ textAlign:'center', fontSize:56, paddingTop:16,
          opacity: step>=1?1:0, transform: step>=1?'scale(1)':'scale(0.5)',
          transition:'all 0.5s cubic-bezier(0.34,1.56,0.64,1)' }}>
          {estrellas === 3 ? '🏆' : estrellas === 2 ? '🥈' : '🥉'}
        </div>

        {/* Título */}
        <div style={{ textAlign:'center',
          opacity: step>=1?1:0, transform: step>=1?'translateY(0)':'translateY(20px)',
          transition:'all 0.4s ease 0.1s' }}>
          <div style={{ color:'white', fontWeight:900, fontSize:22 }}>
            {estrellas === 3 ? '¡Perfecto!' : estrellas === 2 ? '¡Bien hecho!' : '¡Nivel completado!'}
          </div>
          <div style={{ color:'#c4b5fd', fontSize:14, marginTop:4 }}>{nivel.titulo}</div>
        </div>

        {/* Estrellas */}
        <div style={{ display:'flex', justifyContent:'center', gap:12,
          opacity: step>=3?1:0, transition:'opacity 0.3s' }}>
          {[1,2,3].map(s => (
            <span key={s} style={{
              fontSize: 36,
              filter: s <= estrellasAnimadas ? 'none' : 'grayscale(1) opacity(0.3)',
              transform: s <= estrellasAnimadas ? 'scale(1.2)' : 'scale(1)',
              transition: `all 0.3s ease ${(s-1)*0.15}s`,
            }}>⭐</span>
          ))}
        </div>

        {/* Stats */}
        <div style={{ background:'#2e2a5e', borderRadius:10, padding:'12px 16px',
          opacity: step>=2?1:0, transition:'opacity 0.4s ease 0.3s' }}>
          {[
            { label:'Aciertos', valor:`${aciertos}/${totalPreguntas}`, color:'#22c55e' },
            { label:'Precisión', valor:`${precision}%`, color:'#a78bfa' },
            { label:'XP ganado', valor:`+${xpGanado}`, color:'#f59e0b' },
          ].map((r,i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom: i<2 ? '1px solid #3d3870' : 'none' }}>
              <span style={{ color:'#c4b5fd', fontSize:14 }}>{r.label}</span>
              <span style={{ color:r.color, fontWeight:800, fontSize:14 }}>{r.valor}</span>
            </div>
          ))}
        </div>

        {/* XP total */}
        <div style={{ background:'#3b2f6e', borderRadius:10, padding:'10px 16px', textAlign:'center',
          opacity: step>=4?1:0, transition:'opacity 0.3s ease 0.5s' }}>
          <span style={{ color:'#f59e0b', fontWeight:800, fontSize:13 }}>✨ XP Total: {xpTotal}</span>
        </div>

        {/* Logro */}
        {logroNuevo && mostrarLogro && (
          <div style={{
            background: `linear-gradient(135deg, ${logroNuevo.color}33, #2e2a5e)`,
            border: `2px solid ${logroNuevo.color}`,
            borderRadius:12, padding:'14px 16px',
            animation: 'slideIn 0.5s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            <div style={{ color:logroNuevo.color, fontWeight:800, fontSize:13, marginBottom:4 }}>
              🔓 Logro desbloqueado
            </div>
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <span style={{ fontSize:28 }}>{logroNuevo.emoji}</span>
              <div>
                <div style={{ color:'white', fontWeight:700, fontSize:14 }}>{logroNuevo.titulo}</div>
                <div style={{ color:'#c4b5fd', fontSize:12 }}>{logroNuevo.desc}</div>
              </div>
            </div>
          </div>
        )}

        {/* Botones */}
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:4,
          opacity: step>=4?1:0, transition:'opacity 0.3s ease 0.6s' }}>
          {onSiguiente && (
            <button style={{ padding:'14px', background:'#7c3aed', color:'white', border:'none', borderRadius:10, fontWeight:800, fontSize:16, cursor:'pointer' }}
              onClick={onSiguiente}
              onFocus={() => hablar('Botón siguiente nivel. Presiona Enter para continuar')}>
              ▶ Siguiente Nivel
            </button>
          )}
          <button style={{ padding:'12px', background:'#2e2a5e', color:'#c4b5fd', border:'2px solid #7c3aed', borderRadius:10, fontWeight:700, fontSize:14, cursor:'pointer' }}
            onClick={onReintentar}
            onFocus={() => hablar('Botón reintentar nivel')}>
            🔄 Reintentar
          </button>
          <button style={{ padding:'10px', background:'transparent', color:'#7c6fad', border:'none', borderRadius:10, fontWeight:600, fontSize:13, cursor:'pointer' }}
            onClick={onVolver}
            onFocus={() => hablar('Botón volver al menú')}>
            ← Menú
          </button>
        </div>

        <style>{`@keyframes slideIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      </div>
    )
  }

  // ─── MODO VIDENTE ────────────────────────────────────────────────────────────
  return (
    <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #2d1b69 50%, #1e1b4b 100%)', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24, position:'relative', overflow:'hidden' }}>

      {/* Partículas de fondo */}
      {estrellas === 3 && Array.from({length:20}).map((_,i) => (
        <div key={i} style={{
          position:'absolute',
          width: Math.random()*6+4,
          height: Math.random()*6+4,
          borderRadius:'50%',
          background: ['#f59e0b','#a78bfa','#22c55e','#60a5fa'][i%4],
          top: `${Math.random()*100}%`,
          left: `${Math.random()*100}%`,
          animation: `float ${2+Math.random()*3}s ease-in-out infinite alternate`,
          animationDelay: `${Math.random()*2}s`,
          opacity: 0.6,
        }}/>
      ))}

      <div style={{ maxWidth:500, width:'100%', textAlign:'center', position:'relative', zIndex:1 }}>

        {/* Trofeo */}
        <div style={{
          fontSize:100, marginBottom:16,
          filter: `drop-shadow(0 0 30px ${paleta.glow})`,
          opacity: step>=1?1:0,
          transform: step>=1?'scale(1) rotate(0deg)':'scale(0.3) rotate(-20deg)',
          transition:'all 0.6s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          {estrellas === 3 ? '🏆' : estrellas === 2 ? '🥈' : '🥉'}
        </div>

        {/* Título */}
        <div style={{
          opacity: step>=1?1:0,
          transform: step>=1?'translateY(0)':'translateY(30px)',
          transition:'all 0.5s ease 0.2s',
        }}>
          <h1 style={{ color:'white', fontSize:40, fontWeight:900, margin:0, letterSpacing:'-1px' }}>
            {estrellas === 3 ? '¡Perfecto!' : estrellas === 2 ? '¡Bien hecho!' : '¡Completado!'}
          </h1>
          <p style={{ color:'#c4b5fd', fontSize:18, marginTop:8 }}>{nivel.titulo} — Nivel {nivel.id}</p>
        </div>

        {/* Estrellas */}
        <div style={{
          display:'flex', justifyContent:'center', gap:16, margin:'24px 0',
          opacity: step>=3?1:0, transition:'opacity 0.3s',
        }}>
          {[1,2,3].map(s => (
            <div key={s} style={{
              fontSize:48,
              filter: s <= estrellasAnimadas ? 'none' : 'grayscale(1) opacity(0.2)',
              transform: s <= estrellasAnimadas ? 'scale(1.3) rotate(5deg)' : 'scale(1)',
              transition: `all 0.4s cubic-bezier(0.34,1.56,0.64,1) ${(s-1)*0.2}s`,
              textShadow: s <= estrellasAnimadas ? '0 0 20px #f59e0b' : 'none',
            }}>⭐</div>
          ))}
        </div>

        {/* Stats card */}
        <div style={{
          background:'rgba(255,255,255,0.08)',
          backdropFilter:'blur(10px)',
          borderRadius:20,
          padding:28,
          marginBottom:20,
          border:'1px solid rgba(255,255,255,0.12)',
          opacity: step>=2?1:0,
          transform: step>=2?'translateY(0)':'translateY(20px)',
          transition:'all 0.5s ease 0.3s',
        }}>
          <div style={{ display:'flex', justifyContent:'space-around' }}>
            {[
              { label:'Aciertos', valor:`${aciertos}/${totalPreguntas}`, color:'#22c55e', emoji:'✅' },
              { label:'Precisión', valor:`${precision}%`, color:'#a78bfa', emoji:'🎯' },
              { label:'XP ganado', valor:`+${xpGanado}`, color:'#f59e0b', emoji:'⚡' },
            ].map((r,i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <div style={{ fontSize:28, marginBottom:6 }}>{r.emoji}</div>
                <div style={{ color:r.color, fontWeight:900, fontSize:24 }}>{r.valor}</div>
                <div style={{ color:'#c4b5fd', fontSize:13, marginTop:4 }}>{r.label}</div>
              </div>
            ))}
          </div>

          {/* XP bar */}
          <div style={{ marginTop:20, textAlign:'left' }}>
            <div style={{ display:'flex', justifyContent:'space-between', color:'#c4b5fd', fontSize:12, marginBottom:6 }}>
              <span>XP Total</span><span style={{ color:'#f59e0b', fontWeight:700 }}>{xpTotal}</span>
            </div>
            <div style={{ height:8, background:'rgba(255,255,255,0.1)', borderRadius:99, overflow:'hidden' }}>
              <div style={{
                height:'100%',
                width: `${Math.min(100, (xpTotal % 500) / 500 * 100)}%`,
                background:'linear-gradient(90deg, #7c3aed, #f59e0b)',
                borderRadius:99,
                transition:'width 1s ease 0.8s',
              }}/>
            </div>
          </div>
        </div>

        {/* Logro */}
        {logroNuevo && mostrarLogro && (
          <div style={{
            background: `linear-gradient(135deg, ${logroNuevo.color}22, rgba(255,255,255,0.06))`,
            border: `2px solid ${logroNuevo.color}`,
            borderRadius:16, padding:'18px 24px', marginBottom:20, textAlign:'left',
            animation:'slideIn 0.6s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            <div style={{ color:logroNuevo.color, fontWeight:800, fontSize:12, letterSpacing:1, marginBottom:10 }}>
              🔓 LOGRO DESBLOQUEADO
            </div>
            <div style={{ display:'flex', gap:14, alignItems:'center' }}>
              <span style={{ fontSize:44, filter:`drop-shadow(0 0 12px ${logroNuevo.color})` }}>{logroNuevo.emoji}</span>
              <div>
                <div style={{ color:'white', fontWeight:800, fontSize:18 }}>{logroNuevo.titulo}</div>
                <div style={{ color:'#c4b5fd', fontSize:14, marginTop:4 }}>{logroNuevo.desc}</div>
              </div>
            </div>
          </div>
        )}

        {/* Botones */}
        <div style={{
          display:'flex', flexDirection:'column', gap:12,
          opacity: step>=4?1:0, transform: step>=4?'translateY(0)':'translateY(20px)',
          transition:'all 0.4s ease 0.6s',
        }}>
          {onSiguiente && (
            <button
              style={{ padding:'16px', background:'linear-gradient(135deg,#7c3aed,#2563eb)', color:'white', border:'none', borderRadius:14, fontWeight:800, fontSize:18, cursor:'pointer', boxShadow:'0 8px 32px #7c3aed55', transition:'transform 0.15s' }}
              onClick={onSiguiente}
              onMouseEnter={e => e.target.style.transform='scale(1.03)'}
              onMouseLeave={e => e.target.style.transform='scale(1)'}>
              ▶ Siguiente Nivel
            </button>
          )}
          <div style={{ display:'flex', gap:12 }}>
            <button
              style={{ flex:1, padding:'13px', background:'rgba(255,255,255,0.08)', color:'white', border:'1px solid rgba(255,255,255,0.2)', borderRadius:12, fontWeight:700, fontSize:15, cursor:'pointer' }}
              onClick={onReintentar}>
              🔄 Reintentar
            </button>
            <button
              style={{ flex:1, padding:'13px', background:'rgba(255,255,255,0.08)', color:'#c4b5fd', border:'1px solid rgba(255,255,255,0.15)', borderRadius:12, fontWeight:600, fontSize:15, cursor:'pointer' }}
              onClick={onVolver}>
              ← Menú
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
        @keyframes float{from{transform:translateY(0)}to{transform:translateY(-15px)}}
      `}</style>
    </div>
  )
}