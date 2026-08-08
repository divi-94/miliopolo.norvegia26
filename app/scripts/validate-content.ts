import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { parse } from 'yaml';
import { z } from 'astro/zod';

const isoDate = z.string().regex(/^2026-08-(0[9]|1\d|2[0-3])$/);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const daySchema = z.looseObject({ dayNumber: z.number().int().min(1).max(15), date: isoDate, places: z.array(slug) });
const curiositySchema = z.looseObject({ slug, days: z.array(isoDate).min(1), places: z.array(slug).min(1) });

function markdownFiles(directory: string): string[] {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(path);
    return ['.md', '.mdx'].includes(extname(entry.name)) ? [path] : [];
  });
}

function frontmatter(path: string): unknown {
  const source = readFileSync(path, 'utf8');
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
  if (!match) throw new Error(`${path}: frontmatter YAML mancante`);
  return parse(match[1]);
}

function unique(values: string[], label: string): void {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  if (duplicates.length) throw new Error(`${label} duplicati: ${[...new Set(duplicates)].join(', ')}`);
}

const days = markdownFiles('src/content/days').map((path) => ({ path, data: daySchema.parse(frontmatter(path)) }));
const curiosities = markdownFiles('src/content/curiosities').map((path) => ({ path, data: curiositySchema.parse(frontmatter(path)) }));

unique(days.map(({ data }) => data.date), 'Date');
unique(days.map(({ data }) => String(data.dayNumber)), 'Numeri giornata');
unique(curiosities.map(({ data }) => data.slug), 'Slug curiosità');

const dates = new Set(days.map(({ data }) => data.date));
for (const { path, data } of curiosities) {
  for (const date of data.days) if (!dates.has(date)) throw new Error(`${path}: giornata inesistente ${date}`);
}

console.log(`Contenuti validi: ${days.length} giornate, ${curiosities.length} curiosità.`);
