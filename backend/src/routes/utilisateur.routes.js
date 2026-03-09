import { Router } from 'express'
import { monProfil, modifierProfil, changerMotDePasse } from '../controllers/utilisateur.controller.js'
import { verifierToken } from '../middlewares/auth.middleware.js'


const router = Router()
router.get('/profil', verifierToken, monProfil)
router.put('/profil', verifierToken, modifierProfil)
router.put('/changer-mdp', verifierToken, changerMotDePasse)
export default router





