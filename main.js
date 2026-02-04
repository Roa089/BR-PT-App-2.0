// main.js
/* =========================================
   PT-BR Trainer 2.0 — Entry (ES Modules)
   GitHub Pages • Vanilla JS • iPhone-first
   ========================================= */

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
    toastRoot: document.querySelector("#toast-root"),
    modalRoot: document.querySelector("#modal-root"),
    sheetRoot: document.querySelector("#sheet-root"),
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
