/* IdeA1 Service Worker — v4.0 */
/* v4: Force clear semua cache lama */

const CACHE = 'idea1-v4';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      console.log('[SW] Clearing caches:', keys);
      return Promise.all(keys.map(k => {
        console.log('[SW] Deleting cache:', k);
        return caches.delete(k);
      }));
    }).then(() => self.clients.claim())
  );
});

/* Network first - selalu ambil versi terbaru */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('supabase') || e.request.url.includes('firebase')) return;

  e.respondWith(
    fetch(e.request)
      .then(res => res)
      .catch(() => caches.match(e.request)
        .then(cached => cached || caches.match('/index.html'))
      )
  );
});
