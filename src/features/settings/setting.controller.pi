// src/features/settings/settings.controller.js

import { getState, resetStore, actions } from "../../core/store.js";

export function createSettingsController({ ui } = {}) {
  const _ui = ui || (typeof window !== "undefined" ? window.UI : null) || {};
  const toast = typeof _ui.toast === "function" ? _ui.toast.bind(_ui) : (m) => console.log(m);

  function getModel() {
    const s = getState();
    return { prefs: s.userPrefs || {} };
  }

  function bind(root, rerender) {
    if (!root) return () => {};
    const renderSafe = () => { try { rerender?.(); } catch {} };

    function writeOut(txt) {
      const ta = root.querySelector("#settingsOut");
      if (ta) ta.value = txt || "";
    }

    function onClick(e) {
      const el = e.target.closest("[data-act]");
      if (!el) return;
      const act = el.dataset.act;

      if (act === "settings:budget") {
        actions.setTimeBudgetMin(Number(el.dataset.val));
        toast("Zeitbudget gespeichert");
        renderSafe();
        return;
      }

      if (act === "settings:toggleTranslation") {
        const s = getState();
        actions.setShowTranslationByDefault(!s.userPrefs?.showTranslationByDefault);
        renderSafe();
        return;
      }

      if (act === "settings:toggleHardMode") {
        const s = getState();
        actions.setHardMode(!s.userPrefs?.hardMode);
        renderSafe();
        return;
      }

      if (act === "settings:export") {
        writeOut(JSON.stringify(getState(), null, 2));
        toast("Export erstellt");
        return;
      }

      if (act === "settings:reset") {
        resetStore();
        writeOut("");
        toast("Store zurückgesetzt");
        renderSafe();
        return;
      }
    }

    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }

  return { getModel, bind };
}
