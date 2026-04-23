'use client'

import { useState } from 'react'
import { saveCategories } from '../sheets'

export default function Categories({ data, setData }: any) {
  const [detail, setDetail] = useState<any>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ icone: '', nom: '', budget: '', type: 'Variable' })

  function getSpent(cat: any) {
    return data.transactions
      .filter((t: any) => t.cat.includes(cat.nom))
      .reduce((s: number, t: any) => s + t.montant, 0)
  }

  function openAdd() {
    setEditing(null)
    setForm({ icone: '', nom: '', budget: '', type: 'Variable' })
    setShowAdd(true)
  }

  function openEdit(c: any) {
    setEditing(c)
    setForm({ icone: c.icone, nom: c.nom, budget: c.budget, type: c.type })
    setDetail(null)
    setShowAdd(true)
  }

  async function save() {
    if (editing) {
      const updated = data.categories.map((c: any) =>
        c.id === editing.id ? { ...c, ...form, budget: parseFloat(form.budget as any) || 0 } : c
      )
      setData((d: any) => ({ ...d, categories: updated }))
      await saveCategories(updated)
    } else {
      const updated = [...data.categories, {
        id: Date.now(), ...form, budget: parseFloat(form.budget as any) || 0
      }]
      setData((d: any) => ({ ...d, categories: updated }))
      await saveCategories(updated)
    }
    setShowAdd(false)
  }

  async function del(id: number) {
    const updated = data.categories.filter((c: any) => c.id !== id)
    setData((d: any) => ({ ...d, categories: updated }))
    await saveCategories(updated)
    setDetail(null)
  }

  return (
    <div>
      {/* HEADER */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px 12px' }}>
        <h1 style={{ fontSize:22, fontWeight:700 }}>Catégories</h1>
        <button onClick={openAdd} style={{ background:'var(--green-btn)', color:'white', border:'none', borderRadius:20, padding:'9px 16px', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>
          + Add
        </button>
      </div>

      {/* LIST */}
      <div style={{ margin:'0 20px', background:'white', borderRadius:14, overflow:'hidden' }}>
        {data.categories.map((c: any, i: number) => {
          const spent = getSpent(c)
          return (
            <div key={c.id} onClick={() => setDetail(c)}
              style={{ display:'flex', alignItems:'center', padding:'14px 16px', borderBottom: i < data.categories.length - 1 ? '1px solid var(--border)' : 'none', cursor:'pointer' }}>
              <div style={{ fontSize:28, width:46, height:46, display:'flex', alignItems:'center', justifyContent:'center', marginRight:14 }}>{c.icone}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:15, fontWeight:600 }}>{c.nom}</div>
                <div style={{ fontSize:13, color:'var(--text-sub)', marginTop:2 }}>{spent.toFixed(2)} €</div>
              </div>
              <span style={{ color:'var(--text-sub)', fontSize:20 }}>···</span>
            </div>
          )
        })}
      </div>

      {/* DETAIL */}
      {detail && (() => {
        const spent = getSpent(detail)
        const reste = Math.max(0, detail.budget - spent)
        const pct = detail.budget > 0 ? Math.min(100, (spent / detail.budget) * 100) : 0
        return (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:80, display:'flex', alignItems:'flex-end', justifyContent:'center' }}
            onClick={() => setDetail(null)}>
            <div onClick={e => e.stopPropagation()} style={{ background:'white', borderRadius:'24px 24px 0 0', width:'100%', maxWidth:430, padding:'20px 20px 40px' }}>
              <div style={{ width:36, height:4, background:'#ddd', borderRadius:2, margin:'0 auto 16px' }} />
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                <div>
                  <div style={{ fontSize:22, fontWeight:700 }}>{detail.icone} {detail.nom}</div>
                  <div style={{ fontSize:13, color:'var(--text-sub)' }}>{detail.type}</div>
                </div>
                <button onClick={() => openEdit(detail)} style={{ background:'var(--green-btn)', color:'white', border:'none', borderRadius:20, padding:'8px 14px', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>✏️ Edit</button>
              </div>
              <div style={{ background:'#f7f8f7', borderRadius:14, marginTop:16, overflow:'hidden' }}>
                {[['Budget mensuel', detail.budget], ['Reste', reste.toFixed(2)]].map(([k, v]) => (
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'13px 16px', borderBottom:'1px solid var(--border)' }}>
                    <span style={{ color:'var(--text-sub)', fontSize:14 }}>{k}</span>
                    <span style={{ fontWeight:600, fontSize:14 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:16 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'var(--text-sub)', marginBottom:4 }}>Total Dépensé</div>
                <div style={{ fontSize:24, fontWeight:700, marginBottom:8 }}>{spent.toFixed(2)} €</div>
                <div style={{ background:'#ebebeb', borderRadius:6, height:8, overflow:'hidden' }}>
                  <div style={{ width:`${pct}%`, height:'100%', background:'var(--green)', borderRadius:6, transition:'width 0.6s' }} />
                </div>
                <div style={{ textAlign:'right', fontSize:12, color:'var(--text-sub)', marginTop:4 }}>{Math.round(pct)}%</div>
              </div>
              <button onClick={() => del(detail.id)} style={{ width:'100%', marginTop:16, padding:13, border:'none', borderRadius:12, background:'#ffeaea', color:'#e53935', fontWeight:600, fontSize:15, cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>
                Supprimer
              </button>
            </div>
          </div>
        )
      })()}

      {/* FORM ADD/EDIT */}
      {showAdd && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:90, display:'flex', alignItems:'flex-end', justifyContent:'center' }}
          onClick={() => setShowAdd(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background:'white', borderRadius:'24px 24px 0 0', width:'100%', maxWidth:430, padding:'20px 20px 40px' }}>
            <div style={{ width:36, height:4, background:'#ddd', borderRadius:2, margin:'0 auto 16px' }} />
            <div style={{ textAlign:'center', fontSize:16, fontWeight:700, marginBottom:20 }}>
              {editing ? 'Modifier' : 'Ajouter une catégorie'}
            </div>
            {[
              { label:'Icône', key:'icone', type:'text', placeholder:'🏠' },
              { label:'Nom Catégorie', key:'nom', type:'text', placeholder:'Ex: Loyer' },
              { label:'Budget Mensuel (€)', key:'budget', type:'number', placeholder:'0' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom:14 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'var(--text-sub)', marginBottom:6 }}>{f.label}</div>
                <input type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width:'100%', background:'#f2f2f2', border:'none', borderRadius:10, padding:'12px 14px', fontSize:15, fontFamily:'DM Sans, sans-serif', outline:'none' }} />
              </div>
            ))}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:13, fontWeight:600, color:'var(--text-sub)', marginBottom:6 }}>Type</div>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                style={{ width:'100%', background:'#f2f2f2', border:'none', borderRadius:10, padding:'12px 14px', fontSize:15, fontFamily:'DM Sans, sans-serif', outline:'none' }}>
                <option>Fixe</option>
                <option>Variable</option>
              </select>
            </div>
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