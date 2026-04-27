import { LAYOUT } from '../data/niveles';
import { hablar } from '../utils/voz';

export default function TutorialTeclado({ invidente, onClose }) {
  
  // Contenido de la explicación
  const guiaTactil = invidente 
    ? "En tu teclado, las teclas F y J tienen un relieve. Úsalas como centro. Tu mano izquierda controla las teclas D, F, G para los puntos 1, 2 y 3. Tu mano derecha controla las teclas H, J, K para los puntos 4, 5 y 6."
    : "Identifica las marcas en relieve en las teclas F y J; son tu referencia central. La columna izquierda del Braille (puntos 1, 2, 3) corresponde a las teclas D, F, G. La columna derecha (puntos 4, 5, 6) corresponde a H, J, K.";

  return (
    <div style={{
      padding: '20px',
      background: invidente ? '#2e2a5e' : 'white',
      borderRadius: '16px',
      border: invidente ? '2px solid #7c3aed' : '1px solid #ccc',
      maxWidth: '500px',
      margin: '20px auto',
      color: invidente ? 'white' : '#333'
    }}>
      <h2 style={{ marginBottom: '15px' }}>¿Cómo usar el teclado?</h2>
      <p style={{ marginBottom: '20px', fontSize: '16px', lineHeight: '1.5' }}>{guiaTactil}</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {LAYOUT.map((p) => (
          <div key={p.indice} style={{ 
            background: invidente ? '#1e1b4b' : '#f0f4ff', 
            padding: '10px', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <strong style={{ display: 'block', fontSize: '18px' }}>{p.tecla}</strong>
            <span style={{ fontSize: '12px' }}>Coordenada: Punto {p.numero}</span>
          </div>
        ))}
      </div>

      <button 
        onClick={onClose}
        style={{
          marginTop: '20px',
          width: '100%',
          padding: '12px',
          background: '#7c3aed',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Entendido, comenzar
      </button>
    </div>
  );
}