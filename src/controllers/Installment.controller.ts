import { Request, Response } from 'express'
import { jwtPayload } from '@/utils/interfaces/jwt-payload.interface'
import { handleError } from '@/utils/funcs/handleError'
import { InstallmentService } from '@/service/installment.service'
import { createInstallmentSchema } from '@/validators/installment.schema'
import { HttpStatusCode } from '@/utils/constants/httpStatus'

export class InstallmentController {
  private readonly installmentService: InstallmentService

  constructor() {
    this.installmentService = new InstallmentService()
  }

  create = async (req: Request & { user?: jwtPayload }, res: Response) => {
    try {
      const data = createInstallmentSchema.parse(req.body)
      const created = await this.installmentService.create(
        req.user!.userId,
        data
      )

      res.status(HttpStatusCode.CREATED).json({
        message: 'INSTALLMENT_CREATED_SUCCESSFULLY',
        data: created
      })
    } catch (err) {
      handleError(res, err)
    }
  }

  listByDebt = async (req: Request & { user?: jwtPayload }, res: Response) => {
    try {
      const debtId = req.params.debtId
      const installments = await this.installmentService.listByDebt(
        req.user!.userId,
        debtId
      )

      res.status(HttpStatusCode.SUCCESS).json({ data: installments })
    } catch (err) {
      handleError(res, err)
    }
  }

  markAsPaid = async (req: Request & { user?: jwtPayload }, res: Response) => {
    try {
      const id = req.params.id
      const updated = await this.installmentService.markAsPaid(
        req.user!.userId,
        id
      )

      res.status(HttpStatusCode.SUCCESS).json({
        message: 'INSTALLMENT_MARKED_AS_PAID',
        data: updated
      })
    } catch (err) {
      handleError(res, err)
    }
  }
}
