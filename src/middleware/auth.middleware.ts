import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import { jwtPayload } from '../utils/interfaces/jwt-payload.interface'
import { HttpStatusCode } from '../utils/constants/httpStatus'

declare global {
  namespace Express {
    interface Request {
      user?: jwtPayload
    }
  }
}

export const authenticateToken = (
  req: Request & { user?: jwtPayload },
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.accessToken

  if (!token)
    return res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json({ error: 'TOKEN_MISSING_OR_INVALID' })
  try {
    const decoded = verifyToken(token) as jwtPayload
    if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
      return res
        .status(HttpStatusCode.FORBIDDEN)
        .json({ error: 'TOKEN_MISSING_OR_INVALID' })
    }

    req.user = decoded
    next()
  } catch {
    return res
      .status(HttpStatusCode.FORBIDDEN)
      .json({ error: 'TOKEN_MISSING_OR_INVALID' })
  }
}
