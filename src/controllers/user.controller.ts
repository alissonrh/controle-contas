import { Request, Response } from 'express'
import { userSchema } from '../validators/user.validators'
import { signAccessToken, signRefreshToken } from '../utils/jwt'
import { jwtPayload } from '../utils/interfaces/jwt-payload.interface'
import * as UserService from '../service/user.service'
import { User } from '@prisma/client'
import { handleError } from '../utils/funcs/handleError'
import { HttpStatusCode } from '../utils/constants/httpStatus'
import { UserResponse } from '../utils/interfaces/user.interface'

export const registerUser = async (req: Request, res: Response) => {
  try {
    const validatedUserInput = userSchema.parse(req.body)

    const created: User = await UserService.createRegisterUser(
      validatedUserInput
    )

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

    const accessToken = signAccessToken(payload)
    const refreshToken = signRefreshToken(payload)

    console.log('Access Token:', accessToken)

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000 // 15 minutos
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
    })

    return res.status(HttpStatusCode.SUCCESS).json({ message: 'LOGIN_SUCCESS' })
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
