import { todayISO, uid } from './format'

export function emptyItem() {
  return { id: uid(), description: '', detail: '', qty: 1, price: 0 }
}

export function newBudget(number) {
  return {
    number,
    date: todayISO(),
    client: { name: '', address: '', phone: '' },
    items: [emptyItem()],
    includeIVA: false,
    notes: '',
  }
}
