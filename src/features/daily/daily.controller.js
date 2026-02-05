// src/features/daily/daily.controller.js

import { buildDailyPlan } from "./daily.engine.js";

export function createDailyController({ store, ui, router, learnController, speakController }) {
  let plan = { reviews: [], newInput: [], speaking: [] };

  function compute() {
    const state = store?.getState?.() || {};
    const budget = state.userPrefs?.timeBudgetMin || 20;

    try {
      const next = buildDailyPlan(state, { timeBudgetMin: budget });
      plan = next || { reviews: [], newInput: [], speaking: [] };
    } catch (e) {
      console.error("[Daily] buildDailyPlan failed", e);
      plan = { reviews: [], newInput: [], speaking: [] };
    }

    return plan;
  }

  function startLearn() {
    if (!learnController || typeof learnController.startSession !== "function") {
      ui?.toast?.("Learn Controller fehlt");
      return;
    }

    const cards = [
      ...(Array.isArray(plan.reviews) ? plan.reviews : []),
      ...(Array.isArray(plan.newInput) ? plan.newInput : [])
    ];

    if (!cards.length) {
      ui?.toast?.("Keine Karten für heute");
      return;
    }

    learnController.startSession(cards);
    router?.setRoute?.("learn");
  }

  function startSpeak() {
    if (!speakController || typeof speakController.setQueue !== "function") {
      ui?.toast?.("Speak Controller fehlt");
      return;
    }

    const queue = Array.isArray(plan.speaking) ? plan.speaking : [];
    if (!queue.length) {
      ui?.toast?.("Keine Speaking-Übungen");
      return;
    }

    speakController.setQueue(queue);
    router?.setRoute?.("speak");
  }

  function getModel() {
    const state = store?.getState?.() || {};
    return {
      timeBudgetMin: state.userPrefs?.timeBudgetMin || 20,
      today: state.missions?.dailyProgress || {},
      plan
    };
  }

  function bind(root, rerender) {
    if (!root) return () => {};
    compute();

    function onClick(e) {
      const el = e.target.closest("[data-act]");
      if (!el) return;

      const act = el.dataset.act;

      if (act === "daily:startLearn") {
        startLearn();
        return;
      }

      if (act === "daily:startSpeak") {
        startSpeak();
        return;
      }

      if (act === "daily:refresh") {
        compute();
        ui?.toast?.("Plan neu berechnet");
        if (typeof rerender === "function") rerender();
      }
    }

    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }

  return { getModel, bind };
}
