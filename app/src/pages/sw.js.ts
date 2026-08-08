import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getPlaces } from '@/lib/places';

export const prerender = true;

export const GET: APIRoute = async () => {
  const days = await getCollection('days');
  const curiosities = await getCollection('curiosities');
  const routes = [
    '',
    'info/',
    'curiosita/',
    ...days.map((day) => `giorni/${day.data.date}/`),
    ...curiosities.map((item) => `curiosita/${item.data.slug}/`),
    ...getPlaces().map((place) => `luoghi/${place.slug}/`),
    'manifest.webmanifest',
    'app-icon.svg',
  ];
  const version = __BUILD_COMMIT__ ?? __BUILD_TIME__.replace(/\D/gu, '').slice(0, 14);
  const source = `
const VERSION = ${JSON.stringify(version)};
const CONTENT_CACHE = 'norvegia-content-' + VERSION;
const ASSET_CACHE = 'norvegia-assets-' + VERSION;
const ROUTES = ${JSON.stringify(routes)};

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CONTENT_CACHE).then((cache) => {
    const scope = new URL('./', self.registration.scope);
    return cache.addAll(ROUTES.map((route) => new URL(route, scope).href));
  }));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith('norvegia-') && ![CONTENT_CACHE, ASSET_CACHE].includes(key)).map((key) => caches.delete(key)))),
    self.clients.claim(),
  ]));
});

async function networkFirst(request) {
  const cache = await caches.open(CONTENT_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) await cache.put(request, response.clone());
    return response;
  } catch {
    return (await cache.match(request)) || (await cache.match(new URL('./', self.registration.scope).href)) || Response.error();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) await cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(networkFirst(request));
    return;
  }
  event.respondWith(cacheFirst(request));
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
`;

  return new Response(source.trimStart(), {
    headers: {
      'Content-Type': 'text/javascript; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Service-Worker-Allowed': './',
    },
  });
};
