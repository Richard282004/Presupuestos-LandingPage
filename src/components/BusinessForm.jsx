import { useRef } from 'react'
import { compressImage } from '../lib/image'

const field =
  'w-full rounded border border-gray-300 px-2.5 py-1.5 text-sm text-gray-900 focus:border-gray-500 focus:outline-none'
const label = 'block text-xs font-medium text-gray-500 mb-1'

export default function BusinessForm({ business, onChange }) {
  const fileInput = useRef(null)

  function set(key, value) {
    onChange({ ...business, [key]: value })
  }

  async function handleLogoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await compressImage(file, 280)
      set('logo', dataUrl)
    } catch {
      alert('No se pudo procesar la imagen. Intenta con otra.')
    }
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="mb-3 text-sm font-semibold text-gray-800">Datos del negocio</h2>

      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded border border-gray-200 bg-gray-50">
          {business.logo ? (
            <img src={business.logo} alt="Logo" className="h-full w-full object-contain" />
          ) : (
            <div
              className="h-8 w-8 rounded"
              style={{ backgroundColor: business.accentColor }}
            />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="rounded border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            {business.logo ? 'Cambiar logo' : 'Subir logo'}
          </button>
          {business.logo && (
            <button
              type="button"
              onClick={() => set('logo', null)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Quitar logo
            </button>
          )}
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className={label}>Nombre del negocio</label>
          <input
            className={field}
            spellCheck="true"
            lang="es"
            value={business.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Gasfitería Rodríguez"
          />
        </div>
        <div className="col-span-2">
          <label className={label}>Rubro / especialidad</label>
          <input
            className={field}
            spellCheck="true"
            lang="es"
            value={business.specialty}
            onChange={(e) => set('specialty', e.target.value)}
            placeholder="Gasfitería y electricidad"
          />
        </div>
        <div>
          <label className={label}>Teléfono</label>
          <input
            type="tel"
            inputMode="tel"
            className={field}
            value={business.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="+56 9 1234 5678"
          />
        </div>
        <div>
          <label className={label}>RUT (opcional)</label>
          <input
            type="text"
            inputMode="numeric"
            className={field}
            value={business.rut}
            onChange={(e) => set('rut', e.target.value)}
            placeholder="12.345.678-9"
          />
        </div>
        <div className="col-span-2">
          <label className={label}>Dirección</label>
          <input
            className={field}
            spellCheck="true"
            lang="es"
            value={business.address}
            onChange={(e) => set('address', e.target.value)}
            placeholder="Av. Siempre Viva 123, Santiago"
          />
        </div>
        <div className="col-span-2">
          <label className={label}>Email o Instagram</label>
          <input
            className={field}
            value={business.contact}
            onChange={(e) => set('contact', e.target.value)}
            placeholder="@gasfiteria.rodriguez"
          />
        </div>
        <div>
          <label className={label}>Color de acento</label>
          <input
            type="color"
            value={business.accentColor}
            onChange={(e) => set('accentColor', e.target.value)}
            className="h-9 w-full cursor-pointer rounded border border-gray-300"
          />
        </div>
      </div>
    </section>
  )
}
