import { z } from 'zod'

export const createDebtSchema = z.object({
  title: z.string().min(1),
  amount: z.number().positive(),
  debtSourceId: z.string().uuid(),
  installmentsNumber: z.number().int().positive().max(60),
  description: z.string().optional()
})
