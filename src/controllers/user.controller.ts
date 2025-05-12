import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'
import { userSchema } from '../validators/user.validators'
import dotenv from 'dotenv'
import { z } from 'zod'
import { generateToken } from '../utils/jwt'
dotenv.config()

const prisma = new PrismaClient()

export const registerUser = async (req: Request, res: Response) => {
  try {
    const parsed = userSchema.parse(req.body)

    const { name, email, password } = parsed

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ error: 'Email já está em uso.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    return res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: { id: user.id, email: user.email }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message })
    }
    return res.status(500).json({ error: 'Erro interno no servidor' })
  }
}

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const payload = { userId: user.id, email: user.email }

    const token = generateToken(payload)

    return res.status(200).json({ token })
  } catch {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const getMe = async (
  req: Request & { user?: { userId: string } },
  res: Response
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    return res.json(user)
  } catch {
    return res.status(500).json({ error: 'Internal server error' })
  }
}
