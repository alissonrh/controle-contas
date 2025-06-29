import { Request, Response } from 'express'
import { debtSourceSchema } from '../validators/debtSource.schema'
import { handleError } from '../utils/funcs/handleError'
import {
  DebtSourceInput,
  DebtSourceResponse
} from '../utils/interfaces/debt-source.interface'
import { jwtPayload } from '../utils/interfaces/jwt-payload.interface'
import { DebtSourceService } from '../service/debtSource.service'
import { HttpStatusCode } from '../utils/constants/httpStatus'

export class DebtSourceController {
  private readonly debtSourceService: DebtSourceService

  constructor() {
    this.debtSourceService = new DebtSourceService()
  }

  createDebtSource = async (
    req: Request & { user?: jwtPayload },
    res: Response
  ) => {
    const userId = req.user!.userId

    try {
      const data: DebtSourceInput = debtSourceSchema.parse(req.body)

      const created = await this.debtSourceService.createDebtSource(
        userId,
        data
      )

      const response: DebtSourceResponse = {
        id: created.id,
        name: created.name,
        type: created.type,
        dueDay: created.dueDay,
        description: created.description ?? undefined
      }

      return res.status(HttpStatusCode.SUCCESS).json({
        message: 'DEBT_SOURCE_CREATED_SUCCESSFULLY',
        data: response
      })
    } catch (error) {
      handleError(res, error)
    }
  }

  getAllDebtSources = async (
    req: Request & { user?: jwtPayload },
    res: Response
  ) => {
    const userId = req.user!.userId
    try {
      const list = await this.debtSourceService.getAllDebtSources(userId)

      const response: DebtSourceResponse[] = list.map(
        (ds: DebtSourceResponse) => ({
          id: ds.id,
          name: ds.name,
          type: ds.type,
          description: ds.description ?? null,
          dueDay: ds.dueDay
        })
      )

      res.status(HttpStatusCode.SUCCESS).json({ data: response })
    } catch (error) {
      handleError(res, error)
    }
  }

  getDebtSourceById = async (
    req: Request & { user?: jwtPayload },
    res: Response
  ) => {
    const userId = req.user!.userId
    const sourceId = req.params.id

    try {
      const source = await this.debtSourceService.getDebtSourceById(
        sourceId,
        userId
      )

      const response: DebtSourceResponse = {
        id: source.id,
        name: source.name,
        type: source.type,
        description: source.description,
        dueDay: source.dueDay
      }

      return res.status(HttpStatusCode.SUCCESS).json({ data: response })
    } catch (error) {
      handleError(res, error)
    }
  }

  updateDebtSource = async (
    req: Request & { user?: jwtPayload },
    res: Response
  ) => {
    const userId = req.user!.userId
    const sourceId = req.params.id

    try {
      const data: DebtSourceInput = debtSourceSchema.parse(req.body)

      const updated = await this.debtSourceService.updateDebtSource(
        sourceId,
        userId,
        data
      )

      const response: DebtSourceResponse = {
        id: updated.id,
        name: updated.name,
        type: updated.type,
        description: updated.description,
        dueDay: updated.dueDay
      }

      return res.status(HttpStatusCode.SUCCESS).json({
        message: 'DEBT_SOURCE_UPDATED_SUCCESSFULLY',
        data: response
      })
    } catch (error) {
      handleError(res, error)
    }
  }

  deleteDebtSource = async (
    req: Request & { user?: jwtPayload },
    res: Response
  ) => {
    const userId = req.user!.userId
    const sourceId = req.params.id
    try {
      await this.debtSourceService.deleteDebtSource(sourceId, userId)

      res.status(HttpStatusCode.SUCCESS).json({
        message: 'DEBT_SOURCE_DELETED_SUCCESSFULLY'
      })
    } catch (error) {
      handleError(res, error)
    }
  }
}
