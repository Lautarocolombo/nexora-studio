import { test, expect } from '@playwright/test';

const WA_URL = /wa\.me\/5493444517496|api\.whatsapp\.com.*5493444517496/;

test.beforeEach(async ({ page }) => {
  await page.goto('/contacto');
});

test('valida los campos obligatorios', async ({ page }) => {
  await page.getByRole('button', { name: /Abrir WhatsApp/i }).click();
  await expect(page.getByRole('alert')).toBeVisible();
});

test('arma el mensaje de WhatsApp con los datos del usuario', async ({ page }) => {
  await page.fill('#contactName', 'Ana');
  await page.fill('#contactMessage', 'Quiero una tienda online');

  const popupPromise = page.waitForEvent('popup');
  await page.getByRole('button', { name: /Abrir WhatsApp/i }).click();
  const popup = await popupPromise;

  expect(popup.url()).toMatch(WA_URL);
  // El mensaje viaja con espacios como "+" en el query string.
  const message = decodeURIComponent(popup.url()).replace(/\+/g, ' ');
  expect(message).toContain('Ana');
  expect(message).toContain('Quiero una tienda online');
  await popup.close();
});

test('el honeypot frena a los bots', async ({ page }) => {
  await page.fill('#contactName', 'Ana');
  await page.fill('#contactMessage', 'Mensaje');

  // El campo existe pero queda fuera del árbol de accesibilidad y del
  // orden de tabulación, así que una persona nunca lo ve ni lo completa.
  const honeypot = page.locator('#contactCompany');
  await expect(honeypot).toHaveAttribute('tabindex', '-1');
  expect(
    await honeypot.evaluate((el) => Boolean(el.closest('[aria-hidden="true"]'))),
    'el honeypot debe estar dentro de un contenedor aria-hidden',
  ).toBe(true);

  await page.evaluate(() => {
    const el = document.querySelector<HTMLInputElement>('#contactCompany')!;
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    )!.set!;
    setter.call(el, 'spam-bot');
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });

  const before = page.context().pages().length;
  await page.getByRole('button', { name: /Abrir WhatsApp/i }).click();
  await page.waitForTimeout(700);
  expect(page.context().pages().length).toBe(before);
});

test('el FAQ es un acordeón accesible', async ({ page }) => {
  const first = page.getByRole('button', { name: /presupuesto/i });
  await expect(first).toHaveAttribute('aria-expanded', 'true');

  const second = page.getByRole('button', { name: /Cuánto tarda/i });
  await second.click();
  await expect(second).toHaveAttribute('aria-expanded', 'true');
  await expect(first).toHaveAttribute('aria-expanded', 'false');
});
