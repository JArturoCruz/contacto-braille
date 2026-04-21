import { useNavigate } from 'react-router-dom'

export default function Welcome() {
  const navigate = useNavigate()
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.logo}>⠿</div>
        <h1 style={styles.title}>Bienvenido a ConTacto</h1>
        <p style={styles.subtitle}>Una plataforma interactiva y accesible para aprender el sistema de lectura y escritura braille. Diseñada tanto para personas videntes como invidentes.</p>

        <div style={styles.card}>
          <div style={styles.cardLeft}>
            <h2 style={{fontWeight:700, fontSize:20, marginBottom:12}}>¿Qué es el Braille?</h2>
            <p style={{color:'#444', lineHeight:1.6}}>
              El braille es un sistema de lectura y escritura táctil diseñado para personas con discapacidad visual. Fue inventado por <strong>Louis Braille</strong> en 1829.
            </p>
            <p style={{color:'#444', lineHeight:1.6, marginTop:12}}>
              Se basa en una <strong>matriz de 2 × 3 puntos</strong> (2 columnas y 3 filas), que permite 63 combinaciones posibles para representar letras, números y símbolos.
            </p>
            <div style={styles.fact}>
              📖 <strong>Dato curioso:</strong> Louis Braille tenía solo 15 años cuando inventó este sistema revolucionario.
            </div>
          </div>
          <div style={styles.cardRight}>
            <p style={{textAlign:'center', color:'#888', fontSize:12, marginBottom:8}}>2 columnas</p>
            <div style={styles.brailleGrid}>
              {[1,4,2,5,3,6].map((n,i) => (
                <div key={i} style={{...styles.dot, background: n===1 ? '#2563eb' : '#ddd'}}>{n}</div>
              ))}
            </div>
            <p style={{textAlign:'center', marginTop:12, fontSize:13, color:'#666'}}>🔊 Escuchar: A</p>
          </div>
        </div>

        <button style={styles.btn} onClick={() => navigate('/dashboard')}>Comenzar a Aprender →</button>
      </div>
    </div>
  )
}

const styles = {
  container: { background:'#f0f4ff', minHeight:'100vh', padding:32 },
  content: { maxWidth:800, margin:'0 auto', textAlign:'center' },
  logo: { fontSize:64, marginBottom:16 },
  title: { fontSize:36, fontWeight:800, color:'#7c3aed', marginBottom:16 },
  subtitle: { color:'#555', fontSize:16, lineHeight:1.7, marginBottom:32 },
  card: { background:'white', borderRadius:16, padding:32, display:'flex', gap:32, textAlign:'left', boxShadow:'0 4px 24px #0001', marginBottom:32 },
  cardLeft: { flex:1 },
  cardRight: { width:160, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' },
  fact: { background:'#f5f3ff', borderRadius:8, padding:12, marginTop:16, fontSize:13, color:'#5b21b6' },
  brailleGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 },
  dot: { width:44, height:44, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:14 },
  btn: { background:'#7c3aed', color:'white', border:'none', borderRadius:10, padding:'14px 40px', fontSize:16, fontWeight:700, cursor:'pointer' }
}