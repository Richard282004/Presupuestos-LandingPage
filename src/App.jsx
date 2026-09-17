import { useEffect, useMemo, useState } from 'react'
import BusinessForm from './components/BusinessForm'
import BudgetForm from './components/BudgetForm'
import BudgetPreview from './components/BudgetPreview'
import HistoryPanel from './components/HistoryPanel'
import { newBudget } from './lib/budget'
import { uid } from './lib/format'
import { computeTotals } from './lib/totals'
import {
  loadBusiness,
  saveBusiness,
  loadDraft,
  saveDraft,
  loadHistory,
  saveHistory,
  getNextBudgetNumber,
} from './lib/storage'

export default function App() {
  const [business, setBusiness] = useState(loadBusiness)
  const [budget, setBudget] = useState(() => loadDraft() ?? newBudget(getNextBudgetNumber()))
  const [history, setHistory] = useState(loadHistory)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => saveBusiness(business), [business])
  useEffect(() => saveDraft(budget), [budget])
  useEffect(() => saveHistory(history), [history])

  const totals = useMemo(() => computeTotals(budget), [budget])

  function handleNewBudget() {
    setBudget(newBudget(getNextBudgetNumber()))
  }

  function handleSaveToHistory() {
    const entry = {
      id: uid(),
      number: budget.number,
      date: budget.date,
      clientName: budget.client.name,
      total: totals.total,
      budget,
    }
    setHistory((prev) => [...prev, entry])
  }

  function handleLoadHistory(entry) {
    setBudget(entry.budget)
    setShowHistory(false)
  }

  function handleDeleteHistory(id) {
    setHistory((prev) => prev.filter((entry) => entry.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#f7f6f3]">
      <header className="no-print border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <h1 className="text-sm font-semibold text-gray-800">Generador de presupuestos</h1>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowHistory((v) => !v)}
              className="rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Historial ({history.length})
            </button>
            <button
              type="button"
              onClick={handleNewBudget}
              className="rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Nuevo presupuesto
            </button>
            <button
              type="button"
              onClick={handleSaveToHistory}
              className="rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Guardar en historial
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
            >
              Descargar / Imprimir PDF
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
          <div className="no-print space-y-4">
            {showHistory && (
              <HistoryPanel
                history={history}
                onLoad={handleLoadHistory}
                onDelete={handleDeleteHistory}
              />
            )}
            <BusinessForm business={business} onChange={setBusiness} />
            <BudgetForm budget={budget} onChange={setBudget} />
          </div>

          <div>
            <BudgetPreview business={business} budget={budget} totals={totals} />
          </div>
        </div>
      </main>
    </div>
  )
}
