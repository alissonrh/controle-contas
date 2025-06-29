import { prisma } from '@/utils/lib/prisma'
import { DebtInput, DebtResponse } from '@/utils/interfaces/debt.interface'
import { BaseError } from '@/utils/class/baseError'
import { HttpStatusCode } from '@/utils/constants/httpStatus'

export class DebtService {
  async createDebt(data: DebtInput, userId: string): Promise<DebtResponse> {
    const debtSource = await prisma.debtSource.findFirst({
      where: {
        userId,
        id: data.debtSourceId
      }
    })

    if (!debtSource) {
      throw new BaseError(HttpStatusCode.BAD_REQUEST, 'DEBT_SOURCE_NOT_FOUND')
    }

    const createdDebt = await prisma.debt.create({
      data: { ...data, userId }
    })

    return createdDebt
  }
}
