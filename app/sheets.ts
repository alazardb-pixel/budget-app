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
    c.icone, c.nom, c.type, c.pour
  ])
  await fetch('/api/sheets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sheet: 'Catégories', values })
  })
}

export async function saveBudgets(budgets: any) {
  const values: any[] = []
  Object.entries(budgets).forEach(([mois, cats]: any) => {
    Object.entries(cats).forEach(([cat, vals]: any) => {
      values.push([mois, cat, vals.baptiste || 0, vals.lucile || 0])
    })
  })
  await fetch('/api/sheets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sheet: 'Budgets', values })
  })
}

export async function saveRevenus(revenus: any) {
  const MOIS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
  const values = MOIS.map(m => [
    m,
    revenus[m]?.salaireBaptiste || 0,
    revenus[m]?.ticketRestaurant || 0,
    revenus[m]?.autresBaptiste || 0,
    revenus[m]?.salaireLucile || 0,
    revenus[m]?.autresLucile || 0,
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