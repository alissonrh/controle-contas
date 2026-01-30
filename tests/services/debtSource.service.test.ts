import { DebtSourceService } from '../../src/service/debtSource.service'
import { prisma } from '../../src/utils/lib/prisma'
import { BaseError } from '../../src/utils/class/baseError'
import { HttpStatusCode } from '../../src/utils/constants/httpStatus'

jest.mock('@/utils/lib/prisma', () => ({
  prisma: {
    debtSource: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  }
}))

const mockDebtSource = {
  id: 'debt1',
  name: 'Credit Card',
  userId: 'user1'
}

const service = new DebtSourceService()

describe('DebtSourceService', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('createDebtSource', () => {
    it('should create a debt source', async () => {
      ;(prisma.debtSource.create as jest.Mock).mockResolvedValue(mockDebtSource)
      const result = await service.createDebtSource('user1', {
        name: 'Credit Card'
      } as any)
      expect(prisma.debtSource.create).toHaveBeenCalledWith({
        data: { name: 'Credit Card', userId: 'user1' }
      })
      expect(result).toEqual(mockDebtSource)
    })
  })

  describe('getAllDebtSources', () => {
    it('should return all debt sources for a user', async () => {
      ;(prisma.debtSource.findMany as jest.Mock).mockResolvedValue([
        mockDebtSource
      ])
      const result = await service.getAllDebtSources('user1')
      expect(prisma.debtSource.findMany).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        orderBy: { name: 'asc' }
      })
      expect(result).toEqual([mockDebtSource])
    })
  })

  describe('getDebtSourceById', () => {
    it('should return the debt source if found', async () => {
      ;(prisma.debtSource.findFirst as jest.Mock).mockResolvedValue(
        mockDebtSource
      )
      const result = await service.getDebtSourceById('debt1', 'user1')
      expect(prisma.debtSource.findFirst).toHaveBeenCalledWith({
        where: { id: 'debt1', userId: 'user1' }
      })
      expect(result).toEqual(mockDebtSource)
    })

    it('should throw BaseError if not found', async () => {
      ;(prisma.debtSource.findFirst as jest.Mock).mockResolvedValue(null)
      await expect(service.getDebtSourceById('debt1', 'user1')).rejects.toThrow(
        BaseError
      )
      await expect(
        service.getDebtSourceById('debt1', 'user1')
      ).rejects.toMatchObject({
        status: HttpStatusCode.NOT_FOUND,
        message: 'DEBT_SOURCE_NOT_FOUND'
      })
    })
  })

  describe('updateDebtSource', () => {
    it('should update and return the debt source', async () => {
      ;(prisma.debtSource.findUnique as jest.Mock).mockResolvedValue({
        id: 'debt1',
        userId: 'user1'
      })

      // Mock update para retornar o resultado esperado
      ;(prisma.debtSource.update as jest.Mock).mockResolvedValue({
        id: 'debt1',
        userId: 'user1',
        name: 'Updated'
      })

      const result = await service.updateDebtSource('debt1', 'user1', {
        name: 'Updated'
      })
      expect(result.name).toBe('Updated')
    })

    it('should throw BaseError if not found or userId mismatch', async () => {
      ;(prisma.debtSource.findUnique as jest.Mock).mockResolvedValue(null)
      await expect(
        service.updateDebtSource('debt1', 'user1', { name: 'Updated' })
      ).rejects.toThrow(BaseError)
      ;(prisma.debtSource.findUnique as jest.Mock).mockResolvedValue({
        ...mockDebtSource,
        userId: 'otherUser'
      })
      await expect(
        service.updateDebtSource('debt1', 'user1', { name: 'Updated' })
      ).rejects.toThrow(BaseError)
    })
  })

  describe('deleteDebtSource', () => {
    it('should delete the debt source and return true', async () => {
      ;(prisma.debtSource.findUnique as jest.Mock).mockResolvedValue({
        id: 'debt1',
        userId: 'user1'
      })
      ;(prisma.debtSource.delete as jest.Mock).mockResolvedValue({})

      const result = await service.deleteDebtSource('debt1', 'user1')
      expect(prisma.debtSource.findUnique).toHaveBeenCalledWith({
        where: { id: 'debt1' }
      })
      expect(prisma.debtSource.delete).toHaveBeenCalledWith({
        where: { id: 'debt1' }
      })
      expect(result).toBe(true)
    })

    it('should throw BaseError if not found or userId mismatch', async () => {
      ;(prisma.debtSource.findUnique as jest.Mock).mockResolvedValue(null)
      await expect(service.deleteDebtSource('debt1', 'user1')).rejects.toThrow(
        BaseError
      )
      ;(prisma.debtSource.findUnique as jest.Mock).mockResolvedValue({
        ...mockDebtSource,
        userId: 'otherUser'
      })
      await expect(service.deleteDebtSource('debt1', 'user1')).rejects.toThrow(
        BaseError
      )
    })
  })
})
