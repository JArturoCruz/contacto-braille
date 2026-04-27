import { LAYOUT } from '../data/niveles'
import { hablar } from '../utils/voz'

/**
 * MatrizBraille — componente reutilizable
 * Props:
 *   matriz        [0|1, ×6]   estado actual de los 6 puntos
 *   correcta      [0|1, ×6]   solución (para colorear feedback)
 *   estado        'jugando'|'correcto'|'incorrecto'
 *   onToggle      (indice) => void   — null para modo sólo lectura
 *   teclaPulsada  string|null
 *   mostrarPista  bool
 *   invidente     bool
 *   tamaño        'sm'|'md'|'lg'
 */
export default function MatrizBraille({
  matriz,
  correcta,
  estado,
  onToggle,
  teclaPulsada,
  mostrarPista,
  invidente,
  tamano = 'md',
}) {
  const sizes = {
    sm: { punto: 40, gap: 6, fontSize: 11, subFont: 8 },
    md: { punto: invidente ? 52 : 56, gap: invidente ? 8 : 10, fontSize: 13, subFont: 9 },
    lg: { punto: 64, gap: 12, fontSize: 15, subFont: 10 },
  }
  const sz = sizes[tamano]

  const colorPunto = (i) => {
    if (estado === 'correcto')   return matriz[i] ? '#22c55e' : '#e5e7eb'
    if (estado === 'incorrecto') return matriz[i] ? '#ef4444' : '#e5e7eb'
    if (mostrarPista && correcta?.[i]) return '#a78bfa'
    if (invidente) return matriz[i] ? '#7c3aed' : '#3b3570'
    return matriz[i] ? '#2563eb' : '#e5e7eb'
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-start' }}>
      {/* Etiquetas columnas */}
      <div style={{ display:'flex', gap: sz.gap, marginBottom:4, marginLeft: invidente ? 22 : 24 }}>
        {['C1','C2'].map(c => (
          <div key={c} style={{
            width: sz.punto,
            textAlign:'center',
            fontSize: invidente ? 10 : 11,
            color: invidente ? '#7c6fad' : '#aaa',
            fontWeight:700,
          }}>{c}</div>
        ))}
      </div>

      <div style={{ display:'flex', alignItems:'stretch', gap: sz.gap }}>
        {/* Etiquetas filas */}
        <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-around' }}>
          {['F1','F2','F3'].map(f => (
            <span key={f} style={{
              width: invidente ? 18 : 20,
              textAlign:'center',
              fontSize: invidente ? 10 : 11,
              color: invidente ? '#7c6fad' : '#aaa',
              fontWeight:700,
              height: sz.punto,
              display:'flex',
              alignItems:'center',
            }}>{f}</span>
          ))}
        </div>

        {/* Grid de puntos */}
        <div style={{
          display:'grid',
          gridTemplateColumns: `${sz.punto}px ${sz.punto}px`,
          gridTemplateRows: `${sz.punto}px ${sz.punto}px ${sz.punto}px`,
          gap: sz.gap,
        }}>
          {LAYOUT.map(({ indice, col, fila, numero, tecla }) => {
            const activo = matriz[indice] === 1
            const pulsada = teclaPulsada === tecla.toLowerCase()
            return (
              <button
                key={indice}
                tabIndex={onToggle ? 0 : -1}
                style={{
                  gridColumn: col + 1,
                  gridRow: fila + 1,
                  width: sz.punto,
                  height: sz.punto,
                  borderRadius: '50%',
                  border: 'none',
                  cursor: onToggle ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: colorPunto(indice),
                  transform: (activo || pulsada) ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: activo
                    ? invidente ? '0 4px 12px #7c3aed55' : '0 4px 12px #2563eb44'
                    : '0 2px 4px #0001',
                  outline: pulsada ? `3px solid ${invidente ? 'white' : '#2563eb'}` : 'none',
                  transition: 'all 0.12s ease',
                }}
                onClick={() => onToggle?.(indice)}
                onFocus={() => hablar(`Punto ${numero}, tecla ${tecla}, ${activo ? 'activado' : 'desactivado'}`)}
                onMouseEnter={() => onToggle && hablar(`Punto ${numero}, tecla ${tecla}`)}
              >
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:1 }}>
                  <span style={{
                    fontSize: sz.fontSize,
                    color: activo ? 'white' : invidente ? '#aaa' : '#999',
                    fontWeight: 800,
                    lineHeight: 1,
                  }}>{numero}</span>
                  {onToggle && (
                    <span style={{
                      fontSize: sz.subFont,
                      color: activo ? 'rgba(255,255,255,0.8)' : invidente ? '#888' : '#bbb',
                      fontWeight: 600,
                      lineHeight: 1,
                    }}>{tecla}</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}