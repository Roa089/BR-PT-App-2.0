// src/core/sw-register.js
export function registerServiceWorker(path = "./sw.js") {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", async () => {
    try {
      // Scope explizit relativ halten (GitHub Pages safe)
      const reg = await navigator.serviceWorker.register(path, { scope: "./" });

      // Optional: aktiv nach Updates suchen (hilft nach Deploys)
      try { await reg.update(); } catch {}

      // Optional: Logging (du kannst es später wieder entfernen)
      console.log("[SW] registered:", reg.scope);

      // Wenn ein neuer SW installiert ist, Seite einmal neu laden,
      // damit der neue Code sicher aktiv ist (für schnelle Deploy-Fixes).
      reg.addEventListener("updatefound", () => {
        const nw = reg.installing;
        if (!nw) return;

        nw.addEventListener("statechange", () => {
          // installed + es gibt schon einen Controller => Update fertig
          if (nw.state === "installed" && navigator.serviceWorker.controller) {
            console.log("[SW] update installed, reloading once…");
            // Einmaliger Reload um sicher neue Assets zu nutzen
            window.location.reload();
          }
        });
      });
    } catch (err) {
      // Nicht schlucken – zumindest warnen
      console.warn("[SW] registration failed:", err);
    }
  });
}

