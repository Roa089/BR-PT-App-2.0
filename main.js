// main.js
/* =========================================
   PT-BR Trainer 2.0 — Entry (ES Modules)
   GitHub Pages • Vanilla JS • iPhone-first
   ========================================= */

import { registerServiceWorker } from "./src/core/sw-register.js";
import { createUI } from "./src/core/ui.js";
import { createRouter } from "./src/core/router.js";
import { getState, setState, subscribe } from "./src/core/store.js";

import { initPacks } from "./src/features/content/packs.init.js";
import { init as initSrs } from "./src/features/learn/srs.engine.js";

import { createDailyController } from "./src/features/daily/daily.controller.js";
import { renderDailyView } from "./src/features/daily/daily.view.js";

import { createLearnController } from "./src/features/learn/learn.controller.js";
import { renderLearnView } from "./src/features/learn/learn.view.js";

import { createSpeakController } from "./src/features/speak/speak.controller.js";
import { renderSpeakView } from "./src/features/speak/speak.view.js";

import { buildStats } from "./src/features/stats/stats.engine.js";
import { renderStatsView } from "./src/features/stats/stats.view.js";

/* ---------- Bootstrap helpers ---------- */

const APP_PREFIX = "[PTBR2]";
const url = new URL(location.href);
const DEBUG = url.searchParams.get("debug") === "1";
const NO_SW = url.searchParams.get("nosw") === "1";

function log(...args) {
  if (DEBUG) console.log(APP_PREFIX, ...args);
}

function warn(...args) {
  console.warn(APP_PREFIX, ...args);
}

function qs(sel, root = document) {
  return root.querySelector(sel);
}

function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function fatal(msg, err) {
  warn(msg, err);
  const app = qs("#app");
  if (app) {
    app.innerHTML = `
      <div class="card">
        <div class="title">⚠️ Fehler</div>
        <div class="muted">${escapeHtml(msg)}</div>
        <hr/>
        <div class="small muted">Öffne die Console für Details.</div>
      </div>
    `;
  }
}

/* ---------- Optional: SW disable for debug ---------- */

async function disableServiceWorkerIfRequested() {
  if (!NO_SW) return;
  if (!("serviceWorker" in navigator)) return;

  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map((r) => r.unregister().catch(() => false)));
    // Best-effort: clear caches for this origin
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k).catch(() => false)));
    }
    warn("Service Worker disabled via ?nosw=1 (registrations removed, caches cleared).");
  } catch (e) {
    warn("Failed to disable Service Worker:", e);
  }
}

/* ---------- App context ---------- */

function ensureRoots() {
  // Defensive: ensure essential DOM roots exist (in case HTML changed)
  if (!qs("#app")) {
    const main = document.createElement("main");
    main.id = "app";
    main.className = "app";
    main.setAttribute("role", "main");
    document.body.appendChild(main);
  }

  if (!qs("#toastRoot")) {
    const d = document.createElement("div");
    d.id = "toastRoot";
    d.className = "toastRoot";
    d.setAttribute("aria-live", "polite");
    d.setAttribute("aria-atomic", "true");
    document.body.appendChild(d);
  }

  if (!qs("#modalRoot")) {
    const d = document.createElement("div");
    d.id = "modalRoot";
    d.className = "modalRoot";
    d.hidden = true;
    d.setAttribute("aria-hidden", "true");
    document.body.appendChild(d);
  }

  if (!qs("#sheetRoot")) {
    const d = document.createElement("div");
    d.id = "sheetRoot";
    d.className = "sheetRoot";
    d.hidden = true;
    d.setAttribute("aria-hidden", "true");
    document.body.appendChild(d);
  }
}

function createStoreAdapter() {
  return { getState, setState, subscribe };
}

