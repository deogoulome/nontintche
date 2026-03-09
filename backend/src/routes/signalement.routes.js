import { Router } from 'express'
import { signalerAnnonce } from '../controllers/signalement.controller.js'
import { verifierToken } from '../middlewares/auth.middleware.js'

const router = Router()
router.post('/', verifierToken, signalerAnnonce)
export default router