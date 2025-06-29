import { Router } from 'express'
import { authenticateToken } from '@/middleware/auth.middleware'
import { InstallmentController } from '@/controllers/Installment.controller'

const router = Router()
const controller = new InstallmentController()

router.post('/', authenticateToken, controller.create)
router.get('/:debtId', authenticateToken, controller.listByDebt)
router.patch('/:id/pay', authenticateToken, controller.markAsPaid)

export default router
