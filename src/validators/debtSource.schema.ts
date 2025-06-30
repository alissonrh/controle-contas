import { z } from 'zod'

export const debtSourceSchema = z.object({
  name: z.string().min(1),
  description: z.string().max(255).nullish().optional(),
  type: z.enum(['CARTAO', 'BANCO', 'PESSOA', 'CREDIARIO', 'OUTRO'], {
    errorMap: () => ({ message: 'Invalid debt source type' })
  }),

  dueDay: z.number().int().min(1).max(31)
})

export type DebtSourceDTO = z.infer<typeof debtSourceSchema>
