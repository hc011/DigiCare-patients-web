const CACHE_NAME = "digicare-minimal-cache-v1";
const urlsToCache = [
  "/manifest.json",
  "/logo192.png",
  "/logo512.png",
  "/favicon.ico",
];

// Install a minimal cache for PWA icons and metadata only
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  // Immediately take control to ensure the minimal caching behavior is active
  self.skipWaiting();
});

// Handle fetch events - only serve cached PWA assets, don't cache API responses
self.addEventListener("fetch", (event) => {
  // Only use cache for specific PWA assets
  if (urlsToCache.some((url) => event.request.url.includes(url))) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  } else {
    // For all other requests, always go to network and don't cache
    event.respondWith(fetch(event.request));
  }
});

// Clean up any old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
