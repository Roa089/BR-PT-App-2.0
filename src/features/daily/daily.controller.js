// src/features/daily/daily.controller.js

import { buildDailyPlan } from "./daily.engine.js";

export function createDailyController({ store, ui, router, learnController, speakController }) {
  let plan = { reviews: [], newInput: [], speaking: [] };

  function compute() {
    const state = store.getState();
    plan = buildDailyPlan(state, { timeBudgetMin: state.userPrefs?.timeBudgetMin || 20 });
    return plan;
  }

  function startLearn() {
    if (!learnController?.startSession) {
      ui.toast("Learn Controller fehlt");
      return;
    }

    const cards = [...(plan.reviews || []), ...(plan.newInput || [])];

    if (!cards.length) {
      ui.toast("Keine Karten für heute");
      return;
    }

    learnController.startSession(cards);
    router.setRoute("learn");
  }

  function startSpeak() {
    if (!speakController?.setQueue) {
      ui.toast("Speak Controller fehlt");
      return;
    }

    speakController.setQueue(plan.speaking || []);
    router.setRoute("speak");
  }

  function getModel() {
    const state = store.getState();
    return {
      timeBudgetMin: state.userPrefs?.timeBudgetMin || 20,
      today: state.missions?.dailyProgress || {},
      plan
    };
  }

  function bind(root, rerender) {
    compute();

    function onClick(e) {
      const act = e.target.closest("[data-act]")?.dataset.act;
      if (!act) return;

      if (act === "daily:startLearn") {
        startLearn();
      }

      if (act === "daily:startSpeak") {
        startSpeak();
      }

      if (act === "daily:refresh") {
        compute();
        ui.toast("Plan neu berechnet");
        rerender();
      }
    }

    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }

  return { getModel, bind };
}