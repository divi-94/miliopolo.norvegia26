import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { parse } from 'yaml';
import { z } from 'astro/zod';

const isoDate = z.string().regex(/^2026-08-(0[9]|1\d|2[0-3])$/);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const daySchema = z.looseObject({ dayNumber: z.number().int().min(1).max(15), date: isoDate, places: z.array(slug) });
const curiositySchema = z.looseObject({ slug, days: z.array(isoDate).min(1), places: z.array(slug).min(1) });
const placeSchema = z.object({ slug, name: z.string().min(1), area: z.string().min(1) });

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
const places = z.array(placeSchema).parse(parse(readFileSync('src/data/places.yml', 'utf8')));

unique(days.map(({ data }) => data.date), 'Date');
unique(days.map(({ data }) => String(data.dayNumber)), 'Numeri giornata');
unique(curiosities.map(({ data }) => data.slug), 'Slug curiosità');
unique(places.map(({ slug }) => slug), 'Slug luoghi');

const expectedDates = Array.from({ length: 15 }, (_, index) => `2026-08-${String(index + 9).padStart(2, '0')}`);
const actualDates = days.map(({ data }) => data.date).sort();
if (JSON.stringify(actualDates) !== JSON.stringify(expectedDates)) {
  throw new Error(`Servono esattamente le 15 date dal 9 al 23 agosto; trovate: ${actualDates.join(', ')}`);
}

const expectedNumbers = Array.from({ length: 15 }, (_, index) => String(index + 1));
const actualNumbers = days.map(({ data }) => String(data.dayNumber)).sort((a, b) => Number(a) - Number(b));
if (JSON.stringify(actualNumbers) !== JSON.stringify(expectedNumbers)) {
  throw new Error(`Numerazione giornate incompleta: ${actualNumbers.join(', ')}`);
}

if (curiosities.length !== 51) {
  throw new Error(`L'inventario editoriale richiede 51 curiosità; trovate: ${curiosities.length}`);
}

const dates = new Set(days.map(({ data }) => data.date));
const placeSlugs = new Set(places.map(({ slug }) => slug));
for (const { path, data } of days) {
  for (const place of data.places) if (!placeSlugs.has(place)) throw new Error(`${path}: luogo inesistente ${place}`);
}
for (const { path, data } of curiosities) {
  for (const date of data.days) if (!dates.has(date)) throw new Error(`${path}: giornata inesistente ${date}`);
  for (const place of data.places) if (!placeSlugs.has(place)) throw new Error(`${path}: luogo inesistente ${place}`);
}

const publicContent = [...days, ...curiosities].map(({ path }) => readFileSync(path, 'utf8')).join('\n');
const forbiddenBookingReference = ['AY', '89', 'JZ', '32', 'CG'].join('');
if (publicContent.includes(forbiddenBookingReference)) throw new Error('Rilevato un codice di prenotazione vietato nei contenuti pubblici');

console.log(`Contenuti validi: ${days.length} giornate, ${places.length} luoghi, ${curiosities.length} curiosità.`);
