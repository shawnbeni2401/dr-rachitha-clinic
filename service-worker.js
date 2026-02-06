const CACHE_NAME = 'dr-rachithas-clinic-cache-v1';
const URLS_TO_CACHE_ON_INSTALL = [
  '/',
  '/index.html',
  '/icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(URLS_TO_CACHE_ON_INSTALL);
      })
  );
});

self.addEventListener('fetch', event => {
  // Use a network-first strategy.
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // If the request is successful, clone the response, cache it, and return it.
        // This keeps the cache up-to-date.
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            // We only cache successful GET requests.
            if (event.request.method === 'GET' && response.status === 200) {
              cache.put(event.request, responseToCache);
            }
          });
        return response;
      })
      .catch(err => {
        // If the network request fails, try to serve the response from the cache.
        return caches.match(event.request)
          .then(response => {
            // If there's a match in the cache, return it.
            // Otherwise, the fetch will fail.
            return response;
          });
      })
  );
});


self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});