import { test, expect } from '@playwright/test';

test.describe('Portfolio', () => {
  test('loads and filters projects', async ({ page }) => {
    await page.goto('/portfolio.html');
    await expect(page.locator('.portfolio-grid')).toBeAttached();

    await page.click('.filter-btn[data-filter="ec"]');
    const ecCards = page.locator('.portfolio-card[data-category="ec"]');
    await expect(ecCards.first()).toBeVisible();

    await page.click('.filter-btn[data-filter="app"]');
    const appCards = page.locator('.portfolio-card[data-category="app"]');
    await expect(appCards.first()).toBeVisible();
  });
});
