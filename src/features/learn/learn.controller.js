// src/features/learn/learn.controller.js
/* =========================================
   Learn Controller 2.0
   - Session handling
   - Flip handling
   - 2-step ratings -> map to 2-track SRS
   - Keyboard-friendly bindings
   ========================================= */

import { actions as storeActions, selectors as storeSelectors } from "../../core/store.js";
import { toast as uiToast } from "../shared/ui.bridge.js"; // optional bridge (falls nicht vorhanden, wird unten gefallbackt)
import { schedule as srsSchedule } from "./srs.engine.js";

/**
 * createLearnController({ store, ui, tts })
 * store: { getState, setState, subscribe } (from store.js)
 * ui: { toast } optional (from core/ui.js)
 * tts: function(text) optional
 */
export function createLearnController({ store, ui, tts } = {}) {
  const _ui = ui || window.UI || {};
  const _toast = _ui.toast || ((m) => console.log(m));
  const _tts = tts || defaultTTS;

  let session = [];
  let index = 0;
  let flipped = false;
  let phase = "comprehension"; // then "production"
  let lastToast = "";

  function startSession(cards) {
    session = Array.isArray(cards) ? cards : [];
    index = 0;
    flipped = false;
    phase = "comprehension";
    lastToast = "";
  }

  function getCard() {
    return session[index] || null;
  }

  function nextCard() {
    if (!session.length) return;
    index = Math.min(session.length - 1, index + 1);
    flipped = false;
    phase = "comprehension";
  }

  function flip() { flipped = true; }
  function unflip() { flipped = false; }

  function handleAction(act, payload) {
    const s = store?.getState?.() || {};
    const prefs = storeSelectors.prefs(s);
    const card = getCard();

    if (act === "learn:start") {
      // Controller does not own card sourcing here; call from parent with cards.
      _toast("Starte Session über Daily Flow (oder später Explorer).");
      return;
    }

    if (!card) return;

    if (act === "learn:flip") { flip(); return; }
    if (act === "learn:unflip") { unflip(); return; }

    if (act === "learn:tts") {
      _tts(card.pt);
      return;
    }

    // Ratings
    if (act.startsWith("rate:c:")) {
      // HardMode: require flipped at least once if translations default off
      if (prefs.hardMode && !prefs.showTranslationByDefault && !flipped) {
        lastToast = "Hard Mode: erst flippen, dann bewerten.";
        _toast(lastToast);
        return;
      }

      const r = act.split(":")[2]; // instant/hint/fail
      const mapped = mapComprehensionRating(r);

      // schedule comprehension track
      srsSchedule("comprehension", card.id, mapped);

      // XP + progress
      storeActions.markActive();
      storeActions.addDailyProgress("reviews", 1);
      storeActions.addXP(xpFor(mapped));

      // move to production phase
      phase = "production";
      lastToast = "Jetzt: Satz einmal selbst sagen (Output) und bewerten.";
      _toast(lastToast);
      return;
    }

    if (act.startsWith("rate:p:")) {
      const r = act.split(":")[2]; // fluent/hesitant/fail
      const mapped = mapProductionRating(r);

      srsSchedule("production", card.id, mapped);

      storeActions.markActive();
      storeActions.addDailyProgress("speaking", 1);
      storeActions.addXP(xpFor(mapped) + 1);

      // next card
      lastToast = "Weiter ➜";
      _toast("Gespeichert ✅");
      nextCard();
      return;
    }
  }

  function bind(root, rerender) {
    if (!root) return () => {};

    function onClick(e) {
      const btn = e.target.closest("[data-act]");
      if (!btn) return;

      e.preventDefault();
      e.stopPropagation();

      const act = btn.dataset.act;
      handleAction(act);
      rerender?.();
    }

    // Flip card via click (not on buttons)
    function onFlipClick(e) {
      const cardEl = e.currentTarget;
      const tag = (e.target?.tagName || "").toLowerCase();
      if (tag === "button" || tag === "input" || tag === "select" || tag === "textarea") return;
      flipped = !flipped;
      rerender?.();
    }

    // Keyboard shortcuts:
    // Space/K = flip, J = TTS, 1/2/3 rate depending on phase, N = next
    function onKeyDown(e) {
      const key = e.key.toLowerCase();

      if (key === " " || key === "k") {
        flipped = !flipped;
        rerender?.();
        e.preventDefault();
        return;
      }

      if (key === "j") {
        const c = getCard();
        if (c) _tts(c.pt);
        e.preventDefault();
        return;
      }

      if (key === "n") {
        nextCard();
        rerender?.();
        e.preventDefault();
        return;
      }

      if (key === "1" || key === "2" || key === "3") {
        if (phase === "comprehension") {
          handleAction(key === "1" ? "rate:c:instant" : key === "2" ? "rate:c:hint" : "rate:c:fail");
        } else {
          handleAction(key === "1" ? "rate:p:fluent" : key === "2" ? "rate:p:hesitant" : "rate:p:fail");
        }
        rerender?.();
        e.preventDefault();
        return;
      }
    }

    root.addEventListener("click", onClick);

    // Bind flip element if present
    const flipEl = root.querySelector("#learnFlip");
    flipEl?.addEventListener("click", onFlipClick);
    flipEl?.addEventListener("keydown", onKeyDown);

    // Also listen on document for quick shortcuts when learn is open
    document.addEventListener("keydown", onKeyDown);

    return () => {
      root.removeEventListener("click", onClick);
      flipEl?.removeEventListener("click", onFlipClick);
      flipEl?.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }

  function getModel() {
    const s = store?.getState?.() || {};
    const prefs = storeSelectors.prefs(s);

    return {
      card: getCard(),
      index,
      total: session.length,
      flipped,
      showTranslationByDefault: !!prefs.showTranslationByDefault,
      hardMode: !!prefs.hardMode,
      phase,
      lastToast
    };
  }

  return {
    startSession,
    bind,
    getModel,
    handleAction
  };
}

/* ---------- Rating Maps ---------- */
function mapComprehensionRating(x) {
  // Verstehen: instant/hint/fail -> easy/ok/fail
  if (x === "instant") return "easy";
  if (x === "hint") return "ok";
  return "fail";
}

function mapProductionRating(x) {
  // Produzieren: fluent/hesitant/fail -> easy/hard/fail
  if (x === "fluent") return "easy";
  if (x === "hesitant") return "hard";
  return "fail";
}

function xpFor(rating) {
  if (rating === "easy") return 4;
  if (rating === "ok") return 3;
  if (rating === "hard") return 2;
  return 1;
}

/* ---------- Default TTS ---------- */
function defaultTTS(text) {
  try {
    const u = new SpeechSynthesisUtterance(String(text || ""));
    u.lang = "pt-BR";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {}
}

/* ---------- Optional tiny UI bridge fallback ---------- */
// If you don't create ../shared/ui.bridge.js yet, ignore this import by creating that file later.
// For now, we also use window.UI directly via _ui.
