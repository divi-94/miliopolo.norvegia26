import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative, resolve, sep } from 'node:path';

const output = resolve('dist');
const configuredBase = process.env.PUBLIC_BASE_PATH ?? '/miliopolo.norvegia26';
const base = `/${configuredBase.replace(/^\/+|\/+$/g, '')}/`;

function files(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}

function targetFor(href: string, source: string): string | null {
  if (!href || href.startsWith('#') || /^(https?:|mailto:|tel:)/i.test(href)) return null;
  const sourceRoute = `/${relative(output, source).split(sep).join('/')}`.replace(/index\.html$/, '');
  const pathname = decodeURIComponent(new URL(href, `https://local${base}${sourceRoute.replace(/^\/+/, '')}`).pathname);
  if (!pathname.startsWith(base)) throw new Error(`${source}: link fuori dal base path: ${href}`);
  const relativeTarget = pathname.slice(base.length);
  if (!relativeTarget || pathname.endsWith('/')) return join(output, relativeTarget, 'index.html');
  return join(output, relativeTarget);
}

const broken: string[] = [];
const htmlFiles = files(output).filter((path) => extname(path) === '.html');
for (const source of htmlFiles) {
  const html = readFileSync(source, 'utf8');
  for (const match of html.matchAll(/\bhref=["']([^"']+)["']/gi)) {
    const target = targetFor(match[1], source);
    if (target && !existsSync(target)) broken.push(`${relative(output, source)} → ${match[1]}`);
  }
}

if (broken.length) throw new Error(`Link interni rotti:\n${broken.join('\n')}`);
console.log(`Link validi in ${htmlFiles.length} pagine HTML.`);
