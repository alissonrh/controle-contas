import { Request, Response } from 'express'
import { debtSourceSchema } from '../validators/debtSource.schema'
import { handleError } from '../utils/funcs/handleError'
import {
  DebtSourceInput,
  DebtSourceResponse
} from '../utils/interfaces/debt-source.interface'
import { jwtPayload } from '../utils/interfaces/jwt-payload.interface'
import * as DebtSourceService from '../service/debtSource.service'
import { DebtSource } from '@prisma/client'
import { HttpStatusCode } from '../utils/constants/httpStatus'

export const createDebtSource = async (
  req: Request & { user?: jwtPayload },
  res: Response
) => {
  const userId = req.user!.userId

  try {
    const data: DebtSourceInput = debtSourceSchema.parse(req.body)

    const created: DebtSource = await DebtSourceService.createDebtSource(
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

export const getAllDebtSources = async (
  req: Request & { user?: jwtPayload },
  res: Response
) => {
  const userId = req.user!.userId
  console.log('userId', userId)
  try {
    const debtSourcesList = await DebtSourceService.getAllDebtSources(userId)

    const response: DebtSourceResponse[] = debtSourcesList.map(
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

export const getDebtSourceById = async (
  req: Request & { user?: jwtPayload },
  res: Response
) => {
  const userId = req.user!.userId
  const sourceId = req.params.id

  try {
    const source = await DebtSourceService.getDebtSourceById(sourceId, userId)

    if (!source) {
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .json({ error: 'DEBT_SOURCE_NOT_FOUD' })
    }

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

export const updateDebtSource = async (
  req: Request & { user?: jwtPayload },
  res: Response
) => {
  const userId = req.user!.userId
  const sourceId = req.params.id

  try {
    const data: DebtSourceInput = debtSourceSchema.parse(req.body)

    const updatedSource = await DebtSourceService.updateDebtSource(
      sourceId,
      userId,
      data
    )

    const response: DebtSourceResponse = {
      id: updatedSource.id,
      name: updatedSource.name,
      type: updatedSource.type,
      description: updatedSource.description,
      dueDay: updatedSource.dueDay
    }

    return res.status(HttpStatusCode.SUCCESS).json({
      message: 'DEBT_SOURCE_UPDATED_SUCCESSFULLY',
      data: response
    })
  } catch (error) {
    handleError(res, error)
  }
}

export const deleteDebtSource = async (
  req: Request & { user?: jwtPayload },
  res: Response
) => {
  const userId = req.user!.userId
  const sourceId = req.params.id
  try {
    const source = await DebtSourceService.getDebtSourceById(sourceId, userId)
    if (!source) {
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .json({ error: 'DEBT_SOURCE_NOT_FOUD' })
    }

    res
      .status(HttpStatusCode.SUCCESS)
      .json({ message: 'DEBT_SOURCE_DELETED_SUCCESSFULLY' })
  } catch (error) {
    handleError(res, error)
  }
}
