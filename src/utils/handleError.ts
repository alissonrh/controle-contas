import { Response } from 'express'
import { ZodError } from 'zod'

export const handleError = (res: Response, error: unknown) => {
  if (error instanceof ZodError) {
    return res.status(400).json({ error: error.errors[0].message })
  }
  console.error(error)
  return res.status(500).json({ error: 'Internal server error' })
}
