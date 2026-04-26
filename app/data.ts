export const MOIS = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre'
]

export const CATEGORIES_DEFAULT = [
  // FIXES - Communes
  { id:1, icone:'🏠', nom:'Loyer', type:'Fixe', pour:'Commun' },
  { id:2, icone:'💡', nom:'Électricité', type:'Fixe', pour:'Commun' },
  { id:3, icone:'🛡️', nom:'Assurance logement', type:'Fixe', pour:'Commun' },
  { id:4, icone:'🏦', nom:'Frais bancaires', type:'Fixe', pour:'Commun' },
  { id:5, icone:'🦺', nom:'Prévoyance', type:'Fixe', pour:'Commun' },
  { id:6, icone:'📱', nom:'Téléphones & Internet', type:'Fixe', pour:'Commun' },
  { id:7, icone:'📺', nom:'Abonnements', type:'Fixe', pour:'Commun' },
  // VARIABLES - Communes
  { id:8, icone:'🍎', nom:'Alimentation', type:'Variable', pour:'Commun' },
  { id:9, icone:'🚗', nom:'Transports', type:'Variable', pour:'Commun' },
  { id:10, icone:'🎉', nom:'Restaurants & Loisirs', type:'Variable', pour:'Commun' },
  { id:11, icone:'✈️', nom:'Vacances', type:'Variable', pour:'Commun' },
  { id:12, icone:'🎁', nom:'Cadeaux', type:'Variable', pour:'Commun' },
  // VARIABLES - Baptiste
  { id:13, icone:'👕', nom:'Habillement', type:'Variable', pour:'Baptiste' },
  { id:14, icone:'🏥', nom:'Santé', type:'Variable', pour:'Baptiste' },
  { id:15, icone:'📋', nom:'Impôts', type:'Variable', pour:'Baptiste' },
  { id:16, icone:'🎊', nom:'Événements', type:'Variable', pour:'Baptiste' },
  // VARIABLES - Lucile
  { id:17, icone:'👗', nom:'Habillement', type:'Variable', pour:'Lucile' },
  { id:18, icone:'🏥', nom:'Santé', type:'Variable', pour:'Lucile' },
  { id:19, icone:'📋', nom:'Impôts', type:'Variable', pour:'Lucile' },
  { id:20, icone:'🎊', nom:'Événements', type:'Variable', pour:'Lucile' },
]

export const data = {
  transactions: [],
  categories: CATEGORIES_DEFAULT,
  budgets: {} as Record<string, Record<string, { baptiste: number, lucile: number }>>,
  revenus: {
    Janvier:   { salaireBaptiste:0, ticketRestaurant:0, autresBaptiste:0, salaireLucile:0, autresLucile:0 },
    Février:   { salaireBaptiste:0, ticketRestaurant:0, autresBaptiste:0, salaireLucile:0, autresLucile:0 },
    Mars:      { salaireBaptiste:0, ticketRestaurant:0, autresBaptiste:0, salaireLucile:0, autresLucile:0 },
    Avril:     { salaireBaptiste:0, ticketRestaurant:0, autresBaptiste:0, salaireLucile:0, autresLucile:0 },
    Mai:       { salaireBaptiste:0, ticketRestaurant:0, autresBaptiste:0, salaireLucile:0, autresLucile:0 },
    Juin:      { salaireBaptiste:0, ticketRestaurant:0, autresBaptiste:0, salaireLucile:0, autresLucile:0 },
    Juillet:   { salaireBaptiste:0, ticketRestaurant:0, autresBaptiste:0, salaireLucile:0, autresLucile:0 },
    Août:      { salaireBaptiste:0, ticketRestaurant:0, autresBaptiste:0, salaireLucile:0, autresLucile:0 },
    Septembre: { salaireBaptiste:0, ticketRestaurant:0, autresBaptiste:0, salaireLucile:0, autresLucile:0 },
    Octobre:   { salaireBaptiste:0, ticketRestaurant:0, autresBaptiste:0, salaireLucile:0, autresLucile:0 },
    Novembre:  { salaireBaptiste:0, ticketRestaurant:0, autresBaptiste:0, salaireLucile:0, autresLucile:0 },
    Décembre:  { salaireBaptiste:0, ticketRestaurant:0, autresBaptiste:0, salaireLucile:0, autresLucile:0 },
  },
  epargnes: [],
}