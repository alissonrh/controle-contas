import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.middleware'
import { DebtSourceController } from '../controllers/debtSource.controller'

const router = Router()
const controller = new DebtSourceController()

router.post('/', authenticateToken, controller.createDebtSource)
router.get('/', authenticateToken, controller.getAllDebtSources)
router.get('/:id', authenticateToken, controller.getDebtSourceById)
router.patch('/:id', authenticateToken, controller.updateDebtSource)
router.delete('/:id', authenticateToken, controller.deleteDebtSource)

export default router
