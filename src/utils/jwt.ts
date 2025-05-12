import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!
const EXPIRES_IN = '1d'

export function generateToken(payload: object) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN })
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET)
}
