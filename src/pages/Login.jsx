import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { hablar, setVozActiva } from '../utils/voz'
import { setModo } from '../utils/modo'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const emailRef = useRef(null)

  // Login y Register SIEMPRE con voz activada
  useEffect(() => {
    setVozActiva(true)
    emailRef.current?.focus()
    setTimeout(() => hablar('Pantalla de inicio de sesión. Correo electrónico'), 400)
  }, [])

  const handleLogin = async () => {
    setError('')
    if (!email || !password) {
      const msg = 'Por favor llena todos los campos'
      setError(msg)
      hablar(msg)
      return
    }
    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error)
        hablar(data.error)
        return
      }
      sessionStorage.setItem('nombre', data.nombre)
      // Aplicar el modo guardado del usuario
      setModo(data.modo)
      // Activar o desactivar voz según su modo
      setVozActiva(data.modo === 'invidente')
      if (data.modo === 'invidente') {
        hablar('Bienvenido ' + data.nombre + '. Modo invidente activado.')
      }
      navigate('/dashboard')
    } catch {
      const msg = 'No se pudo conectar al servidor'
      setError(msg)
      hablar(msg)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin()
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
          onFocus={() => hablar('Pantalla de inicio de sesión')}
          onMouseEnter={() => hablar('Pantalla de inicio de sesión')}>
          Iniciar Sesión
        </h1>

        <p style={s.subtitulo} tabIndex={0}
          onFocus={() => hablar('Accede a tu cuenta para continuar aprendiendo')}
          onMouseEnter={() => hablar('Accede a tu cuenta para continuar aprendiendo')}>
          Accede a tu cuenta para continuar aprendiendo
        </p>

        <label style={s.label}>Correo Electrónico</label>
        <input
          ref={emailRef}
          style={s.input}
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onFocus={() => hablar('Campo correo electrónico')}
          onMouseEnter={() => hablar('Campo correo electrónico')}
          onKeyDown={handleKeyDown}
          aria-label="Correo electrónico"
        />

        <label style={s.label}>Contraseña</label>
        <input
          style={s.input}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onFocus={() => hablar('Campo contraseña')}
          onMouseEnter={() => hablar('Campo contraseña')}
          onKeyDown={handleKeyDown}
          aria-label="Contraseña"
        />

        {error && (
          <p style={s.error} role="alert"
            onFocus={() => hablar('Error: ' + error)}>
            {error}
          </p>
        )}

        <button style={s.btnPrimario} onClick={handleLogin}
          onFocus={() => hablar('Botón iniciar sesión. Presiona Enter para confirmar')}
          onMouseEnter={() => hablar('Botón iniciar sesión')}>
          Iniciar Sesión
        </button>

        <button style={s.btnSecundario}
          onClick={() => navigate('/register')}
          onFocus={() => hablar('Botón crear cuenta nueva')}
          onMouseEnter={() => hablar('Ir a crear una cuenta nueva')}>
          ¿No tienes cuenta? Regístrate
        </button>

        <div style={s.demo} tabIndex={0}
          onFocus={() => hablar('Modo demo: usa cualquier correo y contraseña para entrar')}>
          <strong>Demo:</strong> Usa cualquier email y contraseña, o regístrate.
        </div>

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
  label: { color:'#c4b5fd', fontSize:15, fontWeight:700, marginBottom:2 },
  input: { padding:'12px 14px', borderRadius:8, border:'2px solid #7c3aed', background:'#1e1b4b', color:'white', fontSize:16, outline:'none', width:'100%' },
  btnPrimario: { padding:'14px', background:'#7c3aed', color:'white', border:'none', borderRadius:8, fontSize:16, fontWeight:800, cursor:'pointer', width:'100%' },
  btnSecundario: { padding:'12px', background:'transparent', color:'#c4b5fd', border:'2px solid #7c3aed', borderRadius:8, fontSize:15, fontWeight:700, cursor:'pointer', width:'100%' },
  error: { color:'#fca5a5', fontSize:14, background:'#7f1d1d', padding:'8px 12px', borderRadius:6, margin:0 },
  demo: { background:'#1e1b4b', border:'1px solid #7c3aed', borderRadius:8, padding:10, fontSize:13, color:'#a78bfa', cursor:'default' },
}