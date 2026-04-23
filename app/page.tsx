'use client'

import { useState } from 'react'
import Transactions from './components/Transactions'
import Categories from './components/Categories'
import Revenus from './components/Revenus'
import Epargnes from './components/Epargnes'
import { data } from './data'

export default function Home() {
  const [tab, setTab] = useState('transactions')
  const [appData, setAppData] = useState(data)

  return (
    <div style={{
      maxWidth: 430,
      margin: '0 auto',
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>

      {/* CONTENU */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 70 }}>
        {tab === 'transactions' && <Transactions data={appData} setData={setAppData} />}
        {tab === 'categories' && <Categories data={appData} setData={setAppData} />}
        {tab === 'revenus' && <Revenus data={appData} setData={setAppData} />}
        {tab === 'epargnes' && <Epargnes data={appData} setData={setAppData} />}
      </div>

      {/* BOTTOM NAV */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        display: 'flex',
        background: 'white',
        borderTop: '1px solid var(--border)',
        paddingBottom: 16,
        zIndex: 50,
      }}>
        {[
          { id: 'transactions', label: 'Transactions', icon: '📋' },
          { id: 'categories', label: 'Catégories', icon: '🎯' },
          { id: 'revenus', label: 'Revenus', icon: '💰' },
          { id: 'epargnes', label: 'Epargnes', icon: '🏛️' },
        ].map(item => (
          <button key={item.id} onClick={() => setTab(item.id)} style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            padding: '10px 0 0',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: 11,
            fontWeight: 500,
            fontFamily: 'DM Sans, sans-serif',
            color: tab === item.id ? 'var(--green)' : 'var(--text-sub)',
          }}>
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

    </div>
  )
}