import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://127.0.0.1:4321/miliopolo.norvegia26/',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm astro preview --host 127.0.0.1',
    port: 4321,
    reuseExistingServer: !process.env.CI,
  },
  projects: [{
    name: 'mobile-chromium',
    use: {
      browserName: 'chromium',
      viewport: { width: 360, height: 800 },
      hasTouch: true,
      isMobile: true,
    },
  }],
});
