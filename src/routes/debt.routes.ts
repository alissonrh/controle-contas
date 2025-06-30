import { Router } from 'express'
import { authenticateToken } from '@/middleware/auth.middleware'
import { DebtController } from '@/controllers/debt.controller'

const router = Router()
const debtController = new DebtController()

router.post('/', authenticateToken, debtController.createDebt)
router.get('/', authenticateToken, debtController.getAllDebts)

export default router
