import { Request, Response, NextFunction } from 'express'
import { HttpStatusCode } from '../../src/utils/constants/httpStatus'
import { verifyToken } from '../../src/utils/jwt'
import { authenticateToken } from '../../src/middleware/auth.middleware'

jest.mock('../../src/utils/jwt', () => ({
  verifyToken: jest.fn()
}))

const mockResponse = () => {
  const res: Partial<Response> = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res as Response
}

describe('authenticateToken middleware', () => {
  let req: Partial<Request & { user?: any }>
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    req = { cookies: {} }
    res = mockResponse()
    next = jest.fn()
    jest.clearAllMocks()
  })

  it('should return 401 if accessToken is not present', () => {
    authenticateToken(req as any, res, next)
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.UNAUTHORIZED)
    expect(res.json).toHaveBeenCalledWith({ error: 'ACCESS_TOKEN_NOT_FOUND' })
    expect(next).not.toHaveBeenCalled()
  })

  it('should return 401 if verifyToken throws', () => {
    req.cookies = { accessToken: 'invalidtoken' }
    ;(verifyToken as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid')
    })
    authenticateToken(req as any, res, next)
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.UNAUTHORIZED)
    expect(res.json).toHaveBeenCalledWith({
      error: 'ACCESS_TOKEN_INVALID_OR_EXPIRED'
    })
    expect(next).not.toHaveBeenCalled()
  })

  it('should return 403 if decoded token is invalid', () => {
    req.cookies = { accessToken: 'sometoken' }
    ;(verifyToken as jest.Mock).mockReturnValue(null)
    authenticateToken(req as any, res, next)
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.FORBIDDEN)
    expect(res.json).toHaveBeenCalledWith({
      error: 'INVALID_ACCESS_TOKEN_PAYLOAD'
    })
    expect(next).not.toHaveBeenCalled()
  })

  it('should return 403 if decoded token is not an object', () => {
    req.cookies = { accessToken: 'sometoken' }
    ;(verifyToken as jest.Mock).mockReturnValue('not-an-object')
    authenticateToken(req as any, res, next)
    expect(res.json).toHaveBeenCalledWith({
      error: 'INVALID_ACCESS_TOKEN_PAYLOAD'
    })
    expect(next).not.toHaveBeenCalled()
  })

  it('should return 403 if decoded token does not have userId', () => {
    req.cookies = { accessToken: 'sometoken' }
    ;(verifyToken as jest.Mock).mockReturnValue({})
    authenticateToken(req as any, res, next)
    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.FORBIDDEN)
    expect(res.json).toHaveBeenCalledWith({
      error: 'INVALID_ACCESS_TOKEN_PAYLOAD'
    })
    expect(next).not.toHaveBeenCalled()
  })

  it('should call next and set req.user if token is valid', () => {
    const payload = { userId: '123', name: 'Test User' }
    req.cookies = { accessToken: 'validtoken' }
    ;(verifyToken as jest.Mock).mockReturnValue(payload)
    authenticateToken(req as any, res, next)
    expect(res.json).not.toHaveBeenCalled()
  })
})
