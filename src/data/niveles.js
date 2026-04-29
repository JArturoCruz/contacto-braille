// ──────────────────────────────────────────────────────────────────────────────
//  ABECEDARIO BRAILLE COMPLETO  (matriz 3×2, 6 puntos)
// ──────────────────────────────────────────────────────────────────────────────
export const BRAILLE = {
  A:[1,0,0,0,0,0], B:[1,1,0,0,0,0], C:[1,0,0,1,0,0],
  D:[1,0,0,1,1,0], E:[1,0,0,0,1,0], F:[1,1,0,1,0,0],
  G:[1,1,0,1,1,0], H:[1,1,0,0,1,0], I:[0,1,0,1,0,0],
  J:[0,1,0,1,1,0], K:[1,0,1,0,0,0], L:[1,1,1,0,0,0],
  M:[1,0,1,1,0,0], N:[1,0,1,1,1,0], O:[1,0,1,0,1,0],
  P:[1,1,1,1,0,0], Q:[1,1,1,1,1,0], R:[1,1,1,0,1,0],
  S:[0,1,1,1,0,0], T:[0,1,1,1,1,0], U:[1,0,1,0,0,1],
  V:[1,1,1,0,0,1], W:[0,1,0,1,1,1], X:[1,0,1,1,0,1],
  Y:[1,0,1,1,1,1], Z:[1,0,1,0,1,1],
}

export const LAYOUT = [
  { indice:0, col:0, fila:0, numero:1, tecla:'D' },
  { indice:1, col:0, fila:1, numero:2, tecla:'F' },
  { indice:2, col:0, fila:2, numero:3, tecla:'G' },
  { indice:3, col:1, fila:0, numero:4, tecla:'H' },
  { indice:4, col:1, fila:1, numero:5, tecla:'J' },
  { indice:5, col:1, fila:2, numero:6, tecla:'K' },
]

export const TECLA_A_PUNTO = { d:0, f:1, g:2, h:3, j:4, k:5 }

// ──────────────────────────────────────────────────────────────────────────────
//  DEFINICIÓN DE NIVELES
// ──────────────────────────────────────────────────────────────────────────────
export const NIVELES = [
  {
    id: 1,
    titulo: 'Primeros Pasos',
    descripcion: 'Aprende las letras: A, B, C, D y E. La pista siempre está visible.',
    tipo: 'escribir',
    letras: ['A','B','C','D','E'],
    repeticiones: 1,
    enOrden: true,
    pistaAutomatica: true,
    tiempoBonus: false,
    xpPorAcierto: 10,
    estrellasPerfecto: 3,
    estrellasMinimas: 1,
    precisionPerfecto: 100,   
    precisionBuena: 70,
  },
  {
    id: 2,
    titulo: 'Las Vocales',
    descripcion: 'Escribe A, E, I, O y U en braille. Sin pista automática.',
    tipo: 'escribir',
    letras: ['A','E','I','O','U'],
    repeticiones: 2,
    pistaAutomatica: false,
    tiempoBonus: false,
    xpPorAcierto: 15,
    estrellasPerfecto: 3,
    estrellasMinimas: 1,
    precisionPerfecto: 100,
    precisionBuena: 70,
  },
  {
    id: 3,
    titulo: 'Primera Decena',
    descripcion: 'Domina las letras A hasta la J. ¡Puedes pedir pista si la necesitas!',
    tipo: 'escribir',
    letras: ['A','B','C','D','E','F','G','H','I','J'],
    repeticiones: 1,
    pistaAutomatica: false,
    tiempoBonus: false,
    xpPorAcierto: 15,
    estrellasPerfecto: 3,
    estrellasMinimas: 1,
    precisionPerfecto: 95,
    precisionBuena: 65,
  },
  {
    id: 4,
    titulo: 'Leer Braille',
    descripcion: 'Ahora al revés: mira la matriz y elige qué letra es. Letras A-J.',
    tipo: 'leer',
    letras: ['A','B','C','D','E','F','G','H','I','J'],
    repeticiones: 1,
    pistaAutomatica: false,
    tiempoBonus: false,
    xpPorAcierto: 20,
    estrellasPerfecto: 3,
    estrellasMinimas: 1,
    precisionPerfecto: 90,
    precisionBuena: 60,
    opcionesPorPregunta: 4,   
  },
  {
    id: 5,
    titulo: 'Segunda Decena',
    descripcion: 'Ahora aprende las letras de la K a la T.',
    tipo: 'escribir',
    letras: ['K','L','M','N','O','P','Q','R','S','T'],
    repeticiones: 1,
    pistaAutomatica: false,
    tiempoBonus: false,
    xpPorAcierto: 20,
    estrellasPerfecto: 3,
    estrellasMinimas: 1,
    precisionPerfecto: 95,
    precisionBuena: 65,
  },
  {
    id: 6,
    titulo: 'El Abecedario Completo',
    descripcion: 'Las últimas 6 letras: U, V, W, X, Y, Z.',
    tipo: 'escribir',
    letras: ['U','V','W','X','Y','Z'],
    repeticiones: 2,
    pistaAutomatica: false,
    tiempoBonus: false,
    xpPorAcierto: 25,
    estrellasPerfecto: 3,
    estrellasMinimas: 1,
    precisionPerfecto: 90,
    precisionBuena: 60,
  },
  {
    id: 7,
    titulo: 'Lectura Total',
    descripcion: 'Lee matrices de cualquier letra del alfabeto. ¡Máxima concentración!',
    tipo: 'leer',
    letras: Object.keys(BRAILLE),
    repeticiones: 1,
    pistaAutomatica: false,
    tiempoBonus: false,
    xpPorAcierto: 25,
    estrellasPerfecto: 3,
    estrellasMinimas: 1,
    precisionPerfecto: 85,
    precisionBuena: 55,
    opcionesPorPregunta: 5,
  },
  {
    id: 8,
    titulo: 'Memoria Táctil',
    descripcion: 'Se muestran algunos puntos ya marcados. Completa el resto. ¡Sin pistas!',
    tipo: 'completar',
    letras: Object.keys(BRAILLE),
    repeticiones: 1,
    pistaAutomatica: false,
    tiempoBonus: false,
    xpPorAcierto: 30,
    estrellasPerfecto: 3,
    estrellasMinimas: 1,
    precisionPerfecto: 80,
    precisionBuena: 50,
    puntosPreMarcados: 2,    
  },
  {
    id: 9,
    titulo: 'Velocidad Braille',
    descripcion: 'Escribe todo el alfabeto lo más rápido posible. ¡Bonus por velocidad!',
    tipo: 'escribir',
    letras: Object.keys(BRAILLE),
    repeticiones: 1,
    pistaAutomatica: false,
    tiempoBonus: true,
    tiempoLimite: 120,        
    xpPorAcierto: 35,
    estrellasPerfecto: 3,
    estrellasMinimas: 1,
    precisionPerfecto: 85,
    precisionBuena: 55,
  },
  {
    id: 10,
    titulo: 'Maestro del Braille',
    descripcion: '¡Ronda final! Lectura y escritura mezcladas con todo el abecedario.',
    tipo: 'mixto',
    letras: Object.keys(BRAILLE),
    repeticiones: 1,
    pistaAutomatica: false,
    tiempoBonus: true,
    tiempoLimite: 150,
    xpPorAcierto: 40,
    estrellasPerfecto: 3,
    estrellasMinimas: 1,
    precisionPerfecto: 85,
    precisionBuena: 55,
    opcionesPorPregunta: 5,
  },
]

