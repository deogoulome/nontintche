import { Router } from 'express'
import { ajouterAvis, supprimerAvis } from '../controllers/avis.controller.js'
import { verifierToken } from '../middlewares/auth.middleware.js'
import { regleAvis, regleIdParam, valider } from '../middlewares/validation.middleware.js'

const router = Router()
router.post('/', verifierToken, regleAvis, valider, ajouterAvis)
router.delete('/:id', verifierToken, regleIdParam, valider, supprimerAvis)
export default router