import { Request, Response } from 'express'
import { debtSourceSchema } from '../validators/debtSource.schema'
import { handleError } from '../utils/handleError'
import {
  DebtSourceInput,
  DebtSourceResponse
} from '../utils/interfaces/debt-source.interface'
import { jwtPayload } from '../utils/interfaces/jwt-payload.interface'
import * as DebtSourceService from '../service/debtSource.service'
import { DebtSource } from '@prisma/client'

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

    return res.status(201).json({
      message: 'Debt source created successfully',
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

    res.status(200).json({ data: response })
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
      return res.status(404).json({ error: 'Debt source not found' })
    }

    const response: DebtSourceResponse = {
      id: source.id,
      name: source.name,
      type: source.type,
      description: source.description,
      dueDay: source.dueDay
    }

    return res.status(200).json({ data: response })
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

    return res.status(200).json({
      message: 'Debt source updated successfully',
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
      return res.status(404).json({ error: 'Debt source not found' })
    }

    res.status(200).json({ message: 'Debt source deleted successfully' })
  } catch (error) {
    handleError(res, error)
  }
}
