export interface JwtPayload {
  userId: string
  email: string
}

export interface debtSource {
  id: string
  name: string
  type: string
  description?: string
  dueDay: number
}
