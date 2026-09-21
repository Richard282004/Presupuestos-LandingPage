import PlaceholderMark from './PlaceholderMark'
import { formatCurrency, formatDate, formatPhone, formatRUT } from '../lib/format'
import { itemSubtotal } from '../lib/totals'

export default function BudgetPreview({ business, budget, totals }) {
  const accent = business.accentColor || '#0f766e'

  return (
    <div className="print-area mx-auto w-full max-w-[820px] bg-white p-5 shadow-sm ring-1 ring-gray-200 sm:p-10 print:p-10 print:ring-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between print:flex-row print:items-start print:justify-between">
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

        <div className="sm:text-right print:text-right">
          <div className="text-2xl font-extrabold uppercase tracking-tight text-gray-900 sm:text-3xl print:text-3xl">
            Presupuesto
          </div>
          <div className="mt-1 text-xs text-gray-500">
            N° {budget.number} &middot; {formatDate(budget.date)}
          </div>
        </div>
      </div>

      {/* Client / job block */}
      <div className="mt-8 grid grid-cols-1 gap-4 border-t border-gray-200 pt-4 sm:grid-cols-2 sm:gap-6 print:grid-cols-2 print:gap-6">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
            Presupuesto para
          </div>
          <div className="mt-1 text-sm font-bold text-gray-900">
            {budget.client.name || '—'}
          </div>
          {budget.client.phone && (
            <div className="whitespace-pre-wrap text-xs text-gray-500">{formatPhone(budget.client.phone)}</div>
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
      <table className="mt-8 hidden w-full table-auto sm:table print:table">
        <thead>
          <tr
            className="border-b-2 text-left text-[11px] font-medium uppercase tracking-wide text-gray-400"
            style={{ borderColor: accent }}
          >
            <th className="w-5 pb-2 sm:w-8 print:w-8">N°</th>
            <th className="pb-2">Descripción</th>
            <th className="w-8 pb-2 text-right sm:w-20 print:w-20">Cantidad</th>
            <th className="w-20 pb-2 text-right sm:w-24 print:w-24">Precio</th>
            <th className="w-20 pb-2 text-right sm:w-28 print:w-28">Total</th>
          </tr>
        </thead>
        <tbody>
          {budget.items.map((item, index) => (
            <tr key={item.id} className="border-b border-gray-100 align-top">
              <td className="py-2 text-xs text-gray-400 sm:text-sm print:text-sm">{index + 1}</td>
              <td className="py-2 text-xs sm:text-sm print:text-sm">
                <div className="font-medium text-gray-900">{item.description || '—'}</div>
                {item.detail && <div className="text-[11px] text-gray-400">{item.detail}</div>}
              </td>
              <td className="py-2 text-right text-xs tabular-nums text-gray-700 sm:text-sm print:text-sm">
                {Number(item.qty) || 0}
              </td>
              <td className="py-2 text-right text-xs tabular-nums text-gray-700 sm:text-sm print:text-sm">
                {formatCurrency(Number(item.price) || 0)}
              </td>
              <td className="py-2 text-right text-xs font-medium tabular-nums text-gray-900 sm:text-sm print:text-sm">
                {formatCurrency(itemSubtotal(item))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 divide-y divide-gray-200 sm:hidden print:hidden">
        {budget.items.map((item, index) => (
          <div key={item.id} className="py-3">
            <div className="font-medium text-gray-900">{index + 1}. {item.description || 'Sin descripción'}</div>
            {item.detail && <p className="mt-1 text-sm text-gray-600">{item.detail}</p>}
            <div className="mt-2 flex flex-wrap justify-between gap-2 text-sm text-gray-700">
              <span>{Number(item.qty) || 0} × {formatCurrency(Number(item.price) || 0)}</span>
              <strong className="tabular-nums">{formatCurrency(itemSubtotal(item))}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mt-8 flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-end sm:justify-between print:flex-row print:items-end print:justify-between">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
            Total
          </div>
          <div
            className="text-3xl font-extrabold tabular-nums sm:text-4xl print:text-4xl"
            style={{ color: accent }}
          >
            {formatCurrency(totals.total)}
          </div>
        </div>
        <div className="text-sm sm:text-right print:text-right">
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
      <div className="mt-10 grid grid-cols-1 gap-6 border-t border-gray-200 pt-6 sm:grid-cols-3 print:grid-cols-3">
        <div className="sm:col-span-2 print:col-span-2">
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
      <div className="mt-10 flex flex-wrap gap-x-3 gap-y-1 border-t border-gray-200 pt-4 text-xs text-gray-500">
        {business.phone && <span className="whitespace-pre-wrap">{formatPhone(business.phone)}</span>}
        {business.address && <span>{business.address}</span>}
        {business.contact && <span>{business.contact}</span>}
        {business.rut && <span className="whitespace-nowrap">RUT {formatRUT(business.rut)}</span>}
      </div>
      <div className="mt-3 h-1.5 w-full" style={{ backgroundColor: accent }} />
    </div>
  )
}
