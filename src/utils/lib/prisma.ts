import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  if (process.env.NODE_ENV === 'production') {
    return new PrismaClient()
  }

  if (!(global as any).prisma) {
    ;(global as any).prisma = new PrismaClient()
  }

  return (global as any).prisma
}

export const prisma = prismaClientSingleton()
