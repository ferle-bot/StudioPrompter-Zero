const CACHE_NAME = 'studioprompter-cache-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json'
    // Aquí agregarías los nombres de tus iconos cuando los crees
    // './icon-192.png',
    // './icon-512.png'
];

// Evento de Instalación (Guarda los archivos en caché)
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Archivos cacheados exitosamente');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Evento de Activación (Limpia cachés viejas si actualizas la versión)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[Service Worker] Limpiando caché antigua');
                        return caches.delete(cache);
                    }
                })
            );
        })
        .then(() => self.clients.claim())
    );
});

// Interceptor de Red (Estrategia: Cache-First)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Devuelve la versión cacheada si existe (Offline mode), si no, va a la red
                return response || fetch(event.request);
            })
    );
});
