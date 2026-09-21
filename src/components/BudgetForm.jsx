import { emptyItem } from '../lib/budget'
import { formatCurrency, formatThousands, digitsOnly, formatPhone } from '../lib/format'
import { itemSubtotal } from '../lib/totals'

const field =
  'w-full min-h-12 rounded border border-gray-300 px-3 py-2.5 text-base text-gray-900 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20'
const label = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function BudgetForm({ budget, onChange }) {
  function set(key, value) {
    onChange({ ...budget, [key]: value })
  }

  function setClient(key, value) {
    onChange({ ...budget, client: { ...budget.client, [key]: value } })
  }

  function setItem(id, key, value) {
    onChange({
      ...budget,
      items: budget.items.map((item) => (item.id === id ? { ...item, [key]: value } : item)),
    })
  }

  function addItem() {
    onChange({ ...budget, items: [...budget.items, emptyItem()] })
  }

  function removeItem(id) {
    onChange({ ...budget, items: budget.items.filter((item) => item.id !== id) })
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="mb-3 text-lg font-semibold text-gray-800">Datos del cliente</h2>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          <label className={label} htmlFor="budgetform-1">N° de presupuesto</label>
          <input id="budgetform-1" className={field} value={budget.number} readOnly />
        </div>
        <div>
          <label className={label} htmlFor="budgetform-2">Fecha</label>
          <input id="budgetform-2"
            type="date"
            className={field}
            value={budget.date}
            onChange={(e) => set('date', e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={label} htmlFor="budgetform-3">Nombre del cliente</label>
          <input id="budgetform-3"
            className={field}
            spellCheck="true"
            lang="es"
            value={budget.client.name}
            onChange={(e) => setClient('name', e.target.value)}
          />
        </div>
        <div>
          <label className={label} htmlFor="budgetform-4">Dirección del trabajo</label>
          <input id="budgetform-4"
            className={field}
            spellCheck="true"
            lang="es"
            value={budget.client.address}
            onChange={(e) => setClient('address', e.target.value)}
          />
        </div>
        <div>
          <label className={label} htmlFor="budgetform-5">Teléfono del cliente</label>
          <input id="budgetform-5"
            type="tel"
            inputMode="tel"
            className={field}
            value={budget.client.phone}
            onChange={(e) => setClient('phone', e.target.value)}
            onBlur={(e) => setClient('phone', formatPhone(e.target.value))}
          />
        </div>
      </div>

      <div className="mb-3">
        <div className="mb-2 flex items-center justify-between">
          <span className={label + ' mb-0'}>Trabajos y materiales</span>
          <button
            type="button"
            onClick={addItem}
            className="rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Agregar trabajo
          </button>
        </div>

        <div className="space-y-2">
          {budget.items.map((item) => (
            <div key={item.id} className="rounded border border-gray-200 p-2">
              <div className="flex gap-2">
                <input
                  className={field}
                  spellCheck="true"
                  lang="es"
                  aria-label="Trabajo o material"
                  placeholder="Trabajo o material"
                  value={item.description}
                  onChange={(e) => setItem(item.id, 'description', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  disabled={budget.items.length === 1}
                  className="shrink-0 rounded border border-gray-300 px-2 text-xs text-gray-500 hover:bg-gray-50 disabled:opacity-30"
                  title="Eliminar trabajo"
                  aria-label="Eliminar trabajo"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
                </button>
              </div>
              <input
                className={field + ' mt-1.5'}
                spellCheck="true"
                lang="es"
                aria-label="Detalle (opcional)"
                placeholder="Detalle (opcional)"
                value={item.detail}
                onChange={(e) => setItem(item.id, 'detail', e.target.value)}
              />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className={label + ' mb-0.5'} htmlFor={"budgetform-6-" + item.id}>Cantidad</label>
                  <input id={"budgetform-6-" + item.id}
                    type="text"
                    inputMode="numeric"
                    className={field}
                    placeholder="Cantidad"
                    value={item.qty === '' ? '' : String(item.qty)}
                    onChange={(e) => {
                      if (/^\d*$/.test(e.target.value)) setItem(item.id, 'qty', e.target.value)
                    }}
                  />
                </div>
                <div>
                  <label className={label + ' mb-0.5'} htmlFor={"budgetform-7-" + item.id}>Precio unitario</label>
                  <input id={"budgetform-7-" + item.id}
                    type="text"
                    inputMode="decimal"
                    className={field}
                    placeholder="Precio unitario"
                    value={formatThousands(item.price)}
                    onChange={(e) => setItem(item.id, 'price', digitsOnly(e.target.value))}
                  />
                </div>
                <div className="col-span-2 flex items-center justify-between text-sm text-gray-700">
                  <span>Subtotal</span>
                  <strong className="tabular-nums">{formatCurrency(itemSubtotal(item))}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <label className="mb-4 flex min-h-12 items-center gap-3 text-base text-gray-700">
        <input
          type="checkbox"
          className="h-5 w-5 accent-teal-700"
          checked={budget.includeIVA}
          onChange={(e) => set('includeIVA', e.target.checked)}
        />
        Incluir IVA (19%)
      </label>

      <div>
        <label className={label} htmlFor="budgetform-8">Notas / condiciones</label>
        <textarea id="budgetform-8"
          className={field}
          spellCheck="true"
          lang="es"
          rows={3}
          placeholder="Validez de la oferta, forma de pago, garantía, etc."
          value={budget.notes}
          onChange={(e) => set('notes', e.target.value)}
        />
      </div>
    </section>
  )
}
