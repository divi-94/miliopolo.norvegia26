import { defineConfig } from 'astro/config';

const site = process.env.PUBLIC_SITE_URL ?? 'https://divi-94.github.io';
const base = process.env.PUBLIC_BASE_PATH ?? '/miliopolo.norvegia26';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
});
