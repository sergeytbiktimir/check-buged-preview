const CACHE = 'chek-budget-pwa-3bfe390b';
const LOCAL = [
  './', 'index.html', 'styles.css', 'app.bundle.js',
  'react.development.js', 'react-dom.development.js',
  'manifest.json',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png',
];
self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(LOCAL.map(u => new Request(u, { cache: 'no-cache' })));
  })());
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request).then(r => {
    if (r && (r.ok || r.type === 'opaque')) { const cl = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cl)); }
    return r;
  })));
});
