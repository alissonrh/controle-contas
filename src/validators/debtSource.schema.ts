import { z } from 'zod'

export const debtSourceSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z
    .string()
    .max(255, 'Description must be at most 255 characters')
    .optional(),
  type: z.enum(['CARTAO', 'BANCO', 'PESSOA', 'CREDIARIO', 'OUTRO'], {
    errorMap: () => ({ message: 'Invalid debt source type' })
  }),
  dueDay: z
    .number()
    .min(1, 'Due day must be between 1 and 31')
    .max(31, 'Due day must be between 1 and 31')
})
