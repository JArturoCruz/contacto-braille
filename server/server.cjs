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

// Función para leer usuarios del archivo
function leerUsuarios() {
  const contenido = fs.readFileSync(BD_PATH, 'utf-8')
  if (!contenido.trim()) return []
  return contenido.trim().split('\n').map(linea => {
    const [nombre, email, password, modo] = linea.split('|')
    return { nombre, email, password, modo }
  })
}

// Función para guardar un usuario
function guardarUsuario(usuario) {
  const linea = `${usuario.nombre}|${usuario.email}|${usuario.password}|${usuario.modo}\n`
  fs.appendFileSync(BD_PATH, linea)
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

  guardarUsuario({ nombre, email, password, modo })
  res.json({ mensaje: 'Usuario registrado correctamente', nombre })
})

// RUTA: Iniciar sesión
app.post('/api/login', (req, res) => {
  const { email, password } = req.body

  const usuarios = leerUsuarios()
  const usuario = usuarios.find(u => u.email === email && u.password === password)

  if (!usuario) {
    return res.status(401).json({ error: 'Email o contraseña incorrectos' })
  }

  res.json({ mensaje: 'Login exitoso', nombre: usuario.nombre, modo: usuario.modo })
})

app.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3001')
})