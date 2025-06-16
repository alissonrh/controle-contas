import express from 'express'
import { createDebt } from '../controllers/debt.controller'
import { authenticateToken } from '../middleware/auth.middleware'

const router = express.Router()

router.post('/', authenticateToken, createDebt)

export default router
