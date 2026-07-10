# Nexora Studio

Design & development studio for SMEs and entrepreneurs in Argentina. Built with HTML, CSS and JS.

## Stack

- HTML5 + SEO / Open Graph / Structured Data
- CSS custom properties + responsive design
- Vanilla JS with modular architecture
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

- Link repo to Vercel
- Keep `vercel.json` redirects for legacy asset paths
- Update `package.json` `buildCommand` if needed

## Validation

```powershell
npm test
```

Checks HTML links, IDs, accessibility basics, and minified assets freshness.
