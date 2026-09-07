/* IdeA1 Service Worker — v7.0 */
const CACHE = 'idea1-v7';

self.addEventListener('install', e => {
  self.skipWaiting(); /* Langsung aktif tanpa tunggu tab lama ditutup */
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => {
        console.log('[SW] Hapus cache lama:', k);
        return caches.delete(k);
      }))
    ).then(() => {
      console.log('[SW] Semua cache lama dihapus');
      return self.clients.claim(); /* Ambil alih semua tab aktif */
    }).then(() => {
      /* Paksa semua client reload untuk mulai fresh */
      return self.clients.matchAll({ type: 'window' });
    }).then(clients => {
      clients.forEach(client => {
        client.postMessage({ type: 'SW_UPDATED' });
      });
    })
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  /* Network first — selalu ambil dari server, bukan cache */
  e.respondWith(
    fetch(e.request, { cache: 'no-store' })
      .catch(() => caches.match('/index.html'))
  );
});
