import { chromium } from '@playwright/test';

const BASE = 'http://localhost:4173';
const results = [];
const check = (name, pass, extra = '') => {
  results.push({ name, pass, extra });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${extra ? ` — ${extra}` : ''}`);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(e.message));

await page.goto(BASE, { waitUntil: 'networkidle' });

// --- Sección y pestañas ---
await page.waitForSelector('#trabajos', { timeout: 10000 });
check('Sección #trabajos renderiza', true);

const tabs = page.getByRole('tab');
check('Hay 2 pestañas de proyecto', (await tabs.count()) === 2, `${await tabs.count()} tabs`);
check('Pestaña Metagro activa', (await tabs.nth(0).textContent())?.includes('Metagro'));
check('Pestaña Artesanías activa', (await tabs.nth(1).textContent())?.includes('Artesan'));

// --- Visor ---
const stage = page.locator('#project-viewer-panel img[loading]').first();
check('Imagen principal visible', await stage.isVisible());
const counter = await page.locator('text=/^1 \\/ 7$/').first().textContent();
check('Contador "1 / 7"', counter?.trim() === '1 / 7', counter?.trim());

const dots = page.locator('#project-viewer-panel button[aria-label^="Ir a la imagen"]');
check('7 puntos de navegación', (await dots.count()) === 7, `${await dots.count()}`);

// --- Miniaturas en orden natural ---
const thumbSrcs = await page.locator('button[aria-label^="Ver imagen"] img').evaluateAll((els) =>
  els.map((e) => e.getAttribute('src')),
);
const nums = thumbSrcs.map((s) => Number(s.match(/(\d+)-[A-Za-z0-9_-]+\.jpg/)?.[1]));
check('Miniaturas en orden 1..7', JSON.stringify(nums) === JSON.stringify([1, 2, 3, 4, 5, 6, 7]), nums.join(','));

// --- Navegación con flechas ---
await page.locator('button[aria-label="Imagen siguiente"]').first().click();
await page.waitForTimeout(250);
check('Flecha siguiente avanza a 2/7', (await page.locator('text=/^2 \\/ 7$/').first().textContent())?.trim() === '2 / 7');

// --- Teclado ---
await page.locator('button[aria-label="Imagen siguiente"]').first().focus();
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(200);
check('Tecla → avanza a 3/7', (await page.locator('text=/^3 \\/ 7$/').first().textContent())?.trim() === '3 / 7');

// --- Click en miniatura ---
await page.locator('button[aria-label^="Ver imagen 5"]').click();
await page.waitForTimeout(300);
check('Click en miniatura 5 → 5/7', (await page.locator('text=/^5 \\/ 7$/').first().textContent())?.trim() === '5 / 7');

// --- Texto real del proyecto ---
check('Nombre del proyecto visible', await page.getByText('Metagro SRL').first().isVisible());
check('Descripción visible', await page.getByText(/catálogo de productos/i).first().isVisible());
check('Tags visibles', await page.getByText('PostgreSQL').first().isVisible());

// --- Cambio de pestaña ---
await tabs.nth(1).click();
await page.waitForTimeout(400);
check('Cambio a Artesanías reinicia en 1/7', (await page.locator('text=/^1 \\/ 7$/').first().textContent())?.trim() === '1 / 7');
check('Artesanías visible', await page.getByText('Artesanías Gualeguay').first().isVisible());

// --- Lightbox ---
await page.locator('button[aria-label^="Ampliar"]').click();
await page.waitForSelector('[role="dialog"][aria-modal="true"]', { timeout: 5000 });
check('Lightbox abre', true);
const boxImg = page.locator('[role="dialog"] img');
check('Imagen en lightbox', await boxImg.isVisible());
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(200);
check('→ en lightbox avanza a 2/7', (await page.locator('[role="dialog"] figcaption').textContent())?.includes('2 / 7'));
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
check('Esc cierra lightbox', (await page.locator('[role="dialog"]').count()) === 0);

// --- Sin descargas ---
const html = await page.content();
check('Sin links .pptx', !/\.pptx/i.test(html));
check('Sin iframes', (await page.locator('iframe').count()) === 0);
const downloadAttrs = await page.locator('[download]').count();
check('Sin atributo download', downloadAttrs === 0, `${downloadAttrs}`);

// --- Responsive ---
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(400);
check('Mobile: sección visible', await page.locator('#trabajos').isVisible());
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check('Mobile: sin scroll horizontal', overflow <= 0, `overflow=${overflow}px`);

check('Sin errores de consola', errors.length === 0, errors.slice(0, 3).join(' | '));

await browser.close();

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks pasaron`);
process.exit(failed.length ? 1 : 0);
