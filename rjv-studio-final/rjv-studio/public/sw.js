const CACHE_NAME = 'rjv-studio-v1';
const STATIC_ASSETS = [
  '/',
  '/booking',
  '/manifest.json',
];

// Install - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch - network first for API, cache first for static
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip Supabase API calls
  if (url.hostname.includes('supabase.co')) return;

  // For navigation requests (HTML pages) - network first
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // For assets (JS, CSS, fonts) - stale while revalidate
  if (
    event.request.destination === 'script' ||
    event.request.destination === 'style' ||
    event.request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const networkFetch = fetch(event.request).then((response) => {
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
          return response;
        });
        return cached || networkFetch;
      })
    );
    return;
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'RJV Studio', {
      body: data.body || 'Your booking has been updated.',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: { url: data.url || '/booking/profile' },
      actions: [
        { action: 'view', title: 'View Booking' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    })
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/booking/profile')
  );
});
