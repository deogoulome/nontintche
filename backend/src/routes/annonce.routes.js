import { Router } from 'express'
import { creerAnnonce, listerAnnonces, detailAnnonce, mesAnnonces, modifierAnnonce, supprimerAnnonce, renouvelerAnnonce } from '../controllers/annonce.controller.js'
import { verifierToken, estProprietaire } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/upload.middleware.js'
import { uploadImages } from '../controllers/upload.controller.js'

const router = Router()

router.get('/', verifierToken, listerAnnonces)
router.get('/mes-annonces', verifierToken, estProprietaire, mesAnnonces)
router.get('/:id', verifierToken, detailAnnonce)
router.post('/', verifierToken, estProprietaire, creerAnnonce)
router.put('/:id', verifierToken, estProprietaire, modifierAnnonce)
router.delete('/:id', verifierToken, estProprietaire, supprimerAnnonce)
router.post('/:id/renouveler', verifierToken, estProprietaire, renouvelerAnnonce)

// Ajoutez cette ligne avec les autres routes :
router.post('/:id/images', verifierToken, estProprietaire, upload.array('images', 5), uploadImages)

export default router
