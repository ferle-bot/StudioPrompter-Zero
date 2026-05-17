const CACHE_NAME = 'studioprompter-cache-v2.0';

const ASSETS = [
    './',
    'index.html',
    'manifest.json',
    'assets/images/icon-192.png',
    'assets/images/icon-512.png'
];

// Instalación Segura: Promise.allSettled asegura que si falta un icono, no colapse todo.
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.allSettled(
                ASSETS.map(asset => cache.add(asset).catch(err => console.warn(`Fallo al cachear: ${asset}`, err)))
            );
        })
    );
});

// Limpieza de memoria vieja
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Interceptor "Network First" con protección contra bots
self.addEventListener('fetch', (event) => {
    // Filtro antibloqueo para PWABuilder (Ignora extensiones y esquemas raros)
    if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                });
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
