import { Router } from 'express'
import { creerAnnonce, listerAnnonces, detailAnnonce, mesAnnonces, modifierAnnonce, supprimerAnnonce, renouvelerAnnonce } from '../controllers/annonce.controller.js'
import { verifierToken, estProprietaire } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/upload.middleware.js'
import { uploadImages } from '../controllers/upload.controller.js'
import { regleAnnonce, regleIdParam, valider } from '../middlewares/validation.middleware.js'

const router = Router()

// Routes specifiques AVANT les routes avec parametres
router.get('/mes-annonces', verifierToken, estProprietaire, mesAnnonces)

// Routes publiques
router.get('/', listerAnnonces)
router.get('/:id', regleIdParam, valider, detailAnnonce)

// Routes protegees
router.post('/', verifierToken, estProprietaire, regleAnnonce, valider, creerAnnonce)
router.put('/:id', verifierToken, estProprietaire, regleIdParam, valider, modifierAnnonce)
router.delete('/:id', verifierToken, estProprietaire, regleIdParam, valider, supprimerAnnonce)
router.post('/:id/renouveler', verifierToken, estProprietaire, regleIdParam, valider, renouvelerAnnonce)
router.post('/:id/images', verifierToken, estProprietaire, regleIdParam, valider, upload.array('images', 5), uploadImages)

export default router
