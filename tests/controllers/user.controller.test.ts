import {
  registerUser,
  loginUser,
  getMe
} from '../../src/controllers/user.controller'
import * as UserService from '../../src/service/user.service'
import { userSchema } from '../../src/validators/user.validators'
import { handleError } from '../../src/utils/funcs/handleError'
import { HttpStatusCode } from '../../src/utils/constants/httpStatus'
import { signAccessToken } from '../../src/utils/jwt'
const signAccessTokenMock = require('../../src/utils/jwt')
  .signAccessToken as jest.Mock
const signRefreshTokenMock = require('../../src/utils/jwt')
  .signRefreshToken as jest.Mock

jest.mock('../../src/service/user.service')
jest.mock('../../src/validators/user.validators', () => ({
  userSchema: { parse: jest.fn() }
}))
jest.mock('../../src/utils/jwt', () => ({
  signAccessToken: jest.fn(),
  signRefreshToken: jest.fn()
}))
jest.mock('../../src/utils/funcs/handleError', () => ({
  handleError: jest.fn()
}))

describe('user.controller', () => {
  let req: any
  let res: any

  beforeEach(() => {
    req = { body: {}, user: undefined }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    jest.clearAllMocks()
  })

  describe('registerUser', () => {
    it('should register user and return success response', async () => {
      const parsedInput = { email: 'test@example.com', password: 'pass' }
      const createdUser = { id: 1, email: 'test@example.com' }
      ;(userSchema.parse as jest.Mock).mockReturnValue(parsedInput)
      ;(UserService.createRegisterUser as jest.Mock).mockResolvedValue(
        createdUser
      )
      req.body = parsedInput

      await registerUser(req, res)

      expect(userSchema.parse).toHaveBeenCalledWith(parsedInput)
      expect(UserService.createRegisterUser).toHaveBeenCalledWith(parsedInput)
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.CREATED)
      expect(res.json).toHaveBeenCalledWith({
        message: 'USER_CREATED_SUCCESSFULLY',
        user: { id: createdUser.id, email: createdUser.email }
      })
    })

    it('should handle error if thrown', async () => {
      const error = new Error('fail')
      ;(userSchema.parse as jest.Mock).mockImplementation(() => {
        throw error
      })
      await registerUser(req, res)
      expect(handleError).toHaveBeenCalledWith(res, error)
    })
  })

  describe('loginUser', () => {
    it('should return 400 if email or password missing', async () => {
      req.body = { email: '', password: '' }
      await loginUser(req, res)
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.BAD_REQUEST)
      expect(res.json).toHaveBeenCalledWith({
        error: 'EMAIL_AND_PASSWORD_ARE_REQUIRED'
      })
    })

    it('should login user, set cookies, and return success response', async () => {
      const email = 'test@example.com'
      const password = 'pass'
      const user = { id: 1, email }
      const accessToken = 'access-token'
      const refreshToken = 'refresh-token'
      req.body = { email, password }
      ;(UserService.loginUser as jest.Mock).mockResolvedValue(user)
      signAccessTokenMock.mockReturnValue(accessToken)
      signRefreshTokenMock.mockReturnValue(refreshToken)

      res.cookie = jest.fn().mockReturnThis()

      await loginUser(req, res)

      expect(UserService.loginUser).toHaveBeenCalledWith(email, password)
      expect(signAccessTokenMock).toHaveBeenCalledWith({
        userId: user.id,
        email: user.email
      })
      expect(signRefreshTokenMock).toHaveBeenCalledWith({
        userId: user.id,
        email: user.email
      })
      expect(res.cookie).toHaveBeenCalledWith(
        'accessToken',
        accessToken,
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax'
        })
      )
      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        refreshToken,
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax'
        })
      )
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.SUCCESS)
      expect(res.json).toHaveBeenCalledWith({ message: 'LOGIN_SUCCESS' })
    })

    describe('getMe', () => {
      it('should return user info', async () => {
        req.user = { userId: 1, email: 'test@example.com' }
        const user = { id: 1, email: 'test@example.com' }
        ;(UserService.getUserById as jest.Mock).mockResolvedValue(user)

        await getMe(req, res)

        expect(UserService.getUserById).toHaveBeenCalledWith(1)
        expect(res.json).toHaveBeenCalledWith({ user })
      })
    })
  })
})
