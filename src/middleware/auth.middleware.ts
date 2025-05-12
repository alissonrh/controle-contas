import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import { jwtPayload } from '../utils/interfaces/jwt-payload.interface'

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
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token missing or invalid' })
  }

  const token = authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Token not provided' })
  try {
    const decoded = verifyToken(token) as jwtPayload
    if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
      return res.status(403).json({ error: 'Invalid token payload' })
    }

    req.user = decoded
    next()
  } catch {
    return res.status(403).json({ error: 'Invalid token' })
  }
}
