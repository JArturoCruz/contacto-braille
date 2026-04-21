let vozSeleccionada = null
let vozActiva = true

function inicializarVoz() {
  return new Promise((resolve) => {
    const intentar = () => {
      const voces = window.speechSynthesis.getVoices()
      if (voces.length === 0) return

      const prioridad = [
        'Microsoft Dalia',
        'Microsoft Sabina',
        'Microsoft Paulina',
        'Microsoft Laura',
        'Google español',
        'Mónica',
        'Sofia',
      ]

      let voz = null
      for (const nombre of prioridad) {
        voz = voces.find(v => v.name.includes(nombre) && v.lang.startsWith('es'))
        if (voz) break
      }
      if (!voz) voz = voces.find(v => v.lang.startsWith('es') && v.name.toLowerCase().includes('female'))
      if (!voz) voz = voces.find(v => v.lang.startsWith('es'))

      vozSeleccionada = voz || voces[0]
      console.log('🎙️ Voz seleccionada:', vozSeleccionada?.name, '| Idioma:', vozSeleccionada?.lang)
      resolve(vozSeleccionada)
    }

    if (window.speechSynthesis.getVoices().length > 0) {
      intentar()
    } else {
      window.speechSynthesis.onvoiceschanged = intentar
    }
  })
}

export async function hablar(texto) {
  if (!vozActiva) return
  window.speechSynthesis.cancel()
  if (!vozSeleccionada) await inicializarVoz()

  const utterance = new SpeechSynthesisUtterance(texto)
  utterance.voice = vozSeleccionada
  utterance.lang = 'es-MX'
  utterance.rate = 0.95
  utterance.pitch = 1.1
  utterance.volume = 1
  window.speechSynthesis.speak(utterance)
}

export function detenerVoz() {
  window.speechSynthesis.cancel()
}

export function setVozActiva(activa) {
  vozActiva = activa
  if (!activa) window.speechSynthesis.cancel()
}

export function getVozActiva() {
  return vozActiva
}

export function listarVoces() {
  const voces = window.speechSynthesis.getVoices()
  console.log('📋 Todas las voces disponibles:')
  voces.forEach((v, i) => {
    console.log(`  ${i}. ${v.name} | ${v.lang} | Local: ${v.localService}`)
  })
}

inicializarVoz()