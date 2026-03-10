import prisma from './src/prisma.js'
import bcrypt from 'bcrypt'

const hash = await bcrypt.hash('AdminNTC2026!', 10)

await prisma.utilisateur.create({
  data: {
    nom: 'Admin',
    prenom: 'NonTinTché',
    telephone: '97000000',
    login: 'admin',
    motdepasse: hash,
    role: 'admin',
    adresse: 'Cotonou, Bénin'
  }
})

console.log('✅ Compte admin créé !')
process.exit(0)