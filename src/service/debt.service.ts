import { prisma } from '../utils/lib/prisma'
import { DebtInput, DebtResponse } from '../utils/interfaces/debt.interface'
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
): Promise<DebtResponse> => {
  const debtSource = await prisma.debtSource.findFirst({
    where: {
      userId: userId,
      id: data.debtSourceId
    }
  })

  if (!debtSource) {
    throw new BaseError(HttpStatusCode.BAD_REQUEST, 'DEBT_SOURCE_NOT_FOUND')
  }

  const returedFields = await prisma.debt.create({
    data: { ...data, userId }
  })
  return returedFields
}
