import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  if (process.env.NODE_ENV === 'production') {
    return new PrismaClient()
  }

  if (process.env.NODE_ENV === 'test') {
    // Avoid initializing PrismaClient when running tests
    return {} as any
  }

  if (!(global as any).prisma) {
    ;(global as any).prisma = new PrismaClient()
  }

  return (global as any).prisma
}

export const prisma = prismaClientSingleton()
