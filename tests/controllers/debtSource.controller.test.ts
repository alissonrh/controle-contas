import { DebtSourceController } from '../../src/controllers/debtSource.controller'
import { DebtSourceService } from '../../src/service/debtSource.service'
import { handleError } from '../../src/utils/funcs/handleError'
import { HttpStatusCode } from '../../src/utils/constants/httpStatus'
import {
  debtSourceSchema,
  partialDebtSourceSchema
} from '../../src/validators/debtSource.schema'

jest.mock('../../src/service/debtSource.service')
jest.mock('../../src/utils/funcs/handleError')

const mockRes = () => {
  const res: any = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

const mockUser = { userId: 'user-123' }

describe('DebtSourceController', () => {
  let controller: DebtSourceController
  let service: jest.Mocked<DebtSourceService>

  beforeEach(() => {
    controller = new DebtSourceController()
    service = (DebtSourceService as jest.Mock).mock.instances[0]
    jest.clearAllMocks()
  })

  describe('createDebtSource', () => {
    it('should create a debt source and return success response', async () => {
      const req: any = {
        user: mockUser,
        body: { name: 'Loan', type: 'BANK', dueDay: 15 }
      }
      const created = { id: '1', name: 'Loan', type: 'BANK', dueDay: 15 }
      service.createDebtSource.mockResolvedValue(created)
      // Mock zod parse
      jest.spyOn(debtSourceSchema, 'parse').mockReturnValue(req.body)

      const res = mockRes()
      await controller.createDebtSource(req, res)

      expect(service.createDebtSource).toHaveBeenCalledWith(
        'user-123',
        req.body
      )
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.SUCCESS)
      expect(res.json).toHaveBeenCalledWith({
        message: 'DEBT_SOURCE_CREATED_SUCCESSFULLY',
        data: {
          id: '1',
          name: 'Loan',
          type: 'BANK',
          dueDay: 15,
          description: undefined
        }
      })
    })

    it('should handle error on createDebtSource', async () => {
      const req: any = { user: mockUser, body: {} }
      const res = mockRes()
      // Mock zod parse to throw
      jest.spyOn(debtSourceSchema, 'parse').mockImplementation(() => {
        throw new Error('Validation error')
      })

      await controller.createDebtSource(req, res)
      expect(handleError).toHaveBeenCalled()
    })
  })

  describe('getAllDebtSources', () => {
    it('should return all debt sources', async () => {
      const req: any = { user: mockUser }
      const res = mockRes()
      const list = [
        { id: '1', name: 'Loan', type: 'BANK', dueDay: 10, description: null }
      ]
      service.getAllDebtSources.mockResolvedValue(list)

      await controller.getAllDebtSources(req, res)

      expect(service.getAllDebtSources).toHaveBeenCalledWith('user-123')
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.SUCCESS)
      expect(res.json).toHaveBeenCalledWith({
        data: [
          { id: '1', name: 'Loan', type: 'BANK', dueDay: 10, description: null }
        ]
      })
    })

    it('should handle error on getAllDebtSources', async () => {
      const req: any = { user: mockUser }
      const res = mockRes()
      service.getAllDebtSources.mockRejectedValue(new Error('DB error'))

      await controller.getAllDebtSources(req, res)
      expect(handleError).toHaveBeenCalled()
    })
  })

  describe('getDebtSourceById', () => {
    it('should return a debt source by id', async () => {
      const req: any = { user: mockUser, params: { id: '1' } }
      const res = mockRes()
      const source = {
        id: '1',
        name: 'Loan',
        type: 'BANK',
        dueDay: 10,
        description: 'desc'
      }
      service.getDebtSourceById.mockResolvedValue(source)

      await controller.getDebtSourceById(req, res)

      expect(service.getDebtSourceById).toHaveBeenCalledWith('1', 'user-123')
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.SUCCESS)
      expect(res.json).toHaveBeenCalledWith({
        data: source
      })
    })

    it('should handle error on getDebtSourceById', async () => {
      const req: any = { user: mockUser, params: { id: '1' } }
      const res = mockRes()
      service.getDebtSourceById.mockRejectedValue(new Error('Not found'))

      await controller.getDebtSourceById(req, res)
      expect(handleError).toHaveBeenCalled()
    })
  })

  describe('updateDebtSource', () => {
    it('should update a debt source and return success response', async () => {
      const req: any = {
        user: mockUser,
        params: { id: '1' },
        body: { name: 'Updated Loan' }
      }
      const updated = {
        id: '1',
        name: 'Updated Loan',
        type: 'BANK',
        dueDay: 10,
        description: 'desc'
      }
      service.updateDebtSource.mockResolvedValue(updated)
      // Mock zod parse
      jest.spyOn(partialDebtSourceSchema, 'parse').mockReturnValue(req.body)
      const res = mockRes()
      await controller.updateDebtSource(req, res)

      expect(service.updateDebtSource).toHaveBeenCalledWith(
        '1',
        'user-123',
        req.body
      )
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.SUCCESS)
      expect(res.json).toHaveBeenCalledWith({
        message: 'DEBT_SOURCE_UPDATED_SUCCESSFULLY',
        data: updated
      })
    })

    it('should handle error on updateDebtSource', async () => {
      const req: any = { user: mockUser, params: { id: '1' }, body: {} }
      const res = mockRes()
      // Mock zod parse to throw
      jest.spyOn(partialDebtSourceSchema, 'parse').mockImplementation(() => {
        throw new Error('Validation error')
      })

      await controller.updateDebtSource(req, res)
      expect(handleError).toHaveBeenCalled()
    })
  })

  describe('deleteDebtSource', () => {
    it('should delete a debt source and return success message', async () => {
      const req: any = { user: mockUser, params: { id: '1' } }
      const res = mockRes()
      service.deleteDebtSource.mockResolvedValue(true)

      await controller.deleteDebtSource(req, res)

      expect(service.deleteDebtSource).toHaveBeenCalledWith('1', 'user-123')
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.SUCCESS)
      expect(res.json).toHaveBeenCalledWith({
        message: 'DEBT_SOURCE_DELETED_SUCCESSFULLY'
      })
    })

    it('should handle error on deleteDebtSource', async () => {
      const req: any = { user: mockUser, params: { id: '1' } }
      const res = mockRes()
      service.deleteDebtSource.mockRejectedValue(new Error('Delete error'))

      await controller.deleteDebtSource(req, res)
      expect(handleError).toHaveBeenCalled()
    })
  })
})
