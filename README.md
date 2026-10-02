# Nexora Studio

Design & development studio for SMEs and entrepreneurs in Argentina.
SPA en React, construida con Vite y Tailwind CSS.

## Stack

- React 19 + React Router 7 (SPA, `BrowserRouter`)
- Vite 8 como bundler y dev server
- Tailwind CSS 4 vía `@tailwindcss/vite`
- i18n propio (ES/EN) con toggle en el sitio y persistencia en localStorage
- Analitica GA4 opcional, activada por variable de entorno
- Playwright para E2E, a11y, contraste y SEO

## Folder structure

```
src/
  main.jsx              # Entry: BrowserRouter + LanguageProvider + analytics
  App.jsx               # Shell: Navbar, Footer, rutas, WhatsAppFloat
  manifest.js           # Rutas y nav como datos puros (los leen los tests)
  routes.js             # Asocia cada ruta del manifiesto con su componente
  index.css             # Tailwind + custom properties
  assets/portfolio/     # Capturas del portfolio (importadas por Vite)
  components/           # Navbar, Footer, ThemeToggle, portfolio/, ui
  pages/                # Home, Services, About, AboutMe, Portfolio, Contact...
  data/                 # portfolio.js, site.js
  i18n/                 # LanguageContext (ES/EN)
  lib/                  # analytics.js, siteConfig.js
public/                 # favicon, manifest, og-image, robots.txt, sitemap.xml
scripts/
  postbuild.mjs         # Genera dist/404.html
  verify.mjs            # Levanta vite preview y corre los dos verify
  verify-site.mjs       # Rutas, contenido, i18n, formulario, teclado
  verify-portfolio.mjs  # Datos del portfolio
tests/                  # Playwright: rutas, contacto, portfolio, a11y,
                        # contraste, SEO y deploy
render.yaml             # Blueprint de Render (sitio estatico)
vercel.json             # Deploy en Vercel
```

## Setup

```powershell
npm ci
npm run build
```

## Scripts

| Comando | Que hace |
|---------|----------|
| `npm run dev` | Dev server de Vite con HMR |
| `npm run build` | `vite build` a `dist/` + genera `dist/404.html` |
| `npm run preview` | Sirve `dist/` en el puerto 4173 |
| `npm run verify` | Build + preview + verificacion de sitio y portfolio |
| `npm run test:e2e` | Suite de Playwright |

No hay `start`: es un sitio estatico, no corre un proceso de Node.

## Deploy

El build produce `dist/`. Ese directorio es lo que se publica, en los dos destinos.

### Render (sitio estatico)

Definido en `render.yaml`, asi que el deploy se crea desde el Blueprint:

- Runtime: `static`
- Build Command: `npm ci && npm run build`
- Publish Directory: `dist`
- Rewrite `/*` → `/index.html` (obligatorio: la app usa `BrowserRouter`)

> El `index.html` de la raiz es la plantilla de Vite, no el sitio. Publicar
> la raiz serviria HTML roto. Lo que se publica es `dist/`.

### Vercel

`vercel.json` maneja los rewrites por ruta, los redirects de las URLs legacy
`.html`, las cabeceras de seguridad y el cache de los assets hasheados.

### Agregar una ruta nueva

Hay cuatro lugares que deben coincidir:

1. `src/manifest.js` (`ROUTE_PATHS`)
2. `src/routes.js` (componente asociado)
3. `vercel.json` (rewrite + redirect legacy)
4. `sitemap.xml` (en `public/`)

`render.yaml` no necesita cambios: su catch-all cubre cualquier ruta nueva.
El test `tests/deploy.spec.ts` falla si alguno de los anteriores queda fuera.

## Variables de entorno

| Variable | Requerida | Description |
|----------|-----------|-------------|
| `VITE_SITE_URL` | no | Origen canonico del sitio, default `https://nexorastudio.com` |
| `VITE_ANALYTICS_ID` | no | ID de medicion GA4 (ej: `G-XXXXXXXXXX`) |

Vite solo expone variables con prefijo `VITE_`, y las lee en **tiempo de build**.
Un sitio estatico no puede leer variables del entorno en runtime.

Configuralas en `.env.local` (no se commitea) o en el panel del proveedor, y
redeploy. Sin `VITE_ANALYTICS_ID`, `initAnalytics()` no hace nada: cero
requests a terceros y cero cookies.

## Tests

```powershell
npm run verify     # verificacion funcional sobre el build
npm run test:e2e   # suite Playwright completa
```

`playwright.config.ts` levanta su propio preview con `reuseExistingServer: false`.
Esto es a proposito: si quedara un preview de una sesion anterior, la suite
mediria un `dist` obsoleto en vez del build recien generado.

## Agregar un proyecto al portfolio

1. Poné las capturas en `src/assets/portfolio/<slug>/` (~1600 px de ancho).
2. Agregá la entrada en `src/data/portfolio.js`.
3. `npm run build && npm run test:e2e`.

Las imagenes se importan desde `src/`, asi que Vite las hashea y las emite a
`dist/assets/`. No hay rutas absolutas que puedan romperse por mayusculas.