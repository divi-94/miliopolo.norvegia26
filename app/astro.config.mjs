import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import rehypeExternalLinks from './scripts/rehype-external-links.mjs';

const site = process.env.PUBLIC_SITE_URL ?? 'https://divi-94.github.io';
const base = process.env.PUBLIC_BASE_PATH ?? '/miliopolo.norvegia26';
const buildTime = process.env.BUILD_TIME ?? new Date().toISOString();
const buildCommit = process.env.GITHUB_SHA?.slice(0, 7) ?? null;

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  vite: {
    define: {
      __BUILD_TIME__: JSON.stringify(buildTime),
      __BUILD_COMMIT__: JSON.stringify(buildCommit),
    },
  },
  markdown: {
    processor: unified({ rehypePlugins: [rehypeExternalLinks] }),
  },
});
