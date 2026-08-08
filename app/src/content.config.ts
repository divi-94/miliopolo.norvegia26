import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const isoDate = z.string().regex(/^2026-08-(0[9]|1\d|2[0-3])$/, 'La data deve essere compresa fra il 9 e il 23 agosto 2026');
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Usare uno slug minuscolo separato da trattini');

const days = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/days' }),
  schema: z.object({
    dayNumber: z.number().int().min(1).max(15),
    date: isoDate,
    title: z.string().min(1),
    route: z.string().min(1),
    base: z.string().min(1).nullable(),
    status: z.enum(['confermato', 'aperto', 'da-verificare', 'problema']),
    drivingMinutes: z.number().int().nonnegative().nullable(),
    places: z.array(slug),
    hike: z.object({
      durationHours: z.number().positive().optional(),
      distanceKm: z.number().positive().optional(),
      elevationGainM: z.number().int().nonnegative().optional(),
    }).optional(),
    weatherPrimary: slug.optional(),
  }),
});

const curiosities = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/curiosities' }),
  schema: z.object({
    title: z.string().min(1),
    slug,
    type: z.enum(['storia', 'fatto', 'leggenda']),
    days: z.array(isoDate).min(1),
    places: z.array(slug).min(1),
    excerpt: z.string().min(1).optional(),
  }),
});

export const collections = { days, curiosities };
