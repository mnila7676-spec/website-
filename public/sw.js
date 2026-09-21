const CACHE = 'lumiva-v2'
const ASSETS = ['./', './manifest.webmanifest', './icons/icon.svg']
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {})); self.skipWaiting() })
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim() })
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url)
  if (e.request.method !== 'GET' || url.origin !== location.origin) return
  if (url.pathname.includes('/images/')) { e.respondWith(caches.open(CACHE).then(async c => { const hit = await c.match(e.request); if (hit) return hit; const res = await fetch(e.request); c.put(e.request, res.clone()); return res })); return }
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request).then(r => r || caches.match('./'))))
})
