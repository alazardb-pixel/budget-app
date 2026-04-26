'use client'

import { useState } from 'react'
import { MOIS } from '../data'
import { saveCategories, saveBudgets } from '../sheets'

export default function Categories({ data, setData }: any) {
  const [personne, setPersonne] = useState<'Baptiste' | 'Lucile'>('Baptiste')
  const [mois, setMois] = useState('Janvier')
  const [detail, setDetail] = useState<any>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [showBudget, setShowBudget] = useState<any>(null)
  const [toast, setToast] = useState('')
  const [form, setForm] = useState({ icone: '', nom: '', type: 'Variable', pour: 'Commun' })
  const [budgetForm, setBudgetForm] = useState({ baptiste: '', lucile: '' })

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function getSpent(cat: any) {
    return data.transactions
      .filter((t: any) => {
        const catMatch = t.cat.includes(cat.nom)
        if (cat.pour === 'Commun') return catMatch
        return catMatch && t.pour === cat.pour
      })
      .reduce((s: number, t: any) => s + t.montant, 0)
  }

  function getBudget(cat: any) {
    const b = data.budgets?.[mois]?.[cat.nom]
    if (!b) return 0
    if (cat.pour === 'Commun') return (b.baptiste || 0) + (b.lucile || 0)
    if (personne === 'Baptiste') return b.baptiste || 0
    return b.lucile || 0
  }

  const catsVisible = data.categories.filter((c: any) =>
    c.pour === 'Commun' || c.pour === personne
  )
  const fixes = catsVisible.filter((c: any) => c.type === 'Fixe')
  const variables = catsVisible.filter((c: any) => c.type === 'Variable')

  function openAdd() {
    setEditing(null)
    setForm({ icone: '', nom: '', type: 'Variable', pour: personne })
    setShowAdd(true)
  }

  function openEdit(c: any) {
    setEditing(c)
    setForm({ icone: c.icone, nom: c.nom, type: c.type, pour: c.pour })
    setDetail(null)
    setShowAdd(true)
  }

  function openBudget(c: any) {
    setShowBudget(c)
    const b = data.budgets?.[mois]?.[c.nom]
    setBudgetForm({
      baptiste: b?.baptiste || '',
      lucile: b?.lucile || '',
    })
    setDetail(null)
  }

  async function save() {
    let updated
    if (editing) {
      updated = data.categories.map((c: any) =>
        c.id === editing.id ? { ...c, ...form } : c
      )
    } else {
      updated = [...data.categories, { id: Date.now(), ...form }]
    }
    setData((d: any) => ({ ...d, categories: updated }))
    setShowAdd(false)
    await saveCategories(updated)
    showToast('✅ Catégorie enregistrée !')
  }

  async function saveBudget() {
    const updated = {
      ...data.budgets,
      [mois]: {
        ...(data.budgets?.[mois] || {}),
        [showBudget.nom]: {
          baptiste: parseFloat(budgetForm.baptiste as any) || 0,
          lucile: parseFloat(budgetForm.lucile as any) || 0,
        }
      }
    }
    setData((d: any) => ({ ...d, budgets: updated }))
    setShowBudget(null)
    await saveBudgets(updated)
    showToast('✅ Budget enregistré !')
  }

  async function del(id: number) {
    const updated = data.categories.filter((c: any) => c.id !== id)
    setData((d: any) => ({ ...d, categories: updated }))
    setDetail(null)
    await saveCategories(updated)
    showToast('🗑️ Catégorie supprimée !')
  }

  function CatCard({ c }: { c: any }) {
    const spent = getSpent(c)
    const budget = getBudget(c)
    const pct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0
    const over = budget > 0 && spent > budget

    return (
      <div onClick={() => setDetail(c)} style={{
        display: 'flex', alignItems: 'center', padding: '12px 16px',
        borderBottom: '1px solid var(--border)', cursor: 'pointer',
        background: 'white',
      }}>
        <div style={{ fontSize: 26, width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>{c.icone}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{c.nom}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: over ? '#e53935' : 'var(--text)' }}>
              {spent.toFixed(0)} €{budget > 0 ? ` / ${budget} €` : ''}
            </div>
          </div>
          {budget > 0 && (
            <div style={{ background: '#ebebeb', borderRadius: 4, height: 5, overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', borderRadius: 4, background: over ? '#e53935' : pct > 80 ? '#ff9800' : 'var(--green)', transition: 'width 0.4s' }} />
            </div>
          )}
          {budget === 0 && (
            <div style={{ fontSize: 11, color: 'var(--text-sub)' }}>Aucun budget défini</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
          background: '#1a1a1a', color: 'white', padding: '12px 20px', borderRadius: 12,
          fontSize: 14, fontWeight: 500, zIndex: 999, whiteSpace: 'nowrap',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)', animation: 'fadeIn 0.2s ease',
        }}>{toast}</div>
      )}
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateX(-50%) translateY(8px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px 12px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Catégories</h1>
        <button onClick={openAdd} style={{ background: 'var(--green-btn)', color: 'white', border: 'none', borderRadius: 20, padding: '9px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>+ Add</button>
      </div>

      {/* FILTRE PERSONNE + MOIS */}
      <div style={{ padding: '0 20px 12px', display: 'flex', gap: 8 }}>
        <div style={{ display: 'flex', background: '#ebebeb', borderRadius: 12, padding: 3, flex: 1 }}>
          {(['Baptiste', 'Lucile'] as const).map(p => (
            <button key={p} onClick={() => setPersonne(p)} style={{
              flex: 1, padding: '8px 0', border: 'none', borderRadius: 10, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600,
              background: personne === p ? 'white' : 'transparent',
              color: personne === p ? (p === 'Baptiste' ? 'var(--baptiste)' : 'var(--lucile)') : 'var(--text-sub)',
              boxShadow: personne === p ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s',
            }}>{p}</button>
          ))}
        </div>
        <select value={mois} onChange={e => setMois(e.target.value)}
          style={{ background: '#ebebeb', border: 'none', borderRadius: 12, padding: '8px 12px', fontSize: 13, fontFamily: 'DM Sans, sans-serif', outline: 'none', cursor: 'pointer', fontWeight: 600 }}>
          {MOIS.map(m => <option key={m}>{m}</option>)}
        </select>
      </div>

      {/* FIXES */}
      {fixes.length > 0 && (
        <div style={{ margin: '0 0 4px' }}>
          <div style={{ padding: '8px 20px 6px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--text-sub)' }}>
            🔒 Charges fixes
          </div>
          <div style={{ background: 'white', margin: '0 0 2px' }}>
            {fixes.map((c: any) => <CatCard key={c.id} c={c} />)}
          </div>
        </div>
      )}

      {/* VARIABLES */}
      {variables.length > 0 && (
        <div style={{ margin: '8px 0 4px' }}>
          <div style={{ padding: '8px 20px 6px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--text-sub)' }}>
            📊 Charges variables
          </div>
          <div style={{ background: 'white', margin: '0 0 2px' }}>
            {variables.map((c: any) => <CatCard key={c.id} c={c} />)}
          </div>
        </div>
      )}

      {/* DETAIL */}
      {detail && (() => {
        const spent = getSpent(detail)
        const budget = getBudget(detail)
        const pct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0
        const over = budget > 0 && spent > budget
        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 80, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
            onClick={() => setDetail(null)}>
            <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 430, padding: '20px 20px 40px' }}>
              <div style={{ width: 36, height: 4, background: '#ddd', borderRadius: 2, margin: '0 auto 16px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>{detail.icone} {detail.nom}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-sub)' }}>{detail.type} · {detail.pour}</div>
                </div>
                <button onClick={() => openEdit(detail)} style={{ background: 'var(--green-btn)', color: 'white', border: 'none', borderRadius: 20, padding: '8px 14px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>✏️ Edit</button>
              </div>
              <div style={{ background: '#f7f8f7', borderRadius: 14, marginTop: 16, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 16px', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-sub)', fontSize: 14 }}>Budget {mois}</span>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{budget > 0 ? `${budget} €` : 'Non défini'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 16px', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-sub)', fontSize: 14 }}>Dépensé</span>
                  <span style={{ fontWeight: 600, fontSize: 14, color: over ? '#e53935' : 'var(--text)' }}>{spent.toFixed(2)} €</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 16px' }}>
                  <span style={{ color: 'var(--text-sub)', fontSize: 14 }}>Reste</span>
                  <span style={{ fontWeight: 600, fontSize: 14, color: over ? '#e53935' : 'var(--green)' }}>{(budget - spent).toFixed(2)} €</span>
                </div>
              </div>
              {budget > 0 && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ background: '#ebebeb', borderRadius: 6, height: 8, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', borderRadius: 6, background: over ? '#e53935' : pct > 80 ? '#ff9800' : 'var(--green)', transition: 'width 0.6s' }} />
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--text-sub)', marginTop: 4 }}>{Math.round(pct)}%</div>
                </div>
              )}
              <button onClick={() => openBudget(detail)} style={{ width: '100%', marginTop: 12, padding: 13, border: 'none', borderRadius: 12, background: 'var(--green-bg)', color: 'var(--green)', fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                💰 Définir le budget de {mois}
              </button>
              <button onClick={() => del(detail.id)} style={{ width: '100%', marginTop: 8, padding: 13, border: 'none', borderRadius: 12, background: '#ffeaea', color: '#e53935', fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                Supprimer
              </button>
            </div>
          </div>
        )
      })()}

      {/* FORM BUDGET */}
      {showBudget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 90, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
          onClick={() => setShowBudget(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 430, padding: '20px 20px 40px' }}>
            <div style={{ width: 36, height: 4, background: '#ddd', borderRadius: 2, margin: '0 auto 16px' }} />
            <div style={{ textAlign: 'center', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Budget {showBudget.nom}</div>
            <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-sub)', marginBottom: 20 }}>{mois}</div>
            {showBudget.pour === 'Commun' ? (
              <>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--baptiste)', marginBottom: 6 }}>Baptiste (€)</div>
                  <input type="number" value={budgetForm.baptiste} onChange={e => setBudgetForm(p => ({ ...p, baptiste: e.target.value }))} placeholder="0"
                    style={{ width: '100%', background: '#f2f2f2', border: 'none', borderRadius: 10, padding: '12px 14px', fontSize: 15, fontFamily: 'DM Sans, sans-serif', outline: 'none' }} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--lucile)', marginBottom: 6 }}>Lucile (€)</div>
                  <input type="number" value={budgetForm.lucile} onChange={e => setBudgetForm(p => ({ ...p, lucile: e.target.value }))} placeholder="0"
                    style={{ width: '100%', background: '#f2f2f2', border: 'none', borderRadius: 10, padding: '12px 14px', fontSize: 15, fontFamily: 'DM Sans, sans-serif', outline: 'none' }} />
                </div>
              </>
            ) : (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: showBudget.pour === 'Baptiste' ? 'var(--baptiste)' : 'var(--lucile)', marginBottom: 6 }}>{showBudget.pour} (€)</div>
                <input type="number"
                  value={showBudget.pour === 'Baptiste' ? budgetForm.baptiste : budgetForm.lucile}
                  onChange={e => setBudgetForm(p => showBudget.pour === 'Baptiste' ? { ...p, baptiste: e.target.value } : { ...p, lucile: e.target.value })}
                  placeholder="0"
                  style={{ width: '100%', background: '#f2f2f2', border: 'none', borderRadius: 10, padding: '12px 14px', fontSize: 15, fontFamily: 'DM Sans, sans-serif', outline: 'none' }} />
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button onClick={() => setShowBudget(null)} style={{ flex: 1, padding: 13, border: '1.5px solid var(--border)', borderRadius: 12, background: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Annuler</button>
              <button onClick={saveBudget} style={{ flex: 1, padding: 13, border: 'none', borderRadius: 12, background: 'var(--green-btn)', color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* FORM ADD/EDIT */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 90, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
          onClick={() => setShowAdd(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 430, padding: '20px 20px 40px' }}>
            <div style={{ width: 36, height: 4, background: '#ddd', borderRadius: 2, margin: '0 auto 16px' }} />
            <div style={{ textAlign: 'center', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>{editing ? 'Modifier' : 'Ajouter une catégorie'}</div>
            {[
              { label: 'Icône', key: 'icone', type: 'text', placeholder: '🏠' },
              { label: 'Nom', key: 'nom', type: 'text', placeholder: 'Ex: Loyer' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 6 }}>{f.label}</div>
                <input type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: '100%', background: '#f2f2f2', border: 'none', borderRadius: 10, padding: '12px 14px', fontSize: 15, fontFamily: 'DM Sans, sans-serif', outline: 'none' }} />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 6 }}>Type</div>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                style={{ width: '100%', background: '#f2f2f2', border: 'none', borderRadius: 10, padding: '12px 14px', fontSize: 15, fontFamily: 'DM Sans, sans-serif', outline: 'none' }}>
                <option>Fixe</option><option>Variable</option>
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 6 }}>Pour</div>
              <select value={form.pour} onChange={e => setForm(p => ({ ...p, pour: e.target.value }))}
                style={{ width: '100%', background: '#f2f2f2', border: 'none', borderRadius: 10, padding: '12px 14px', fontSize: 15, fontFamily: 'DM Sans, sans-serif', outline: 'none' }}>
                <option>Commun</option><option>Baptiste</option><option>Lucile</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: 13, border: '1.5px solid var(--border)', borderRadius: 12, background: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Annuler</button>
              <button onClick={save} style={{ flex: 1, padding: 13, border: 'none', borderRadius: 12, background: 'var(--green-btn)', color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Soumettre</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}