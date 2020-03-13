const CACHE_NAME = 'BahnhofsAbfahrten';
const urlsToCache = ['/', '/routing', '/details', '/about'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
  event.registerForeignFetch({
    scopes: ['/'],
    origins: ['*'],
  });
});

self.addEventListener('activate', event => {
  const cacheWhitelist = ['BahnhofsAbfahrten'];
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

addEventListener('message', messageEvent => {
  if (messageEvent.data === 'skipWaiting') return skipWaiting();
});

addEventListener('fetch', event => {
  event.respondWith(
    (async () => {
      if (
        event.request.mode === 'navigate' &&
        event.request.method === 'GET' &&
        registration.waiting &&
        (await clients.matchAll()).length < 2
      ) {
        registration.waiting.postMessage('skipWaiting');
        return new Response('', { headers: { Refresh: '0' } });
      }
      return (await caches.match(event.request)) || fetch(event.request);
    })()
  );
});

self.addEventListener('foreignfetch', event => {
  event.respondWith(
    fetch(event.request).then(response => {
      return {
        response: response,
        origin: event.origin,
        headers: ['Content-Type'],
      };
    })
  );
});
