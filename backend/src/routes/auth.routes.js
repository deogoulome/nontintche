import { Router } from 'express'
import { inscription, connexion } from '../controllers/auth.controller.js'

const router = Router()

router.post('/inscription', inscription)
router.post('/connexion', connexion)

export default router