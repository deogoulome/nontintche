import { Router } from 'express'
import { signalerAnnonce } from '../controllers/signalement.controller.js'
import { verifierToken } from '../middlewares/auth.middleware.js'
import { regleSignalement, valider } from '../middlewares/validation.middleware.js'

const router = Router()
router.post('/', verifierToken, regleSignalement, valider, signalerAnnonce)
export default router