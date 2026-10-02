import { chromium } from '@playwright/test';

const BASE = 'http://localhost:4173';
const results = [];
const check = (name, pass, extra = '') => {
  // El `extra` se guarda: si no, los diagnósticos no se pueden leer
  // programáticamente y solo quedan en la consola.
  results.push({ name, pass, extra });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${extra ? ` — ${extra}` : ''}`);
};

/**
 * Cada ruta con un texto que SOLO puede estar si la página fue portada
 * de verdad. Si alguien saca el contenido, esto falla.
 */
const ROUTES = [
  { path: '/', h1: /Transformamos ideas/i, min: 1200 },
  { path: '/servicios', h1: /Servicios web a medida/i, min: 2000 },
  { path: '/nosotros', h1: /Un estudio digital del interior/i, min: 1200 },
  { path: '/yo', h1: /Damian Richard/, min: 900 },
  { path: '/portfolio', h1: /Nuestros trabajos/i, min: 300 },
  { path: '/contacto', h1: /escalar tu presencia digital/i, min: 1200 },
  { path: '/privacidad', h1: /Política de Privacidad/i, min: 1200 },
  { path: '/terminos', h1: /Términos de Servicio/i, min: 1200 },
  { path: '/ruta-inexistente', h1: /Página no.*encontrada/s, min: 150 },
];

const browser = await chromium.launch();
const errors = [];

/** Texto visible de la página, sin contar el navbar/footer. */
const mainText = async (page) =>
  (await page.locator('main').innerText()).replace(/\s+/g, ' ').trim();

// ─── 1. Todas las rutas responden con su contenido ───
for (const route of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on('pageerror', (e) => errors.push(`${route.path}: ${e.message}`));
  page.on('console', (m) => m.type() === 'error' && errors.push(`${route.path}: ${m.text()}`));

  await page.goto(BASE + route.path, { waitUntil: 'networkidle' });

  const h1 = await page.locator('h1').first().textContent();
  check(`${route.path} renderiza su H1`, route.h1.test(h1 ?? ''), (h1 ?? '').slice(0, 52));

  const text = await mainText(page);
  check(`${route.path} conserva contenido`, text.length >= route.min, `${text.length} chars`);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  check(`${route.path} sin scroll horizontal`, overflow <= 0, `overflow=${overflow}`);

  await page.close();
}

// ─── 2. Enlaces del navbar llevan a rutas reales ───
{
  const page = await browser.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const hrefs = await page
    .locator('header nav a[href]')
    .evaluateAll((els) => [...new Set(els.map((e) => new URL(e.href).pathname))]);

  const expected = ['/', '/nosotros', '/yo', '/servicios', '/portfolio', '/contacto'];
  const missing = expected.filter((p) => !hrefs.includes(p));
  check('Navbar enlaza las 6 rutas', missing.length === 0, missing.join(','));

  for (const p of hrefs) {
    const res = await page.request.get(BASE + p);
    check(`${p} responde 200`, res.status() === 200, `${res.status()}`);
  }
  await page.close();
}

// ─── 3. Contenido clave que no puede perderse ───
{
  const page = await browser.newPage();
  await page.goto(BASE + '/servicios', { waitUntil: 'networkidle' });
  const text = await mainText(page);
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
    check(`servicios conserva "${needle}"`, text.includes(needle));
  }
  await page.close();
}

// ─── 4. Toggle de idioma ───
{
  const page = await browser.newPage();
  await page.goto(BASE + '/servicios', { waitUntil: 'networkidle' });
  check('ES: título en español', (await page.locator('h1').first().textContent())?.includes('Servicios web'));

  await page.locator('button[aria-label*="English"]').click();
  await page.waitForTimeout(300);
  const h1 = await page.locator('h1').first().textContent();
  check('EN: cambia a inglés', h1?.includes('Custom web services'), h1?.slice(0, 40));
  check('EN: lang del documento', (await page.getAttribute('html', 'lang')) === 'en');

  const text = await mainText(page);
  check('EN: conserva "Corporate Sites"', text.includes('Corporate Sites'));
  await page.close();
}

// ─── 5. Formulario de contacto → WhatsApp ───
{
  const page = await browser.newPage();
  await page.goto(BASE + '/contacto', { waitUntil: 'networkidle' });

  // Validación: vacío no abre nada.
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(200);
  check('Form: valida campos vacíos', await page.locator('[role="alert"]').isVisible());

  await page.fill('#contactName', 'Ana');
  await page.fill('#contactMessage', 'Quiero una tienda online');
  const [popup] = await Promise.all([
    page.waitForEvent('popup', { timeout: 5000 }).catch(() => null),
    page.locator('button[type="submit"]').click(),
  ]);
  const url = popup?.url() ?? '';
  // wa.me redirige a api.whatsapp.com: ambas son válido.
  check(
    'Form: abre WhatsApp con el número correcto',
    /wa\.me\/5493444517496|api\.whatsapp\.com.*5493444517496/.test(url),
    url.slice(0, 46),
  );
  check('Form: incluye el nombre', decodeURIComponent(url).includes('Ana'));
  if (popup) await popup.close();

  // Honeypot: si se llena el campo oculto, no debe abrir nada.
  await page.evaluate(() => {
    const el = document.querySelector('#contactCompany');
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(el, 'spam-bot');
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  const before = page.context().pages().length;
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(700);
  check('Form: honeypot bloquea bots', page.context().pages().length === before);
  await page.close();
}

// ─── 6. Navegación por teclado y foco visible ───
{
  const page = await browser.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });

  // La página no debe autodesplazarse al cargar.
  await page.waitForTimeout(600);
  const scrolled = await page.evaluate(() => window.scrollY);
  check('Home no se autodesplaza al cargar', scrolled === 0, `scrollY=${scrolled}`);

  await page.keyboard.press('Tab');
  const firstFocus = await page.evaluate(() => ({
    text: (document.activeElement?.textContent || '').trim(),
    rect: (() => {
      const r = document.activeElement?.getBoundingClientRect();
      return r ? `${Math.round(r.width)}x${Math.round(r.height)}` : '';
    })(),
    outline: getComputedStyle(document.activeElement).outlineStyle,
  }));
  check('Primer Tab: skip link', firstFocus.text.includes('Saltar'), firstFocus.text);
  check('Skip link se hace visible al enfocar', firstFocus.rect !== '1x1', firstFocus.rect);
  check('Foco visible', firstFocus.outline === 'solid', firstFocus.outline);

  // La navegación por teclado dentro de la SPA no debe recargar.
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.locator('header nav a[href="/servicios"]').first().focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);
  check('SPA: navega sin recargar', new URL(page.url()).pathname === '/servicios');
  await page.close();
}

// ─── 7. Sin descargas ───
{
  const page = await browser.newPage();
  let clean = true;
  const offenders = [];
  for (const path of ['/', '/portfolio', '/yo']) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    const html = await page.content();
    if (/\.pptx/i.test(html)) {
      clean = false;
      offenders.push(`${path}: .pptx`);
    }
    const iframes = await page.locator('iframe').count();
    if (iframes) {
      clean = false;
      offenders.push(`${path}: ${iframes} iframe(s)`);
    }
    const downloads = await page.locator('[download]').count();
    if (downloads) {
      clean = false;
      offenders.push(`${path}: ${downloads} download`);
    }
  }
  // Antes este check se emitía con `true` fijo y mostraba PASS aunque las
  // tres condiciones fallaran.
  check('Sin descargas en /, /portfolio, /yo', clean, offenders.join(', ') || 'limpio');
  await page.close();
}

// ─── 8. El teclado NO avanza dos imágenes en la tira de miniaturas ───
{
  const page = await browser.newPage();
  await page.goto(BASE + '/portfolio', { waitUntil: 'networkidle' });

  // El bug: la tira y la raíz del visor compartían el listener de ←/→, así
  // que un ArrowRight sobre una miniatura avanzaba dos posiciones.
  await page.locator('button[aria-label^="Ver imagen"]').first().focus();
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(250);
  const afterOne = await page.locator('text=/^\\d+ \\/ 7$/').first().textContent();
  check('Tira: un ArrowRight avanza una imagen', afterOne?.trim() === '2 / 7', afterOne?.trim());

  // Wrap: desde la última, una flecha debe volver a la primera.
  await page.locator('button[aria-label^="Ver imagen 7"]').click();
  await page.waitForTimeout(250);
  await page.locator('button[aria-label^="Ver imagen"]').first().focus();
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(250);
  const wrapped = await page.locator('text=/^\\d+ \\/ 7$/').first().textContent();
  check('Tira: el wrap de la última vuelve a la primera', wrapped?.trim() === '1 / 7', wrapped?.trim());

  await page.close();
}

// ─── 9. El foco no se escapa del lightbox al navegar ───
{
  const page = await browser.newPage();
  await page.goto(BASE + '/portfolio', { waitUntil: 'networkidle' });
  await page.locator('button[aria-label^="Ampliar"]').click();
  await page.waitForSelector('[role="dialog"]');

  const focusStaysInside = [];
  for (let i = 0; i < 3; i += 1) {
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(150);
    focusStaysInside.push(
      await page.evaluate(() => Boolean(document.activeElement?.closest('[role="dialog"]'))),
    );
  }
  check(
    'Lightbox: el foco queda dentro al navegar',
    focusStaysInside.every(Boolean),
    focusStaysInside.join(','),
  );

  const scrollLocked = await page.evaluate(() => document.body.style.overflow);
  check('Lightbox: el scroll del body sigue bloqueado', scrollLocked === 'hidden', scrollLocked);

  await page.close();
}

// ─── 10. El email del formulario no se pierde ───
{
  const page = await browser.newPage();
  await page.goto(BASE + '/contacto', { waitUntil: 'networkidle' });
  await page.fill('#contactName', 'Ana');
  await page.fill('#contactEmail', 'ana@empresa.com');
  await page.fill('#contactMessage', 'Necesito una tienda');

  const [popup] = await Promise.all([
    page.waitForEvent('popup', { timeout: 5000 }).catch(() => null),
    page.locator('button[type="submit"]').click(),
  ]);
  const message = decodeURIComponent(popup?.url() ?? '').replace(/\+/g, ' ');
  check('Form: incluye el email', message.includes('ana@empresa.com'), message.slice(0, 90));
  check('Form: omite el servicio si no se eligió', !message.includes('consultar por:'), message.slice(0, 90));
  if (popup) await popup.close();
  await page.close();
}

// ─── 11. El skip link mueve el foco, no solo el scroll ───
{
  const page = await browser.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
  const focusInsideMain = await page.evaluate(() => {
    const el = document.activeElement;
    return el?.id === 'main' || Boolean(el?.closest('main'));
  });
  check('Skip link: el foco queda en <main>', focusInsideMain);
  await page.close();
}

// ─── 12. SEO por ruta ───
{
  const page = await browser.newPage();
  const titles = [];
  for (const path of ['/', '/servicios', '/contacto', '/privacidad', '/terminos']) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    const title = await page.title();
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');

    titles.push(title);
    check(`${path} canonical correcto`, canonical === `https://nexorastudio.com${path}`, canonical);
    check(
      `${path} description presente`,
      Boolean(desc) && desc.length >= 50,
      `${desc?.length ?? 0} chars`,
    );
  }
  // El bug era que las 8 rutas devolvían el mismo title del index.html.
  check('Los titles de cada ruta son distintos', new Set(titles).size === titles.length, `${new Set(titles).size}/${titles.length} únicos`);

  // El 404 no debe indexarse.
  await page.goto(BASE + '/ruta-inexistente', { waitUntil: 'networkidle' });
  const robots = await page.locator('meta[name="robots"]').getAttribute('content');
  check('404 marcado como noindex', robots === 'noindex, follow', String(robots));
  await page.close();
}

// ─── 13. El sitemap se sirve como XML ───
{
  const res = await fetch(`${BASE}/sitemap.xml`);
  const body = await res.text();
  check('sitemap.xml responde 200', res.status === 200, `${res.status}`);
  check(
    'sitemap.xml es XML, no HTML',
    body.trimStart().startsWith('<?xml') && body.includes('<urlset'),
    body.slice(0, 30).replace(/\n/g, ' '),
  );
  check('sitemap lista las rutas limpias', body.includes('/servicios') && !body.includes('.html'));
}

check('Sin errores de runtime', errors.length === 0, errors.slice(0, 3).join(' | '));

await browser.close();
const failed = results.filter((r) => !r.pass).length;
console.log(`\n${results.length - failed}/${results.length} checks pasaron`);
process.exit(failed ? 1 : 0);
