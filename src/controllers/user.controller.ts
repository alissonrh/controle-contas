import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { userSchema } from '../validators/user.validators'
import dotenv from 'dotenv'
import { generateToken } from '../utils/jwt'
import { jwtPayload } from '../utils/interfaces/jwt-payload.interface'
import { prisma } from '../utils/lib/prisma'
import * as UserService from '../service/user.service'
import { User } from '@prisma/client'
import { handleError } from '../utils/funcs/handleError'

dotenv.config()

export const registerUser = async (req: Request, res: Response) => {
  try {
    const parsedUserInput = userSchema.parse(req.body)

    const created: User = await UserService.createRegisterUser(parsedUserInput)

    return res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: { id: created.id, email: created.email }
    })
  } catch (error) {
    handleError(res, error)
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
  } catch (error) {
    console.error('Create DebtSource error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const getMe = async (
  req: Request & { user?: jwtPayload },
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
