// import express from 'express'
// import cors from 'cors'
// import dotenv from 'dotenv'
// import path from 'path'
// import { fileURLToPath } from 'url'

// import cron from 'node-cron'
// import adminRoutes from './routes/admin.routes.js'

// import authRoutes from './routes/auth.routes.js'
// import annonceRoutes from './routes/annonce.routes.js'
// import utilisateurRoutes from './routes/utilisateur.routes.js'
// import paiementRoutes from './routes/paiement.routes.js'
// import favoriRoutes from './routes/favori.routes.js'
// import avisRoutes from './routes/avis.routes.js'
// import signalementRoutes from './routes/signalement.routes.js'
// import typeannonceRoutes from './routes/typeannonce.routes.js'
// import commoditeRoutes from './routes/commodite.routes.js'

// dotenv.config()

// const app = express()
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// app.use(cors())
// app.use(express.json())
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// // Routes
// app.use('/api/auth', authRoutes)
// app.use('/api/annonces', annonceRoutes)
// app.use('/api/utilisateurs', utilisateurRoutes)
// app.use('/api/paiements', paiementRoutes)
// // Ajouter après les routes existantes :
// app.use('/api/favoris', favoriRoutes)
// app.use('/api/avis', avisRoutes)
// app.use('/api/signalements', signalementRoutes)
// app.use('/api/typeannonces', typeannonceRoutes)
// app.use('/api/commodites', commoditeRoutes)
// // Route admin
// app.use('/api/admin', adminRoutes)

// app.get('/', (req, res) => {
//   res.json({ message: 'API Location Chambres 🚀' })
// })

// const PORT = process.env.PORT || 3000
// app.listen(PORT, () => {
//   console.log(`✅ Serveur démarré sur http://localhost:${PORT}`)
// })



// // Cron job — expire les annonces chaque nuit à minuit
// cron.schedule('0 0 * * *', async () => {
//   try {
//     const result = await prisma.annonce.updateMany({
//       where: {
//         statut: 'active',
//         date_fin_annonce: { lt: new Date() }
//       },
//       data: { statut: 'expiree' }
//     })
//     console.log(`✅ Cron: ${result.count} annonce(s) expirée(s)`)
//   } catch (err) {
//     console.error('❌ Cron erreur:', err.message)
//   }
// })

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import cron from 'node-cron'
import prisma from './prisma.js'
import adminRoutes from './routes/admin.routes.js'

import authRoutes from './routes/auth.routes.js'
import annonceRoutes from './routes/annonce.routes.js'
import utilisateurRoutes from './routes/utilisateur.routes.js'
import paiementRoutes from './routes/paiement.routes.js'
import favoriRoutes from './routes/favori.routes.js'
import avisRoutes from './routes/avis.routes.js'
import signalementRoutes from './routes/signalement.routes.js'
import typeannonceRoutes from './routes/typeannonce.routes.js'
import commoditeRoutes from './routes/commodite.routes.js'

dotenv.config()

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ✅ CORS mis à jour pour la production
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://nontintche.vercel.app',
  ],
  credentials: true
}))

app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/annonces', annonceRoutes)
app.use('/api/utilisateurs', utilisateurRoutes)
app.use('/api/paiements', paiementRoutes)
app.use('/api/favoris', favoriRoutes)
app.use('/api/avis', avisRoutes)
app.use('/api/signalements', signalementRoutes)
app.use('/api/typeannonces', typeannonceRoutes)
app.use('/api/commodites', commoditeRoutes)
app.use('/api/admin', adminRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'API NonTinTché 🚀' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`)
})

// Cron job — expire les annonces chaque nuit à minuit
cron.schedule('0 0 * * *', async () => {
  try {
    const result = await prisma.annonce.updateMany({
      where: {
        statut: 'active',
        date_fin_annonce: { lt: new Date() }
      },
      data: { statut: 'expiree' }
    })
    console.log(`✅ Cron: ${result.count} annonce(s) expirée(s)`)
  } catch (err) {
    console.error('❌ Cron erreur:', err.message)
  }
})