'use client'

import { useState, useEffect } from 'react'
import { MOIS } from '../data'
import { saveTransactions } from '../sheets'

export default function Transactions({ data, setData, onMenuOpen }: any) {
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [detail, setDetail] = useState<any>(null)
  const [editing, setEditing] = useState<any>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [toast, setToast] = useState('')
  const [filters, setFilters] = useState({
    mois: '', payepar: '', pour: '', cat: ''
  })
  const [form, setForm] = useState({
    mois: 'Janvier', cat: '', libelle: '', montant: '', pour: 'Commun', payepar: 'Baptiste'
  })

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const filtered = data.transactions.filter((t: any) => {
    const matchSearch = t.libelle.toLowerCase().includes(search.toLowerCase()) ||
      t.cat.toLowerCase().includes(search.toLowerCase())
    const matchMois = !filters.mois || t.mois === filters.mois
    const matchPayepar = !filters.payepar || t.payepar === filters.payepar
    const matchPour = !filters.pour || t.pour === filters.pour
    const matchCat = !filters.cat || t.cat === filters.cat
    return matchSearch && matchMois && matchPayepar && matchPour && matchCat
  })

  const grouped = MOIS.reduce((acc: any, m) => {
    const items = filtered.filter((t: any) => t.mois === m)
    if (items.length) acc[m] = items
    return acc
  }, {})

  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length

  function resetFilters() {
    setFilters({ mois: '', payepar: '', pour: '', cat: '' })
  }

  function openAdd() {
    setEditing(null)
    setForm({
      mois: 'Janvier',
      cat: data.categories[0]?.icone + ' ' + data.categories[0]?.nom || '',
      libelle: '', montant: '', pour: 'Commun', payepar: 'Baptiste'
    })
    setShowAdd(true)
  }

  function openEdit(t: any) {
    setEditing(t)
    setForm({ mois: t.mois, cat: t.cat, libelle: t.libelle, montant: t.montant, pour: t.pour, payepar: t.payepar })
    setDetail(null)
    setShowAdd(true)
  }

  async function save() {
    let updated
    if (editing) {
      updated = data.transactions.map((t: any) =>
        t.id === editing.id ? { ...t, ...form, montant: parseFloat(form.montant as any) || 0 } : t
      )
    } else {
      updated = [...data.transactions, {
        id: Date.now(), ...form, montant: parseFloat(form.montant as any) || 0
      }]
    }
    setData((d: any) => ({ ...d, transactions: updated }))
    setShowAdd(false)
    await saveTransactions(updated)
    showToast('✅ Transaction enregistrée dans Google Sheets !')
  }

  async function del(id: number) {
    const updated = data.transactions.filter((t: any) => t.id !== id)
    setData((d: any) => ({ ...d, transactions: updated }))
    setDetail(null)
    await saveTransactions(updated)
    showToast('🗑️ Transaction supprimée !')
  }

  const whoColor: any = {
    baptiste: 'var(--baptiste)',
    lucile: 'var(--lucile)',
    commun: 'var(--commun)'
  }

  const uniqueCats = [...new Set(data.transactions.map((t: any) => t.cat))] as string[]

  return (
    <div>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
          background: '#1a1a1a', color: 'white', padding: '12px 20px', borderRadius: 12,
          fontSize: 14, fontWeight: 500, zIndex: 999, whiteSpace: 'nowrap',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          animation: 'fadeIn 0.2s ease',
        }}>
          {toast}
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateX(-50%) translateY(8px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
      `}</style>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px 8px' }}>
        <button onClick={onMenuOpen} style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', color:'var(--text-sub)', padding:0 }}>☰</button>
        <button onClick={openAdd} style={{ background: 'var(--green-btn)', color: 'white', border: 'none', borderRadius: 20, padding: '9px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
          + Add
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div style={{ padding: '0 20px 12px', display: 'flex', gap: 8 }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Recherche"
          style={{ flex: 1, background: '#ebebeb', border: 'none', borderRadius: 12, padding: '10px 14px', fontSize: 14, fontFamily: 'DM Sans, sans-serif', outline: 'none' }}
        />
        <button onClick={() => setShowFilters(!showFilters)} style={{
          background: activeFiltersCount > 0 ? 'var(--green-btn)' : '#ebebeb',
          border: 'none', borderRadius: 12, width: 42, cursor: 'pointer', fontSize: 16,
          color: activeFiltersCount > 0 ? 'white' : 'var(--text-sub)',
          position: 'relative', fontWeight: 600,
        }}>
          {activeFiltersCount > 0 ? activeFiltersCount : '⚙'}
        </button>
      </div>

      {/* FILTRES */}
      {showFilters && (
        <div style={{ margin: '0 20px 12px', background: 'white', borderRadius: 14, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Filtres</span>
            {activeFiltersCount > 0 && (
              <button onClick={resetFilters} style={{ background: 'none', border: 'none', color: 'var(--green)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                Réinitialiser
              </button>
            )}
          </div>

          {[
            { label: 'Mois', key: 'mois', options: ['', ...MOIS] },
            { label: 'Pour', key: 'pour', options: ['', 'Baptiste', 'Lucile', 'Commun'] },
            { label: 'Payé par', key: 'payepar', options: ['', 'Baptiste', 'Lucile'] },
            { label: 'Catégorie', key: 'cat', options: ['', ...uniqueCats] },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 4 }}>{f.label}</div>
              <select
                value={(filters as any)[f.key]}
                onChange={e => setFilters(p => ({ ...p, [f.key]: e.target.value }))}
                style={{ width: '100%', background: '#f2f2f2', border: 'none', borderRadius: 10, padding: '10px 12px', fontSize: 14, fontFamily: 'DM Sans, sans-serif', outline: 'none' }}
              >
                {f.options.map(o => <option key={o} value={o}>{o === '' ? `Tous` : o}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* RÉSULTAT FILTRE */}
      {activeFiltersCount > 0 && (
        <div style={{ padding: '0 20px 8px', fontSize: 13, color: 'var(--text-sub)' }}>
          {filtered.length} transaction{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}
        </div>
      )}

      {/* LIST */}
      {Object.keys(grouped).length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-sub)', fontSize: 14 }}>
          Aucune transaction trouvée
        </div>
      ) : (
        Object.entries(grouped).map(([mois, items]: any) => (
          <div key={mois}>
            <div style={{ padding: '10px 20px 6px', fontSize: 17, fontWeight: 700 }}>{mois}</div>
            <div style={{ background: 'white', margin: '0 0 2px' }}>
              {items.map((t: any) => (
                <div key={t.id} onClick={() => setDetail(t)}
                  style={{ display: 'flex', alignItems: 'center', padding: '13px 20px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                  <div style={{ fontSize: 26, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                    {t.cat.split(' ')[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: whoColor[t.pour.toLowerCase()] || 'var(--commun)', marginBottom: 2 }}>
                      {t.pour}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{t.libelle}</div>
                    <div style={{ fontSize: 14, color: 'var(--text-sub)' }}>{t.montant.toFixed(2).replace('.', ',')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* DETAIL */}
      {detail && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 80, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
          onClick={() => setDetail(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 430, padding: '20px 20px 40px' }}>
            <div style={{ width: 36, height: 4, background: '#ddd', borderRadius: 2, margin: '0 auto 16px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{detail.mois}</div>
                <div style={{ fontSize: 14, color: 'var(--text-sub)' }}>{detail.libelle}</div>
              </div>
              <button onClick={() => openEdit(detail)} style={{ background: 'var(--green-btn)', color: 'white', border: 'none', borderRadius: 20, padding: '8px 14px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>✏️ Edit</button>
            </div>
            <div style={{ background: '#f7f8f7', borderRadius: 14, marginTop: 16, overflow: 'hidden' }}>
              {[['Catégorie', detail.cat], ['Montant', detail.montant.toFixed(2).replace('.', ',') + ' €'], ['Pour', detail.pour], ['Payé par', detail.payepar]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 16px', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-sub)', fontSize: 14 }}>{k}</span>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => del(detail.id)} style={{ width: '100%', marginTop: 16, padding: 13, border: 'none', borderRadius: 12, background: '#ffeaea', color: '#e53935', fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
              Supprimer
            </button>
          </div>
        </div>
      )}

      {/* FORM ADD/EDIT */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 90, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
          onClick={() => setShowAdd(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 430, padding: '20px 20px 40px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ width: 36, height: 4, background: '#ddd', borderRadius: 2, margin: '0 auto 16px' }} />
            <div style={{ textAlign: 'center', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>
              {editing ? 'Modifier' : 'Ajouter une transaction'}
            </div>
            {[
              { label: 'Mois', key: 'mois', type: 'select', options: MOIS },
              { label: 'Catégorie', key: 'cat', type: 'select', options: data.categories.map((c: any) => c.icone + ' ' + c.nom) },
              { label: 'Libellé', key: 'libelle', type: 'text' },
              { label: 'Montant (€)', key: 'montant', type: 'number' },
              { label: 'Pour', key: 'pour', type: 'select', options: ['Baptiste', 'Lucile', 'Commun'] },
              { label: 'Payé par', key: 'payepar', type: 'select', options: ['Baptiste', 'Lucile'] },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 6 }}>{f.label}</div>
                {f.type === 'select' ? (
                  <select value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: '100%', background: '#f2f2f2', border: 'none', borderRadius: 10, padding: '12px 14px', fontSize: 15, fontFamily: 'DM Sans, sans-serif', outline: 'none' }}>
                    {f.options!.map((o: string) => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: '100%', background: '#f2f2f2', border: 'none', borderRadius: 10, padding: '12px 14px', fontSize: 15, fontFamily: 'DM Sans, sans-serif', outline: 'none' }} />
                )}
              </div>
            ))}
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