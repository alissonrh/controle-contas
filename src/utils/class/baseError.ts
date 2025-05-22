export class BaseError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'BaseError'
    this.status = status
  }
}
