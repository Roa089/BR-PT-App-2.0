// sw.js (robust, update-sicher, GitHub-Pages-safe)
const CACHE_VERSION = "ptbr2-v4"; // bei jedem Deploy erhöhen
const CACHE = CACHE_VERSION;

const INDEX = new Request("./index.html", { cache: "reload" });

// App-Shell: halte das klein + stabil
const APP_SHELL = [
  "./",
  INDEX,
  "./style.css",
  "./main.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);

    // Wichtig: nicht an einer fehlenden Datei scheitern
    for (const item of APP_SHELL) {
      try {
        await cache.add(item);
      } catch (e) {
        // optional: loggen, aber nicht crashen
        // console.warn("[SW] cache add failed:", item, e);
      }
    }
  })());

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => (k === CACHE ? null : caches.delete(k))));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Nur gleiche Origin behandeln
  if (url.origin !== location.origin) return;

  // NAVIGATION: network-first + fallback auf INDEX
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE);
        cache.put(INDEX, fresh.clone()); // stabiler Key
        return fresh;
      } catch {
        const cached = await caches.match(INDEX);
        return cached || new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } });
      }
    })());
    return;
  }

  // ASSETS: stale-while-revalidate (besser für Updates)
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req);
    const fetchPromise = fetch(req)
      .then((fresh) => {
        cache.put(req, fresh.clone());
        return fresh;
      })
      .catch(() => null);

    // sofort Cache liefern, im Hintergrund updaten
    return cached || (await fetchPromise) || new Response("", { status: 504 });
  })());
});
