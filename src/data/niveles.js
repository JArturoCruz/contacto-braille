// ──────────────────────────────────────────────────────────────────────────────
//  ABECEDARIO BRAILLE COMPLETO  (matriz 3×2, 6 puntos)
//  Índices: [p1, p2, p3, p4, p5, p6]
//            col1-fila1, col1-fila2, col1-fila3, col2-fila1, col2-fila2, col2-fila3
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
//  tipo: 'escribir'  → usuario escribe la letra mostrada
//        'leer'      → usuario ve la matriz y elige la letra correcta
//        'completar' → se muestra la letra y parte de la matriz (pista parcial)
// ──────────────────────────────────────────────────────────────────────────────
export const NIVELES = [
  // ─ NIVEL 1 ─ Muy fácil: solo A, B, C con pista siempre visible
  {
    id: 1,
    titulo: 'Primeros Pasos',
    descripcion: 'Aprende las primeras 3 letras: A, B y C. La pista siempre está visible.',
    tipo: 'escribir',
    letras: ['A','B','C'],
    repeticiones: 2,          // cada letra aparece N veces
    pistaAutomatica: true,    // la pista (puntos morados) aparece sin pedirla
    tiempoBonus: false,
    xpPorAcierto: 10,
    estrellasPerfecto: 3,
    estrellasMinimas: 1,
    precisionPerfecto: 100,
    precisionBuena: 70,
  },
  // ─ NIVEL 2 ─ Fácil: A-E sin pista automática
  {
    id: 2,
    titulo: 'Las Vocales',
    descripcion: 'Escribe A, B, C, D y E en braille. Sin pista automática.',
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
  // ─ NIVEL 3 ─ Fácil-medio: A-J, sin pista automática
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
  // ─ NIVEL 4 ─ Medio: Leer braille (ver matriz → elegir letra)
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
    opcionesPorPregunta: 4,   // cuántas opciones múltiples mostrar
  },
  // ─ NIVEL 5 ─ Medio: K-T escribir
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
  // ─ NIVEL 6 ─ Medio-difícil: U-Z + repaso mixto
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
  // ─ NIVEL 7 ─ Difícil: Leer todo el alfabeto
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
  // ─ NIVEL 8 ─ Muy difícil: Completar la matriz (pistas parciales)
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
    puntosPreMarcados: 2,    // cuántos puntos correctos se muestran de inicio
  },
  // ─ NIVEL 9 ─ Experto: Todo el alfabeto, contrareloj
  {
    id: 9,
    titulo: 'Velocidad Braille',
    descripcion: 'Escribe todo el alfabeto lo más rápido posible. ¡Bonus por velocidad!',
    tipo: 'escribir',
    letras: Object.keys(BRAILLE),
    repeticiones: 1,
    pistaAutomatica: false,
    tiempoBonus: true,
    tiempoLimite: 120,        // segundos
    xpPorAcierto: 35,
    estrellasPerfecto: 3,
    estrellasMinimas: 1,
    precisionPerfecto: 85,
    precisionBuena: 55,
  },
  // ─ NIVEL 10 ─ Maestro: Ronda mixta aleatoria
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
  {
    id: 'primer_nivel',
    titulo: 'Primer Contacto',
    desc: 'Completaste el Nivel 1. ¡Bienvenido al mundo del Braille!',
    emoji: '🌟',
    color: '#f59e0b',
    condicion: (stats) => stats.nivelesCompletados.includes(1),
  },
  {
    id: 'perfecto_nivel1',
    titulo: 'Sin Errores',
    desc: 'Completaste el Nivel 1 con 100% de precisión.',
    emoji: '💎',
    color: '#06b6d4',
    condicion: (stats) => stats.precisionNivel?.[1] === 100,
  },
  {
    id: 'cinco_niveles',
    titulo: 'A Mitad de Camino',
    desc: 'Completaste 5 niveles.',
    emoji: '🚀',
    color: '#8b5cf6',
    condicion: (stats) => stats.nivelesCompletados.length >= 5,
  },
  {
    id: 'maestro',
    titulo: 'Maestro Braille',
    desc: 'Completaste todos los 10 niveles.',
    emoji: '🏆',
    color: '#d97706',
    condicion: (stats) => stats.nivelesCompletados.length >= 10,
  },
  {
    id: 'velocista',
    titulo: 'Velocista',
    desc: 'Completaste el Nivel 9 (velocidad) con 3 estrellas.',
    emoji: '⚡',
    color: '#f97316',
    condicion: (stats) => stats.estrellasNivel?.[9] === 3,
  },
]

// ──────────────────────────────────────────────────────────────────────────────
//  HELPERS
// ──────────────────────────────────────────────────────────────────────────────

/** Genera la secuencia de preguntas para un nivel */
export function generarSecuencia(nivel) {
  let preguntas = []
  const letras = [...nivel.letras]

  if (nivel.tipo === 'mixto') {
    // mezcla leer y escribir
    letras.forEach(l => {
      preguntas.push({ letra: l, tipo: Math.random() > 0.5 ? 'escribir' : 'leer' })
    })
  } else {
    for (let r = 0; r < (nivel.repeticiones || 1); r++) {
      letras.forEach(l => preguntas.push({ letra: l, tipo: nivel.tipo }))
    }
  }

  // Mezclar (Fisher-Yates)
  for (let i = preguntas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[preguntas[i], preguntas[j]] = [preguntas[j], preguntas[i]]
  }
  return preguntas
}

/** Genera opciones múltiples para el tipo 'leer' */
export function generarOpciones(letraCorrecta, cantidad = 4) {
  const todas = Object.keys(BRAILLE).filter(l => l !== letraCorrecta)
  // mezclar
  for (let i = todas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[todas[i], todas[j]] = [todas[j], todas[i]]
  }
  const opciones = [letraCorrecta, ...todas.slice(0, cantidad - 1)]
  // mezclar resultado
  for (let i = opciones.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[opciones[i], opciones[j]] = [opciones[j], opciones[i]]
  }
  return opciones
}

/** Calcula estrellas según precisión */
export function calcularEstrellas(precision, nivel) {
  if (precision >= nivel.precisionPerfecto) return 3
  if (precision >= nivel.precisionBuena) return 2
  return 1
}

/** Lee progreso del localStorage */
export function leerProgreso() {
  try {
    const raw = localStorage.getItem('braille_progreso')
    if (!raw) return estadoInicial()
    return JSON.parse(raw)
  } catch { return estadoInicial() }
}

/** Guarda progreso */
export function guardarProgreso(prog) {
  localStorage.setItem('braille_progreso', JSON.stringify(prog))
}

function estadoInicial() {
  return {
    xp: 0,
    nivel: 1,
    nivelesCompletados: [],
    estrellasNivel: {},
    precisionNivel: {},
    logros: [],
  }
}