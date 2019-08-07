// Installed!

let CACHE_NAME = 'offline-page-v1';

self.addEventListener('install', evt => {
    console.log('new serviceWorker installed!');

    const FILES_TO_CACHE = [
        'offline.html',
        'styles.css',
        'favicon.ico',
        'manifest.json',
        'fonts/Pacifico-Regular.ttf'
    ]
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('SW: caching...');
            return cache.addAll(FILES_TO_CACHE);
        })
    )
})

self.addEventListener('activate', evt => {
    console.log('ServiceWorker activated!');
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys.map(key => {
                if (key !== CACHE_NAME) {
                    console.log('SW: dropping cache');
                    return caches.delete(key);
                }
            }))
        }
        )
    )
})

self.addEventListener('fetch', evt => {
    if (evt.request.mode !== 'navigate') {
        evt.respondWith(
            fetch(evt.request)
                .catch(() => {
                    return caches.open(CACHE_NAME)
                        .then(cache => {
                            return cache.match(evt.request.url.match(/[A-Za-z\.0-9]*$/)[0])
                        })
                })
        )
    } else {
        evt.respondWith(
            fetch(evt.request)
                .catch(() => {
                    return caches.open(CACHE_NAME)
                        .then(cache => {
                            return cache.match('offline.html')
                        })
                })
        )
    }


})