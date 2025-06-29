import { Request, Response } from 'express'
import { handleError } from '@/utils/funcs/handleError'
import { TripService } from '@/service/trip.service'
import { createTripSchema } from '@/validators/trip.validation'
import { jwtPayload } from '@/utils/interfaces/jwt-payload.interface'
import { HttpStatusCode } from '@/utils/constants/httpStatus'

export class TripController {
  private readonly tripService: TripService

  constructor() {
    this.tripService = new TripService()
  }

  create = async (req: Request & { user?: jwtPayload }, res: Response) => {
    const userId = req.user!.userId
    try {
      const validated = createTripSchema.parse(req.body)
      const trip = await this.tripService.create(userId, validated)
      res.status(HttpStatusCode.CREATED).json(trip)
    } catch (err) {
      handleError(res, err)
    }
  }

  list = async (req: Request & { user?: jwtPayload }, res: Response) => {
    try {
      const trips = await this.tripService.list(req.user!.userId)
      res.status(HttpStatusCode.SUCCESS).json(trips)
    } catch (err) {
      handleError(res, err)
    }
  }
}
