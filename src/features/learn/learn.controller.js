// src/features/learn/learn.controller.js
import * as SRS from "./srs.engine.js";

export function createLearnController({ store, ui }) {
  let session = [];
  let index = 0;

  // UI state for the current card
  let flipped = false;
  let compChoice = null; // "instant" | "hint" | "fail"
  let prodChoice = null; // "fluent" | "hesitant" | "fail"

  function startSession(cards) {
    session = Array.isArray(cards) ? cards : [];
    index = 0;
    resetCardState();
  }

  function resetCardState() {
    flipped = false;
    compChoice = null;
    prodChoice = null;
  }

  function currentCard() {
    return session[index] || null;
  }

  function hasNext() {
    return index < session.length - 1;
  }

  function next() {
    if (hasNext()) {
      index++;
      resetCardState();
    } else {
      ui?.toast?.("Session fertig ✅");
    }
  }

  // ---------- ratings mapping ----------
  function mapComprehension(choice) {
    // "instant/hint/fail" -> SM2-ish rating set
    if (choice === "instant") return "easy";
    if (choice === "hint") return "ok";
    return "fail";
  }

  function mapProduction(choice) {
    // "fluent/hesitant/fail"
    if (choice === "fluent") return "easy";
    if (choice === "hesitant") return "hard";
    return "fail";
  }

  function scheduleBoth(cardId, comp, prod) {
    try {
      SRS.schedule?.("comprehension", cardId, comp);
      SRS.schedule?.("production", cardId, prod);
    } catch (e) {
      console.error("SRS schedule error", e);
      ui?.toast?.("SRS Fehler (Console prüfen)");
    }
  }

  function awardProgress({ comp, prod }) {
    // minimal: XP + daily counters (best effort, no hard dependency)
    try {
      store?.setState?.((s) => {
        const missions = s.missions || {};
        const dp = { ...(missions.dailyProgress || {}) };
        const key = dayKey(new Date());
        const entry = dp[key] || { reviews: 0, newInput: 0, speaking: 0, story: 0, xpEarned: 0 };

        const xp =
          (comp === "easy" ? 3 : comp === "ok" ? 2 : comp === "hard" ? 1 : 0) +
          (prod === "easy" ? 4 : prod === "ok" ? 3 : prod === "hard" ? 2 : 0);

        entry.reviews += 1;
        entry.xpEarned += xp;

        // streak bookkeeping (very simple)
        const last = missions.lastActiveDay;
        const today = key;
        let streak = Number(missions.streak || 0);
        if (!last) streak = 1;
        else if (last !== today && isYesterday(last, today)) streak = streak + 1;
        else if (last !== today) streak = 1;

        return {
          ...s,
          missions: {
            ...missions,
            xp: Math.max(0, Number(missions.xp || 0)) + xp,
            streak,
            lastActiveDay: today,
            dailyProgress: { ...dp, [key]: entry }
          }
        };
      });
    } catch (e) {
      // ignore
    }
  }

  // ---------- actions ----------
  function flip() {
    flipped = true;
  }

  function chooseComprehension(choice) {
    compChoice = choice;
    // auto-flip when rating happens
    flipped = true;

    // If comprehension is fail, still ask production (optional),
    // but we keep it as step 2 to enforce speaking habit.
  }

  function chooseProduction(choice) {
    prodChoice = choice;

    const card = currentCard();
    if (!card) return;

    const comp = mapComprehension(compChoice || "fail");
    const prod = mapProduction(prodChoice || "fail");

    scheduleBoth(card.id, comp, prod);
    awardProgress({ comp, prod });

    next();
  }

  function skip() {
    // Skip without scheduling (keeps pressure low)
    next();
  }

  function getModel() {
    const card = currentCard();
    return {
      card,
      flipped,
      step: !card
        ? "empty"
        : !flipped
          ? "front"
          : compChoice == null
            ? "comprehension"
            : "production",
      compChoice,
      prodChoice,
      index: index + 1,
      total: session.length
    };
  }

  function bind(root, rerender) {
    if (!root) return () => {};

    function click(e) {
      const el = e.target.closest("[data-act]");
      if (!el) return;

      const act = el.dataset.act;

      if (act === "learn:flip") {
        flip();
        rerender();
        return;
      }

      if (act === "learn:skip") {
        skip();
        rerender();
        return;
      }

      if (act.startsWith("learn:comp:")) {
        chooseComprehension(act.replace("learn:comp:", ""));
        rerender();
        return;
      }

      if (act.startsWith("learn:prod:")) {
        chooseProduction(act.replace("learn:prod:", ""));
        rerender();
        return;
      }
    }

    // Keyboard: Space flip, 1/2/3 for current step
    function keydown(e) {
      const m = getModel();
      const k = e.key;

      if (k === " " || k === "Enter") {
        if (m.step === "front") {
          flip();
          rerender();
          e.preventDefault();
        }
        return;
      }

      if (k === "Escape") {
        skip();
        rerender();
        e.preventDefault();
        return;
      }

      if (m.step === "comprehension") {
        if (k === "1") { chooseComprehension("instant"); rerender(); e.preventDefault(); }
        if (k === "2") { chooseComprehension("hint"); rerender(); e.preventDefault(); }
        if (k === "3") { chooseComprehension("fail"); rerender(); e.preventDefault(); }
        return;
      }

      if (m.step === "production") {
        if (k === "1") { chooseProduction("fluent"); rerender(); e.preventDefault(); }
        if (k === "2") { chooseProduction("hesitant"); rerender(); e.preventDefault(); }
        if (k === "3") { chooseProduction("fail"); rerender(); e.preventDefault(); }
      }
    }

    root.addEventListener("click", click);
    document.addEventListener("keydown", keydown);

    return () => {
      root.removeEventListener("click", click);
      document.removeEventListener("keydown", keydown);
    };
  }

  return { startSession, getModel, bind };
}

/* ---------- tiny date helpers ---------- */
function dayKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
}
function isYesterday(lastKey, todayKey) {
  const [y1, m1, d1] = lastKey.split("-").map(Number);
  const [y2, m2, d2] = todayKey.split("-").map(Number);
  const a = new Date(y1, m1 - 1, d1);
  const b = new Date(y2, m2 - 1, d2);
  const diff = b - a;
  return diff >= 24 * 60 * 60 * 1000 && diff < 48 * 60 * 60 * 1000;
}