import express from 'express'
import { tripController } from '@/controllers/trip.controller'
import { authenticateToken } from '@/middleware/auth.middleware'

const router = express.Router()

router.post('/', authenticateToken, tripController.create)
router.get('/', authenticateToken, tripController.list)

export default router
