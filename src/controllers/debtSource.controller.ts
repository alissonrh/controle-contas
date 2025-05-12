import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { debtSourceSchema } from '../validators/debtSource.schema'
import { JwtPayload } from 'jsonwebtoken'
import { z } from 'zod'

const prisma = new PrismaClient()

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

// Outros métodos: getAll, getById, update, delete...
