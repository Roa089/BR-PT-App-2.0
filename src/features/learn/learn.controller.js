// src/features/learn/learn.controller.js
/* =========================================
   Learn Controller 2.0
   - Session over cards (from Daily)
   - Flip -> Comprehension -> Production
   - SRS scheduling via srs.engine.js
   ========================================= */

import { schedule } from "./srs.engine.js";

export function createLearnController({ store, ui } = {}) {
  const _store = store || {};
  const _ui = ui || (typeof window !== "undefined" ? window.UI : null) || {};
  const toast = typeof _ui.toast === "function" ? _ui.toast.bind(_ui) : (m) => console.log(m);

  // Session state (kept local; persisted progress via store)
  let session = [];
  let idx = 0;

  let flipped = false;
  let step = "front"; // "front" | "comprehension" | "production"
  let compChoice = null; // "instant" | "hint" | "fail"

  function safeGetState() {
    try {
      return typeof _store.getState === "function" ? _store.getState() : null;
    } catch (e) {
      console.warn("[PTBR2] store.getState failed:", e);
      return null;
    }
  }

  function safeSetState(updater) {
    try {
      if (typeof _store.setState === "function") return _store.setState(updater);
      console.warn("[PTBR2] store.setState missing");
    } catch (e) {
      console.warn("[PTBR2] store.setState failed:", e);
    }
    return null;
  }

  function currentCard() {
    return session[idx] || null;
  }

  function resetCardFlow() {
    flipped = false;
    step = "front";
    compChoice = null;
  }

  function startSession(cards) {
    session = Array.isArray(cards) ? cards.filter(Boolean) : [];
    idx = 0;
    resetCardFlow();

    if (!session.length) toast("Keine Karten für Session.");
  }

  function skip() {
    if (!session.length) return;
    idx = Math.min(session.length - 1, idx + 1);
    resetCardFlow();
  }

  function flip() {
    flipped = true;
    if (step === "front") step = "comprehension";
  }

  function rateComprehension(kind) {
    if (!currentCard()) return;

    compChoice = kind;

    // Map to SRS rating
    // instant -> easy, hint -> ok, fail -> fail
    const rating = kind === "instant" ? "easy" : kind === "hint" ? "ok" : "fail";

    try {
      schedule("comprehension", currentCard().id, rating);
    } catch (e) {
      console.warn("[PTBR2] schedule(comprehension) failed:", e);
    }

    addProgress("reviews", 1);
    addXP(kind === "instant" ? 4 : kind === "hint" ? 2 : 1);

    // Move to production step
    step = "production";
    flipped = true;
  }

  function rateProduction(kind) {
    if (!currentCard()) return;

    // fluent -> easy, hesitant -> ok, fail -> fail
    const rating = kind === "fluent" ? "easy" : kind === "hesitant" ? "ok" : "fail";

    try {
      schedule("production", currentCard().id, rating);
    } catch (e) {
      console.warn("[PTBR2] schedule(production) failed:", e);
    }

    addProgress("speaking", 1);
    addXP(kind === "fluent" ? 6 : kind === "hesitant" ? 3 : 1);

    // Next card
    skip();
  }

  function addXP(amount) {
    const a = Math.max(0, Number(amount || 0));
    if (!a) return;

    const dayKey = toDayKey(new Date());

    safeSetState((s) => {
      const missions = s.missions || {};
      const dp = { ...(missions.dailyProgress || {}) };
      const entry = dp[dayKey] || { reviews: 0, newInput: 0, speaking: 0, story: 0, xpEarned: 0 };
      entry.xpEarned = Math.max(0, Number(entry.xpEarned || 0)) + a;
      dp[dayKey] = entry;

      const last = missions.lastActiveDay || null;
      let streak = Math.max(0, Number(missions.streak || 0));

      if (!last) streak = 1;
      else if (isYesterdayKey(last, dayKey)) streak = streak + 1;
      else if (last !== dayKey) streak = 1;

      return {
        ...s,
        missions: {
          ...missions,
          xp: Math.max(0, Number(missions.xp || 0)) + a,
          streak,
          lastActiveDay: dayKey,
          dailyProgress: dp
        }
      };
    });
  }

  function addProgress(type, amount = 1) {
    const t = String(type || "");
    const a = Math.max(0, Number(amount || 0));
    if (!a) return;

    const dayKey = toDayKey(new Date());

    safeSetState((s) => {
      const missions = s.missions || {};
      const dp = { ...(missions.dailyProgress || {}) };
      const entry = dp[dayKey] || { reviews: 0, newInput: 0, speaking: 0, story: 0, xpEarned: 0 };

      if (t === "reviews") entry.reviews += a;
      if (t === "newInput") entry.newInput += a;
      if (t === "speaking") entry.speaking += a;
      if (t === "story") entry.story += a;

      dp[dayKey] = entry;

      const last = missions.lastActiveDay || null;
      let streak = Math.max(0, Number(missions.streak || 0));

      if (!last) streak = 1;
      else if (isYesterdayKey(last, dayKey)) streak = streak + 1;
      else if (last !== dayKey) streak = 1;

      return {
        ...s,
        missions: { ...missions, streak, lastActiveDay: dayKey, dailyProgress: dp }
      };
    });
  }

  function handleAction(act) {
    const a = String(act || "");
    if (!a) return false;

    if (a === "learn:flip") { flip(); return true; }
    if (a === "learn:skip") { skip(); return true; }

    if (a === "learn:comp:instant") { flip(); rateComprehension("instant"); return true; }
    if (a === "learn:comp:hint") { flip(); rateComprehension("hint"); return true; }
    if (a === "learn:comp:fail") { flip(); rateComprehension("fail"); return true; }

    if (a === "learn:prod:fluent") { rateProduction("fluent"); return true; }
    if (a === "learn:prod:hesitant") { rateProduction("hesitant"); return true; }
    if (a === "learn:prod:fail") { rateProduction("fail"); return true; }

    return false;
  }

  function bind(root, rerender) {
    if (!root) return () => {};

    const renderSafe = () => { try { rerender?.(); } catch {} };

    function onClick(e) {
      const el = e.target.closest("[data-act]");
      if (!el) return;
      const act = el.dataset.act;
      if (!act) return;
      if (handleAction(act)) renderSafe();
    }

    function onKeyDown(e) {
      const k = String(e.key || "").toLowerCase();

      // Global shortcuts in learn
      if (k === "escape") {
        skip();
        renderSafe();
        e.preventDefault();
        return;
      }

      if (k === " " || k === "spacebar") {
        if (step === "front") {
          flip();
          renderSafe();
          e.preventDefault();
        }
        return;
      }

      // 1/2/3 for ratings depending on step
      if (k === "1" || k === "2" || k === "3") {
        if (step === "comprehension") {
          if (k === "1") rateComprehension("instant");
          if (k === "2") rateComprehension("hint");
          if (k === "3") rateComprehension("fail");
          renderSafe();
          e.preventDefault();
          return;
        }
        if (step === "production") {
          if (k === "1") rateProduction("fluent");
          if (k === "2") rateProduction("hesitant");
          if (k === "3") rateProduction("fail");
          renderSafe();
          e.preventDefault();
          return;
        }
      }
    }

    root.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      root.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }

  function getModel() {
    const card = currentCard();
    return {
      card,
      flipped,
      step,
      index: session.length ? idx + 1 : 0,
      total: session.length,
      compChoice
    };
  }

  return {
    startSession,
    getModel,
    bind,
    handleAction
  };
}

/* ---------- Compatibility Aliases ---------- */
export { createLearnController as createLearnController2 };
export default createLearnController;

/* ---------- Helpers ---------- */
function toDayKey(d) {
  const dt = d instanceof Date ? d : new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const da = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
}

function isYesterdayKey(lastKey, todayKey) {
  if (!lastKey || !todayKey) return false;

  const [y1, m1, d1] = String(lastKey).split("-").map(Number);
  const [y2, m2, d2] = String(todayKey).split("-").map(Number);
  if (!Number.isFinite(y1) || !Number.isFinite(m1) || !Number.isFinite(d1)) return false;
  if (!Number.isFinite(y2) || !Number.isFinite(m2) || !Number.isFinite(d2)) return false;

  const last = new Date(y1, m1 - 1, d1);
  const today = new Date(y2, m2 - 1, d2);
  const y = new Date(today);
  y.setDate(today.getDate() - 1);

  return (
    last.getFullYear() === y.getFullYear() &&
    last.getMonth() === y.getMonth() &&
    last.getDate() === y.getDate()
  );
}