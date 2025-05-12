import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import { verifyToken } from '../utils/jwt'

dotenv.config()

interface JwtPayload {
  userId: string
  email: string
}

export const authenticateToken = (
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token missing or invalid' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = verifyToken(token) as JwtPayload
    req.user = decoded
    next()
  } catch {
    return res.status(403).json({ error: 'Invalid token' })
  }
}
