const CACHE_NAME = 'studioprompter-cache-v3.0';

// RUTAS ABSOLUTAS: El antídoto para el 404 de GitHub Pages
const ASSETS = [
    '/StudioPrompter-Zero/',
    '/StudioPrompter-Zero/index.html',
    '/StudioPrompter-Zero/manifest.json',
    '/StudioPrompter-Zero/assets/images/icon-192.png',
    '/StudioPrompter-Zero/assets/images/icon-512.png'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Instalando caché estricta...');
            return Promise.allSettled(
                ASSETS.map(asset => cache.add(asset).catch(err => console.warn(`Fallo al cachear: ${asset}`, err)))
            );
        })
    );
});

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

// Network First con filtro de seguridad
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;

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
