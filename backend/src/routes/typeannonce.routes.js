import { Router } from 'express'
import prisma from '../prisma.js'
import { verifierToken } from '../middlewares/auth.middleware.js'

const router = Router()
router.get('/', verifierToken, async (req, res) => {
  const data = await prisma.typeannonce.findMany()
  res.json(data)
})
export default router