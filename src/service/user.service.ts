import { conflictError as conflictError } from '../utils/handleError'
import { UserInput } from '../utils/interfaces/user.interface'
import { prisma } from '../utils/lib/prisma'
import bcrypt from 'bcrypt'

export const createRegisterUser = async (parsedUserInput: UserInput) => {
  const { name, email, password } = parsedUserInput

  const existingUser = await prisma.user.findUnique({ where: { email } })

  if (existingUser) {
    throw new conflictError(409, 'EMAIL_ALREADY_EXISTS')
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
