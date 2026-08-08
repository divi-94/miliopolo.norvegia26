import { expect, test } from '@playwright/test';

test('rende disponibile la pagina iniziale', async ({ page }) => {
  await page.goto('./?date=2026-08-17');
  await expect(page.getByRole('heading', { name: 'Il viaggio, a colpo d’occhio' })).toBeVisible();
  await expect(page.locator('[data-day-card]')).toHaveCount(15);
  await expect(page.locator('[data-temporal="today"]')).toHaveAttribute('data-date', '2026-08-17');
  await expect(page.locator('[data-today-label]')).toHaveText('Giorno 9 di 15');
  await expect(page.locator('[data-today-link]').first()).toHaveAttribute('href', /giorni\/2026-08-17\/$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('gestisce prima e dopo il viaggio', async ({ page }) => {
  await page.goto('./?date=2026-08-08');
  await expect(page.locator('[data-trip-message]')).toHaveText('Si parte domani.');
  await expect(page.locator('[data-temporal="future"]')).toHaveCount(15);

  await page.goto('./?date=2026-08-24');
  await expect(page.locator('[data-trip-message]')).toContainText('Quindici giorni da ripercorrere');
  await expect(page.locator('[data-temporal="past"]')).toHaveCount(15);
});
