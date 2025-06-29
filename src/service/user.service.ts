import { BaseError } from '@/utils/class/baseError'
import { UserInput } from '@/utils/interfaces/user.interface'
import { prisma } from '@/utils/lib/prisma'
import bcrypt from 'bcrypt'

export class UserService {
  async createRegisterUser(parsedUserInput: UserInput) {
    const { name, email, password } = parsedUserInput

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) throw new BaseError(409, 'EMAIL_ALREADY_EXISTS')

    const hashedPassword = await bcrypt.hash(password, 10)

    return prisma.user.create({
      data: { name, email, password: hashedPassword }
    })
  }

  async loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) throw new BaseError(401, 'INVALID_CREDENTIALS')

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new BaseError(401, 'INVALID_CREDENTIALS')

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const { password: _password, ...safeUser } = user
    return safeUser
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    })
    if (!user) throw new BaseError(404, 'USER_NOT_FOUND')
    return user
  }
}
