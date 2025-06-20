import { Request, Response } from 'express'
import { handleError } from '../utils/funcs/handleError'
import { DebtResponse } from '../utils/interfaces/debt.interface'
import { createDebtSchema } from '../validators/debt.schema'
import { HttpStatusCode } from '../utils/constants/httpStatus'
import * as DebtService from '../service/debt.service'
import { jwtPayload } from '../utils/interfaces/jwt-payload.interface'

export const createDebt = async (
  req: Request & { user?: jwtPayload },
  res: Response
) => {
  const userId = req.user!.userId

  try {
    const data = createDebtSchema.parse(req.body)

    const newDebt: DebtResponse = await DebtService.createDebt(data, userId)

    const response: DebtResponse = {
      id: newDebt.id,
      title: newDebt.title,
      amount: newDebt.amount,
      debtSourceId: newDebt.debtSourceId,
      installmentsNumber: newDebt.installmentsNumber
    }

    res.status(HttpStatusCode.CREATED).json({ data: response })
  } catch (error) {
    handleError(res, error)
  }
}
