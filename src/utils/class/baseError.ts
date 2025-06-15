export class BaseError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = this.constructor.name
    this.status = status
    Error.captureStackTrace(this, this.constructor)
  }
}
