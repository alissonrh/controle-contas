import { Request, Response } from 'express'
import { debtSourceSchema } from '../validators/debtSource.schema'
import { JwtPayload } from 'jsonwebtoken'
import { z } from 'zod'
import { prisma } from '../utils/lib/prisma'
import { debtSource } from '../utils/interfaces/jwt-payload.interface'

const findDebtSourceById = async (
  sourceId: string,
  userId: string | undefined,
  res: Response
) => {
  const debtSourceRecord = await prisma.debtSource.findUnique({
    where: { id: sourceId, userId }
  })
  if (!debtSourceRecord) {
    res.status(404).json({ error: 'Debt source not found' })
    return null
  }
  return debtSourceRecord
}

export const createDebtSource = async (
  req: Request & { user?: JwtPayload },
  res: Response
) => {
  try {
    const userId = req.user?.userId
    const data = debtSourceSchema.parse(req.body)

    const newSource = await prisma.debtSource.create({
      data: { ...data, userId }
    })
    res.status(201).json({
      message: 'Debt source created successfully',
      source: {
        name: newSource.name,
        type: newSource.type
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message })
    } else if (error instanceof Error) {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export const getAllDebtSources = async (
  req: Request & { user?: JwtPayload },
  res: Response
) => {
  try {
    const userId = req.user?.userId

    const debtSourcesList = await prisma.debtSource.findMany({
      where: { userId }
    })

    res.status(200).json(
      debtSourcesList.map((debtSource: debtSource) => ({
        id: debtSource.id,
        name: debtSource.name,
        type: debtSource.type,
        description: debtSource.description,
        dueDay: debtSource.dueDay
      })) as debtSource[]
    )
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getDebtSourceById = async (
  req: Request & { user?: JwtPayload },
  res: Response
) => {
  try {
    const userId = req.user?.userId
    const sourceId = req.params.id

    const source = await findDebtSourceById(sourceId, userId, res)
    if (!source) return

    res.status(200).json({
      id: source.id,
      name: source.name,
      type: source.type,
      description: source.description,
      dueDay: source.dueDay
    } as debtSource)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const updateDebtSource = async (
  req: Request & { user?: JwtPayload },
  res: Response
) => {
  try {
    const userId = req.user?.userId
    const sourceId = req.params.id
    const data = debtSourceSchema.parse(req.body)

    const source = await findDebtSourceById(sourceId, userId, res)
    if (!source) return

    const updatedSource = await prisma.debtSource.update({
      where: { id: sourceId, userId },
      data
    })

    res.status(200).json({
      message: 'Debt source updated successfully',
      source: {
        id: updatedSource.id,
        name: updatedSource.name,
        type: updatedSource.type,
        description: updatedSource.description,
        dueDay: updatedSource.dueDay
      } as debtSource
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message })
    } else if (error instanceof Error) {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export const deleteDebtSource = async (
  req: Request & { user?: JwtPayload },
  res: Response
) => {
  try {
    const userId = req.user?.userId
    const sourceId = req.params.id

    const source = await findDebtSourceById(sourceId, userId, res)
    if (!source) return

    await prisma.debtSource.delete({
      where: { id: sourceId, userId }
    })

    res.status(200).json({ message: 'Debt source deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}
