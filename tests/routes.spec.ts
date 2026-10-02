import { test, expect } from '@playwright/test';

/** Cada ruta y un texto que solo aparece si la página fue portada de verdad. */
const ROUTES = [
  { path: '/', h1: /Transformamos ideas/i },
  { path: '/servicios', h1: /Servicios web a medida/i },
  { path: '/nosotros', h1: /Un estudio digital del interior/i },
  { path: '/yo', h1: /Damian Richard/ },
  { path: '/portfolio', h1: /Nuestros trabajos/i },
  { path: '/contacto', h1: /escalar tu presencia digital/i },
  { path: '/privacidad', h1: /Política de Privacidad/i },
  { path: '/terminos', h1: /Términos de Servicio/i },
  { path: '/ruta-inexistente', h1: /Página no.*encontrada/s },
];

for (const { path, h1 } of ROUTES) {
  test(`${path} renderiza su contenido`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('h1').first()).toHaveText(h1);
  });

  test(`${path} no tiene scroll horizontal`, async ({ page }) => {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test('el navbar enlaza todas las rutas y responden 200', async ({ page }) => {
  await page.goto('/');
  const paths = await page
    .locator('header nav a[href]')
    .evaluateAll((els) => [...new Set(els.map((e) => new URL(e.href).pathname))]);

  expect(paths).toEqual(
    expect.arrayContaining(['/', '/nosotros', '/yo', '/servicios', '/portfolio', '/contacto']),
  );

  for (const p of paths) {
    const response = await page.request.get(p);
    expect(response.status(), `${p} debe responder 200`).toBe(200);
  }
});

test('la home conserva los servicios y precios originales', async ({ page }) => {
  await page.goto('/servicios');
  const text = (await page.locator('main').innerText()).replace(/\s+/g, ' ');

  for (const needle of [
    'Landing Pages',
    'Sitios Corporativos',
    'Tiendas Online',
    'Apps y Sistemas',
    '$350',
    '$2,000',
    '3–5 días',
    'Brief y estrategia',
  ]) {
    expect(text, `servicios debe conservar "${needle}"`).toContain(needle);
  }
});

test('el toggle de idioma cambia el contenido a inglés', async ({ page }) => {
  await page.goto('/servicios');
  await page.getByRole('button', { name: /Switch to English/i }).click();

  await expect(page.locator('h1').first()).toContainText('Custom web services');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('main')).toContainText('Corporate Sites');
});
