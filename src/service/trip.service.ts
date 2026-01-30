import { prisma } from '@/utils/lib/prisma'
import { CreateTripDTO } from '@/validators/trip.validation'

export class TripService {
  async create(userId: string, data: CreateTripDTO) {
    const trip = await prisma.trip.create({
      data: { ...data, userId }
    })

    return trip
  }

  async list(userId: string) {
    return await prisma.trip.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' }
    })
  }
}
