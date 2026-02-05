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

/* ---------- App bootstrap ---------- */

function qs(sel) {
  return document.querySelector(sel);
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
  console.error(msg, err);
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

function createStoreAdapter() {
  // Echte Store-API durchreichen (wichtig für Re-Renders)
  return { getState, setState, subscribe };
}

function createAppContext() {
  const appEl = qs("#app");
  if (!appEl) throw new Error("Missing #app element in index.html");

  const UI = createUI({
    toastRoot: qs("#toastRoot"),
    modalRoot: qs("#modalRoot"),
    sheetRoot: qs("#sheetRoot"),
  });

  // optional: debug
  window.UI = UI;

  const store = createStoreAdapter();

  // init features (content + srs)
  initPacks();
  initSrs({ getState, setState });

  // controllers
  const learnController = createLearnController({ store, ui: UI });
  const speakController = createSpeakController({ ui: UI });

  // daily depends on router + controllers (wired later)
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

  function bind(controller, router, renderFn) {
    if (typeof unbind === "function") unbind();
    if (controller?.bind) {
      // WICHTIG: renderFn bekommt route + router
      unbind = controller.bind(ctx.appEl, () => renderFn(router.getRoute(), router));
    } else {
      unbind = null;
    }
  }

  function renderFallback(route) {
    ctx.appEl.innerHTML = `
      <div class="card">
        <div class="title">🚧 ${escapeHtml(route)}</div>
        <div class="muted">Dieser Screen kommt als Nächstes.</div>
      </div>
    `;
    if (typeof unbind === "function") unbind();
    unbind = null;
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
        if (typeof unbind === "function") unbind();
        unbind = null;
      },

      explore: () => renderFallback(route),
      settings: () => renderFallback(route),
    };

    // FIX: Default muss daily-FUNKTION sein, nicht Wrapper der nur zurückgibt
    const fn = routeHandlers[route] || routeHandlers.daily;
    fn();
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
      setState((s) => ({ ...s, ui: { ...s.ui, route } }));
      renderer.render(route, router);
    }
  });

  router.start();
  renderer.render(router.getRoute(), router);

  // Service Worker: robust (nach load)
  window.addEventListener("load", () => {
    try {
      registerServiceWorker("./sw.js", { scope: "./" }); // falls sw-register.js opts akzeptiert
    } catch (e) {
      console.warn("Service Worker Registrierung fehlgeschlagen:", e);
    }
  });
}

// Extra: Fehler sichtbar machen statt “still”
window.addEventListener("error", (e) => fatal("Uncaught error", e.error || e.message));
window.addEventListener("unhandledrejection", (e) => fatal("Unhandled promise rejection", e.reason));

document.addEventListener("DOMContentLoaded", () => {
  try {
    start();
  } catch (e) {
    fatal("App konnte nicht gestartet werden. Prüfe index.html IDs + Console.", e);
  }
});
