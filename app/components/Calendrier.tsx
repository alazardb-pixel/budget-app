'use client'

export default function Calendrier() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh', flexDirection:'column', gap:12 }}>
      <div style={{ fontSize:48 }}>📅</div>
      <div style={{ fontSize:18, fontWeight:700 }}>Calendrier</div>
      <div style={{ fontSize:14, color:'var(--text-sub)' }}>Bientôt disponible</div>
    </div>
  )
}