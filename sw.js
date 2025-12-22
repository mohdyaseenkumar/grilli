const CACHE_NAME = 'grilli-v1';
const urlsToCache = [
  '/grilli/',
  '/grilli/index.html',
  '/grilli/assets/css/style.css',
  '/grilli/assets/js/app.js',
  '/grilli/assets/images/logo.png',
  '/grilli/assets/favicon-192x192.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
