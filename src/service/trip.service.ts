import { prisma } from '@/lib/prisma'
import { CreateTripDTO } from '@/dtos/trip.dto'

export const tripService = {
  create: async (userId: number, data: CreateTripDTO) => {
    return prisma.trip.create({
      data: {
        ...data,
        userId
      }
    })
  },
  list: async (userId: number) => {
    return prisma.trip.findMany({
      where: { userId }
    })
  }
}
