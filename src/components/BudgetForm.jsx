import { emptyItem } from '../lib/budget'
import { formatCurrency, formatThousands, digitsOnly } from '../lib/format'
import { itemSubtotal } from '../lib/totals'

const field =
  'w-full rounded border border-gray-300 px-2.5 py-1.5 text-sm text-gray-900 focus:border-gray-500 focus:outline-none'
const label = 'block text-xs font-medium text-gray-500 mb-1'

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
      <h2 className="mb-3 text-sm font-semibold text-gray-800">Presupuesto</h2>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          <label className={label}>N° de presupuesto</label>
          <input className={field} value={budget.number} readOnly />
        </div>
        <div>
          <label className={label}>Fecha</label>
          <input
            type="date"
            className={field}
            value={budget.date}
            onChange={(e) => set('date', e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className={label}>Nombre del cliente</label>
          <input
            className={field}
            spellCheck="true"
            lang="es"
            value={budget.client.name}
            onChange={(e) => setClient('name', e.target.value)}
          />
        </div>
        <div>
          <label className={label}>Dirección del trabajo</label>
          <input
            className={field}
            spellCheck="true"
            lang="es"
            value={budget.client.address}
            onChange={(e) => setClient('address', e.target.value)}
          />
        </div>
        <div>
          <label className={label}>Teléfono del cliente</label>
          <input
            type="tel"
            inputMode="tel"
            className={field}
            value={budget.client.phone}
            onChange={(e) => setClient('phone', e.target.value)}
          />
        </div>
      </div>

      <div className="mb-3">
        <div className="mb-2 flex items-center justify-between">
          <span className={label + ' mb-0'}>Ítems</span>
          <button
            type="button"
            onClick={addItem}
            className="rounded border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            + Agregar ítem
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
                  placeholder="Descripción"
                  value={item.description}
                  onChange={(e) => setItem(item.id, 'description', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  disabled={budget.items.length === 1}
                  className="shrink-0 rounded border border-gray-300 px-2 text-xs text-gray-500 hover:bg-gray-50 disabled:opacity-30"
                  title="Eliminar ítem"
                >
                  ✕
                </button>
              </div>
              <input
                className={field + ' mt-1.5'}
                spellCheck="true"
                lang="es"
                placeholder="Detalle (opcional)"
                value={item.detail}
                onChange={(e) => setItem(item.id, 'detail', e.target.value)}
              />
              <div className="mt-1.5 grid grid-cols-3 gap-2">
                <div>
                  <label className={label + ' mb-0.5'}>Cantidad</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={field}
                    placeholder="Cantidad"
                    value={item.qty === '' ? '' : String(item.qty)}
                    onChange={(e) => setItem(item.id, 'qty', digitsOnly(e.target.value))}
                  />
                </div>
                <div>
                  <label className={label + ' mb-0.5'}>Precio</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    className={field}
                    placeholder="Precio unitario"
                    value={formatThousands(item.price)}
                    onChange={(e) => setItem(item.id, 'price', digitsOnly(e.target.value))}
                  />
                </div>
                <div className="flex items-end justify-end px-1 pb-1.5 text-sm text-gray-600">
                  {formatCurrency(itemSubtotal(item))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <label className="mb-3 flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={budget.includeIVA}
          onChange={(e) => set('includeIVA', e.target.checked)}
        />
        Incluir IVA (19%)
      </label>

      <div>
        <label className={label}>Notas / condiciones</label>
        <textarea
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