function createAppContext() {
  ensureRoots();

  const appEl = qs("#app");
  if (!appEl) throw new Error("Missing #app element in index.html");

  const UI = createUI({
    toastRoot: qs("#toastRoot"),
    modalRoot: qs("#modalRoot"),
    sheetRoot: qs("#sheetRoot"),
  });

  // Bridge compatibility: only expose minimal global (non-enumerable)
  try {
    Object.defineProperty(window, "UI", {
      value: UI,
      writable: true,
      configurable: true,
      enumerable: false
    });
  } catch {
    window.UI = UI;
  }

  const store = createStoreAdapter();

  // init features (content + srs)
  try {
    initPacks();
  } catch (e) {
    warn("initPacks failed:", e);
  }

  try {
    initSrs({ getState, setState });
  } catch (e) {
    warn("initSrs failed:", e);
  }

  // controllers
  const learnController = createLearnController({ store, ui: UI });
  const speakController = createSpeakController({ ui: UI });

  let dailyController = null;

  return {
    appEl,
    UI,
    store,
    controllers: { learnController, speakController },
    getOrCreateDailyController(router) {
      if (!dailyController) {
        dailyController = createDailyController({
          store,
          ui: UI,
          router,
          learnController,
          speakController,
        });
      }
      return dailyController;
    }
  };
}

/* ---------- Rendering + binding ---------- */

function createRenderer(ctx) {
  let unbind = null;

  function safeUnbind() {
    if (typeof unbind === "function") {
      try { unbind(); } catch (e) { warn("unbind failed:", e); }
    }
    unbind = null;
  }

  function bind(controller, router, renderFn) {
    safeUnbind();
    if (controller?.bind) {
      try {
        unbind = controller.bind(ctx.appEl, () => renderFn(router.getRoute(), router));
      } catch (e) {
        warn("controller.bind failed:", e);
        unbind = null;
      }
    }
  }

  function renderFallback(route) {
    ctx.appEl.innerHTML = `
      <div class="card">
        <div class="title">🚧 ${escapeHtml(route)}</div>
        <div class="muted">Dieser Screen kommt als Nächstes.</div>
      </div>
    `;
    safeUnbind();
  }

  function render(route, router) {
    const state = getState();

    const routeHandlers = {
      daily: () => {
        const c = ctx.getOrCreateDailyController(router);
        ctx.appEl.innerHTML = renderDailyView(c.getModel());
        bind(c, router, render);
      },

      learn: () => {
        const c = ctx.controllers.learnController;
        ctx.appEl.innerHTML = renderLearnView(c.getModel());
        bind(c, router, render);
      },

      speak: () => {
        const c = ctx.controllers.speakController;
        ctx.appEl.innerHTML = renderSpeakView(c.getModel());
        bind(c, router, render);
      },

      stats: () => {
        const model = buildStats(state);
        ctx.appEl.innerHTML = renderStatsView(model);
        safeUnbind();
      },

      explore: () => renderFallback(route),
      settings: () => renderFallback(route),
    };

    const fn = routeHandlers[route] || routeHandlers.daily;

    try {
      fn();
    } catch (e) {
      fatal(`Render fehlgeschlagen (${route}).`, e);
    }
  }

  return { render };
}

/* ---------- Start ---------- */

function start() {
  const ctx = createAppContext();
  const renderer = createRenderer(ctx);

  const router = createRouter({
    defaultRoute: "daily",
    tabsSelector: ".tab",
    onRouteChange: (route) => {
      try {
        setState((s) => ({ ...s, ui: { ...s.ui, route } }));
      } catch (e) {
        warn("setState(route) failed:", e);
      }
      renderer.render(route, router);
    }
  });

  router.start();
  renderer.render(router.getRoute(), router);

  // Service Worker: register after load (GitHub Pages safe)
  window.addEventListener("load", () => {
    try {
      if (!NO_SW) registerServiceWorker("./sw.js");
      else warn("SW registration skipped (?nosw=1).");
    } catch (e) {
      warn("Service Worker registration threw:", e);
    }
  });

  log("started", { route: router.getRoute() });
}

/* ---------- Global error visibility ---------- */

window.addEventListener("error", (e) => {
  const err = e?.error || e?.message || e;
  fatal("Uncaught error", err);
});

window.addEventListener("unhandledrejection", (e) => {
  fatal("Unhandled promise rejection", e?.reason || e);
});

/* ---------- DOM ready ---------- */

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await disableServiceWorkerIfRequested();
    start();
  } catch (e) {
    fatal("App konnte nicht gestartet werden. Prüfe index.html IDs + Console.", e);
  }
});