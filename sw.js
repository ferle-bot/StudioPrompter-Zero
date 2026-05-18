const CACHE_NAME = 'studioprompter-cache-v4.0'; // Cambio de versión para forzar actualización

const ASSETS = [
    '/StudioPrompter-Zero/index.html',
    '/StudioPrompter-Zero/manifest.json',
    '/StudioPrompter-Zero/assets/images/icon-192.png',
    '/StudioPrompter-Zero/assets/images/icon-512.png'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Instalando caché estricta para PWABuilder...');
            // Promise.allSettled evita que el SW muera si un solo archivo falla
            return Promise.allSettled(
                ASSETS.map(asset => cache.add(asset))
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

// Network First con Fallback Estratégico (Lo que pide PWABuilder)
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
            .catch(async () => {
                // 1. Buscamos coincidencia exacta en caché
                const cachedResponse = await caches.match(event.request);
                if (cachedResponse) return cachedResponse;
                
                // 2. EL TRUCO PARA PWABUILDER: Si está offline y pide navegar, forzamos el index
                if (event.request.mode === 'navigate') {
                    return caches.match('/StudioPrompter-Zero/index.html');
                }
            })
    );
});
