import { Response } from 'express'
import { ZodError } from 'zod'

export const handleError = (res: Response, error: unknown) => {
  if (error instanceof ZodError) {
    return res.status(400).json({ error: error.errors[0].message })
  }
  if (error instanceof conflictError) {
    return res.status(error.status).json({ error: error.message })
  }
  console.error(error)
  return res.status(500).json({ error: 'Internal server error' })
}

export class conflictError extends Error {
  status: number
  constructor(status: number, message: string) {
    super()
    this.status = status
  }
}
