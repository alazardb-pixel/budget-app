'use client'

import { useState } from 'react'
import { MOIS } from '../data'
import { saveRevenus } from '../sheets'

export default function Revenus({ data, setData }: any) {
  const [mois, setMois] = useState('Janvier')
  const [showEdit, setShowEdit] = useState(false)
  const [toast, setToast] = useState('')
  const [form, setForm] = useState({
    salaireBaptiste: '', ticketRestaurant: '', autresBaptiste: '',
    salaireLucile: '', autresLucile: ''
  })

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function getTotalBaptiste(r: any) {
    return (r?.salaireBaptiste || 0) + (r?.ticketRestaurant || 0) + (r?.autresBaptiste || 0)
  }
  function getTotalLucile(r: any) {
    return (r?.salaireLucile || 0) + (r?.autresLucile || 0)
  }

  const r = data.revenus[mois] || { salaireBaptiste: 0, ticketRestaurant: 0, autresBaptiste: 0, salaireLucile: 0, autresLucile: 0 }
  const totalBaptiste = getTotalBaptiste(r)
  const totalLucile = getTotalLucile(r)
  const totalCouple = totalBaptiste + totalLucile

  const allTotauxBaptiste = MOIS.map(m => getTotalBaptiste(data.revenus[m]))
  const allTotauxLucile = MOIS.map(m => getTotalLucile(data.revenus[m]))
  const maxVal = Math.max(...allTotauxBaptiste, ...allTotauxLucile, 1)

  // Moyennes (uniquement mois avec données)
  const moisAvecDonnees = MOIS.filter(m => getTotalBaptiste(data.revenus[m]) + getTotalLucile(data.revenus[m]) > 0)
  const moyBaptiste = moisAvecDonnees.length > 0
    ? moisAvecDonnees.reduce((s, m) => s + getTotalBaptiste(data.revenus[m]), 0) / moisAvecDonnees.length
    : 0
  const moyLucile = moisAvecDonnees.length > 0
    ? moisAvecDonnees.reduce((s, m) => s + getTotalLucile(data.revenus[m]), 0) / moisAvecDonnees.length
    : 0

  const totalAnnuel = MOIS.reduce((s, m) => s + getTotalBaptiste(data.revenus[m]) + getTotalLucile(data.revenus[m]), 0)

  const moisShort = ['J', 'F', 'Ma', 'Av', 'Mai', 'Jn', 'Jl', 'A', 'S', 'O', 'N', 'D']

  // Échelle axe Y : 3 valeurs
  const yMax = Math.ceil(maxVal / 1000) * 1000
  const yMid = Math.round(yMax / 2)

  function openEdit() {
    setForm({
      salaireBaptiste: r.salaireBaptiste || '',
      ticketRestaurant: r.ticketRestaurant || '',
      autresBaptiste: r.autresBaptiste || '',
      salaireLucile: r.salaireLucile || '',
      autresLucile: r.autresLucile || '',
    })
    setShowEdit(true)
  }

  async function save() {
    const updated = {
      ...data.revenus,
      [mois]: {
        salaireBaptiste: parseFloat(form.salaireBaptiste as any) || 0,
        ticketRestaurant: parseFloat(form.ticketRestaurant as any) || 0,
        autresBaptiste: parseFloat(form.autresBaptiste as any) || 0,
        salaireLucile: parseFloat(form.salaireLucile as any) || 0,
        autresLucile: parseFloat(form.autresLucile as any) || 0,
      }
    }
    setData((d: any) => ({ ...d, revenus: updated }))
    setShowEdit(false)
    await saveRevenus(updated)
    showToast('✅ Revenus enregistrés dans Google Sheets !')
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
        }}>
          {toast}
        </div>
      )}
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateX(-50%) translateY(8px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
      `}</style>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px 12px' }}>
        <span style={{ fontSize: 22, color: 'var(--text-sub)' }}>☰</span>
        <span style={{ fontSize: 16, fontWeight: 700 }}>Revenus</span>
        <span style={{ fontSize: 22, color: 'var(--text-sub)' }}></span>
      </div>

      {/* SELECTEUR MOIS */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 6 }}>Mois</div>
        <select value={mois} onChange={e => setMois(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 15, fontFamily: 'DM Sans, sans-serif', background: 'white', outline: 'none', cursor: 'pointer' }}>
          {MOIS.map(m => <option key={m}>{m}</option>)}
        </select>
      </div>

      {/* CARTE RÉSUMÉ */}
      <div style={{ margin: '0 20px 12px', background: 'white', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Total couple</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--green)' }}>{totalCouple.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1, padding: '14px 18px', borderRight: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--baptiste)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Baptiste</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{totalBaptiste.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</div>
            {[
              { label: 'Salaire', val: r.salaireBaptiste },
              { label: 'Ticket resto', val: r.ticketRestaurant },
              { label: 'Autres', val: r.autresBaptiste },
            ].map(item => item.val > 0 && (
              <div key={item.label} style={{ fontSize: 12, color: 'var(--text-sub)', marginTop: 3 }}>
                {item.label} : {item.val.toLocaleString('fr-FR')} €
              </div>
            ))}
          </div>
          <div style={{ flex: 1, padding: '14px 18px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--lucile)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Lucile</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{totalLucile.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</div>
            {[
              { label: 'Salaire', val: r.salaireLucile },
              { label: 'Autres', val: r.autresLucile },
            ].map(item => item.val > 0 && (
              <div key={item.label} style={{ fontSize: 12, color: 'var(--text-sub)', marginTop: 3 }}>
                {item.label} : {item.val.toLocaleString('fr-FR')} €
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border)' }}>
          <button onClick={openEdit} style={{ width: '100%', padding: 11, background: 'var(--green-btn)', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            ✏️ Modifier les revenus de {mois}
          </button>
        </div>
      </div>

      {/* GRAPHIQUE */}
      <div style={{ background: 'white', borderRadius: 14, margin: '0 20px 12px', padding: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>Évolution mensuelle</div>
        <div style={{ fontSize: 12, color: 'var(--text-sub)', marginBottom: 12 }}>Revenus totaux par mois</div>

        {/* Légende + moyennes */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
          {[
            { color: 'var(--baptiste)', name: 'Baptiste', moy: moyBaptiste },
            { color: 'var(--lucile)', name: 'Lucile', moy: moyLucile },
          ].map(({ color, name, moy }) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
              <span style={{ color: 'var(--text-sub)' }}>{name}</span>
              {moy > 0 && <span style={{ color, fontWeight: 600 }}>~{Math.round(moy).toLocaleString('fr-FR')} €</span>}
            </div>
          ))}
        </div>

        {/* Graphique avec échelle Y */}
        <div style={{ display: 'flex', gap: 6 }}>
          {/* Axe Y */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', height: 90, paddingBottom: 0, flexShrink: 0 }}>
            <span style={{ fontSize: 9, color: 'var(--text-sub)' }}>{(yMax / 1000).toFixed(0)}k</span>
            <span style={{ fontSize: 9, color: 'var(--text-sub)' }}>{(yMid / 1000).toFixed(0)}k</span>
            <span style={{ fontSize: 9, color: 'var(--text-sub)' }}>0</span>
          </div>

          {/* Barres */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 90, borderLeft: '1px solid #eee', paddingLeft: 4 }}>
              {MOIS.map((m, i) => {
                const hB = Math.round((allTotauxBaptiste[i] / maxVal) * 80)
                const hL = Math.round((allTotauxLucile[i] / maxVal) * 80)
                const isSelected = m === mois
                return (
                  <div key={m} onClick={() => setMois(m)} style={{ flex: 1, display: 'flex', gap: 1, alignItems: 'flex-end', cursor: 'pointer', opacity: isSelected ? 1 : 0.55 }}>
                    <div style={{ flex: 1, height: hB, background: 'var(--baptiste)', borderRadius: '2px 2px 0 0', minHeight: hB > 0 ? 3 : 0 }} />
                    <div style={{ flex: 1, height: hL, background: 'var(--lucile)', borderRadius: '2px 2px 0 0', minHeight: hL > 0 ? 3 : 0 }} />
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: 3, marginTop: 4, paddingLeft: 4 }}>
              {moisShort.map((m, i) => (
                <div key={m} onClick={() => setMois(MOIS[i])} style={{ flex: 1, textAlign: 'center', fontSize: 8, color: MOIS[i] === mois ? 'var(--green)' : 'var(--text-sub)', fontWeight: MOIS[i] === mois ? 700 : 400, cursor: 'pointer' }}>{m}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TOTAL ANNUEL */}
      <div style={{ background: 'white', borderRadius: 14, margin: '0 20px 12px', padding: '16px 18px' }}>
        <div style={{ fontSize: 13, color: 'var(--text-sub)', marginBottom: 4 }}>Total revenus 2026</div>
        <div style={{ fontSize: 24, fontWeight: 700 }}>{totalAnnuel.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</div>
      </div>

      {/* HISTORIQUE */}
      <div style={{ background: 'white', borderRadius: 14, margin: '0 20px 12px', overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>Historique 2026</div>
        </div>
        {MOIS.map(m => {
          const rv = data.revenus[m]
          const tB = getTotalBaptiste(rv)
          const tL = getTotalLucile(rv)
          const total = tB + tL
          if (total === 0) return null
          return (
            <div key={m} onClick={() => setMois(m)} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 18px', borderBottom: '1px solid var(--border)',
              background: m === mois ? 'var(--green-bg)' : 'white', cursor: 'pointer'
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: m === mois ? 700 : 500 }}>{m}</div>
                <div style={{ fontSize: 11, color: 'var(--text-sub)', marginTop: 2 }}>
                  <span style={{ color: 'var(--baptiste)' }}>{tB.toLocaleString('fr-FR')} €</span>
                  {' · '}
                  <span style={{ color: 'var(--lucile)' }}>{tL.toLocaleString('fr-FR')} €</span>
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{total.toLocaleString('fr-FR')} €</div>
            </div>
          )
        })}
      </div>

      {/* FORM EDIT */}
      {showEdit && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 90, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
          onClick={() => setShowEdit(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 430, padding: '20px 20px 40px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ width: 36, height: 4, background: '#ddd', borderRadius: 2, margin: '0 auto 16px' }} />
            <div style={{ textAlign: 'center', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Revenus de {mois}</div>

            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--baptiste)', margin: '16px 0 10px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Baptiste</div>
            {[
              { label: 'Salaire', key: 'salaireBaptiste' },
              { label: 'Ticket Restaurant', key: 'ticketRestaurant' },
              { label: 'Autres revenus', key: 'autresBaptiste' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 6 }}>{f.label}</div>
                <input type="number" value={(form as any)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder="0"
                  style={{ width: '100%', background: '#f2f2f2', border: 'none', borderRadius: 10, padding: '12px 14px', fontSize: 15, fontFamily: 'DM Sans, sans-serif', outline: 'none' }} />
              </div>
            ))}

            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--lucile)', margin: '16px 0 10px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Lucile</div>
            {[
              { label: 'Salaire', key: 'salaireLucile' },
              { label: 'Autres revenus', key: 'autresLucile' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sub)', marginBottom: 6 }}>{f.label}</div>
                <input type="number" value={(form as any)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder="0"
                  style={{ width: '100%', background: '#f2f2f2', border: 'none', borderRadius: 10, padding: '12px 14px', fontSize: 15, fontFamily: 'DM Sans, sans-serif', outline: 'none' }} />
              </div>
            ))}

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button onClick={() => setShowEdit(false)} style={{ flex: 1, padding: 13, border: '1.5px solid var(--border)', borderRadius: 12, background: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Annuler</button>
              <button onClick={save} style={{ flex: 1, padding: 13, border: 'none', borderRadius: 12, background: 'var(--green-btn)', color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}