self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activated');
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  const title = data.title || 'Notifikasi Baru!';
  const options = {
    body: data.body || 'Ada pesan baru untukmu!',
    icon: '/images/logo.png',
    badge: '/images/logo.png',
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
