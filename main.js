// main.js
/* =========================================
   PT-BR Trainer 2.0 — Entry (ES Modules)
   GitHub Pages • Vanilla JS • iPhone-first
   ========================================= */
const app = document.querySelector("#app");
if (!app) {
  alert("FEHLER: #app nicht gefunden. Prüfe index.html <main id='app'>");
} else {
  app.innerHTML = "<div style='padding:16px;color:white'>main.js läuft ✅</div>";
}



import { registerServiceWorker } from "./src/core/sw-register.js";
import { createUI } from "./src/core/ui.js";
import { createRouter } from "./src/core/router.js";

// Minimal placeholder render until features are added
function render(route) {
  const app = document.querySelector("#app");
  if (!app) return;

  const views = {
    daily: () => `
      <div class="card">
        <div class="title">⚡ Daily Flow</div>
        <div class="muted">App 2.0 Shell ist live. Nächster Schritt: Store + Daily Engine.</div>
        <hr/>
        <div class="row">
          <button class="btn primary" id="btnToast">Toast testen</button>
          <button class="btn" id="btnModal">Modal testen</button>
        </div>
      </div>
    `,
    learn: () => `
      <div class="card">
        <div class="title">📚 Lernen</div>
        <div class="muted">Hier kommt Flip + 2-track SRS.</div>
      </div>
    `,
    speak: () => `
      <div class="card">
        <div class="title">🎤 Sprechen</div>
        <div class="muted">Hier kommt Shadowing + Stop Mic.</div>
      </div>
    `,
    explore: () => `
      <div class="card">
        <div class="title">🧭 Themen</div>
        <div class="muted">Hier kommen 20 Topics A1–C2 + Generator.</div>
      </div>
    `,
    stats: () => `
      <div class="card">
        <div class="title">📈 Stats</div>
        <div class="muted">Hier kommen KPIs + Charts.</div>
      </div>
    `,
    settings: () => `
      <div class="card">
        <div class="title">⚙️ Settings</div>
        <div class="muted">Hier kommen Packs, Zeitbudget, Hard Mode.</div>
      </div>
    `
  };

  const view = views[route] ? views[route]() : views.daily();
  app.innerHTML = view;

  // tiny demo bindings
  const { toast, openModal } = window.UI || {};
  document.querySelector("#btnToast")?.addEventListener("click", () => toast?.("Hallo 👋 PT-BR 2.0 ist bereit."));
  document.querySelector("#btnModal")?.addEventListener("click", () => {
    openModal?.(`
      <div class="title">Quick Modal</div>
      <p class="muted">Nächster Prompt: Store + Router + UI Utilities.</p>
      <div class="row" style="margin-top:12px;">
        <button class="btn primary" data-close="1">OK</button>
      </div>
    `);
  });
}

function init() {
  // UI helpers (toast/modal/sheet)
  window.UI = createUI({
    toastRoot: document.querySelector("#toastRoot"),
    modalRoot: document.querySelector("#modalRoot"),
    sheetRoot: document.querySelector("#sheetRoot"),
  });

  // Router (tabs + hash)
  const router = createRouter({
    defaultRoute: "daily",
    tabsSelector: ".tab",
    onRoute: (route) => render(route),
  });

  // top-right quick actions demo
  document.querySelector("#btnQuick")?.addEventListener("click", () => {
    window.UI.openSheet(`
      <div class="title">Quick Actions</div>
      <p class="muted">In App 2.0 kommt hier: Zeitbudget, Hard Mode, Packs.</p>
      <div class="row" style="margin-top:12px;">
        <button class="btn primary" data-close="1">Schließen</button>
      </div>
    `);
  });

  router.start();
  registerServiceWorker("./sw.js");
}

document.addEventListener("DOMContentLoaded", init);

// main.js
import { createRouter } from "./src/core/router.js";
import { createUI } from "./src/core/ui.js";
import { getState, setState } from "./src/core/store.js";

import { init as initSrs } from "./src/features/learn/srs.engine.js";
import { initPacks } from "./src/features/content/packs.init.js";

import { renderDailyView } from "./src/features/daily/daily.view.js";
import { createDailyController } from "./src/features/daily/daily.controller.js";

import { renderLearnView } from "./src/features/learn/learn.view.js";
import { createLearnController } from "./src/features/learn/learn.controller.js";

import { renderSpeakView } from "./src/features/speak/speak.view.js";
import { createSpeakController } from "./src/features/speak/speak.controller.js";

import { buildStats } from "./src/features/stats/stats.engine.js";
import { renderStatsView } from "./src/features/stats/stats.view.js";

const app = document.querySelector("#app");
const toastRoot = document.querySelector("#toastRoot");
const modalRoot = document.querySelector("#modalRoot");
const sheetRoot = document.querySelector("#sheetRoot");

// UI
const UI = createUI({ toastRoot, modalRoot, sheetRoot });
window.UI = UI;

// Store adapter for SRS + controllers
const store = { getState, setState, subscribe: () => () => {} };

// Init content + srs
initPacks();
initSrs({ getState, setState });

// Controllers
const learnController = createLearnController({ store, ui: UI });
const speakController = createSpeakController({ ui: UI });
let dailyController = null;

function render(route) {
  const state = getState();

  if (route === "daily") {
    dailyController ||= createDailyController({ store, ui: UI, router, learnController, speakController });
    app.innerHTML = renderDailyView(dailyController.getModel());
    bindReplace(dailyController);
    return;
  }

  if (route === "learn") {
    app.innerHTML = renderLearnView(learnController.getModel());
    bindReplace(learnController);
    return;
  }

  if (route === "speak") {
    app.innerHTML = renderSpeakView(speakController.getModel());
    bindReplace(speakController);
    return;
  }

  if (route === "stats") {
    const model = buildStats(state);
    app.innerHTML = renderStatsView(model);
    // simple static view: no controller needed
    return;
  }

  // fallback
  app.innerHTML = `
    <div class="card">
      <div class="title">🚧 ${route}</div>
      <div class="muted">Dieser Screen kommt als Nächstes.</div>
    </div>
  `;
}

let unbind = null;
function bindReplace(controller) {
  if (typeof unbind === "function") unbind();
  if (controller?.bind) unbind = controller.bind(app, () => render(router.getRoute()));
}

const router = createRouter({
  onRouteChange: (route) => {
    // keep in store (optional)
    setState((s) => ({ ...s, ui: { ...s.ui, route } }));
    render(route);
  }
});

router.start();
render(router.getRoute());
