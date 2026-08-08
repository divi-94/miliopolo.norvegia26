import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('https://api.open-meteo.com/**', async (route) => {
    const url = new URL(route.request().url());
    const count = url.searchParams.get('latitude')?.split(',').length ?? 1;
    const dates = Array.from({ length: 16 }, (_, index) => `2026-08-${String(index + 9).padStart(2, '0')}`);
    const hours = dates.flatMap((date) => Array.from({ length: 24 }, (_, hour) => `${date}T${String(hour).padStart(2, '0')}:00`));
    const one = {
      daily: {
        time: dates,
        weather_code: dates.map(() => 61),
        temperature_2m_min: dates.map(() => 11),
        temperature_2m_max: dates.map(() => 18),
        precipitation_probability_max: dates.map(() => 70),
        precipitation_sum: dates.map(() => 4.2),
        wind_speed_10m_max: dates.map(() => 18),
        wind_gusts_10m_max: dates.map(() => 32),
        sunrise: dates.map((date) => `${date}T05:30`),
        sunset: dates.map((date) => `${date}T21:20`),
      },
      hourly: {
        time: hours,
        temperature_2m: hours.map(() => 14),
        precipitation_probability: hours.map(() => 60),
        weather_code: hours.map(() => 61),
        wind_speed_10m: hours.map(() => 16),
        wind_gusts_10m: hours.map(() => 28),
      },
    };
    await route.fulfill({ json: count === 1 ? one : Array.from({ length: count }, () => one) });
  });
});

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
  await expect(page.locator('[data-weather-content]')).toBeVisible();
  await expect(page.locator('[data-weather-temperature]')).toHaveText('11–18 °C');
  await expect(page.getByText(/Escursione sensibile/)).toBeVisible();
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

test('un errore meteo non blocca il programma statico', async ({ page }) => {
  await page.unroute('https://api.open-meteo.com/**');
  await page.route('https://api.open-meteo.com/**', (route) => route.abort('failed'));
  await page.goto('./giorni/2026-08-17/');
  await expect(page.getByRole('heading', { name: 'Trolltunga', level: 1 })).toBeVisible();
  await expect(page.locator('[data-weather-state]')).toContainText('Meteo temporaneamente non disponibile');
  await expect(page.getByRole('heading', { name: 'Programma' })).toBeVisible();
});
