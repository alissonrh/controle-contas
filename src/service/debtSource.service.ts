import { DebtSourceInput } from '../utils/interfaces/debt-source.interface'
import { prisma } from '../utils/lib/prisma'

export const createDebtSource = async (
  userId: string,
  data: DebtSourceInput
) => {
  return await prisma.debtSource.create({
    data: { ...data, userId }
  })
}

export const getAllDebtSources = async (userId: string) => {
  return await prisma.debtSource.findMany({
    where: { userId },
    orderBy: { name: 'asc' }
  })
}

export const getDebtSourceById = async (id: string, userId: string) => {
  const debtSource = await prisma.debtSource.findFirst({
    where: { id, userId }
  })
  if (!debtSource) return null

  return debtSource
}

export const updateDebtSource = async (
  id: string,
  userId: string,
  data: DebtSourceInput
) => {
  const existing = await prisma.debtSource.findUnique({ where: { id } })

  if (!existing || existing.userId !== userId) {
    return null
  }

  return await prisma.debtSource.update({
    where: { id },
    data
  })
}

export const deleteDebtSource = async (id: string, userId: string) => {
  const existing = await prisma.debtSource.findUnique({ where: { id } })

  if (!existing || existing.userId !== userId) {
    return false
  }

  await prisma.debtSource.delete({ where: { id } })
  return true
}
