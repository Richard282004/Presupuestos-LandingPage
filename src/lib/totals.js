export const IVA_RATE = 0.19

export function itemSubtotal(item) {
  const qty = Number(item.qty) || 0
  const price = Number(item.price) || 0
  return qty * price
}

export function computeTotals(budget) {
  const subtotal = budget.items.reduce((sum, item) => sum + itemSubtotal(item), 0)
  const iva = budget.includeIVA ? subtotal * IVA_RATE : 0
  const total = subtotal + iva
  return { subtotal, iva, total }
}