// ──────────────────────────────────────────────────────────────────────────────
//  LOGROS
// ──────────────────────────────────────────────────────────────────────────────
export const LOGROS = [
  { id: 'primer_nivel', titulo: 'Primer Contacto', desc: 'Completaste el Nivel 1. ¡Bienvenido al mundo del Braille!', emoji: '🌟', color: '#f59e0b', condicion: (stats) => stats.nivelesCompletados.includes(1) },
  { id: 'perfecto_nivel1', titulo: 'Sin Errores', desc: 'Completaste el Nivel 1 con 100% de precisión.', emoji: '💎', color: '#06b6d4', condicion: (stats) => stats.precisionNivel?.[1] === 100 },
  { id: 'cinco_niveles', titulo: 'A Mitad de Camino', desc: 'Completaste 5 niveles.', emoji: '🚀', color: '#8b5cf6', condicion: (stats) => stats.nivelesCompletados.length >= 5 },
  { id: 'maestro', titulo: 'Maestro Braille', desc: 'Completaste todos los 10 niveles.', emoji: '🏆', color: '#d97706', condicion: (stats) => stats.nivelesCompletados.length >= 10 },
  { id: 'velocista', titulo: 'Velocista', desc: 'Completaste el Nivel 9 (velocidad) con 3 estrellas.', emoji: '⚡', color: '#f97316', condicion: (stats) => stats.estrellasNivel?.[9] === 3 },
]

// ──────────────────────────────────────────────────────────────────────────────
//  HELPERS
// ──────────────────────────────────────────────────────────────────────────────

export function generarSecuencia(nivel) {
  let preguntas = []
  const letras = [...nivel.letras]

  if (nivel.tipo === 'mixto') {
    letras.forEach(l => { preguntas.push({ letra: l, tipo: Math.random() > 0.5 ? 'escribir' : 'leer' }) })
  } else {
    for (let r = 0; r < (nivel.repeticiones || 1); r++) {
      letras.forEach(l => preguntas.push({ letra: l, tipo: nivel.tipo }))
    }
  }

  if (!nivel.enOrden) {
    for (let i = preguntas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[preguntas[i], preguntas[j]] = [preguntas[j], preguntas[i]]
    }
  }
  return preguntas
}

export function generarOpciones(letraCorrecta, cantidad = 4) {
  const todas = Object.keys(BRAILLE).filter(l => l !== letraCorrecta)
  for (let i = todas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[todas[i], todas[j]] = [todas[j], todas[i]]
  }
  const opciones = [letraCorrecta, ...todas.slice(0, cantidad - 1)]
  for (let i = opciones.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[opciones[i], opciones[j]] = [opciones[j], opciones[i]]
  }
  return opciones
}

export function calcularEstrellas(precision, nivel) {
  if (precision >= nivel.precisionPerfecto) return 3
  if (precision >= nivel.precisionBuena) return 2
  return 1
}

function estadoInicial() {
  return { xp: 0, nivel: 1, nivelesCompletados: [], estrellasNivel: {}, precisionNivel: {}, logros: [] }
}

/** Lee progreso del localStorage (lo que usa el juego) */
export function leerProgreso() {
  try {
    const raw = localStorage.getItem('braille_progreso')
    if (!raw) return estadoInicial()
    return JSON.parse(raw)
  } catch { return estadoInicial() }
}

/** * CORRECCIÓN VITAL:
 * Guarda el progreso en el LocalStorage y lo manda a la BD del servidor 
 */
export function guardarProgreso(prog) {
  // 1. Guardar para que la pantalla se actualice al instante
  localStorage.setItem('braille_progreso', JSON.stringify(prog))

  // 2. Avisarle a la BD para no perderlo si el usuario cierra sesión
  const email = sessionStorage.getItem('email')
  if (email) {
    fetch('http://localhost:3001/api/update-progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, nuevoProgreso: prog })
    }).catch(err => console.error('Error sincronizando con bd.txt:', err))
  }
}