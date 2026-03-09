import { Router } from 'express'
import { ajouterFavori, mesFavoris } from '../controllers/favori.controller.js'
import { verifierToken } from '../middlewares/auth.middleware.js'

const router = Router()
router.get('/', verifierToken, mesFavoris)
router.post('/', verifierToken, ajouterFavori)
export default router