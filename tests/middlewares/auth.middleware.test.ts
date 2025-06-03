import { authenticateToken } from '../../src/middleware/auth.middleware'
import { verifyToken } from '../../src/utils/jwt'
import { HttpStatusCode } from '../../src/utils/constants/httpStatus'
import { Request, Response, NextFunction } from 'express'

jest.mock('../../src/utils/jwt', () => ({
  verifyToken: jest.fn()
}))

describe('authenticateToken middleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = { cookies: {} }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    next = jest.fn()
    jest.clearAllMocks()
  })

  it('should return 401 if accessToken is not present', () => {
    authenticateToken(req as Request, res as Response, next)
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.UNAUTHORIZED)
    expect(res.json).toHaveBeenCalledWith({ error: 'ACCESS_TOKEN_NOT_FOUND' })
    expect(next).not.toHaveBeenCalled()
  })

  it('should return 401 if verifyToken throws', () => {
    req.cookies = { accessToken: 'invalid.token' }
    ;(verifyToken as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token')
    })

    authenticateToken(req as Request, res as Response, next)
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.UNAUTHORIZED)
    expect(res.json).toHaveBeenCalledWith({
      error: 'ACCESS_TOKEN_INVALID_OR_EXPIRED'
    })
    expect(next).not.toHaveBeenCalled()
  })

  it('should return 403 if decoded token is invalid or missing userId', () => {
    req.cookies = { accessToken: 'token' }
    ;(verifyToken as jest.Mock).mockReturnValue({})

    authenticateToken(req as Request, res as Response, next)
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.FORBIDDEN)
    expect(res.json).toHaveBeenCalledWith({
      error: 'INVALID_ACCESS_TOKEN_PAYLOAD'
    })
    expect(next).not.toHaveBeenCalled()
  })

  it('should call next and set req.user if token is valid', () => {
    req.cookies = { accessToken: 'token' }
    const payload = { userId: '123', name: 'Test User' }
    ;(verifyToken as jest.Mock).mockReturnValue(payload)

    authenticateToken(req as Request, res as Response, next)
    expect(req.user).toEqual(payload)
    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })
})
