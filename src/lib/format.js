export function formatCurrency(value) {
  const n = Number.isFinite(value) ? value : 0
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(n)
}

export function formatThousands(value) {
  const digits = String(value ?? '').replace(/\D/g, '')
  if (!digits) return ''
  return new Intl.NumberFormat('es-CL').format(Number(digits))
}

export function digitsOnly(value) {
  return String(value ?? '').replace(/\D/g, '')
}

export function cleanRUT(value) {
  return String(value ?? '')
    .replace(/[^0-9kK]/g, '')
    .toUpperCase()
}

export function formatRUT(value) {
  const clean = cleanRUT(value)
  if (!clean) return ''
  const body = clean.slice(0, -1)
  const dv = clean.slice(-1)
  if (!body) return dv
  const withDots = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${withDots}-${dv}`
}

export function formatDate(isoDate) {
  if (!isoDate) return ''
  const [year, month, day] = isoDate.split('-')
  if (!year || !month || !day) return isoDate
  return `${day}-${month}-${year}`
}

export function todayISO() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

let seq = 0
export function uid() {
  seq += 1
  return `${Date.now()}-${seq}`
}
