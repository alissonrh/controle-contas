import { z } from 'zod'

export const createInstallmentSchema = z.object({
  amount: z.coerce
    .number({
      required_error: 'Amount is required'
    })
    .positive({ message: 'Amount must be a positive number' }),

  month: z
    .number({
      required_error: 'Month is required'
    })
    .int({ message: 'Month must be an integer' })
    .min(1, { message: 'Month must be between 1 and 12' })
    .max(12, { message: 'Month must be between 1 and 12' }),

  year: z
    .number({
      required_error: 'Year is required'
    })
    .int({ message: 'Year must be an integer' })
    .min(2000, { message: 'Year must be between 2000 and 2100' })
    .max(2100, { message: 'Year must be between 2000 and 2100' }),

  type: z.enum(
    [
      'ELETRONICO',
      'ROUPA',
      'VIAGEM',
      'ALIMENTACAO',
      'SAUDE',
      'EDUCACAO',
      'OUTRO'
    ],
    {
      errorMap: () => ({ message: 'Invalid installment type' })
    }
  ),

  debtId: z
    .string({
      required_error: 'Debt ID is required'
    })
    .uuid({ message: 'Debt ID must be a valid UUID' })
})

export type CreateInstallmentDTO = z.infer<typeof createInstallmentSchema>
