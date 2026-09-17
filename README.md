# Presupuestos

Generador de presupuestos/cotizaciones para negocios de servicios (gasfitería,
electricidad, etc.). Sin backend: todo se guarda en `localStorage` del
navegador. Pensado para desplegarse como sitio estático en Cloudflare Pages.

## Stack

- React + Vite + Tailwind CSS
- Persistencia 100% local (`localStorage`)
- `window.print()` + estilos `@media print` para exportar el presupuesto a PDF

## Desarrollo local

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (por defecto `http://localhost:5173`).

## Build

```bash
npm run build
```

Genera el sitio estático en `dist/`.

## Uso

1. Completa **Datos del negocio** (nombre, rubro, teléfono, RUT, dirección,
   contacto, logo y color de acento). Se guardan automáticamente.
2. Completa el presupuesto: datos del cliente, ítems (con cantidad, precio y
   detalle opcional), si incluye IVA, y notas/condiciones.
3. La vista previa a la derecha se actualiza en tiempo real con el diseño
   final del documento.
4. **Guardar en historial** guarda una copia del presupuesto actual.
   **Historial** permite volver a cargarlo o eliminarlo.
5. **Descargar / Imprimir PDF** abre el diálogo de impresión del navegador
   mostrando solo el documento (usa "Guardar como PDF" en el diálogo).

## Despliegue en Cloudflare Pages

### Opción A: conectar el repositorio (dashboard)

1. Sube el proyecto a GitHub/GitLab.
2. En el dashboard de Cloudflare → **Workers & Pages** → **Create** →
   **Pages** → **Connect to Git**, selecciona el repositorio.
3. Configura:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Deploy. Cloudflare reconstruye el sitio en cada push.

### Opción B: Wrangler CLI (deploy manual)

```bash
npm install -g wrangler   # si no lo tienes instalado
npm run build
npx wrangler pages deploy dist
```

La primera vez, Wrangler pedirá autenticarse (`npx wrangler login`) y el
nombre del proyecto de Pages a crear/usar (puedes usar el `name` de
`wrangler.toml`).

### Variables de entorno / secretos

Este proyecto **no requiere ninguna variable de entorno** hoy: es un sitio
100% estático sin backend. Si en el futuro agregas un backend o una API key:

- Nunca la commitees en el repo ni la hardcodees en el código.
- Léela con `import.meta.env.VITE_*` (ver `.env.example`).
- En Cloudflare Pages, configúrala en el dashboard del proyecto en
  **Settings → Environment variables** (no en el repositorio).

## Seguridad

- No hay credenciales ni API keys en el código fuente.
- `.gitignore` excluye `node_modules`, `dist`, `.env*` y `.wrangler/`.
- `.env.example` documenta qué variables existirían, sin valores reales.
