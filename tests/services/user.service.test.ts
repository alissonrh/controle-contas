import { createRegisterUser } from '../../src/service/user.service'
import { prisma } from '../../src/utils/lib/prisma'
import bcrypt from 'bcrypt'
import { BaseError } from '../../src/utils/class/baseError'

jest.mock('../../src/utils/lib/prisma', () => ({
  prisma: {
    user: { findUnique: jest.fn(), create: jest.fn() }
  }
}))

jest.mock('bcrypt', () => ({
  hash: jest.fn()
}))

describe('User Service - createRegisterUser', () => {
  const mockUser = {
    name: 'Alisson',
    email: 'ali@email.com',
    password: '12345678'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should hash the password and create a user', async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
    ;(bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password')
    ;(prisma.user.create as jest.Mock).mockResolvedValue({
      id: '1',
      name: mockUser.name,
      email: mockUser.email,
      password: 'hashed_password'
    })

    const result = await createRegisterUser(mockUser)
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: mockUser.email }
    })
    expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10)
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: mockUser.name,
        email: mockUser.email,
        password: 'hashed_password'
      }
    })
    expect(result).toHaveProperty('email', mockUser.email)
    expect(result).toHaveProperty('password', 'hashed_password')
  })

  it('should throw BaseError if email already exists', async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      ...mockUser
    })

    await expect(createRegisterUser(mockUser)).rejects.toThrow(BaseError)
    await expect(createRegisterUser(mockUser)).rejects.toThrow(
      'EMAIL_ALREADY_EXISTS'
    )
    expect(prisma.user.create).not.toHaveBeenCalled()
  })
})
