import { Request, Response } from 'express'
import { userSchema } from '../validators/user.validators'
import { generateToken } from '../utils/jwt'
import { jwtPayload } from '../utils/interfaces/jwt-payload.interface'
import * as UserService from '../service/user.service'
import { User } from '@prisma/client'
import { handleError } from '../utils/funcs/handleError'
import { HttpStatusCode } from '../utils/constants/httpStatus'
import { UserResponse } from '../utils/interfaces/user.interface'

export const registerUser = async (req: Request, res: Response) => {
  try {
    const parsedUserInput = userSchema.parse(req.body)

    const created: User = await UserService.createRegisterUser(parsedUserInput)

    return res.status(HttpStatusCode.CREATED).json({
      message: 'USER_CREATED_SUCCESSFULLY',
      user: { id: created.id, email: created.email }
    })
  } catch (error) {
    handleError(res, error)
  }
}

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ error: 'EMAIL_AND_PASSWORD_ARE_REQUIRED' })
    }

    const user: UserResponse = await UserService.loginUser(email, password)

    const payload = { userId: user.id, email: user.email }

    const token = generateToken(payload)

    return res.status(HttpStatusCode.SUCCESS).json({ token })
  } catch (error) {
    handleError(res, error)
  }
}

export const getMe = async (
  req: Request & { user?: jwtPayload },
  res: Response
) => {
  try {
    const user: UserResponse = await UserService.getUserById(req.user!.userId)

    return res.json({ user })
  } catch (error) {
    handleError(res, error)
  }
}
