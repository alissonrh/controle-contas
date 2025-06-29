import { z } from 'zod'

export const createDebtSchema = z.object({
  title: z.string().min(1),
  amount: z.number().positive(),
  debtSourceId: z.string().uuid(),
  installmentsNumber: z.number().int().positive().max(60),
  description: z.string().optional(),
  type: z
    .enum([
      'ELETRONICO',
      'ROUPA',
      'VIAGEM',
      'ALIMENTACAO',
      'SAUDE',
      'EDUCACAO',
      'OUTRO'
    ])
    .default('OUTRO'),
  tripId: z.number().int().optional()
})

export type CreateDebtDTO = z.infer<typeof createDebtSchema>
