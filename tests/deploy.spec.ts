import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { ROUTE_PATHS, NAV_ITEMS } from '../src/manifest';

const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));

test('vercel.json reescribe exactamente las rutas de la app', () => {
  const rewrites = new Set((vercel.rewrites ?? []).map((r) => r.source));

  // Cada ruta de la app debe tener su rewrite: sin él, el hard refresh
  // en producción devuelve 404 aunque en dev funcione.
  for (const path of ROUTE_PATHS) {
    expect(rewrites.has(path), `falta el rewrite de "${path}" en vercel.json`).toBe(true);
  }

  // Y no deberían quedar rewrites de rutas que ya no existen.
  for (const source of rewrites) {
    expect(ROUTE_PATHS, `vercel.json reescribe "${source}" pero la app no la tiene`).toContain(source);
  }
});

test('vercel.json redirige las URLs legacy .html', () => {
  const targets = new Map(
    (vercel.redirects ?? []).map((r) => [r.source.replace(/:\w+$/, ''), r.destination]),
  );

  for (const path of ROUTE_PATHS) {
    const legacy = path === '/' ? '/index.html' : `${path}.html`;
    expect(targets.get(legacy), `falta el redirect de "${legacy}"`).toBe(path);
  }
});

test('el build genera un 404.html real', () => {
  // Sin esto, una URL desconocida devuelve 200 con la home (soft 404).
  expect(() => readFileSync('dist/404.html', 'utf8')).not.toThrow();
  expect(readFileSync('dist/404.html', 'utf8')).toContain('/assets/');
});

test('el navbar expone solo rutas que existen', () => {
  const paths = NAV_ITEMS.map((r) => r.path);
  expect(paths).toEqual(['/', '/nosotros', '/yo', '/servicios', '/portfolio', '/contacto']);
  for (const path of paths) {
    expect(ROUTE_PATHS).toContain(path);
  }
});

test('las cabeceras de seguridad siguen puestas', () => {
  const all = JSON.stringify(vercel.headers);
  for (const header of [
    'X-Content-Type-Options',
    'X-Frame-Options',
    'Referrer-Policy',
    'Permissions-Policy',
  ]) {
    expect(all).toContain(header);
  }
  // Los assets hasheados pueden cachearse para siempre.
  const assets = (vercel.headers ?? []).find((h) => h.source === '/assets/(.*)');
  expect(assets?.headers?.[0]?.value).toContain('immutable');
});

/**
 * Render es el segundo destino de deploy. Se lee como texto (no hay parser
 * de YAML en devDependencies) porque solo hay que verificar un puñado de
 * valores, no parsear el documento entero.
 */
const renderYaml = readFileSync('render.yaml', 'utf8');

test('render.yaml publica el build de Vite como sitio estatico', () => {
  expect(renderYaml).toContain('runtime: static');
  expect(renderYaml).toMatch(/staticPublishPath:\s*\.?\/?dist/);
  expect(renderYaml).toMatch(/buildCommand:\s*"?npm ci && npm run build/);
});

test('render.yaml no define startCommand', () => {
  // Un sitio estatico no corre un proceso: un startCommand fue lo que
  // provoco el "node index.html" y el SyntaxError del deploy original.
  expect(renderYaml).not.toContain('startCommand');
});

test('render.yaml reescribe exactamente las rutas de la app', () => {
  // El rewrite es por ruta, no un catch-all: asi una URL inexistente cae en
  // 404.html y responde con status 404 en vez de un 200 con NotFound.
  const rewrites = [...renderYaml.matchAll(/source:\s*(\S+)/g)]
    .map((m) => m[1].replace(/^["']|["']$/g, ''))
    .filter((s) => s !== '/*');

  for (const path of ROUTE_PATHS) {
    expect(rewrites, `falta el rewrite de "${path}" en render.yaml`).toContain(path);
  }
  // Y no deberían quedar rewrites de rutas que ya no existen.
  for (const source of rewrites) {
    expect(ROUTE_PATHS, `render.yaml reescribe "${source}" pero la app no la tiene`).toContain(source);
  }
  // Todas apuntan al entrypoint.
  const destinations = [...renderYaml.matchAll(/destination:\s*(\S+)/g)].map((m) => m[1]);
  expect(destinations.length).toBeGreaterThan(0);
  for (const d of destinations) {
    expect(d, `el rewrite apunta a "${d}" y no a index.html`).toBe('/index.html');
  }
});

test('render.yaml no usa catch-all ni startCommand', () => {
  // Un sitio estatico no corre un proceso: un startCommand fue lo que
  // provoco el "node index.html" y el SyntaxError del deploy original.
  expect(renderYaml).not.toContain('startCommand');
  // Un catch-all `/* -> /index.html` devolveria 200 para URLs inexistentes.
  expect(renderYaml).not.toMatch(/source:\s*\/\*/);
});

test('render.yaml cachea los assets hasheados pero no el entrypoint', () => {
  const immutable = renderYaml.match(/\/assets\/\*[\s\S]*?value:\s*(.+)/);
  expect(immutable?.[1]).toContain('immutable');

  // La home y /index.html deben revalidarse en cada visita.
  expect(renderYaml).toMatch(/path:\s*\/\s*\n\s*name:\s*Cache-Control\s*\n\s*value:\s*public, max-age=0/);
  expect(renderYaml).toMatch(/\/index\.html\s*\n\s*name:\s*Cache-Control\s*\n\s*value:\s*public, max-age=0/);
});
