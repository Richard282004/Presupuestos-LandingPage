import { formatCurrency, formatDate } from '../lib/format'

export default function HistoryPanel({ history, onLoad, onDelete }) {
  if (history.length === 0) {
    return (
      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-gray-800">Historial</h2>
        <p className="text-sm text-gray-400">Aún no hay presupuestos guardados.</p>
      </section>
    )
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="mb-3 text-sm font-semibold text-gray-800">Historial</h2>
      <div className="space-y-2">
        {history
          .slice()
          .reverse()
          .map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between gap-2 rounded border border-gray-200 p-2"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-gray-900">
                  {entry.number} &middot; {entry.clientName || 'Sin cliente'}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(entry.date)} &middot; {formatCurrency(entry.total)}
                </div>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  onClick={() => onLoad(entry)}
                  className="rounded border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cargar
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(entry.id)}
                  className="rounded border border-gray-300 px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
      </div>
    </section>
  )
}
