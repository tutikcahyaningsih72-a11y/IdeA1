/* IdeA1 Service Worker — v1.0 */

const CACHE  = 'idea1-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'
];

/* Install — cache core assets */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll(ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

/* Activate — clean old caches */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* Fetch — cache first for assets, network first for API */
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  /* Skip non-GET and cross-origin API calls */
  if (e.request.method !== 'GET') return;
  if (url.hostname.includes('supabase.co'))  return;
  if (url.hostname.includes('firebase'))     return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        /* Cache fresh responses for same-origin assets */
        if (url.origin === self.location.origin && res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => {
        /* Offline fallback */
        if (e.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
