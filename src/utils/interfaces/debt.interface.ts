export interface DebtInput {
  title: string
  amount: number
  debtSourceId: string
  installmentsNumber: number
  description?: string
}

export interface DebtResponse {
  id: string
  title: string
  amount: number
  debtSourceId: string
  installmentsNumber: number
}
