export interface DebtSourceInput {
  name: string
  type: 'CARTAO' | 'BANCO' | 'PESSOA' | 'CREDIARIO' | 'OUTRO'
  dueDay: number
  description?: string
}

export interface DebtSourceResponse {
  id: string
  name: string
  type: string
  dueDay: number
  description?: string
}
