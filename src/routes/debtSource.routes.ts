import express from 'express'
import {
  createDebtSource,
  deleteDebtSource,
  getAllDebtSources,
  getDebtSourceById,
  updateDebtSource
} from '../controllers/debtSource.controller'
import { authenticateToken } from '../middleware/auth.middleware'

const router = express.Router()

router.post('/', authenticateToken, createDebtSource)
router.get('/', authenticateToken, getAllDebtSources)
router.get('/:id', authenticateToken, getDebtSourceById)
router.put('/:id', authenticateToken, updateDebtSource)
router.delete('/:id', authenticateToken, deleteDebtSource)

export default router
