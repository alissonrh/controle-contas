import { RequestHandler } from 'express'
import { handleError } from '@/utils/funcs/handleError'
import { tripService } from '@/service/trip.service'
import { createTripSchema } from '@/validators/trip.validation'

export const tripController: {
  create: RequestHandler
  list: RequestHandler
} = {
  create: async (req, res) => {
    try {
      const validated = createTripSchema.parse(req.body)
      const trip = await tripService.create(req.user.id, validated)
      res.status(201).json(trip)
    } catch (err) {
      handleError(res, err)
    }
  },
  list: async (req, res) => {
    try {
      const trips = await tripService.list(req.user.id)
      res.json(trips)
    } catch (err) {
      handleError(res, err)
    }
  }
}
