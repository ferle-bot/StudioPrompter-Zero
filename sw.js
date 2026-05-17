const CACHE_NAME = 'studioprompter-cache-v1.4'; // Versión actualizada
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './assets/images/icon-192.png',
    './assets/images/icon-512.png'
];

// Evento de Instalación (Tolerante a Fallos 404)
self.addEventListener('install', (event) => {
    self.skipWaiting(); // Fuerza la instalación inmediata sin esperar a que cierres pestañas
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Iniciando caché de assets...');
            // Iteramos uno por uno. Si falla uno, no rompe el resto.
            return Promise.all(
                ASSETS_TO_CACHE.map(asset => {
                    return cache.add(asset).catch(err => {
                        console.warn(`[Service Worker] Fallo aisldado al cachear: ${asset}`, err);
                    });
                })
            );
        })
    );
});

// Limpieza de cachés antiguas para no llenar la memoria del teléfono
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[Service Worker] Limpiando caché antigua:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Interceptor de Red (Cache First)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Si está en la memoria del teléfono, lo servimos de ahí (Offline Mode)
            if (cachedResponse) {
                return cachedResponse;
            }
            // Si no está, lo buscamos en internet (GitHub Pages)
            return fetch(event.request);
        })
    );
});
