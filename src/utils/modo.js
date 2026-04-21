export function getModo() {
  return sessionStorage.getItem('modo') || 'vidente'
}

export function setModo(modo) {
  sessionStorage.setItem('modo', modo)
}

export function esInvidente() {
  return getModo() === 'invidente'
}