export async function loadData() {
  const res = await fetch('/api/sheets')
  if (!res.ok) throw new Error('Erreur chargement données')
  return res.json()
}

export async function saveTransactions(transactions: any[]) {
  const values = transactions.map(t => [
    t.mois, t.cat, t.libelle, t.montant, t.pour, t.payepar
  ])
  await fetch('/api/sheets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sheet: 'Transactions', values })
  })
}

export async function saveCategories(categories: any[]) {
  const values = categories.map(c => [
    c.icone, c.nom, c.budget, c.type
  ])
  await fetch('/api/sheets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sheet: 'Catégories', values })
  })
}

export async function saveRevenus(revenus: any) {
  const values = Object.entries(revenus).map(([mois, v]: any) => [
    mois, v.baptiste, v.lucile
  ])
  await fetch('/api/sheets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sheet: 'Revenus', values })
  })
}

export async function saveEpargnes(epargnes: any[]) {
  const values = epargnes.map(e => [
    e.nom, e.objectif, e.epargne
  ])
  await fetch('/api/sheets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sheet: 'Epargnes', values })
  })
}