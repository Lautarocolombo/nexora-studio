import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.locator('#trabajos').scrollIntoViewIfNeeded();
});

test('muestra los dos proyectos como pestañas', async ({ page }) => {
  const tabs = page.getByRole('tab');
  await expect(tabs).toHaveCount(2);
  await expect(tabs.nth(0)).toContainText('Metagro');
  await expect(tabs.nth(1)).toContainText('Artesanías');
});

test('el escenario principal es 16:9', async ({ page }) => {
  const stage = page.locator('#trabajos .aspect-video');
  const box = (await stage.boundingBox())!;
  expect(box.width / box.height).toBeCloseTo(16 / 9, 2);
});

test('navega con flechas, teclado y miniaturas', async ({ page }) => {
  await expect(page.getByText('1 / 7').first()).toBeVisible();

  await page.getByRole('button', { name: 'Imagen siguiente' }).first().click();
  await expect(page.getByText('2 / 7').first()).toBeVisible();

  await page.getByRole('button', { name: 'Imagen siguiente' }).first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByText('3 / 7').first()).toBeVisible();

  await page.getByRole('button', { name: /Ver imagen 5/ }).click();
  await expect(page.getByText('5 / 7').first()).toBeVisible();
});

test('expone texto real del proyecto para SEO y lectores de pantalla', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Metagro SRL' })).toBeVisible();
  await expect(page.locator('main')).toContainText('catálogo de productos');
  await expect(page.locator('main')).toContainText('PostgreSQL');
});

test('cambiar de pestaña reinicia el carrusel', async ({ page }) => {
  await page.getByRole('button', { name: 'Imagen siguiente' }).first().click();
  await expect(page.getByText('2 / 7').first()).toBeVisible();

  await page.getByRole('tab', { name: /Artesanías/ }).click();
  await expect(page.getByText('1 / 7').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Artesanías Gualeguay' })).toBeVisible();
});

test('el lightbox abre a pantalla completa y se cierra con Esc', async ({ page }) => {
  await page.getByRole('button', { name: /Ampliar imagen/ }).click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('aria-modal', 'true');

  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('dialog').locator('figcaption')).toContainText('2 / 7');

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
});

test('no ofrece descargas ni iframes', async ({ page }) => {
  for (const path of ['/', '/portfolio']) {
    await page.goto(path);
    await expect(page.locator('iframe')).toHaveCount(0);
    await expect(page.locator('[download]')).toHaveCount(0);
    expect(await page.content()).not.toMatch(/\.pptx/i);
  }
});

test('la tira de miniaturas no arrastra la página al cargar', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(600);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});
