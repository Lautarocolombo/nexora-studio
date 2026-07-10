import { test, expect } from '@playwright/test';

test.describe('Home', () => {
  test('loads and shows hero', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('soluciones digitales');
  });

  test('navigates to services', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="servicios.html"]');
    await expect(page.locator('h1')).toContainText('Servicios');
  });

  test('navigates to portfolio', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="portfolio.html"]');
    await expect(page.locator('h1')).toContainText('Proyectos digitales');
  });
});
