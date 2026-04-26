'use client'

import { useState } from 'react'
import { MOIS } from '../data'
import { saveEpargnesBaptiste, saveEpargneConfig } from '../sheets'

const COLORS = ['#4a7c3f','#c95b8a','#f59e0b','#3b82f6','#8b5cf6','#ef4444','#06b6d4','#84cc16']

export default function Epargnes({ data, setData }: any) {
  const [mois, setMois] = useState('Janvier')
  const [toast, setToast] = useState('')
  const [showSaisie, setShowSaisie] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [showAddEnveloppe, setShowAddEnveloppe] = useState(false)
  const [selectedEnveloppe, setSelectedEnveloppe] = useState<string | null>(null)
  const [saisieForm, setSaisieForm] = useState({ versement: '', retrait: '', valorisation: '' })
  const [configForm, setConfigForm] = useState<any>({})
  const [newEnveloppe, setNewEnveloppe] = useState({ nom: '', objectif: '' })

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const config = data.epargneConfig?.baptiste || {}
  const enveloppes = Object.keys(config)
  const epMois = data.epargnesBaptiste?.[mois] || {}

  // Totaux du mois
  const totalVersement = enveloppes.reduce((s, e) => s + (epMois[e]?.versement || 0), 0)
  const totalRetrait = enveloppes.reduce((s, e) => s + (epMois[e]?.retrait || 0), 0)
  const totalValorisation = enveloppes.reduce((s, e) => s + (epMois[e]?.valorisation || 0), 0)
  const totalObjectif = enveloppes.reduce((s, e) => s + (config[e] || 0), 0)

  // Évolution : valorisation totale par mois
  const evolutionData = MOIS.map(m => {
    const ep = data.epargnesBaptiste?.[m] || {}
    return enveloppes.reduce((s, e) => s + (ep[e]?.valorisation || 0), 0)
  })
  const maxEvol = Math.max(...evolutionData, 1)

  function openSaisie(enveloppe: string) {
    setSelectedEnveloppe(enveloppe)
    const existing = epMois[enveloppe] || {}
    setSaisieForm({
      versement: existing.versement || '',
      retrait: existing.retrait || '',
      valorisation: existing.valorisation || '',
    })
    setShowSaisie(true)
  }

  async function saveSaisie() {
    const updated = {
      ...data.epargnesBaptiste,
      [mois]: {
        ...(data.epargnesBaptiste?.[mois] || {}),
        [selectedEnveloppe!]: {
          versement: parseFloat(saisieForm.versement as any) || 0,
          retrait: parseFloat(saisieForm.retrait as any) || 0,
          valorisation: parseFloat(saisieForm.valorisation as any) || 0,
        }
      }
    }
    setData((d: any) => ({ ...d, epargnesBaptiste: updated }))
    setShowSaisie(false)
    await saveEpargnesBaptiste(updated)
    showToast('✅ Épargne enregistrée !')
  }

  function openConfig() {
    setConfigForm({ ...config })
    setShowConfig(true)
  }

  async function saveConfig() {
    const updated = {
      ...data.epargneConfig,
      baptiste: configForm
    }
    setData((d: any) => ({ ...d, epargneConfig: updated }))
    setShowConfig(false)
    await saveEpargneConfig(updated)
    showToast('✅ Objectifs mis à jour !')
  }

  async function addEnveloppe() {
    if (!newEnveloppe.nom) return
    const updatedConfig = {
      ...data.epargneConfig,
      baptiste: { ...config, [newEnveloppe.nom]: parseFloat(newEnveloppe.objectif as any) || 0 }
    }
    setData((d: any) => ({ ...d, epargneConfig: updatedConfig }))
    setShowAddEnveloppe(false)
    setNewEnveloppe({ nom: '', objectif: '' })
    await saveEpargneConfig(updatedConfig)
    showToast('✅ Enveloppe ajoutée !')
  }

  async function deleteEnveloppe(nom: string) {
    const { [nom]: _, ...rest } = config
    const updatedConfig = { ...data.epargneConfig, baptiste: rest }
    setData((d: any) => ({ ...d, epargneConfig: updatedConfig }))
    await saveEpargneConfig(updatedConfig)
    showToast('🗑️ Enveloppe supprimée !')
  }

  const moisShort = ['J','F','Ma','Av','Mai','Jn','Jl','A','S','O','N','D']

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
      <style>{`@keyframes fadeIn { from{opacity:0;transform:translateX(-50%) translateY(8px);}to{opacity:1;transform:translateX(-50%) translateY(0);} }`}</style>

      {/* HEADER */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px 12px' }}>
        <h1 style={{ fontSize:22, fontWeight:700 }}>Épargnes</h1>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={openConfig} style={{ background:'#ebebeb', border:'none', borderRadius:20, padding:'9px 14px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>
            🎯 Objectifs
          </button>
          <button onClick={() => setShowAddEnveloppe(true)} style={{ background:'var(--green-btn)', color:'white', border:'none', borderRadius:20, padding:'9px 14px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>
            + Add
          </button>
        </div>
      </div>

      {/* SELECTEUR MOIS */}
      <div style={{ padding:'0 20px 16px' }}>
        <select value={mois} onChange={e => setMois(e.target.value)}
          style={{ width:'100%', padding:'12px 16px', border:'1.5px solid var(--border)', borderRadius:12, fontSize:15, fontFamily:'DM Sans, sans-serif', background:'white', outline:'none', cursor:'pointer' }}>
          {MOIS.map(m => <option key={m}>{m}</option>)}
        </select>
      </div>

      {/* CARTE RÉSUMÉ DU MOIS */}
      <div style={{ margin:'0 20px 12px', background:'white', borderRadius:14, overflow:'hidden' }}>
        <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)' }}>
          <div style={{ fontSize:13, fontWeight:700, color:'var(--baptiste)', textTransform:'uppercase', letterSpacing:0.5, marginBottom:8 }}>Baptiste — {mois}</div>
          <div style={{ display:'flex', gap:0 }}>
            {[
              { label:'Valorisation', val:totalValorisation, color:'var(--green)' },
              { label:'Versements', val:totalVersement, color:'var(--baptiste)' },
              { label:'Retraits', val:totalRetrait, color:'#e53935' },
            ].map((item, i) => (
              <div key={item.label} style={{ flex:1, textAlign:'center', borderRight: i < 2 ? '1px solid var(--border)' : 'none', padding:'4px 0' }}>
                <div style={{ fontSize:11, color:'var(--text-sub)', marginBottom:4 }}>{item.label}</div>
                <div style={{ fontSize:15, fontWeight:700, color:item.color }}>{item.val.toLocaleString('fr-FR')} €</div>
              </div>
            ))}
          </div>
        </div>
        {totalObjectif > 0 && (
          <div style={{ padding:'12px 18px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--text-sub)', marginBottom:6 }}>
              <span>Progression vers objectifs</span>
              <span>{totalObjectif.toLocaleString('fr-FR')} € objectif total</span>
            </div>
            <div style={{ background:'#ebebeb', borderRadius:6, height:8, overflow:'hidden' }}>
              <div style={{ width:`${Math.min(100,(totalValorisation/totalObjectif)*100)}%`, height:'100%', background:'var(--green)', borderRadius:6, transition:'width 0.6s' }} />
            </div>
            <div style={{ textAlign:'right', fontSize:12, color:'var(--text-sub)', marginTop:4 }}>
              {Math.round((totalValorisation/totalObjectif)*100)}%
            </div>
          </div>
        )}
      </div>

      {/* ENVELOPPES */}
      <div style={{ margin:'0 0 12px' }}>
        <div style={{ padding:'8px 20px 6px', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:0.8, color:'var(--text-sub)' }}>
          Enveloppes
        </div>
        <div style={{ background:'white' }}>
          {enveloppes.map((env, i) => {
            const ep = epMois[env] || { versement:0, retrait:0, valorisation:0 }
            const objectif = config[env] || 0
            const pct = objectif > 0 ? Math.min(100, (ep.valorisation / objectif) * 100) : 0
            const color = COLORS[i % COLORS.length]
            return (
              <div key={env} onClick={() => openSaisie(env)}
                style={{ display:'flex', alignItems:'center', padding:'14px 20px', borderBottom:'1px solid var(--border)', cursor:'pointer' }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:color, marginRight:12, flexShrink:0 }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                    <div style={{ fontSize:15, fontWeight:600 }}>{env}</div>
                    <div style={{ fontSize:13, fontWeight:600 }}>
                      {ep.valorisation.toLocaleString('fr-FR')} €
                      {objectif > 0 && <span style={{ color:'var(--text-sub)', fontWeight:400 }}> / {objectif.toLocaleString('fr-FR')} €</span>}
                    </div>
                  </div>
                  {objectif > 0 && (
                    <div style={{ background:'#ebebeb', borderRadius:4, height:5, overflow:'hidden', marginBottom:4 }}>
                      <div style={{ width:`${pct}%`, height:'100%', background:color, borderRadius:4, transition:'width 0.4s' }} />
                    </div>
                  )}
                  <div style={{ display:'flex', gap:12, fontSize:11, color:'var(--text-sub)' }}>
                    {ep.versement > 0 && <span style={{ color:'var(--baptiste)' }}>▲ {ep.versement.toLocaleString('fr-FR')} €</span>}
                    {ep.retrait > 0 && <span style={{ color:'#e53935' }}>▼ {ep.retrait.toLocaleString('fr-FR')} €</span>}
                    {ep.versement === 0 && ep.retrait === 0 && <span>Appuyer pour saisir</span>}
                  </div>
                </div>
                <div style={{ marginLeft:12, color:'var(--text-sub)', fontSize:18 }}>›</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* GRAPHIQUE ÉVOLUTION */}
      <div style={{ background:'white', borderRadius:14, margin:'0 20px 12px', padding:16 }}>
        <div style={{ fontSize:15, fontWeight:700, marginBottom:2 }}>Évolution du patrimoine</div>
        <div style={{ fontSize:12, color:'var(--text-sub)', marginBottom:16 }}>Valorisation totale par mois</div>
        <div style={{ display:'flex', gap:6 }}>
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', alignItems:'flex-end', height:80, flexShrink:0 }}>
            <span style={{ fontSize:9, color:'var(--text-sub)' }}>{(maxEvol/1000).toFixed(0)}k</span>
            <span style={{ fontSize:9, color:'var(--text-sub)' }}>{(maxEvol/2000).toFixed(0)}k</span>
            <span style={{ fontSize:9, color:'var(--text-sub)' }}>0</span>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'flex-end', gap:3, height:80, borderLeft:'1px solid #eee', paddingLeft:4 }}>
              {evolutionData.map((val, i) => {
                const h = Math.round((val / maxEvol) * 76)
                const isSelected = MOIS[i] === mois
                return (
                  <div key={i} onClick={() => setMois(MOIS[i])} style={{ flex:1, cursor:'pointer' }}>
                    <div style={{ height:h, background: isSelected ? 'var(--green)' : '#c8dfc4', borderRadius:'3px 3px 0 0', minHeight: h > 0 ? 3 : 0, transition:'height 0.3s' }} />
                  </div>
                )
              })}
            </div>
            <div style={{ display:'flex', gap:3, marginTop:4, paddingLeft:4 }}>
              {moisShort.map((m, i) => (
                <div key={m} onClick={() => setMois(MOIS[i])} style={{ flex:1, textAlign:'center', fontSize:8, color: MOIS[i] === mois ? 'var(--green)' : 'var(--text-sub)', fontWeight: MOIS[i] === mois ? 700 : 400, cursor:'pointer' }}>{m}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CAMEMBERT RÉPARTITION */}
      {totalValorisation > 0 && (
        <div style={{ background:'white', borderRadius:14, margin:'0 20px 12px', padding:16 }}>
          <div style={{ fontSize:15, fontWeight:700, marginBottom:2 }}>Répartition du patrimoine</div>
          <div style={{ fontSize:12, color:'var(--text-sub)', marginBottom:16 }}>{mois}</div>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <svg width={120} height={120} viewBox="0 0 120 120">
              {(() => {
                let offset = 0
                const r = 40
                const cx = 60, cy = 60
                const circ = 2 * Math.PI * r
                return enveloppes.map((env, i) => {
                  const val = epMois[env]?.valorisation || 0
                  const pct = totalValorisation > 0 ? val / totalValorisation : 0
                  const dash = pct * circ
                  const gap = circ - dash
                  const el = (
                    <circle key={env}
                      cx={cx} cy={cy} r={r}
                      fill="none"
                      stroke={COLORS[i % COLORS.length]}
                      strokeWidth={20}
                      strokeDasharray={`${dash} ${gap}`}
                      strokeDashoffset={-offset}
                      transform={`rotate(-90 ${cx} ${cy})`}
                    />
                  )
                  offset += dash
                  return el
                })
              })()}
              <circle cx={60} cy={60} r={28} fill="white" />
              <text x={60} y={55} textAnchor="middle" fontSize={9} fill="#888">Total</text>
              <text x={60} y={68} textAnchor="middle" fontSize={9} fontWeight="bold" fill="#1a1a1a">
                {(totalValorisation/1000).toFixed(0)}k €
              </text>
            </svg>
            <div style={{ flex:1 }}>
              {enveloppes.map((env, i) => {
                const val = epMois[env]?.valorisation || 0
                const pct = totalValorisation > 0 ? Math.round((val / totalValorisation) * 100) : 0
                if (val === 0) return null
                return (
                  <div key={env} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                    <div style={{ width:10, height:10, borderRadius:2, background:COLORS[i % COLORS.length], flexShrink:0 }} />
                    <div style={{ flex:1, fontSize:12 }}>{env}</div>
                    <div style={{ fontSize:12, fontWeight:600 }}>{pct}%</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL SAISIE */}
      {showSaisie && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:90, display:'flex', alignItems:'flex-end', justifyContent:'center' }}
          onClick={() => setShowSaisie(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background:'white', borderRadius:'24px 24px 0 0', width:'100%', maxWidth:430, padding:'20px 20px 40px' }}>
            <div style={{ width:36, height:4, background:'#ddd', borderRadius:2, margin:'0 auto 16px' }} />
            <div style={{ textAlign:'center', fontSize:16, fontWeight:700, marginBottom:4 }}>{selectedEnveloppe}</div>
            <div style={{ textAlign:'center', fontSize:13, color:'var(--text-sub)', marginBottom:20 }}>{mois}</div>
            {[
              { label:'Versement (€)', key:'versement', color:'var(--baptiste)' },
              { label:'Retrait (€)', key:'retrait', color:'#e53935' },
              { label:'Valorisation totale (€)', key:'valorisation', color:'var(--green)' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom:14 }}>
                <div style={{ fontSize:13, fontWeight:600, color:f.color, marginBottom:6 }}>{f.label}</div>
                <input type="number" value={(saisieForm as any)[f.key]}
                  onChange={e => setSaisieForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder="0"
                  style={{ width:'100%', background:'#f2f2f2', border:'none', borderRadius:10, padding:'12px 14px', fontSize:15, fontFamily:'DM Sans, sans-serif', outline:'none' }} />
              </div>
            ))}
            <div style={{ display:'flex', gap:10, marginTop:8 }}>
              <button onClick={() => setShowSaisie(false)} style={{ flex:1, padding:13, border:'1.5px solid var(--border)', borderRadius:12, background:'white', fontSize:15, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>Annuler</button>
              <button onClick={saveSaisie} style={{ flex:1, padding:13, border:'none', borderRadius:12, background:'var(--green-btn)', color:'white', fontSize:15, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL OBJECTIFS */}
      {showConfig && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:90, display:'flex', alignItems:'flex-end', justifyContent:'center' }}
          onClick={() => setShowConfig(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background:'white', borderRadius:'24px 24px 0 0', width:'100%', maxWidth:430, padding:'20px 20px 40px', maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ width:36, height:4, background:'#ddd', borderRadius:2, margin:'0 auto 16px' }} />
            <div style={{ textAlign:'center', fontSize:16, fontWeight:700, marginBottom:20 }}>🎯 Objectifs fin 2026</div>
            {enveloppes.map(env => (
              <div key={env} style={{ marginBottom:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'var(--text-sub)' }}>{env}</div>
                  <button onClick={() => deleteEnveloppe(env)} style={{ background:'none', border:'none', color:'#e53935', fontSize:12, cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>Supprimer</button>
                </div>
                <input type="number" value={configForm[env] || ''}
                  onChange={e => setConfigForm((p: any) => ({ ...p, [env]: e.target.value }))}
                  placeholder="0"
                  style={{ width:'100%', background:'#f2f2f2', border:'none', borderRadius:10, padding:'12px 14px', fontSize:15, fontFamily:'DM Sans, sans-serif', outline:'none' }} />
              </div>
            ))}
            <div style={{ display:'flex', gap:10, marginTop:8 }}>
              <button onClick={() => setShowConfig(false)} style={{ flex:1, padding:13, border:'1.5px solid var(--border)', borderRadius:12, background:'white', fontSize:15, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>Annuler</button>
              <button onClick={saveConfig} style={{ flex:1, padding:13, border:'none', borderRadius:12, background:'var(--green-btn)', color:'white', fontSize:15, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL AJOUTER ENVELOPPE */}
      {showAddEnveloppe && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:90, display:'flex', alignItems:'flex-end', justifyContent:'center' }}
          onClick={() => setShowAddEnveloppe(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background:'white', borderRadius:'24px 24px 0 0', width:'100%', maxWidth:430, padding:'20px 20px 40px' }}>
            <div style={{ width:36, height:4, background:'#ddd', borderRadius:2, margin:'0 auto 16px' }} />
            <div style={{ textAlign:'center', fontSize:16, fontWeight:700, marginBottom:20 }}>Ajouter une enveloppe</div>
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:13, fontWeight:600, color:'var(--text-sub)', marginBottom:6 }}>Nom de l'enveloppe</div>
              <input value={newEnveloppe.nom} onChange={e => setNewEnveloppe(p => ({ ...p, nom: e.target.value }))}
                placeholder="Ex: SCPI"
                style={{ width:'100%', background:'#f2f2f2', border:'none', borderRadius:10, padding:'12px 14px', fontSize:15, fontFamily:'DM Sans, sans-serif', outline:'none' }} />
            </div>
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:13, fontWeight:600, color:'var(--text-sub)', marginBottom:6 }}>Objectif fin 2026 (€)</div>
              <input type="number" value={newEnveloppe.objectif} onChange={e => setNewEnveloppe(p => ({ ...p, objectif: e.target.value }))}
                placeholder="0"
                style={{ width:'100%', background:'#f2f2f2', border:'none', borderRadius:10, padding:'12px 14px', fontSize:15, fontFamily:'DM Sans, sans-serif', outline:'none' }} />
            </div>
            <div style={{ display:'flex', gap:10, marginTop:8 }}>
              <button onClick={() => setShowAddEnveloppe(false)} style={{ flex:1, padding:13, border:'1.5px solid var(--border)', borderRadius:12, background:'white', fontSize:15, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>Annuler</button>
              <button onClick={addEnveloppe} style={{ flex:1, padding:13, border:'none', borderRadius:12, background:'var(--green-btn)', color:'white', fontSize:15, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>Ajouter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}