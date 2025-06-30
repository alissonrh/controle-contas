import { DebtService } from '../../src/service/debt.service'
import { prisma } from '../../src/utils/lib/prisma'
import { BaseError } from '../../src/utils/class/baseError'
import { HttpStatusCode } from '../../src/utils/constants/httpStatus'
import { generateInstallments } from '../../src/utils/funcs/generateInstallments'

jest.mock('../../src/utils/lib/prisma', () => ({
  prisma: {
    debtSource: { findFirst: jest.fn() },
    debt: { create: jest.fn(), findMany: jest.fn() },
    installment: { create: jest.fn() }
  }
}))
jest.mock('../../src/utils/funcs/generateInstallments')

const mockPrisma = prisma as jest.Mocked<typeof prisma>
const mockGenerateInstallments = generateInstallments as jest.Mock

describe('DebtService', () => {
  const service = new DebtService()
  const userId = 'user-1'
  const debtSourceId = 'source-1'
  const debtId = 'debt-1'
  const baseData = {
    debtSourceId,
    firstMonth: 1,
    firstYear: 2024,
    installmentsNumber: 3,
    amount: 300,
    name: 'Test Debt'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createDebt', () => {
    it('throws error if debt source not found', async () => {
      mockPrisma.debtSource.findFirst.mockResolvedValue(null)

      await expect(
        service.createDebt(baseData as any, userId)
      ).rejects.toThrowError(
        new BaseError(HttpStatusCode.BAD_REQUEST, 'DEBT_SOURCE_NOT_FOUND')
      )
    })

    it('creates debt and installments when installmentsNumber > 0', async () => {
      mockPrisma.debtSource.findFirst.mockResolvedValue({ id: debtSourceId })
      mockPrisma.debt.create.mockResolvedValue({ id: debtId, ...baseData })
      mockGenerateInstallments.mockReturnValue([
        { amount: 100, month: 1, year: 2024 },
        { amount: 100, month: 2, year: 2024 },
        { amount: 100, month: 3, year: 2024 }
      ])
      mockPrisma.installment.create.mockResolvedValue({})

      const result = await service.createDebt(baseData as any, userId)

      expect(mockPrisma.debtSource.findFirst).toHaveBeenCalledWith({
        where: { userId, id: debtSourceId }
      })
      expect(mockPrisma.debt.create).toHaveBeenCalledWith({
        data: {
          name: 'Test Debt',
          amount: 300,
          installmentsNumber: 3,
          userId
        }
      })
      expect(mockGenerateInstallments).toHaveBeenCalledWith(300, 3, 1, 2024)
      expect(mockPrisma.installment.create).toHaveBeenCalledTimes(3)
      expect(result).toEqual({ id: debtId, ...baseData })
    })

    it('creates debt without installments when installmentsNumber is 0', async () => {
      const data = { ...baseData, installmentsNumber: 0 }
      mockPrisma.debtSource.findFirst.mockResolvedValue({ id: debtSourceId })
      mockPrisma.debt.create.mockResolvedValue({ id: debtId, ...data })

      const result = await service.createDebt(data as any, userId)

      expect(mockPrisma.debt.create).toHaveBeenCalled()
      expect(mockGenerateInstallments).not.toHaveBeenCalled()
      expect(mockPrisma.installment.create).not.toHaveBeenCalled()
      expect(result).toEqual({ id: debtId, ...data })
    })
  })

  describe('getAllDebts', () => {
    it('returns all debts for user', async () => {
      const debts = [{ id: 'd1' }, { id: 'd2' }]
      mockPrisma.debt.findMany.mockResolvedValue(debts as any)

      const result = await service.getAllDebts(userId)

      expect(mockPrisma.debt.findMany).toHaveBeenCalledWith({
        where: { userId }
      })
      expect(result).toBe(debts)
    })
  })
})
