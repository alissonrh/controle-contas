import { Response } from 'express'
import { ZodError } from 'zod'
import { BaseError } from '../class/baseError'

export const handleError = (res: Response, error: unknown) => {
  if (error instanceof ZodError) {
    return res.status(400).json({ error: error.errors[0].message })
  }
  if (error instanceof BaseError) {
    return res.status(error.status).json({ error: error.message })
  }
  console.error(error)
  return res.status(500).json({ error: 'Internal server error' })
}
