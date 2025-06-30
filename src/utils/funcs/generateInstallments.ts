export function generateInstallments(
  amount: number,
  count: number,
  startMonth: number,
  startYear: number
): Array<{ amount: number; month: number; year: number }> {
  const installments = []
  const baseAmount = Number((amount / count).toFixed(2))

  let month = startMonth
  let year = startYear

  for (let i = 0; i < count; i++) {
    installments.push({ amount: baseAmount, month, year })

    month++
    if (month > 12) {
      month = 1
      year++
    }
  }

  return installments
}
