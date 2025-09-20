// sw.js — Service Worker di Stasera Qui
const VERSION = 'v3';
const STATIC_CACHE = `sq-static-${VERSION}`;
const RUNTIME_CACHE = `sq-runtime-${VERSION}`;
const TILE_CACHE = `sq-tiles-${VERSION}`;

// Precache: mettiamo qui i file locali e le pagine principali
const PRECACHE_URLS = [
  '/', '/index.html',
  '/assets/style.css?v=10',
  '/assets/vendor/leaflet/leaflet.css',
  '/assets/vendor/leaflet/leaflet.js',
  '/assets/vendor/supabase/supabase.min.js',
  '/site.webmanifest?v=2',

  // icone (metti quelle che hai)
  '/icons/favicon-32x32.png?v=2',
  '/icons/favicon-16x16.png?v=2',
  '/icons/favicon.ico?v=2',
  '/icons/apple-touch-icon-120x120.png?v=2',
  '/icons/apple-touch-icon-152x152.png?v=2',
  '/icons/apple-touch-icon-167x167.png?v=2',
  '/icons/apple-touch-icon-180x180.png?v=2',
  '/icons/safari-pinned-tab.svg?v=2',

  // pagine frequenti (se ne hai altre, aggiungile qui)
  '/mission.html',
  '/chi-siamo.html',
  '/contatti.html',
  '/come-funziona.html',
  '/pubblica-evento.html',
  '/lavora-con-noi.html',
  '/termini-privacy.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => ![STATIC_CACHE, RUNTIME_CACHE, TILE_CACHE].includes(k))
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Navigazione pagine: se offline, cadi su index
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Stesso dominio (tuo sito): statici cache-first
  if (url.origin === self.location.origin) {
    if (
      PRECACHE_URLS.includes(url.pathname) ||
      url.pathname.startsWith('/assets/') ||
      url.pathname.startsWith('/icons/')
    ) {
      event.respondWith(cacheFirst(req, STATIC_CACHE));
      return;
    }
  }

  // Tile OSM: cache-first con limite
  if (url.hostname.endsWith('tile.openstreetmap.org')) {
    event.respondWith(tileCache(req));
    return;
  }

  // Google (Maps/Fonts): network-first con fallback cache
  if (url.hostname.endsWith('googleapis.com') || url.hostname.endsWith('gstatic.com')) {
    event.respondWith(networkFirst(req, RUNTIME_CACHE));
    return;
  }

  // Supabase: network-first, poi cache se offline
  if (url.hostname.endsWith('supabase.co')) {
    event.respondWith(networkFirst(req, RUNTIME_CACHE));
    return;
  }

  // Tutto il resto: network-first
  event.respondWith(networkFirst(req, RUNTIME_CACHE));
});

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req, { ignoreSearch: true });
  if (cached) return cached;
  const resp = await fetch(req);
  if (resp && resp.ok) cache.put(req, resp.clone());
  return resp;
}

async function networkFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const resp = await fetch(req);
    if (resp && resp.ok) cache.put(req, resp.clone());
    return resp;
  } catch (_) {
    const cached = await cache.match(req, { ignoreSearch: true });
    if (cached) return cached;
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

async function tileCache(req) {
  const cache = await caches.open(TILE_CACHE);
  const cached = await cache.match(req);
  if (cached) return cached;

  // Alcuni tile hanno CORS "opaque" — va bene lo stesso
  const resp = await fetch(req, { mode: 'no-cors' }).catch(() => null);
  if (resp) cache.put(req, resp.clone());

  // Limita le dimensioni della cache tile
  const keys = await cache.keys();
  const MAX = 300;
  if (keys.length > MAX) {
    await cache.delete(keys[0]);
  }
  return resp || new Response(null, { status: 204 });
}
