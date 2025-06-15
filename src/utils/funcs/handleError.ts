import { Response } from 'express'
import { ZodError } from 'zod'
import { BaseError } from '../class/baseError'
import { HttpStatusCode } from '../constants/httpStatus'

export const handleError = (res: Response, error: unknown): Response => {
  if (error instanceof ZodError) {
    const message =
      error.errors?.[0]?.message.toUpperCase() || 'VALIDATION_ERROR'
    return res.status(HttpStatusCode.BAD_REQUEST).json({ error: message })
  }

  if (error instanceof BaseError) {
    return res.status(error.status).json({ error: error.message })
  }

  return res
    .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
    .json({ error: 'INTERNAL_SERVER_ERROR' })
}
