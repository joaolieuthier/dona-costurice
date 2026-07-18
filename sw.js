const CACHE_VERSION = "dona-costurice-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./gestao.html",
  "./assets/css/style.css",
  "./assets/js/app.js",
  "./assets/js/gestao.js",
  "./assets/images/brand/logo.jpg",
  "./assets/images/hero-costurice.jpg",
  "./manifest.webmanifest"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_VERSION).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_VERSION).map(key => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.pathname.endsWith("/data/products.json")) {
    event.respondWith(fetch(event.request).then(response => {
      const copy = response.clone(); caches.open(CACHE_VERSION).then(cache => cache.put(event.request, copy)); return response;
    }).catch(() => caches.match(event.request)));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => {
    const network = fetch(event.request).then(response => {
      if (response.ok && url.origin === self.location.origin) caches.open(CACHE_VERSION).then(cache => cache.put(event.request, response.clone()));
      return response;
    });
    return cached || network;
  }));
});
