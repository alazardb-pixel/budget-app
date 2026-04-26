import { google } from 'googleapis'
import { NextResponse } from 'next/server'

const SHEET_ID = process.env.GOOGLE_SHEET_ID!

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}

export async function GET() {
  try {
    const auth = getAuth()
    const sheets = google.sheets({ version: 'v4', auth })

    const [tx, cats, rev, budgets, epBaptiste, epConfig] = await Promise.all([
      sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: 'Transactions!A2:G' }),
      sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: 'Catégories!A2:D' }),
      sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: 'Revenus!A2:F' }),
      sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: 'Budgets!A2:D' }),
      sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: 'Epargnes_Baptiste!A2:E' }),
      sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: 'Epargnes_Config!A2:C' }),
    ])

    const transactions = (tx.data.values || []).map((r, i) => ({
      id: i + 1,
      mois: r[0] || '',
      cat: r[1] || '',
      libelle: r[2] || '',
      montant: parseFloat(r[3]?.replace(',', '.')) || 0,
      pour: r[4] || '',
      payepar: r[5] || '',
    }))

    const categories = (cats.data.values || []).length > 0
      ? (cats.data.values || []).map((r, i) => ({
          id: i + 1,
          icone: r[0] || '',
          nom: r[1] || '',
          type: r[2] || 'Variable',
          pour: r[3] || 'Commun',
        }))
      : (await import('../../data')).CATEGORIES_DEFAULT

    const MOIS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
    const revenus: any = {}
    MOIS.forEach(m => revenus[m] = { salaireBaptiste:0, ticketRestaurant:0, autresBaptiste:0, salaireLucile:0, autresLucile:0 })
    ;(rev.data.values || []).forEach(r => {
      if (r[0]) revenus[r[0]] = {
        salaireBaptiste: parseFloat(r[1]?.replace(',', '.')) || 0,
        ticketRestaurant: parseFloat(r[2]?.replace(',', '.')) || 0,
        autresBaptiste: parseFloat(r[3]?.replace(',', '.')) || 0,
        salaireLucile: parseFloat(r[4]?.replace(',', '.')) || 0,
        autresLucile: parseFloat(r[5]?.replace(',', '.')) || 0,
      }
    })

    const budgetsData: any = {}
    ;(budgets.data.values || []).forEach(r => {
      const [mois, cat, baptiste, lucile] = r
      if (!mois || !cat) return
      if (!budgetsData[mois]) budgetsData[mois] = {}
      budgetsData[mois][cat] = {
        baptiste: parseFloat(baptiste?.replace(',', '.')) || 0,
        lucile: parseFloat(lucile?.replace(',', '.')) || 0,
      }
    })

    // Config enveloppes : { baptiste: { 'Livret A': 8000, ... } }
    const epargneConfig: any = { baptiste: {}, lucile: {} }
    ;(epConfig.data.values || []).forEach(r => {
      const [personne, enveloppe, objectif] = r
      if (!personne || !enveloppe) return
      const key = personne.toLowerCase()
      epargneConfig[key][enveloppe] = parseFloat(objectif?.replace(',', '.')) || 0
    })

    // Si config vide, mettre defaults Baptiste
    if (Object.keys(epargneConfig.baptiste).length === 0) {
      epargneConfig.baptiste = {
        'Livret A': 8000, 'AV': 1200, 'PEE': 300,
        'PEA': 23000, 'CTO': 1000, 'Crypto': 1000
      }
    }

    // Données épargne Baptiste : { 'Janvier': { 'Livret A': { versement, retrait, valorisation } } }
    const epargnesBaptiste: any = {}
    ;(epBaptiste.data.values || []).forEach(r => {
      const [mois, enveloppe, versement, retrait, valorisation] = r
      if (!mois || !enveloppe) return
      if (!epargnesBaptiste[mois]) epargnesBaptiste[mois] = {}
      epargnesBaptiste[mois][enveloppe] = {
        versement: parseFloat(versement?.replace(',', '.')) || 0,
        retrait: parseFloat(retrait?.replace(',', '.')) || 0,
        valorisation: parseFloat(valorisation?.replace(',', '.')) || 0,
      }
    })

    return NextResponse.json({
      transactions, categories, revenus, budgets: budgetsData,
      epargnesBaptiste, epargneConfig,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { sheet, values } = await req.json()
    const auth = getAuth()
    const sheets = google.sheets({ version: 'v4', auth })

    const ranges: any = {
      Transactions: 'Transactions!A2:G',
      Catégories: 'Catégories!A2:D',
      Revenus: 'Revenus!A2:F',
      Budgets: 'Budgets!A2:D',
      Epargnes_Baptiste: 'Epargnes_Baptiste!A2:E',
      Epargnes_Config: 'Epargnes_Config!A2:C',
    }

    await sheets.spreadsheets.values.clear({ spreadsheetId: SHEET_ID, range: ranges[sheet] })
    if (values.length > 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: ranges[sheet],
        valueInputOption: 'RAW',
        requestBody: { values },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}