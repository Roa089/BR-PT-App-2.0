// src/features/explore/explore.controller.js

import { getPacks, togglePack } from "../content/content.registry.js";
import { resetGenerator } from "../content/generator.js";

export function createExploreController({ ui, router } = {}) {
  const _ui = ui || (typeof window !== "undefined" ? window.UI : null) || {};
  const toast = typeof _ui.toast === "function" ? _ui.toast.bind(_ui) : (m) => console.log(m);

  function getModel() {
    const packs = getPacks();
    const enabledCount = packs.filter(p => p.enabled).length;
    return {
      packs,
      info: { enabledCount, totalCount: packs.length }
    };
  }

  function bind(root, rerender) {
    if (!root) return () => {};
    const renderSafe = () => { try { rerender?.(); } catch {} };

    function onClick(e) {
      const el = e.target.closest("[data-act]");
      if (!el) return;

      const act = el.dataset.act;

      if (act === "explore:toggle") {
        togglePack(el.dataset.key);
        toast("Pack aktualisiert");
        renderSafe();
        return;
      }

      if (act === "explore:rebuild") {
        resetGenerator();
        toast("Generator Cache zurückgesetzt");
        renderSafe();
        return;
      }

      if (act === "explore:goDaily") {
        router?.setRoute?.("daily");
        return;
      }

      if (act === "explore:goStats") {
        router?.setRoute?.("stats");
        return;
      }
    }

    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }

  return { getModel, bind };
}
