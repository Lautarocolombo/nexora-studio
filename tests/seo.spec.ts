import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { META, NOT_FOUND_META, metaFor } from '../src/data/seo';
import { ROUTE_PATHS, NAV_ITEMS } from '../src/manifest';
import { SERVICES, STATS } from '../src/data/site';

test('toda ruta tiene title y description en ambos idiomas', () => {
  for (const path of ROUTE_PATHS) {
    for (const lang of ['es', 'en'] as const) {
      const meta = META[path]?.[lang];
      expect(meta?.title, `${path} (${lang}) sin title`).toBeTruthy();
      expect(meta?.description, `${path} (${lang}) sin description`).toBeTruthy();
      expect(meta!.description.length, `${path} (${lang}) description demasiado corta`).toBeGreaterThan(50);
      // Google recorta alrededor de los 160 caracteres.
      expect(meta!.description.length, `${path} (${lang}) description demasiado larga`).toBeLessThan(300);
    }
  }
});

test('no hay titles duplicados entre rutas', () => {
  const titles = ROUTE_PATHS.map((path) => META[path].es.title);
  expect(new Set(titles).size, 'hay títulos repetidos').toBe(titles.length);
});

test('cada ruta define su title en el documento', async ({ page }) => {
  for (const path of ROUTE_PATHS) {
    await page.goto(path);
    const title = await page.title();
    expect(title, `${path} no aplicó su title`).toBe(META[path].es.title);

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(META[path].es.description);

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe(`https://nexorastudio.com${path}`);
  }
});

test('la ruta 404 se marca como noindex', async ({ page }) => {
  await page.goto('/ruta-inexistente');
  expect(await page.title()).toBe(NOT_FOUND_META.es.title);

  const robots = await page.locator('meta[name="robots"]').getAttribute('content');
  expect(robots).toBe('noindex, follow');
});

test('los datos estructurados son JSON-LD válido', async ({ page }) => {
  await page.goto('/');
  const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(raw).toBeTruthy();

  const data = JSON.parse(raw!);
  expect(data['@type']).toBe('ProfessionalService');
  expect(data.name).toBe('Nexora Studio');
  expect(data.address.addressLocality).toBe('Gualeguay');
  expect(data.email).toBe('contacto@nexorastudio.com');
});

test('metaFor cae en el 404 para rutas desconocidas', () => {
  expect(metaFor('/no-existe', 'es').title).toBe(NOT_FOUND_META.es.title);
  expect(metaFor('/no-existe', 'en').title).toBe(NOT_FOUND_META.en.title);
  expect(metaFor('/', 'es').title).toBe(META['/'].es.title);
});

test('el index.html declara los metadatos base', () => {
  const html = readFileSync('index.html', 'utf8');
  expect(html).toContain('<html lang="es"');
  expect(html).toContain('rel="canonical"');
  expect(html).toContain('name="theme-color"');
});

test('no quedan textos corruptos en los datos', () => {
  const files = [
    'src/data/seo.js',
    'src/data/site.js',
    'src/data/portfolio.js',
    'src/components/portfolio/ProjectShowcase.jsx',
  ];
  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    expect(content, `${file} contiene un carácter de reemplazo (mojibake)`).not.toMatch(/�/);
    // Rangos CJK: ningún texto del sitio está en chino.
    expect(content, `${file} contiene caracteres CJK`).not.toMatch(/[一-鿿]/);
  }
});

test('los datos de negocio son consistentes', () => {
  expect(SERVICES.length).toBe(4);
  expect(SERVICES.every((s) => s.price > 0)).toBe(true);
  expect(STATS.length).toBe(3);
  expect(NAV_ITEMS.every((n) => ROUTE_PATHS.includes(n.path))).toBe(true);
});
