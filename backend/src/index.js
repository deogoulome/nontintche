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

// ── Cron : expire les annonces chaque nuit à minuit ──────────────────────────
cron.schedule('0 0 * * *', async () => {
  try {
    const result = await prisma.annonce.updateMany({
      where: { statut: 'active', date_fin_annonce: { lt: new Date() } },
      data: { statut: 'expiree' }
    })
    if (result.count > 0) {
      console.log(`✅ Cron expiration: ${result.count} annonce(s) expirée(s)`)
    }
  } catch (err) {
    console.error('❌ Cron expiration:', err.message)
  }
})

// ── Cron : alerte annonces qui expirent dans 3 jours (chaque matin à 8h) ─────
cron.schedule('0 8 * * *', async () => {
  try {
    const dans3jours = new Date()
    dans3jours.setDate(dans3jours.getDate() + 3)
    const maintenant = new Date()

    const annonces = await prisma.annonce.findMany({
      where: {
        statut: 'active',
        date_fin_annonce: {
          gte: maintenant,
          lte: dans3jours,
        }
      },
      include: {
        utilisateur: { select: { nom: true, prenom: true, telephone: true } }
      }
    })

    if (annonces.length > 0) {
      console.log(`⚠️  Cron rappel: ${annonces.length} annonce(s) expirent dans 3 jours:`)
      annonces.forEach(a => {
        console.log(`   - [${a.id}] "${a.titre}" — propriétaire: ${a.utilisateur.prenom} ${a.utilisateur.nom} (${a.utilisateur.telephone}) — expire le ${a.date_fin_annonce?.toISOString().split('T')[0]}`)
      })
      // TODO: remplacer ce log par un envoi SMS via l'API de votre choix
    }
  } catch (err) {
    console.error('❌ Cron rappel expiration:', err.message)
  }
})
