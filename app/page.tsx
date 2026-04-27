'use client'

import { useState, useEffect } from 'react'
import Transactions from './components/Transactions'
import Categories from './components/Categories'
import Revenus from './components/Revenus'
import Epargnes from './components/Epargnes'
import Repas from './components/Repas'
import Calendrier from './components/Calendrier'
import { loadData } from './sheets'
import { data as defaultData } from './data'

const APPS = [
  { id: 'budget', icon: '🏠', label: 'Budget' },
  { id: 'epargnes', icon: '💰', label: 'Épargnes' },
  { id: 'repas', icon: '🍽️', label: 'Repas' },
  { id: 'calendrier', icon: '📅', label: 'Calendrier' },
]

const BUDGET_TABS = [
  { id: 'transactions', label: 'Transactions', icon: '📋' },
  { id: 'categories', label: 'Catégories', icon: '🎯' },
  { id: 'revenus', label: 'Revenus', icon: '💰' },
]

export default function Home() {
  const [app, setApp] = useState('budget')
  const [tab, setTab] = useState('transactions')
  const [appData, setAppData] = useState(defaultData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    const [appHash, tabHash] = hash.split('/')
    const validApps = APPS.map(a => a.id)
    if (validApps.includes(appHash)) setApp(appHash)
    const validTabs = BUDGET_TABS.map(t => t.id)
    if (tabHash && validTabs.includes(tabHash)) setTab(tabHash)
  }, [])

  useEffect(() => {
    window.location.hash = app === 'budget' ? `budget/${tab}` : app
  }, [app, tab])

  useEffect(() => {
    loadData()
      .then(d => setAppData(d))
      .catch(e => console.error('Erreur chargement:', e))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', flexDirection:'column', gap:16 }}>
      <div style={{ fontSize:40 }}>🏠</div>
      <div style={{ fontSize:16, color:'var(--text-sub)', fontFamily:'DM Sans, sans-serif' }}>Chargement...</div>
    </div>
  )

  return (
    <div style={{ maxWidth:430, margin:'0 auto', minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column' }}>

      {/* TOP NAV — APPS */}
      <div style={{
        background:'white', borderBottom:'1px solid var(--border)',
        display:'flex', padding:'12px 20px 0', gap:0,
        position:'sticky', top:0, zIndex:40,
      }}>
        {APPS.map(a => (
          <button key={a.id} onClick={() => setApp(a.id)} style={{
            flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4,
            padding:'6px 0 10px', border:'none', background:'none', cursor:'pointer',
            fontFamily:'DM Sans, sans-serif', fontSize:10, fontWeight:600,
            color: app === a.id ? 'var(--green)' : 'var(--text-sub)',
            borderBottom: app === a.id ? '2px solid var(--green)' : '2px solid transparent',
            transition:'all 0.2s',
          }}>
            <span style={{ fontSize:20 }}>{a.icon}</span>
            {a.label}
          </button>
        ))}
      </div>

      {/* CONTENU */}
      <div style={{ flex:1, overflowY:'auto', paddingBottom: app === 'budget' ? 70 : 20 }}>
        {app === 'budget' && (
          <>
            {tab === 'transactions' && <Transactions data={appData} setData={setAppData} />}
            {tab === 'categories' && <Categories data={appData} setData={setAppData} />}
            {tab === 'revenus' && <Revenus data={appData} setData={setAppData} />}
          </>
        )}
        {app === 'epargnes' && <Epargnes data={appData} setData={setAppData} />}
        {app === 'repas' && <Repas />}
        {app === 'calendrier' && <Calendrier />}
      </div>

      {/* BOTTOM NAV — seulement pour Budget */}
      {app === 'budget' && (
        <div style={{
          position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)',
          width:'100%', maxWidth:430, display:'flex', background:'white',
          borderTop:'1px solid var(--border)', paddingBottom:16, zIndex:50,
        }}>
          {BUDGET_TABS.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} style={{
              flex:1, display:'flex', flexDirection:'column', alignItems:'center',
              gap:3, padding:'10px 0 0', border:'none', background:'none', cursor:'pointer',
              fontSize:11, fontWeight:500, fontFamily:'DM Sans, sans-serif',
              color: tab === item.id ? 'var(--green)' : 'var(--text-sub)',
            }}>
              <span style={{ fontSize:22 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}