# Nexora Studio

Design & development studio for SMEs and entrepreneurs in Argentina. Built with HTML, CSS and JS.

## Stack

- HTML5 + SEO / Open Graph / Structured Data
- CSS custom properties + responsive design
- Vanilla JS with modular architecture
- Sentry-ready error monitoring (optional via env)
- Source maps disabled in production build for privacy

## Folder structure

```
src/
  css/style.css       # Source CSS
  js/script.js        # UI behaviors
  js/projects.js      # Portfolio data
css/style.min.css     # Production CSS
js/script.min.js      # Production JS
js/projects.min.js    # Production data
scripts/
  validate.mjs        # HTML validation
  watch.mjs           # Dev watcher
tests/                 # Playwright E2E tests
.github/workflows/    # CI pipeline
```

## Setup

```powershell
npm install
npm run build
npm test
```

## Dev server

```powershell
npm start
# or
npm run dev
```

Open `http://localhost:5500`.

## Build

Compiles `/src/` into `/css/` and `/js/`.

```powershell
npm run build
```

## Deploy

- Production: https://nexora-studio-ruddy.vercel.app
- Vercel project: `portafolio`
- Automatic deploy from `master` branch
- `vercel.json` includes legacy redirects + security headers + caching

## Environment variables

| Variable | Service | Required | Description |
|----------|---------|----------|-------------|
| `NEXORA_ANALYTICS_ID` | Google Analytics | optional | GA4 measurement ID (example: `G-XXXXXXXXXX`) |
| `NEXORA_SENTRY_DSN` | Sentry | optional | Browser DSN for error monitoring |

## Observability

- Analytics loaded conditionally when `NEXORA_ANALYTICS_ID` is present.
- Sentry initialized conditionally when `NEXORA_SENTRY_DSN` is present.
- To enable: add the env var in Vercel > Project Settings > Environment Variables and redeploy.

## Validation

```powershell
npm test
```

Checks HTML links, IDs, accessibility basics, and minified assets freshness.

```powershell
npx playwright test
```

Runs E2E tests for home, contact, and portfolio flows.
