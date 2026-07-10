import { test, expect } from '@playwright/test';

test.describe('Contact', () => {
  test('loads contact page', async ({ page }) => {
    await page.goto('/contacto.html');
    await expect(page.locator('h1')).toContainText('presencia digital');
  });

  test('opens WhatsApp link', async ({ page }) => {
    await page.goto('/contacto.html');
    const wa = page.locator('a[href*="wa.me"]').first();
    await expect(wa).toHaveAttribute('href', /wa\.me\/5493444517496/);
  });
});
