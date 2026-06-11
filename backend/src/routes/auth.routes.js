import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { inscription, connexion } from '../controllers/auth.controller.js'
import { regleInscription, regleConnexion, valider } from '../middlewares/validation.middleware.js'

const router = Router()

const limiterConnexion = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Trop de tentatives. Reessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const limiterInscription = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { message: 'Trop de creations de compte. Reessayez dans 1 heure.' },
  standardHeaders: true,
  legacyHeaders: false,
})

router.post('/inscription', limiterInscription, regleInscription, valider, inscription)
router.post('/connexion', limiterConnexion, regleConnexion, valider, connexion)

export default router
