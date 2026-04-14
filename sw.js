const CACHE_NAME = 'marina-bahia-v1';

/* INSTALAR */
self.addEventListener('install', event => {
  self.skipWaiting();
});

/* ACTIVAR */
self.addEventListener('activate', event => {

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

/* FETCH */
self.addEventListener('fetch', event => {

  const url = event.request.url;

  // 🔥 NO tocar streaming ni API (CLAVE TOTAL)
  if (
    url.includes('/listen/') ||
    url.includes('/api/') ||
    url.includes('.mp3') ||
    url.includes('nowplaying')
  ) {
    return;
  }

  // Cache básico (solo archivos de la web)
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );

});