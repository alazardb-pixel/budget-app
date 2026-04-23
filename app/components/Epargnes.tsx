'use client'

import { useState } from 'react'

export default function Epargnes({ data, setData }: any) {
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ nom: '', objectif: '', epargne: '' })

  function openAdd() {
    setEditing(null)
    setForm({ nom: '', objectif: '', epargne: '' })
    setShowAdd(true)
  }

  function openEdit(e: any) {
    setEditing(e)
    setForm({ nom: e.nom, objectif: e.objectif, epargne: e.epargne })
    setShowAdd(true)
  }

  function save() {
    if (editing) {
      setData((d: any) => ({
        ...d,
        epargnes: d.epargnes.map((e: any) =>
          e.id === editing.id ? {
            ...e,
            nom: form.nom,
            objectif: parseFloat(form.objectif as any) || 0,
            epargne: parseFloat(form.epargne as any) || 0,
          } : e
        )
      }))
    } else {
      setData((d: any) => ({
        ...d,
        epargnes: [...d.epargnes, {
          id: Date.now(),
          nom: form.nom || 'Nouvelle épargne',
          objectif: parseFloat(form.objectif as any) || 0,
          epargne: parseFloat(form.epargne as any) || 0,
        }]
      }))
    }
    setShowAdd(false)
  }

  function del(id: number) {
    setData((d: any) => ({ ...d, epargnes: d.epargnes.filter((e: any) => e.id !== id) }))
  }

  return (
    <div>
      {/* HEADER */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px 12px' }}>
        <h1 style={{ fontSize:22, fontWeight:700 }}>Épargnes</h1>
        <button onClick={openAdd} style={{ background:'var(--green-btn)', color:'white', border:'none', borderRadius:20, padding:'9px 16px', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>
          + Add
        </button>
      </div>

      {/* LIST */}
      <div style={{ padding:'0 20px' }}>
        {data.epargnes.map((e: any) => {
          const pct = e.objectif > 0 ? Math.min(100, (e.epargne / e.objectif) * 100) : 0
          const restant = Math.max(0, e.objectif - e.epargne)
          return (
            <div key={e.id} style={{ background:'white', borderRadius:14, padding:18, marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
                <div>
                  <div style={{ fontSize:16, fontWeight:700 }}>{e.nom}</div>
                  <div style={{ fontSize:12, color:'var(--text-sub)', marginBottom:12 }}>
                    Objectif : {e.objectif.toLocaleString('fr-FR')} €
                  </div>
                </div>
                <button onClick={() => openEdit(e)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:18, color:'var(--text-sub)' }}>✏️</button>
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:14, color:'var(--text-sub)' }}>Épargné</span>
                <span style={{ fontSize:14, fontWeight:600 }}>{e.epargne.toLocaleString('fr-FR')} €</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                <span style={{ fontSize:14, color:'var(--text-sub)' }}>Restant</span>
                <span style={{ fontSize:14, fontWeight:600 }}>{restant.toLocaleString('fr-FR')} €</span>
              </div>

              <div style={{ background:'#ebebeb', borderRadius:6, height:8, overflow:'hidden', marginBottom:4 }}>
                <div style={{ width:`${pct}%`, height:'100%', background:'var(--green)', borderRadius:6, transition:'width 0.6s' }} />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:12, color:'var(--text-sub)' }}>{Math.round(pct)}%</span>
                <button onClick={() => del(e.id)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:12, color:'#e53935', fontWeight:600, fontFamily:'DM Sans, sans-serif' }}>
                  Supprimer
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* FORM ADD/EDIT */}
      {showAdd && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:90, display:'flex', alignItems:'flex-end', justifyContent:'center' }}
          onClick={() => setShowAdd(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background:'white', borderRadius:'24px 24px 0 0', width:'100%', maxWidth:430, padding:'20px 20px 40px' }}>
            <div style={{ width:36, height:4, background:'#ddd', borderRadius:2, margin:'0 auto 16px' }} />
            <div style={{ textAlign:'center', fontSize:16, fontWeight:700, marginBottom:20 }}>
              {editing ? 'Modifier' : 'Ajouter une épargne'}
            </div>
            {[
              { label:'Nom', key:'nom', type:'text', placeholder:'Ex: Vacances' },
              { label:'Objectif (€)', key:'objectif', type:'number', placeholder:'0' },
              { label:'Montant épargné (€)', key:'epargne', type:'number', placeholder:'0' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom:14 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'var(--text-sub)', marginBottom:6 }}>{f.label}</div>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={(form as any)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width:'100%', background:'#f2f2f2', border:'none', borderRadius:10, padding:'12px 14px', fontSize:15, fontFamily:'DM Sans, sans-serif', outline:'none' }}
                />
              </div>
            ))}
            <div style={{ display:'flex', gap:10, marginTop:8 }}>
              <button onClick={() => setShowAdd(false)} style={{ flex:1, padding:13, border:'1.5px solid var(--border)', borderRadius:12, background:'white', fontSize:15, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>Annuler</button>
              <button onClick={save} style={{ flex:1, padding:13, border:'none', borderRadius:12, background:'var(--green-btn)', color:'white', fontSize:15, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>Soumettre</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}