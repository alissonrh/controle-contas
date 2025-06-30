import { prisma } from '@/utils/lib/prisma'
import { DebtResponse } from '@/utils/interfaces/debt.interface'
import { BaseError } from '@/utils/class/baseError'
import { HttpStatusCode } from '@/utils/constants/httpStatus'
import { generateInstallments } from '@/utils/funcs/generateInstallments'
import { CreateDebtDTO } from '@/validators/debt.schema'

export class DebtService {
  async createDebt(data: CreateDebtDTO, userId: string): Promise<DebtResponse> {
    const debtSource = await prisma.debtSource.findFirst({
      where: { userId, id: data.debtSourceId }
    })

    if (!debtSource) {
      throw new BaseError(HttpStatusCode.BAD_REQUEST, 'DEBT_SOURCE_NOT_FOUND')
    }

    const { firstMonth, firstYear, installmentsNumber, amount, ...rest } = data

    const debt = await prisma.debt.create({
      data: {
        ...rest,
        amount,
        installmentsNumber,
        userId
      }
    })

    if (installmentsNumber > 0) {
      const parcels = generateInstallments(
        amount,
        installmentsNumber,
        firstMonth,
        firstYear
      )

      for (const parcel of parcels) {
        await prisma.installment.create({
          data: {
            amount: parcel.amount,
            month: parcel.month,
            year: parcel.year,
            status: 'PENDING',
            userId,
            debtId: debt.id
          }
        })
      }
    }

    return debt
  }

  async getAllDebts(userId: string) {
    return await prisma.debt.findMany({
      where: { userId }
    })
  }
}
