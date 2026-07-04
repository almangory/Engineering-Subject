const CACHE_NAME = 'engineering-curriculum-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching offline app shell');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Handle post requests (e.g., API calls)
  if (request.method !== 'GET') {
    if (request.method === 'POST' && url.pathname === '/api/chat') {
      event.respondWith(
        fetch(request).catch(() => {
          return new Response(
            JSON.stringify({
              content: "عذراً! أنت في وضع عدم الاتصال بالإنترنت حالياً (أوفلاين). يرجى الاتصال بالإنترنت لتتمكن من مناقشة الأسئلة والدروس مع معلمك الذكي."
            }),
            {
              headers: { 'Content-Type': 'application/json; charset=utf-8' }
            }
          );
        })
      );
    }
    return;
  }

  // Only handle same-origin or fonts
  const isSameOrigin = url.origin === self.location.origin;
  const isGoogleFont = url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com');

  if (!isSameOrigin && !isGoogleFont) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch((err) => {
        console.warn('[Service Worker] Network request failed (offline mode):', err);
      });

      return cachedResponse || fetchPromise;
    })
  );
});
