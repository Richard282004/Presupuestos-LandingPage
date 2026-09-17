const KEYS = {
  business: 'presupuestos:business',
  counter: 'presupuestos:counter',
  draft: 'presupuestos:draft',
  history: 'presupuestos:history',
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage full or unavailable — ignore, data just won't persist
  }
}

export const defaultBusiness = {
  name: '',
  specialty: '',
  phone: '',
  rut: '',
  address: '',
  contact: '',
  logo: null,
  accentColor: '#0f766e',
}

export function loadBusiness() {
  return { ...defaultBusiness, ...read(KEYS.business, {}) }
}

export function saveBusiness(business) {
  write(KEYS.business, business)
}

export function loadHistory() {
  return read(KEYS.history, [])
}

export function saveHistory(history) {
  write(KEYS.history, history)
}

export function loadDraft() {
  return read(KEYS.draft, null)
}

export function saveDraft(draft) {
  write(KEYS.draft, draft)
}

// Reserves and returns the next sequential budget number for the given year,
// formatted as "YYYY-001". Advances the persisted counter as a side effect.
export function getNextBudgetNumber(year = new Date().getFullYear()) {
  const counters = read(KEYS.counter, {})
  const next = (counters[year] || 0) + 1
  counters[year] = next
  write(KEYS.counter, counters)
  return `${year}-${String(next).padStart(3, '0')}`
}
