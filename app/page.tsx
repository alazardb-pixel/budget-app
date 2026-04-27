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
  { id: 'budget', icon: '🏠', label: 'Budget du foyer' },
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
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    const [appHash, tabHash] = hash.split('/')
    if (APPS.find(a => a.id === appHash)) setApp(appHash)
    if (tabHash && BUDGET_TABS.find(t => t.id === tabHash)) setTab(tabHash)
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

  function switchApp(id: string) {
    setApp(id)
    setMenuOpen(false)
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 40 }}>🏠</div>
      <div style={{ fontSize: 16, color: 'var(--text-sub)', fontFamily: 'DM Sans, sans-serif' }}>Chargement...</div>
    </div>
  )

  return (
    <div style={{ maxWidth: 430, margin: '0 auto', minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', position: 'relative' }}>

      {/* MENU OVERLAY */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex' }}>
          {/* Fond sombre */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} onClick={() => setMenuOpen(false)} />
          {/* Menu latéral */}
          <div style={{
            position: 'relative', width: 280, background: 'white', height: '100%',
            zIndex: 101, display: 'flex', flexDirection: 'column',
            boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
            animation: 'slideRight 0.25s ease',
          }}>
            <style>{`@keyframes slideRight { from { transform: translateX(-100%); } to { transform: translateX(0); } }`}</style>
            <div style={{ padding: '48px 24px 24px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>Menu</div>
            </div>
            {APPS.map(a => (
              <button key={a.id} onClick={() => switchApp(a.id)} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '18px 24px', border: 'none', background: app === a.id ? 'var(--green-bg)' : 'white',
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', textAlign: 'left',
                borderLeft: app === a.id ? '3px solid var(--green)' : '3px solid transparent',
              }}>
                <span style={{ fontSize: 24 }}>{a.icon}</span>
                <span style={{ fontSize: 16, fontWeight: app === a.id ? 700 : 500, color: app === a.id ? 'var(--green)' : 'var(--text)' }}>
                  {a.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TOP BAR */}
      <div style={{
        background: 'white', borderBottom: '1px solid var(--border)',
        padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 40,
      }}>
        <button onClick={() => setMenuOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, padding: 0, color: 'var(--text)' }}>
          ☰
        </button>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
          {APPS.find(a => a.id === app)?.icon} {APPS.find(a => a.id === app)?.label}
        </span>
        <span style={{ width: 28 }} />
      </div>

      {/* CONTENU */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: app === 'budget' ? 70 : 20 }}>
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

      {/* BOTTOM NAV — seulement Budget */}
      {app === 'budget' && (
        <div style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 430, display: 'flex', background: 'white',
          borderTop: '1px solid var(--border)', paddingBottom: 16, zIndex: 50,
        }}>
          {BUDGET_TABS.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 3, padding: '10px 0 0', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: 11, fontWeight: 500, fontFamily: 'DM Sans, sans-serif',
              color: tab === item.id ? 'var(--green)' : 'var(--text-sub)',
            }}>
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}