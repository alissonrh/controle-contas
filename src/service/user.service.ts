import { BaseError } from '../utils/class/baseError'
import { UserInput } from '../utils/interfaces/user.interface'
import { prisma } from '../utils/lib/prisma'
import bcrypt from 'bcrypt'

export const createRegisterUser = async (parsedUserInput: UserInput) => {
  const { name, email, password } = parsedUserInput

  const existingUser = await prisma.user.findUnique({ where: { email } })

  if (existingUser) {
    throw new BaseError(409, 'EMAIL_ALREADY_EXISTS')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  return await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  })
}
