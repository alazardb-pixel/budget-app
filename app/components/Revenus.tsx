'use client'

import { useState } from 'react'
import { MOIS } from '../data'

export default function Revenus({ data, setData }: any) {
  const [mois, setMois] = useState('Janvier')

  const r = data.revenus[mois] || { baptiste: 0, lucile: 0 }
  const couple = r.baptiste + r.lucile

  const allVals = Object.values(data.revenus).flatMap((v: any) => [v.baptiste, v.lucile])
  const maxVal = Math.max(...allVals, 1)

  const totalAnnuel = Object.values(data.revenus).reduce((s: number, v: any) => s + v.baptiste + v.lucile, 0)

  const moisShort = ['J','F','Ma','Av','Mai','Jn','Jl','A','S','O','N','D']

  return (
    <div>
      {/* HEADER */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px 12px' }}>
        <span style={{ fontSize:22, color:'var(--text-sub)' }}>☰</span>
        <span style={{ fontSize:16, fontWeight:700 }}>Revenus</span>
        <span style={{ fontSize:22, color:'var(--text-sub)' }}>☰</span>
      </div>

      {/* SELECTEUR MOIS */}
      <div style={{ padding:'0 20px 16px' }}>
        <div style={{ fontSize:13, fontWeight:600, color:'var(--text-sub)', marginBottom:6 }}>Mois</div>
        <select value={mois} onChange={e => setMois(e.target.value)}
          style={{ width:'100%', padding:'12px 16px', border:'1.5px solid var(--border)', borderRadius:12, fontSize:15, fontFamily:'DM Sans, sans-serif', background:'white', outline:'none', cursor:'pointer' }}>
          {MOIS.map(m => <option key={m}>{m}</option>)}
        </select>
      </div>

      {/* STATS */}
      <div style={{ background:'white', borderRadius:14, margin:'0 20px', overflow:'hidden' }}>
        {[
          ['Revenus Couple', couple],
          ['Revenus Baptiste', r.baptiste],
          ['Revenus Lucile', r.lucile],
        ].map(([label, val]: any) => (
          <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 18px', borderBottom:'1px solid var(--border)' }}>
            <span style={{ fontSize:14, color:'var(--text-sub)' }}>{label}</span>
            <span style={{ fontSize:15, fontWeight:600 }}>{val.toFixed(2).replace('.', ',')}</span>
          </div>
        ))}
      </div>

      {/* GRAPHIQUE */}
      <div style={{ background:'white', borderRadius:14, margin:'12px 20px', padding:16 }}>
        <div style={{ fontSize:16, fontWeight:700, marginBottom:10 }}>Revenus par mois</div>
        <div style={{ display:'flex', gap:16, marginBottom:12 }}>
          {[['var(--baptiste)', 'Baptiste'], ['var(--lucile)', 'Lucile']].map(([color, name]) => (
            <div key={name} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--text-sub)' }}>
              <div style={{ width:10, height:10, borderRadius:'50%', background:color }} />
              {name}
            </div>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'flex-end', gap:4, height:80 }}>
          {MOIS.map((m, i) => {
            const rv = data.revenus[m] || { baptiste: 0, lucile: 0 }
            const hB = Math.round((rv.baptiste / maxVal) * 70)
            const hL = Math.round((rv.lucile / maxVal) * 70)
            return (
              <div key={m} style={{ flex:1, display:'flex', gap:2, alignItems:'flex-end' }}>
                <div style={{ flex:1, height:hB, background:'var(--baptiste)', borderRadius:'3px 3px 0 0', minHeight: hB > 0 ? 4 : 0 }} />
                <div style={{ flex:1, height:hL, background:'var(--lucile)', borderRadius:'3px 3px 0 0', minHeight: hL > 0 ? 4 : 0 }} />
              </div>
            )
          })}
        </div>
        <div style={{ display:'flex', gap:4, marginTop:6 }}>
          {moisShort.map(m => (
            <div key={m} style={{ flex:1, textAlign:'center', fontSize:9, color:'var(--text-sub)' }}>{m}</div>
          ))}
        </div>
      </div>

      {/* TOTAL ANNUEL */}
      <div style={{ background:'white', borderRadius:14, margin:'0 20px 12px', padding:'16px 18px' }}>
        <div style={{ fontSize:13, color:'var(--text-sub)', marginBottom:4 }}>Total revenus 2026</div>
        <div style={{ fontSize:24, fontWeight:700 }}>
          {totalAnnuel.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
        </div>
      </div>
    </div>
  )
}