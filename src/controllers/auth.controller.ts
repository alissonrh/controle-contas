import jwt from 'jsonwebtoken'
import { signAccessToken } from '../utils/jwt'
import { Request, Response } from 'express'
import { HttpStatusCode } from '../utils/constants/httpStatus'
import { jwtPayload } from '../utils/interfaces/jwt-payload.interface'
import { handleError } from '../utils/funcs/handleError'
import { log } from 'console'

export const refreshTokenHandler = (req: Request, res: Response) => {
  log('Received request to refresh access token')
  const token = req.cookies?.refreshToken

  if (!token) {
    return res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json({ error: 'REFRESH_TOKEN_NOT_FOUND' })
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET!
    ) as jwtPayload

    const newAccessToken = signAccessToken({
      userId: payload.userId,
      email: payload.email
    })

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000 // 15 minutos
    })

    console.log('New access token generated:', newAccessToken)
    console.log('Refresh token payload:', payload)
    console.log('Refresh token:', token)
    console.log('Access token cookie set with maxAge:', 15 * 60 * 1000)

    return res
      .status(HttpStatusCode.SUCCESS)
      .json({ message: 'ACCESS_TOKEN_REFRESHED' })
  } catch (error) {
    handleError(res, error)
  }
}
