import { prisma } from '../utils/lib/prisma'
import { DebtInput } from '../utils/interfaces/debt.interface'
import { log } from 'console'
import { BaseError } from '../utils/class/baseError'
import { HttpStatusCode } from '../utils/constants/httpStatus'

/**
 * Creates a new debt in the database.
 * @param {DebtInput} data - The data for the new debt.
 * @returns {Promise<Debt>} The created debt object.
 * @throws {BaseError} If any required field is missing or if the creation fails.
 */
export const createDebt = async (
  data: DebtInput,
  userId: string
): Promise<any> => {
  const debtSource = await prisma.debtSource.findUnique({
    where: { id: data.debtSourceId }
  })
  if (!debtSource) {
    throw new BaseError(HttpStatusCode.BAD_REQUEST, 'DEBT_SOURCE_NOT_FOUND')
  }

  const returedFields = await prisma.debt.create({
    data: { ...data, userId }
  })
  return returedFields
}
