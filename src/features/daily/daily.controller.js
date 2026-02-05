// src/features/daily/daily.controller.js
/* =========================================
   Daily Controller 2.1
   - Plan compute + rerender
   - Budget selector (10..100 step 10)
   - Metrics wiring (Reviews/New/Speak/Heute XP)
   ========================================= */

import { buildDailyPlan } from "./daily.engine.js";
import { actions } from "../../core/store.js";

export function createDailyController({ store, ui, router, learnController, speakController }) {
  let plan = { reviews: [], newInput: [], speaking: [] };
  let weakTopics = [];

  function compute() {
    const state = store.getState();
    const tb = Number(state.userPrefs?.timeBudgetMin || 20);

    const built = buildDailyPlan(state, { timeBudgetMin: tb }) || {};
    plan = {
      reviews: Array.isArray(built.reviews) ? built.reviews : [],
      newInput: Array.isArray(built.newInput) ? built.newInput : [],
      speaking: Array.isArray(built.speaking) ? built.speaking : []
    };
    weakTopics = Array.isArray(built.weakTopics) ? built.weakTopics : [];

    return plan;
  }

  function startLearn() {
    if (!learnController?.startSession) {
      ui?.toast?.("Learn Controller fehlt");
      return;
    }

    const cards = [...(plan.reviews || []), ...(plan.newInput || [])].filter(Boolean);

    if (!cards.length) {
      ui?.toast?.("Keine Karten für heute");
      return;
    }

    try {
      learnController.startSession(cards);
      router?.setRoute?.("learn");
    } catch (e) {
      console.warn("[PTBR2] startLearn failed:", e);
      ui?.toast?.("Konnte Learn nicht starten.");
    }
  }

  function startSpeak() {
    if (!speakController?.setQueue) {
      ui?.toast?.("Speak Controller fehlt");
      return;
    }

    try {
      speakController.setQueue((plan.speaking || []).filter(Boolean));
      router?.setRoute?.("speak");
    } catch (e) {
      console.warn("[PTBR2] startSpeak failed:", e);
      ui?.toast?.("Konnte Speak nicht starten.");
    }
  }

  function setBudget(val) {
    const n = Number(val);
    const v = clampToSet(n, allowedBudgets(), 20);

    try {
      // prefer core action (keeps future compatibility)
      actions?.setTimeBudgetMin?.(v);
    } catch (e) {
      console.warn("[PTBR2] actions.setTimeBudgetMin failed, falling back to store.setState:", e);
      store.setState((s) => ({ ...s, userPrefs: { ...s.userPrefs, timeBudgetMin: v } }));
    }

    compute();
  }

  function todayXP(state) {
    const dayKey = toDayKey(new Date());
    const entry = (state.missions?.dailyProgress || {})[dayKey] || {};
    return Math.max(0, Number(entry.xpEarned || 0));
  }

  function getModel() {
    const state = store.getState();
    const tb = Number(state.userPrefs?.timeBudgetMin || 20);

    // Ensure plan exists even if controller is called before bind()
    if (!plan || (!plan.reviews && !plan.newInput && !plan.speaking)) compute();

    return {
      timeBudgetMin: tb,
      today: { xpEarned: todayXP(state) },
      plan,
      weakTopics,
      hasTts: !!(typeof window !== "undefined" && "speechSynthesis" in window)
    };
  }

  function bind(root, rerender) {
    if (!root) return () => {};

    // initial compute
    compute();

    const safeRerender = () => {
      try { rerender?.(); } catch (e) { console.warn("[PTBR2] daily rerender failed:", e); }
    };

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
        safeRerender();
        return;
      }

      if (act === "daily:budget") {
        const val = el.dataset.val;
        if (val == null) return;
        setBudget(val);
        ui?.toast?.(`Zeitbudget: ${store.getState().userPrefs?.timeBudgetMin || 20} min`);
        safeRerender();
        return;
      }
    }

    root.addEventListener("click", onClick);

    // re-render daily automatically when store changes while on daily route
    const unsub = store.subscribe?.((next) => {
      const route = String(next?.ui?.route || "");
      if (route === "daily") {
        compute();
        safeRerender();
      }
    });

    return () => {
      root.removeEventListener("click", onClick);
      try { unsub?.(); } catch {}
    };
  }

  return { getModel, bind };
}

/* ---------- Helpers ---------- */

function allowedBudgets() {
  // 10..100 in 10er Schritten
  const out = [];
  for (let i = 10; i <= 100; i += 10) out.push(i);
  return out;
}

function clampToSet(n, allowed, fallback) {
  if (!Number.isFinite(n)) return fallback;
  let best = allowed[0] ?? fallback;
  let bestDist = Math.abs(n - best);
  for (const v of allowed) {
    const d = Math.abs(n - v);
    if (d < bestDist) { best = v; bestDist = d; }
  }
  return best;
}

function toDayKey(d) {
  const dt = d instanceof Date ? d : new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const da = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
}