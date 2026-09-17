import PlaceholderMark from './PlaceholderMark'
import { formatCurrency, formatDate } from '../lib/format'
import { itemSubtotal } from '../lib/totals'

export default function BudgetPreview({ business, budget, totals }) {
  const accent = business.accentColor || '#0f766e'

  return (
    <div className="print-area mx-auto w-full max-w-[820px] bg-white p-10 shadow-sm ring-1 ring-gray-200 print:ring-0">
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-center gap-3">
          {business.logo ? (
            <img src={business.logo} alt="Logo" className="h-14 max-w-[140px] object-contain" />
          ) : (
            <PlaceholderMark color={accent} size={48} />
          )}
          <div>
            <div className="text-lg font-extrabold uppercase tracking-tight text-gray-900">
              {business.name || 'Tu negocio'}
            </div>
            {business.specialty && (
              <div className="text-xs text-gray-500">{business.specialty}</div>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-extrabold uppercase tracking-tight text-gray-900">
            Presupuesto
          </div>
          <div className="mt-1 text-xs text-gray-500">
            N° {budget.number} &middot; {formatDate(budget.date)}
          </div>
        </div>
      </div>

      {/* Client / job block */}
      <div className="mt-8 grid grid-cols-2 gap-6 border-t border-gray-200 pt-4">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
            Presupuesto para
          </div>
          <div className="mt-1 text-sm font-bold text-gray-900">
            {budget.client.name || '—'}
          </div>
          {budget.client.phone && (
            <div className="text-xs text-gray-500">{budget.client.phone}</div>
          )}
        </div>
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
            Dirección del trabajo
          </div>
          <div className="mt-1 text-sm font-bold text-gray-900">
            {budget.client.address || '—'}
          </div>
        </div>
      </div>

      {/* Items table */}
      <table className="mt-8 w-full">
        <thead>
          <tr
            className="border-b-2 text-left text-[11px] font-medium uppercase tracking-wide text-gray-400"
            style={{ borderColor: accent }}
          >
            <th className="w-8 pb-2">N°</th>
            <th className="pb-2">Descripción</th>
            <th className="w-20 pb-2 text-right">Cant.</th>
            <th className="w-24 pb-2 text-right">Precio</th>
            <th className="w-28 pb-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {budget.items.map((item, index) => (
            <tr key={item.id} className="border-b border-gray-100 align-top">
              <td className="py-2 text-sm text-gray-400">{index + 1}</td>
              <td className="py-2 text-sm">
                <div className="font-medium text-gray-900">{item.description || '—'}</div>
                {item.detail && <div className="text-xs text-gray-400">{item.detail}</div>}
              </td>
              <td className="py-2 text-right text-sm tabular-nums text-gray-700">
                {Number(item.qty) || 0}
              </td>
              <td className="py-2 text-right text-sm tabular-nums text-gray-700">
                {formatCurrency(Number(item.price) || 0)}
              </td>
              <td className="py-2 text-right text-sm font-medium tabular-nums text-gray-900">
                {formatCurrency(itemSubtotal(item))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="mt-8 flex items-end justify-between border-t border-gray-200 pt-6">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
            Total
          </div>
          <div className="text-4xl font-extrabold tabular-nums" style={{ color: accent }}>
            {formatCurrency(totals.total)}
          </div>
        </div>
        <div className="text-right text-sm">
          <div className="flex justify-between gap-6 text-gray-500">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatCurrency(totals.subtotal)}</span>
          </div>
          {budget.includeIVA && (
            <div className="flex justify-between gap-6 text-gray-500">
              <span>IVA (19%)</span>
              <span className="tabular-nums">{formatCurrency(totals.iva)}</span>
            </div>
          )}
          <div className="mt-1 flex justify-between gap-6 border-t border-gray-200 pt-1 font-semibold text-gray-900">
            <span>Total</span>
            <span className="tabular-nums">{formatCurrency(totals.total)}</span>
          </div>
        </div>
      </div>

      {/* Terms + signature */}
      <div className="mt-10 grid grid-cols-3 gap-6 border-t border-gray-200 pt-6">
        <div className="col-span-2">
          <div className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
            Términos y condiciones
          </div>
          <div className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-gray-600">
            {budget.notes || 'Sin condiciones especificadas.'}
          </div>
        </div>
        <div className="flex flex-col justify-end">
          <div className="border-t border-gray-400 pt-1 text-center text-xs text-gray-500">
            Firma
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-4 text-xs text-gray-500">
        <div className="space-x-3">
          {business.phone && <span>{business.phone}</span>}
          {business.address && <span>{business.address}</span>}
          {business.contact && <span>{business.contact}</span>}
          {business.rut && <span>RUT {business.rut}</span>}
        </div>
      </div>
      <div className="mt-3 h-1.5 w-full" style={{ backgroundColor: accent }} />
    </div>
  )
}
