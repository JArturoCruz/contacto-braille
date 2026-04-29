import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { hablar, setVozActiva } from '../utils/voz'
import { setModo } from '../utils/modo'

export default function Register() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [modo, setModoLocal] = useState('vidente')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    setVozActiva(true)
    setTimeout(() => hablar('Pantalla de crear cuenta. Campo nombre completo'), 400)
  }, [])

  const handleRegister = async () => {
    setError('')
    if (!nombre || !email || !password || !confirmar) {
      const msg = 'Por favor llena todos los campos'
      setError(msg); hablar(msg); return
    }
    if (password !== confirmar) {
      const msg = 'Las contraseñas no coinciden'
      setError(msg); hablar(msg); return
    }
    try {
      const res = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password, modo })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); hablar(data.error); return }
      
      sessionStorage.clear()
      localStorage.clear()
      
      sessionStorage.setItem('nombre', data.nombre)
      sessionStorage.setItem('email', email)
      
      // CORRECCIÓN: Guardar inicialización en 'braille_progreso'
      localStorage.setItem('braille_progreso', JSON.stringify(data.progreso))
      
      setModo(modo)
      setVozActiva(modo === 'invidente')
      hablar('Cuenta creada exitosamente. Bienvenido ' + data.nombre)
      navigate('/welcome')
    } catch {
      const msg = 'No se pudo conectar al servidor'
      setError(msg); hablar(msg)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo} tabIndex={0}
          onFocus={() => hablar('ConTacto, aplicación para aprender braille')}
          onMouseEnter={() => hablar('ConTacto, aplicación para aprender braille')}>
          ⠿
        </div>

        <h1 style={s.titulo} tabIndex={0}
          onFocus={() => hablar('Pantalla de crear cuenta nueva')}
          onMouseEnter={() => hablar('Pantalla de crear cuenta nueva')}>
          Crear Cuenta
        </h1>

        <p style={s.subtitulo} tabIndex={0}
          onFocus={() => hablar('Únete y comienza a aprender braille')}
          onMouseEnter={() => hablar('Únete y comienza a aprender braille')}>
          Únete y comienza a aprender braille
        </p>

        <label style={s.label}>Nombre Completo</label>
        <input style={s.input} placeholder="Tu nombre completo" autoFocus
          value={nombre} onChange={e => setNombre(e.target.value)}
          onFocus={() => hablar('Campo nombre completo')}
          onMouseEnter={() => hablar('Campo nombre completo')} aria-label="Nombre completo" />

        <label style={s.label}>Correo Electrónico</label>
        <input style={s.input} type="email" placeholder="tu@email.com"
          value={email} onChange={e => setEmail(e.target.value)}
          onFocus={() => hablar('Campo correo electrónico')}
          onMouseEnter={() => hablar('Campo correo electrónico')} aria-label="Correo electrónico" />

        <label style={s.label}>Contraseña</label>
        <input style={s.input} type="password" placeholder="••••••"
          value={password} onChange={e => setPassword(e.target.value)}
          onFocus={() => hablar('Campo contraseña')}
          onMouseEnter={() => hablar('Campo contraseña')} aria-label="Contraseña" />

        <label style={s.label}>Confirmar Contraseña</label>
        <input style={s.input} type="password" placeholder="••••••"
          value={confirmar} onChange={e => setConfirmar(e.target.value)}
          onFocus={() => hablar('Campo confirmar contraseña')}
          onMouseEnter={() => hablar('Campo confirmar contraseña')} aria-label="Confirmar contraseña" />

        <label style={s.label}>Modo de Aprendizaje</label>
        <p style={s.modoDesc} tabIndex={0} onFocus={() => hablar('Selecciona tu modo de aprendizaje')}>
          Selecciona cómo quieres usar la aplicación
        </p>

        {[
          { id:'vidente', titulo:'Modo Vidente', desc:'Interfaz visual. Sin voz guiada.' },
          { id:'invidente', titulo:'Modo Invidente', desc:'Voz guiada y navegación por teclado.' },
        ].map(m => (
          <button key={m.id} style={{ ...s.modoBtn, background: modo === m.id ? '#7c3aed' : 'transparent', color: modo === m.id ? 'white' : '#c4b5fd', borderColor: modo === m.id ? '#7c3aed' : '#4c1d95' }}
            onClick={() => { setModoLocal(m.id); hablar(m.titulo + ' seleccionado. ' + m.desc) }}
            onFocus={() => hablar(m.titulo + (modo === m.id ? ', seleccionado. ' : '. ') + m.desc)}
            onMouseEnter={() => hablar(m.titulo + '. ' + m.desc)} aria-pressed={modo === m.id}>
            <span style={{fontWeight:800}}>{modo === m.id ? '● ' : '○ '}{m.titulo}</span>
            <span style={{fontSize:12, opacity:0.8, marginTop:2, display:'block'}}>{m.desc}</span>
          </button>
        ))}

        {error && (
          <p style={s.error} role="alert" onFocus={() => hablar('Error: ' + error)}>{error}</p>
        )}

        <button style={s.btnPrimario} onClick={handleRegister}
          onFocus={() => hablar('Botón crear cuenta. Presiona Enter para confirmar')}
          onMouseEnter={() => hablar('Botón crear cuenta')}>
          Crear Cuenta
        </button>

        <button style={s.btnSecundario} onClick={() => navigate('/')}
          onFocus={() => hablar('Botón volver a inicio de sesión')}
          onMouseEnter={() => hablar('Volver a inicio de sesión')}>
          ¿Ya tienes cuenta? Inicia sesión
        </button>
      </div>
    </div>
  )
}

const s = {
  page: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', background:'#1e1b4b', padding:16 },
  card: { background:'#2e2a5e', borderRadius:14, padding:28, width:'100%', maxWidth:380, display:'flex', flexDirection:'column', gap:10 },
  logo: { fontSize:52, textAlign:'center', cursor:'default' },
  titulo: { color:'white', fontSize:24, fontWeight:800, textAlign:'center', margin:0 },
  subtitulo: { color:'#c4b5fd', fontSize:14, textAlign:'center', margin:0 },
  label: { color:'#c4b5fd', fontSize:15, fontWeight:700, marginBottom:2, marginTop:4 },
  modoDesc: { color:'#a78bfa', fontSize:13, margin:0 },
  input: { padding:'12px 14px', borderRadius:8, border:'2px solid #7c3aed', background:'#1e1b4b', color:'white', fontSize:16, outline:'none', width:'100%' },
  modoBtn: { padding:'10px 14px', border:'2px solid', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer', width:'100%', textAlign:'left', transition:'all 0.15s' },
  btnPrimario: { marginTop:4, padding:'14px', background:'#7c3aed', color:'white', border:'none', borderRadius:8, fontSize:16, fontWeight:800, cursor:'pointer', width:'100%' },
  btnSecundario: { padding:'12px', background:'transparent', color:'#c4b5fd', border:'2px solid #7c3aed', borderRadius:8, fontSize:15, fontWeight:700, cursor:'pointer', width:'100%' },
  error: { color:'#fca5a5', fontSize:14, background:'#7f1d1d', padding:'8px 12px', borderRadius:6, margin:0 },
}