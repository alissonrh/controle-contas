import { z } from 'zod'

export const createTripSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  location: z.string().min(2),
  description: z.string().optional()
})

export type CreateTripDTO = z.infer<typeof createTripSchema>
