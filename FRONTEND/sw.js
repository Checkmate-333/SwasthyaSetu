const CACHE_NAME = 'swasthyasetu-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './login.html',
  './style.css',
  './Script.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE).catch(err => console.log('Failed to cache assets', err));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Network first, fallback to cache for API calls if offline. 
  // For static assets, cache first, fallback to network.
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Return a mock offline response for certain GETs if needed
        return new Response(JSON.stringify({ error: 'offline', message: 'You are offline' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});

// Setup Background Sync
self.addEventListener('sync', event => {
  if (event.tag === 'sync-offline-prescriptions') {
    // Notify clients to process the IndexedDB queue
    event.waitUntil(
      self.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage({ type: 'PROCESS_OFFLINE_QUEUE' }));
      })
    );
  }
});
