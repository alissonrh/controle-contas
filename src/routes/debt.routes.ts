import { Router } from 'express'
import { authenticateToken } from '@/middleware/auth.middleware'
import { DebtController } from '@/controllers/debt.controller'

const router = Router()
const debtController = new DebtController()

router.post('/debts', authenticateToken, debtController.createDebt)

export default router
