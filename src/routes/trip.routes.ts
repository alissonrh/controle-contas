import express from 'express'
import { TripController } from '@/controllers/trip.controller'
import { authenticateToken } from '@/middleware/auth.middleware'

const router = express.Router()
export const tripController = new TripController()

router.post('/', authenticateToken, tripController.create)
router.get('/', authenticateToken, tripController.list)

export default router
