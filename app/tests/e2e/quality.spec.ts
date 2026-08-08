import AxeBuilder from '@axe-core/playwright';
import { chromium, expect, test } from '@playwright/test';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';

const baseUrl = 'http://127.0.0.1:4321/miliopolo.norvegia26/';
const representativeRoutes = [
  '',
  'giorni/2026-08-17/',
  'luoghi/trolltunga/',
  'curiosita/',
  'curiosita/trolltunga-formazione/',
  'info/',
];

test.beforeEach(async ({ page }) => {
  await page.route('https://api.open-meteo.com/**', (route) => route.fulfill({ json: {} }));
});

test('mantiene leggibili i contenuti essenziali senza JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 360, height: 800 },
  });
  const page = await context.newPage();

  await page.goto(baseUrl);
  await expect(page.getByRole('heading', { name: 'Il viaggio, a colpo d’occhio' })).toBeVisible();
  await expect(page.locator('[data-day-card]')).toHaveCount(15);

  await page.goto(`${baseUrl}giorni/2026-08-17/`);
  await expect(page.getByRole('heading', { name: 'Trolltunga', level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Programma' })).toBeVisible();

  await page.goto(`${baseUrl}curiosita/`);
  await expect(page.getByRole('heading', { name: 'Curiosità', level: 1 })).toBeVisible();
  await expect(page.locator('[data-curiosity-card]')).toHaveCount(51);

  await context.close();
});

test('non produce overflow o errori JavaScript alle larghezze richieste', async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  for (const width of [320, 360, 390]) {
    await page.setViewportSize({ width, height: 800 });
    for (const route of representativeRoutes) {
      await page.goto(`${baseUrl}${route}`);
      await expect(page.locator('main')).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        `overflow orizzontale a ${width}px in ${route || 'home'}`,
      ).toBe(true);
    }
  }

  expect(runtimeErrors).toEqual([]);
});

for (const route of ['', 'giorni/2026-08-17/', 'curiosita/', 'info/']) {
  test(`non presenta violazioni WCAG automatizzabili in ${route || 'home'}`, async ({ page }) => {
    await page.goto(`${baseUrl}${route}`);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

test('raggiunge le soglie Lighthouse mobile', async ({}, testInfo) => {
  test.setTimeout(120_000);
  const chrome = await chromeLauncher.launch({
    chromePath: chromium.executablePath(),
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
  });

  try {
    const result = await lighthouse(baseUrl, {
      port: chrome.port,
      logLevel: 'error',
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices'],
      formFactor: 'mobile',
    });
    expect(result).not.toBeUndefined();
    const scores = {
      performance: Math.round((result?.lhr.categories.performance.score ?? 0) * 100),
      accessibility: Math.round((result?.lhr.categories.accessibility.score ?? 0) * 100),
      bestPractices: Math.round((result?.lhr.categories['best-practices'].score ?? 0) * 100),
    };
    await testInfo.attach('lighthouse-summary.json', {
      body: JSON.stringify(scores, null, 2),
      contentType: 'application/json',
    });

    expect(scores.performance).toBeGreaterThanOrEqual(90);
    expect(scores.accessibility).toBeGreaterThanOrEqual(95);
    expect(scores.bestPractices).toBeGreaterThanOrEqual(95);
  } finally {
    try {
      chrome.kill();
    } catch (error) {
      if (!(error instanceof Error) || !error.message.includes('EPERM')) throw error;
    }
  }
});
