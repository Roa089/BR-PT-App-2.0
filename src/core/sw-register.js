// src/core/sw-register.js
export function registerServiceWorker(path = "./sw.js") {
  if (!("serviceWorker" in navigator)) return;

  let reloaded = false;

  window.addEventListener("load", async () => {
    try {
      const reg = await navigator.serviceWorker.register(path, { scope: "./" });

      // aktiv nach Updates suchen (Deploy-sicher)
      try { await reg.update(); } catch {}

      // Update-Handling: genau einmal reloaden
      reg.addEventListener("updatefound", () => {
        const nw = reg.installing;
        if (!nw) return;

        nw.addEventListener("statechange", () => {
          if (
            nw.state === "installed" &&
            navigator.serviceWorker.controller &&
            !reloaded
          ) {
            reloaded = true;
            window.location.reload();
          }
        });
      });
    } catch (err) {
      console.warn("[SW] registration failed:", err);
    }
  });
}
