import { useEffect, useMemo, useState } from 'react'
import BusinessForm from './components/BusinessForm'
import BudgetForm from './components/BudgetForm'
import BudgetPreview from './components/BudgetPreview'
import HistoryPanel from './components/HistoryPanel'
import { newBudget } from './lib/budget'
import { formatCurrency, uid } from './lib/format'
import { computeTotals } from './lib/totals'
import {
  loadBusiness, saveBusiness, loadDraft, saveDraft,
  loadHistory, saveHistory, getNextBudgetNumber,
} from './lib/storage'

const button = 'rounded border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50'
const primaryButton = 'rounded bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800'

export default function App() {
  const [business, setBusiness] = useState(loadBusiness)
  const [budget, setBudget] = useState(() => loadDraft() ?? newBudget(getNextBudgetNumber()))
  const [history, setHistory] = useState(loadHistory)
  const [showHistory, setShowHistory] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [storageError, setStorageError] = useState(false)

  useEffect(() => {
    const businessSaved = saveBusiness(business)
    const draftSaved = saveDraft(budget)
    const historySaved = saveHistory(history)
    // Report the result of synchronizing with browser storage.
    // eslint-disable-next-line react/set-state-in-effect
    setStorageError(!businessSaved || !draftSaved || !historySaved)
  }, [business, budget, history])

  const totals = useMemo(() => computeTotals(budget), [budget])
  const hasWork = Boolean(
    Object.values(budget.client).some(Boolean) || budget.notes || budget.includeIVA ||
    budget.items.length > 1 ||
    budget.items.some((item) => item.description || item.detail || Number(item.price) || Number(item.qty) !== 1),
  )
  const savedCurrent = history.some((entry) => JSON.stringify(entry.budget) === JSON.stringify(budget))

  function canReplaceDraft() {
    return !hasWork || savedCurrent ||
      window.confirm('Este presupuesto aún no está en Mis presupuestos. ¿Quieres dejarlo y continuar?')
  }

  function handleNewBudget() {
    if (!canReplaceDraft()) return
    setBudget(newBudget(getNextBudgetNumber()))
    setShowHistory(false)
    setShowPreview(false)
    window.scrollTo({ top: 0 })
  }

  function handleSaveToHistory() {
    const existing = history.find((entry) => entry.number === budget.number)
    const entry = {
      id: existing?.id || uid(), number: budget.number, date: budget.date,
      clientName: budget.client.name, total: totals.total, budget,
    }
    const next = [...history.filter((item) => item.id !== entry.id), entry]
    if (!saveHistory(next)) {
      setStorageError(true)
      return
    }
    setHistory(next)
  }

  function handleLoadHistory(entry) {
    if (!canReplaceDraft()) return
    setBudget(entry.budget)
    setShowHistory(false)
    setShowPreview(false)
  }

  function handleDeleteHistory(id) {
    if (!window.confirm('¿Eliminar este presupuesto guardado? Esta acción no se puede deshacer.')) return
    setHistory((prev) => prev.filter((entry) => entry.id !== id))
  }

  function handlePrint() {
    window.print()
  }

  return (
    <div className="min-h-screen bg-[#f7f6f3]">
      <header className="no-print border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-lg font-semibold text-gray-900">Presupuestos</h1>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowHistory(!showHistory)} aria-expanded={showHistory} aria-controls="budget-history" className={button}>
              {showHistory ? 'Cerrar lista' : 'Mis presupuestos (' + history.length + ')'}
            </button>
            <button type="button" onClick={handleNewBudget} className={button}>Nuevo</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-4 pb-44 lg:pb-6">
        <p role="status" className={'no-print mb-4 text-sm ' + (storageError ? 'font-medium text-red-700' : 'text-gray-600')}>
          {storageError
            ? 'No se pudo guardar en este navegador. Guarda un PDF antes de cerrar para conservar una copia.'
            : savedCurrent ? 'Guardado en Mis presupuestos, en este navegador.' : 'Borrador guardado en este navegador.'}
        </p>
        {showHistory && (
          <div id="budget-history" className="no-print mb-4">
            <HistoryPanel history={history} onLoad={handleLoadHistory} onDelete={handleDeleteHistory} />
          </div>
        )}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[400px_1fr]">
          <div className={'no-print space-y-4 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-2 ' + (showPreview ? 'hidden lg:block' : '')}>
            <BusinessForm business={business} onChange={setBusiness} />
            <BudgetForm budget={budget} onChange={setBudget} />
          </div>
          <div className={'budget-preview min-w-0 ' + (showPreview ? '' : 'hidden lg:block')}>
            <h2 className="no-print mb-2 text-lg font-semibold text-gray-800">Vista previa</h2>
            <p className="no-print mb-3 text-sm text-gray-600">Para guardar el archivo, elige “Guardar como PDF” al imprimir.</p>
            <BudgetPreview business={business} budget={budget} totals={totals} />
          </div>
        </div>
        <div className="no-print action-bar fixed inset-x-0 bottom-0 z-10 border-t border-gray-200 bg-white px-4 pt-3 lg:sticky lg:mt-6 lg:rounded-lg lg:border lg:p-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-3 flex items-center justify-between gap-3 lg:mb-0 lg:inline-flex lg:gap-4">
              <div className="flex min-w-0 items-baseline gap-2">
                <span className="text-sm text-gray-600">Total</span>
                <strong className="break-all text-xl tabular-nums text-gray-900">{formatCurrency(totals.total)}</strong>
              </div>
              <button type="button" className="px-2 text-sm font-semibold text-teal-800 lg:hidden" onClick={() => { setShowPreview(!showPreview); window.scrollTo({ top: 0 }) }}>
                {showPreview ? 'Volver a editar' : 'Ver presupuesto'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 lg:float-right lg:flex">
              <button type="button" onClick={handleSaveToHistory} className={button}>{savedCurrent ? 'Guardado' : 'Guardar presupuesto'}</button>
              <button type="button" onClick={handlePrint} className={primaryButton}>Imprimir / PDF</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
