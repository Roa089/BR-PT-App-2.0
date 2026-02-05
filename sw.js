// sw.js (robust, update-sicher, GitHub-Pages-safe)
const CACHE_VERSION = "ptbr2-v5";
const CACHE = CACHE_VERSION;

// Stabile Referenz für HTML-Fallback
const INDEX_URL = new URL("./index.html", self.location);
const INDEX_REQ = new Request(INDEX_URL.href, { cache: "reload" });

// App-Shell bewusst klein halten
const APP_SHELL = [
  INDEX_REQ,
  "./",
  "./style.css",
  "./main.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    for (const item of APP_SHELL) {
      try {
        await cache.add(item);
      } catch {
        // bewusst ignorieren (404 o.ä. dürfen SW nicht killen)
      }
    }
  })());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.map((k) => (k === CACHE ? null : caches.delete(k)))
    );
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Nur gleiche Origin
  if (url.origin !== self.location.origin) return;

  // Navigation: network-first + stabiles HTML-Fallback
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE);
        cache.put(INDEX_REQ, fresh.clone());
        return fresh;
      } catch {
        const cached = await caches.match(INDEX_REQ);
        return cached || new Response("Offline", {
          status: 503,
          headers: { "Content-Type": "text/plain" }
        });
      }
    })());
    return;
  }

  // Assets: stale-while-revalidate
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req);

    const update = fetch(req)
      .then((fresh) => {
        cache.put(req, fresh.clone());
        return fresh;
      })
      .catch(() => null);

    return cached || (await update) || new Response("", { status: 504 });
  })());
});
