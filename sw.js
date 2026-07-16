/* IdeA1 Service Worker — v2.0 */

const CACHE = 'idea1-v2';  /* ← Naik dari v1 ke v2, paksa refresh */

self.addEventListener('install', e => {
  self.skipWaiting(); /* Langsung aktif tanpa tunggu */
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k))) /* Hapus SEMUA cache lama */
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  /* Network first — selalu ambil yang terbaru dari server */
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
