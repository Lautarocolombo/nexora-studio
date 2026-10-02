import { test, expect } from '@playwright/test';

test('el primer Tab enfoca el skip link y lo hace visible', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');

  const skip = page.getByRole('link', { name: /Saltar al contenido/i });
  await expect(skip).toBeFocused();

  const box = (await skip.boundingBox())!;
  expect(box.width).toBeGreaterThan(100);

  await expect(skip).toHaveCSS('outline-style', 'solid');
});

test('el skip link lleva al contenido principal', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/#main$/);
});

test('la navegación por teclado no recarga la página', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    (window as unknown as { __alive?: boolean }).__alive = true;
  });

  await page.locator('header nav a[href="/servicios"]').first().focus();
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/\/servicios$/);
  expect(await page.evaluate(() => (window as unknown as { __alive?: boolean }).__alive)).toBe(true);
});

test('el toggle de tema cambia data-theme y persiste', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /modo claro/i }).click();

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('el botón de saltar al menú móvil abre y cierra con Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  // El aria-label cambia a "Cerrar menú móvil" al abrirse, así que lo
  // localizamos por el atributo estable aria-controls.
  const toggle = page.locator('button[aria-controls="mobile-nav"]');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#mobile-nav')).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#mobile-nav')).toHaveCount(0);
});
