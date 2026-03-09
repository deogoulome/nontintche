import { Router } from 'express'
import { ajouterAvis, supprimerAvis } from '../controllers/avis.controller.js'
import { verifierToken } from '../middlewares/auth.middleware.js'

const router = Router()
router.post('/', verifierToken, ajouterAvis)
router.delete('/:id', verifierToken, supprimerAvis)
export default router