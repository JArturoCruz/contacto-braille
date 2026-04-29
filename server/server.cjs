const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
app.use(cors())
app.use(express.json())

const BD_PATH = path.join(__dirname, 'bd.txt')

// Si no existe el archivo, lo crea vacío
if (!fs.existsSync(BD_PATH)) {
  fs.writeFileSync(BD_PATH, '')
}

// Función para leer usuarios del archivo de forma estricta
function leerUsuarios() {
  const contenido = fs.readFileSync(BD_PATH, 'utf-8')
  if (!contenido.trim()) return []
  
  return contenido.trim().split('\n').filter(linea => linea.trim() !== '').map(linea => {
    const partes = linea.split('|')
    const nombre = partes[0] || ''
    const email = partes[1] || ''
    const password = partes[2] || ''
    const modo = partes[3] || 'vidente'
    
    // Progreso por defecto (Nivel 1, todo en 0)
    let progreso = { nivelActual: 1, leccionesCompletadas: [] }
    
    // Si la parte 4 existe, intentamos recuperar el progreso real
    if (partes[4] && partes[4].trim() !== '') {
      try {
        progreso = JSON.parse(partes[4])
      } catch (e) {
        console.error("Error parseando progreso del email:", email)
      }
    }
    
    return { nombre, email, password, modo, progreso }
  })
}

// Función para guardar un usuario nuevo (Siempre empieza desde 1)
function guardarUsuario(usuario) {
  // Asegurarnos de que el progreso inicial es estricto
  const progresoInicial = { nivelActual: 1, leccionesCompletadas: [] }
  const progresoStr = JSON.stringify(progresoInicial)
  
  const linea = `${usuario.nombre}|${usuario.email}|${usuario.password}|${usuario.modo}|${progresoStr}\n`
  fs.appendFileSync(BD_PATH, linea)
}

// Función para reescribir todo el archivo (al actualizar progreso de un usuario)
function actualizarUsuarios(usuarios) {
  const lineas = usuarios.map(u => {
    const progresoStr = JSON.stringify(u.progreso || { nivelActual: 1, leccionesCompletadas: [] })
    return `${u.nombre}|${u.email}|${u.password}|${u.modo}|${progresoStr}`
  })
  fs.writeFileSync(BD_PATH, lineas.join('\n') + '\n', 'utf-8')
}

// RUTA: Registrar usuario
app.post('/api/register', (req, res) => {
  const { nombre, email, password, modo } = req.body

  if (!nombre || !email || !password || !modo) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' })
  }

  const usuarios = leerUsuarios()
  const existe = usuarios.find(u => u.email === email)

  if (existe) {
    return res.status(400).json({ error: 'El email ya está registrado' })
  }

  // Se crea con progreso limpio
  const progresoInicial = { nivelActual: 1, leccionesCompletadas: [] }
  guardarUsuario({ nombre, email, password, modo, progreso: progresoInicial })
  
  res.json({ mensaje: 'Usuario registrado correctamente', nombre, progreso: progresoInicial })
})

// RUTA: Iniciar sesión
app.post('/api/login', (req, res) => {
  const { email, password } = req.body

  const usuarios = leerUsuarios()
  const usuario = usuarios.find(u => u.email === email && u.password === password)

  if (!usuario) {
    return res.status(401).json({ error: 'Email o contraseña incorrectos' })
  }

  res.json({ 
    mensaje: 'Login exitoso', 
    nombre: usuario.nombre, 
    modo: usuario.modo,
    progreso: usuario.progreso 
  })
})

// RUTA: Actualizar el progreso del usuario
app.post('/api/update-progress', (req, res) => {
  const { email, nuevoProgreso } = req.body

  if (!email || !nuevoProgreso) {
    return res.status(400).json({ error: 'Faltan datos para actualizar el progreso' })
  }

  const usuarios = leerUsuarios()
  const index = usuarios.findIndex(u => u.email === email)

  if (index !== -1) {
    // Fusiona el progreso antiguo del usuario ESPECÍFICO con su nuevo progreso
    usuarios[index].progreso = { ...usuarios[index].progreso, ...nuevoProgreso }
    actualizarUsuarios(usuarios)
    res.json({ success: true, progreso: usuarios[index].progreso })
  } else {
    res.status(404).json({ error: 'Usuario no encontrado' })
  }
})

app.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3001')
})