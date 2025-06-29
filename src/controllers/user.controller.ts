import { Request, Response } from 'express'
import { userSchema } from '@/validators/user.validators'
import { signAccessToken, signRefreshToken } from '@/utils/jwt'
import { UserService } from '@/service/user.service'
import { HttpStatusCode } from '@/utils/constants/httpStatus'
import { handleError } from '@/utils/funcs/handleError'
import { jwtPayload } from '@/utils/interfaces/jwt-payload.interface'

export class UserController {
  private readonly userService: UserService
  constructor() {
    this.userService = new UserService()
  }

  registerUser = async (req: Request, res: Response) => {
    try {
      const validatedUserInput = userSchema.parse(req.body)

      const created =
        await this.userService.createRegisterUser(validatedUserInput)

      return res.status(HttpStatusCode.CREATED).json({
        message: 'USER_CREATED_SUCCESSFULLY',
        user: { id: created.id, email: created.email }
      })
    } catch (error) {
      handleError(res, error)
    }
  }

  loginUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ error: 'EMAIL_AND_PASSWORD_ARE_REQUIRED' })
      }

      const user = await this.userService.loginUser(email, password)

      const payload = { userId: user.id, email: user.email }

      const accessToken = signAccessToken(payload)
      const refreshToken = signRefreshToken(payload)

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

      return res
        .status(HttpStatusCode.SUCCESS)
        .json({ message: 'LOGIN_SUCCESS' })
    } catch (error) {
      handleError(res, error)
    }
  }

  getMe = async (req: Request & { user?: jwtPayload }, res: Response) => {
    try {
      const user = await this.userService.getUserById(req.user!.userId)

      return res.json({ user })
    } catch (error) {
      handleError(res, error)
    }
  }
}
