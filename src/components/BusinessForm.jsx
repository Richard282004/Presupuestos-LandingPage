import { useRef, useState } from 'react'
import { compressImage } from '../lib/image'
import { cleanRUT, formatRUT } from '../lib/format'

const field =
  'w-full min-h-12 rounded border border-gray-300 px-3 py-2.5 text-base text-gray-900 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20'
const label = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function BusinessForm({ business, onChange }) {
  const fileInput = useRef(null)
  const [expanded, setExpanded] = useState(() => !business.name.trim())

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
      <button type="button" className="flex w-full items-center justify-between gap-3 text-left" aria-expanded={expanded} aria-controls="business-fields" onClick={() => setExpanded(!expanded)}>
        <span className="min-w-0">
          <span className="block font-semibold text-gray-800">Mi negocio</span>
          {!expanded && <span className="block truncate text-sm text-gray-600">{business.name || 'Completar datos'}</span>}
        </span>
        <span className="text-sm font-medium text-teal-800">{expanded ? 'Cerrar' : 'Editar'}</span>
      </button>
      <div id="business-fields" hidden={!expanded} className="mt-4">
      <p className="mb-4 text-sm text-gray-600">Completa estos datos una vez. Se recordarán en este navegador.</p>

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
          <label className={label} htmlFor="businessform-1">Nombre del negocio</label>
          <input id="businessform-1"
            className={field}
            spellCheck="true"
            lang="es"
            value={business.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Gasfitería Rodríguez"
          />
        </div>
        <div className="col-span-2">
          <label className={label} htmlFor="businessform-2">Rubro / especialidad</label>
          <input id="businessform-2"
            className={field}
            spellCheck="true"
            lang="es"
            value={business.specialty}
            onChange={(e) => set('specialty', e.target.value)}
            placeholder="Gasfitería y electricidad"
          />
        </div>
        <div>
          <label className={label} htmlFor="businessform-3">Teléfono</label>
          <input id="businessform-3"
            type="tel"
            inputMode="tel"
            className={field}
            value={business.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="+56 9 1234 5678"
          />
        </div>
        <div>
          <label className={label} htmlFor="businessform-4">RUT (opcional)</label>
          <input id="businessform-4"
            type="text"
            autoCapitalize="characters"
            className={field}
            value={formatRUT(business.rut)}
            onChange={(e) => set('rut', cleanRUT(e.target.value))}
            placeholder="12.345.678-9"
            maxLength={12}
          />
        </div>
        <div className="col-span-2">
          <label className={label} htmlFor="businessform-5">Dirección</label>
          <input id="businessform-5"
            className={field}
            spellCheck="true"
            lang="es"
            value={business.address}
            onChange={(e) => set('address', e.target.value)}
            placeholder="Av. Siempre Viva 123, Santiago"
          />
        </div>
        <div className="col-span-2">
          <label className={label} htmlFor="businessform-6">Email o Instagram</label>
          <input id="businessform-6"
            className={field}
            value={business.contact}
            onChange={(e) => set('contact', e.target.value)}
            placeholder="@gasfiteria.rodriguez"
          />
        </div>
        <div>
          <label className={label} htmlFor="businessform-7">Color de acento</label>
          <input id="businessform-7"
            type="color"
            value={business.accentColor}
            onChange={(e) => set('accentColor', e.target.value)}
            className="h-9 w-full cursor-pointer rounded border border-gray-300"
          />
        </div>
      </div>
      <button type="button" className="mt-4 w-full rounded bg-gray-900 px-4 py-3 font-medium text-white" onClick={() => setExpanded(false)}>Listo</button>
      </div>
    </section>
  )
}
