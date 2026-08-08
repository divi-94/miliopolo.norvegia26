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

test('mostra dettaglio operativo e navigazione fra giornate', async ({ page }) => {
  await page.goto('./giorni/2026-08-17/');
  await expect(page.getByRole('heading', { name: 'Trolltunga', level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Alert' })).toBeVisible();
  await expect(page.locator('input[type="checkbox"]')).toHaveCount(4);
  await expect(page.locator('input[type="checkbox"]').first()).toBeDisabled();
  await expect(page.getByRole('link', { name: 'Trolltunga', exact: true })).toHaveAttribute('href', /luoghi\/trolltunga\/$/);
  await expect(page.getByRole('navigation', { name: 'Giornate precedente e successiva' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('collega un luogo alle mappe e alle giornate', async ({ page }) => {
  await page.goto('./luoghi/trolltunga/');
  await expect(page.getByRole('heading', { name: 'Trolltunga', level: 1 })).toBeVisible();
  const mapLink = page.getByRole('link', { name: /Apri nelle mappe/ });
  await expect(mapLink).toHaveAttribute('target', '_blank');
  await expect(mapLink).toHaveAttribute('rel', /noopener/);
  await expect(page.getByRole('link', { name: /Giorno 9 Trolltunga/ })).toBeVisible();
});

test('filtra le curiosità e apre una storia collegata', async ({ page }) => {
  await page.goto('./curiosita/');
  await expect(page.getByRole('heading', { name: 'Curiosità', level: 1 })).toBeVisible();
  await expect(page.locator('[data-curiosity-card]')).toHaveCount(51);
  await page.locator('[data-curiosity-day]').selectOption('2026-08-17');
  await expect(page.locator('[data-curiosity-card]:visible')).toHaveCount(4);
  await page.getByRole('link', { name: 'Come si è formata la lingua' }).click();
  await expect(page.getByRole('heading', { name: 'Come si è formata la lingua', level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Trolltunga', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /Giorno 9/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('abilita la modalità editor senza esporre credenziali', async ({ page }) => {
  await page.goto('./giorni/2026-08-17/?edit=1');
  const editLink = page.getByRole('link', { name: /Modifica questa giornata/ });
  await expect(editLink).toBeVisible();
  await expect(editLink).toHaveAttribute('href', 'https://github.com/divi-94/miliopolo.norvegia26/edit/main/app/src/content/days/2026-08-17.md');
  await page.goto('./info/');
  await expect(page.getByText('Modalità editor attiva')).toBeVisible();
  await page.getByRole('button', { name: 'Disattiva modalità editor' }).click();
  await expect(page.getByText('Modalità editor non attiva')).toBeVisible();
});

test('riapre una giornata dalla cache quando è offline', async ({ page, context }) => {
  await page.goto('./');
  await page.evaluate(() => navigator.serviceWorker.ready);
  if (!await page.evaluate(() => Boolean(navigator.serviceWorker.controller))) {
    await page.reload();
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  }
  await context.setOffline(true);
  await page.evaluate(() => window.dispatchEvent(new Event('offline')));
  await expect(page.getByText(/Sei offline/)).toBeVisible();
  await page.goto('./giorni/2026-08-17/');
  await expect(page.getByRole('heading', { name: 'Trolltunga', level: 1 })).toBeVisible();
  await context.setOffline(false);
});
