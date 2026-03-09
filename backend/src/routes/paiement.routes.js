import express from 'express'
import {
  initierPaiement,
  verifierPaiement,
  webhookFedaPay,
  getHistoriquePaiements
} from '../controllers/paiement.controller.js'
import { verifierToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/', verifierToken, initierPaiement)
router.get('/historique', verifierToken, getHistoriquePaiements)
router.get('/verifier/:transaction_id', verifierToken, verifierPaiement)
router.post('/webhook', webhookFedaPay)

export default router