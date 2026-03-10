import prisma from './src/prisma.js'

await prisma.typechambre.createMany({ data: [
  { libelle: 'Studio' }, { libelle: 'Chambre simple' },
  { libelle: 'Chambre moderne' }, { libelle: 'Appartement' }, { libelle: 'Villa' }
], skipDuplicates: true })

await prisma.typeannonce.createMany({ data: [
  { libelle: 'Basique', duree_jours: 7, prix: 500 },
  { libelle: 'Standard', duree_jours: 30, prix: 1500 },
  { libelle: 'Premium', duree_jours: 90, prix: 3500 }
], skipDuplicates: true })

await prisma.commodite.createMany({ data: [
  { libelle: 'WiFi' }, { libelle: 'Eau courante' }, { libelle: 'Electricité' },
  { libelle: 'Climatisation' }, { libelle: 'Parking' }, { libelle: 'Gardien' },
  { libelle: 'Cuisine équipée' }
], skipDuplicates: true })

console.log('✅ Données insérées avec succès !')
process.exit(0)