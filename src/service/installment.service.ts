import { prisma } from '@/utils/lib/prisma'
import { BaseError } from '@/utils/class/baseError'
import { HttpStatusCode } from '@/utils/constants/httpStatus'
import { CreateInstallmentDTO } from '@/validators/installment.schema'

export class InstallmentService {
  async create(userId: string, data: CreateInstallmentDTO) {
    return prisma.installment.create({
      data: {
        ...data,
        userId
      }
    })
  }

  async listByDebt(userId: string, debtId: string) {
    return prisma.installment.findMany({
      where: { userId, debtId },
      orderBy: { dueDate: 'asc' } // se quiser adicionar `dueDate`
    })
  }

  async markAsPaid(userId: string, installmentId: string) {
    const installment = await prisma.installment.findFirst({
      where: { id: installmentId, userId }
    })

    if (!installment) {
      throw new BaseError(HttpStatusCode.NOT_FOUND, 'INSTALLMENT_NOT_FOUND')
    }

    return prisma.installment.update({
      where: { id: installmentId },
      data: { status: 'PAID' }
    })
  }
}
