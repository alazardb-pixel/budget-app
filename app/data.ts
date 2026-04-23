export const MOIS = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre'
]

export const data = {
  transactions: [
    { id:1, mois:'Janvier', cat:'🏠 Loyer', libelle:'Loyer Janvier', montant:904, pour:'Commun', payepar:'Baptiste' },
    { id:2, mois:'Janvier', cat:'🛒 Alimentation', libelle:'Courses Carrefour', montant:55.20, pour:'Baptiste', payepar:'Lucile' },
    { id:3, mois:'Janvier', cat:'⚡ Électricité', libelle:'Facture EDF', montant:35.51, pour:'Lucile', payepar:'Baptiste' },
    { id:4, mois:'Janvier', cat:'🚗 Transport', libelle:'Plein essence', montant:104, pour:'Baptiste', payepar:'Lucile' },
    { id:5, mois:'Janvier', cat:'🍔 Loisirs', libelle:'Restaurant', montant:18.66, pour:'Commun', payepar:'Baptiste' },
    { id:6, mois:'Janvier', cat:'🛒 Alimentation', libelle:'courses', montant:69.45, pour:'Commun', payepar:'Baptiste' },
    { id:7, mois:'Février', cat:'⚡ Électricité', libelle:'EDF', montant:35.51, pour:'Commun', payepar:'Baptiste' },
    { id:8, mois:'Mars', cat:'🍔 Loisirs', libelle:'test ajout', montant:550, pour:'Baptiste', payepar:'Baptiste' },
    { id:9, mois:'Mai', cat:'🍔 Loisirs', libelle:'Traiteur', montant:12500, pour:'Commun', payepar:'Baptiste' },
  ],
  categories: [
    { id:1, icone:'🏠', nom:'Loyer', budget:904, type:'Fixe' },
    { id:2, icone:'🛒', nom:'Alimentation', budget:400, type:'Variable' },
    { id:3, icone:'⚡', nom:'Électricité', budget:50, type:'Fixe' },
    { id:4, icone:'🚗', nom:'Transport', budget:150, type:'Variable' },
    { id:5, icone:'🍔', nom:'Loisirs', budget:200, type:'Variable' },
    { id:6, icone:'📊', nom:'Épargne', budget:300, type:'Fixe' },
  ],
  revenus: {
    Janvier:   { baptiste: 2700, lucile: 3000 },
    Février:   { baptiste: 2670, lucile: 3200 },
    Mars:      { baptiste: 2470, lucile: 3400 },
    Avril:     { baptiste: 2570, lucile: 2600 },
    Mai:       { baptiste: 0, lucile: 0 },
    Juin:      { baptiste: 0, lucile: 0 },
    Juillet:   { baptiste: 0, lucile: 0 },
    Août:      { baptiste: 0, lucile: 0 },
    Septembre: { baptiste: 0, lucile: 0 },
    Octobre:   { baptiste: 0, lucile: 0 },
    Novembre:  { baptiste: 0, lucile: 0 },
    Décembre:  { baptiste: 0, lucile: 0 },
  },
  epargnes: [
    { id:1, nom:'Vacances', objectif:3000, epargne:850 },
    { id:2, nom:'Voiture', objectif:10000, epargne:2400 },
    { id:3, nom:'Urgences', objectif:5000, epargne:5000 },
  ],
}