import { Router } from 'express'
import {
  dashboardAdmin, listeUtilisateurs, toggleUtilisateur,
  listeAnnoncesAdmin, toggleAnnonce,
  listeSignalements, traiterSignalement
} from '../controllers/admin.controller.js'
import { verifierToken, estAdmin } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/dashboard', verifierToken, estAdmin, dashboardAdmin)
router.get('/utilisateurs', verifierToken, estAdmin, listeUtilisateurs)
router.put('/utilisateurs/:id/toggle', verifierToken, estAdmin, toggleUtilisateur)
router.get('/annonces', verifierToken, estAdmin, listeAnnoncesAdmin)
router.put('/annonces/:id/toggle', verifierToken, estAdmin, toggleAnnonce)
router.get('/signalements', verifierToken, estAdmin, listeSignalements)
router.put('/signalements/:id', verifierToken, estAdmin, traiterSignalement)

export default router