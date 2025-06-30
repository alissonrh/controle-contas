import { prisma } from '@/utils/lib/prisma'
import { BaseError } from '@/utils/class/baseError'
import { HttpStatusCode } from '@/utils/constants/httpStatus'
import { DebtSourceDTO } from '@/validators/debtSource.schema'

export class DebtSourceService {
  async createDebtSource(userId: string, data: DebtSourceDTO) {
    return await prisma.debtSource.create({
      data: { ...data, userId }
    })
  }

  async getAllDebtSources(userId: string) {
    return await prisma.debtSource.findMany({
      where: { userId },
      orderBy: { name: 'asc' }
    })
  }

  async getDebtSourceById(id: string, userId: string) {
    const debtSource = await prisma.debtSource.findFirst({
      where: { id, userId }
    })

    if (!debtSource) {
      throw new BaseError(HttpStatusCode.NOT_FOUND, 'DEBT_SOURCE_NOT_FOUND')
    }

    return debtSource
  }

  async updateDebtSource(
    id: string,
    userId: string,
    data: Partial<DebtSourceDTO>
  ) {
    const existing = await prisma.debtSource.findUnique({ where: { id } })

    if (!existing || existing.userId !== userId) {
      throw new BaseError(HttpStatusCode.NOT_FOUND, 'DEBT_SOURCE_NOT_FOUND')
    }

    return await prisma.debtSource.update({
      where: { id },
      data
    })
  }

  async deleteDebtSource(id: string, userId: string) {
    const existing = await prisma.debtSource.findUnique({ where: { id } })

    if (!existing || existing.userId !== userId) {
      throw new BaseError(HttpStatusCode.NOT_FOUND, 'DEBT_SOURCE_NOT_FOUND')
    }

    await prisma.debtSource.delete({ where: { id } })
    return true
  }
}
