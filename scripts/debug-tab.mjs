import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message + '\n' + (e.stack || '')));

try {
  await page.goto('http://localhost:5199/', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(2500);
  console.log('h1:', await page.locator('h1').first().textContent().catch(() => 'NO H1'));
  console.log('body len:', (await page.locator('body').innerText()).length);
  console.log('json-ld:', await page.locator('script[type="application/ld+json"]').count());
  console.log('title:', await page.title());
} catch (e) {
  console.log('FALLO goto/lectura:', e.message.split('\n')[0]);
}

console.log('--- CONSOLA ---');
console.log(errors.length ? errors.slice(0, 5).join('\n---\n') : '(sin errores)');
await browser.close();
