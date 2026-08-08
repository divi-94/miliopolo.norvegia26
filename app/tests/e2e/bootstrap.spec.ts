import { expect, test } from '@playwright/test';

test('rende disponibile la pagina iniziale', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Il viaggio, a colpo d’occhio' })).toBeVisible();
});
