// src/features/daily/daily.controller.js
/* =========================================
   Daily Controller 2.0
   - Builds plan via daily.engine
   - Starts Learn/Speak modules with queues
   - Updates store prefs + missions
   ========================================= */

import { actions as storeActions, selectors as storeSelectors } from "../../core/store.js";
import { buildDailyPlan } from "./daily.engine.js";
import { isSupported as ttsSupported } from "../../core/audio.js";

export function createDailyController({ store, ui, router, learnController, speakController } = {}) {
  const _store = store;
  const _ui = ui || window.UI || {};
  const toast = _ui.toast || ((m) => console.log(m));
  const _router = router;

  let plan = { reviews: [], newInput: [], speaking: [] };
  let weakTopics = [];

  function compute() {
    const s = _store.getState();
    const timeBudgetMin = storeSelectors.timeBudgetMin(s);

    const out = buildDailyPlan(s, { timeBudgetMin });
    plan = out;

    // Derive weak topics from speaking queue (best effort)
    weakTopics = (out.speaking || []).map(x => x.topic).filter(Boolean);
    weakTopics = Array.from(new Set(weakTopics)).slice(0, 3);

    return out;
  }

  function startLearn() {
    if (!learnController?.startSession) {
      toast("Learn Controller fehlt/noch nicht wired.");
      return;
    }
    // Reviews first, then newInput
    const session = [...(plan.reviews || []), ...(plan.newInput || [])];
    learnController.startSession(session);
    storeActions.setRoute("learn");
    _router?.setRoute?.("learn");
  }

  function startSpeak() {
    if (!speakController?.setQueue) {
      toast("Speak Controller fehlt/noch nicht wired.");
      return;
    }
    speakController.setQueue(plan.speaking || []);
    storeActions.setRoute("speak");
    _router?.setRoute?.("speak");
  }

  function setBudget(min) {
    storeActions.setTimeBudgetMin(Number(min));
    compute();
    toast(`Budget: ${Number(min)} min`);
  }

  function getModel() {
    const s = _store.getState();
    const timeBudgetMin = storeSelectors.timeBudgetMin(s);
    const missions = s.missions || {};
    const todayKey = toDayKey(new Date());
    const today = (missions.dailyProgress || {})[todayKey] || { reviews: 0, newInput: 0, speaking: 0, story: 0, xpEarned: 0 };

    return {
      timeBudgetMin,
      today,
      plan,
      weakTopics,
      hasTts: ttsSupported()
    };
  }

  function bind(root, rerender) {
    if (!root) return () => {};

    function onClick(e) {
      const el = e.target.closest("[data-act]");
      if (!el) return;

      const act = el.dataset.act;

      if (act === "daily:budget") {
        setBudget(el.dataset.val);
        rerender?.();
        return;
      }

      if (act === "daily:refresh") {
        compute();
        toast("Neu geplant ✅");
        rerender?.();
        return;
      }

      if (act === "daily:startLearn") {
        computeIfNeeded();
        startLearn();
        rerender?.();
        return;
      }

      if (act === "daily:startSpeak") {
        computeIfNeeded();
        startSpeak();
        rerender?.();
        return;
      }
    }

    function computeIfNeeded() {
      if (!plan || (!plan.reviews && !plan.newInput && !plan.speaking)) compute();
      // if empty plan, compute anyway
      if ((plan.reviews?.length || 0) + (plan.newInput?.length || 0) + (plan.speaking?.length || 0) === 0) compute();
    }

    root.addEventListener("click", onClick);

    // compute at bind time for instant content
    compute();

    // keyboard: L = start learn, S = start speak, R = refresh
    function onKeyDown(e) {
      const k = e.key.toLowerCase();
      if (k === "l") { computeIfNeeded(); startLearn(); e.preventDefault(); }
      if (k === "s") { computeIfNeeded(); startSpeak(); e.preventDefault(); }
      if (k === "r") { compute(); toast("Neu geplant ✅"); rerender?.(); e.preventDefault(); }
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      root.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }

  return { compute, getModel, bind };
}

/* ---------- helpers ---------- */
function toDayKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
}
