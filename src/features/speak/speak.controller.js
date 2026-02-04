// src/features/speak/speak.controller.js
/* =========================================
   Speak Controller 2.0
   - Shadowing queue (cards)
   - TTS playback (pt-BR) with rate
   - STT optional + stop mic
   - Phrase Builder mini-mode
   ========================================= */

import { isSttSupported, startListening, stopListening } from "./stt.engine.js";

export function createSpeakController({ ui } = {}) {
  const _ui = ui || window.UI || {};
  const toast = _ui.toast || ((m) => console.log(m));

  // state
  let mode = "shadowing";
  let queue = [];
  let index = 0;
  let rate = 1.0;

  let listening = false;
  let lastTranscript = "";
  let diffHtml = "";

  // builder
  let builderParts = [];

  function setQueue(cards) {
    queue = Array.isArray(cards) ? cards : [];
    index = 0;
    resetCompare();
  }

  function current() {
    return queue[index] || null;
  }

  function resetCompare() {
    lastTranscript = "";
    diffHtml = "";
    listening = false;
  }

  function play(text) {
    const c = current();
    const t = text || c?.pt;
    if (!t) return;

    try {
      const u = new SpeechSynthesisUtterance(String(t));
      u.lang = "pt-BR";
      u.rate = rate;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {
      toast("TTS nicht verfügbar.");
    }
  }

  function next() {
    if (!queue.length) return;
    index = Math.min(queue.length - 1, index + 1);
    resetCompare();
  }

  function prev() {
    if (!queue.length) return;
    index = Math.max(0, index - 1);
    resetCompare();
  }

  function repeat() {
    play();
  }

  function setRate(v) {
    rate = clamp(Number(v || 1), 0.7, 1.3);
  }

  function startSttCompare() {
    const c = current();
    if (!c) return;

    if (!isSttSupported()) {
      toast("STT nicht verfügbar (iOS/Safari Einschränkung möglich).");
      return;
    }

    listening = true;
    lastTranscript = "";
    diffHtml = "";

    const res = startListening({
      lang: "pt-BR",
      onPartial: (text) => {
        lastTranscript = text;
        diffHtml = buildDiffHtml(c.pt, text);
      },
      onFinal: (text) => {
        lastTranscript = text;
        diffHtml = buildDiffHtml(c.pt, text);
      },
      onError: () => {
        listening = false;
        toast("STT Fehler/Permission. Tip: Safari → Mikro erlauben.");
      }
    });

    if (!res.ok) {
      listening = false;
      toast(res.reason);
    }
  }

  function stopMic() {
    stopListening();
    listening = false;
    toast("Mikrofon aus");
  }

  // Phrase Builder
  function builderAdd(val) {
    const t = String(val || "").trim();
    if (!t) return;
    builderParts.push(t);
  }

  function builderClear() {
    builderParts = [];
  }

  function builderSentence() {
    return builderParts.join(" ").replace(/\s+/g, " ").trim();
  }

  function handleAction(act, payload) {
    if (act === "mode:shadowing") { mode = "shadowing"; return true; }
    if (act === "mode:builder") { mode = "builder"; stopMic(); return true; }

    if (act === "play") { play(); return true; }
    if (act === "repeat") { repeat(); return true; }
    if (act === "next") { next(); return true; }
    if (act === "prev") { prev(); return true; }

    if (act === "rate") { setRate(payload); return true; }

    if (act === "stt:start") { startSttCompare(); return true; }
    if (act === "stt:stop") { stopMic(); return true; }

    if (act === "builder:add") { builderAdd(payload); return true; }
    if (act === "builder:clear") { builderClear(); return true; }
    if (act === "builder:tts") {
      const s = builderSentence();
      if (!s) toast("Erst Bausteine tippen.");
      else play(s);
      return true;
    }

    return false;
  }

  function bind(root, rerender) {
    if (!root) return () => {};

    function onClick(e) {
      const el = e.target.closest("[data-act]");
      if (!el) return;
      const act = el.dataset.act;

      // payloads
      if (act === "rate") {
        const slider = el; // not a button
        handleAction("rate", slider.value);
        rerender?.();
        return;
      }

      if (act === "builder:add") {
        handleAction("builder:add", el.dataset.val);
        rerender?.();
        updateBuilderOut();
        return;
      }

      handleAction(act);
      rerender?.();
      updateBuilderOut();
    }

    function onInput(e) {
      const el = e.target;
      if (el?.id === "rate") {
        handleAction("rate", el.value);
        rerender?.();
      }
    }

    function updateBuilderOut() {
      const out = root.querySelector("#builderOut");
      if (!out) return;
      out.textContent = builderSentence() || "—";
    }

    root.addEventListener("click", onClick);
    root.addEventListener("input", onInput);

    // Keyboard shortcuts in shadowing:
    // J: play, N: next, P: prev, R: repeat, M: stop mic
    function onKeyDown(e) {
      const k = e.key.toLowerCase();
      if (mode !== "shadowing") return;

      if (k === "j") { play(); e.preventDefault(); }
      if (k === "n") { next(); rerender?.(); e.preventDefault(); }
      if (k === "p") { prev(); rerender?.(); e.preventDefault(); }
      if (k === "r") { repeat(); e.preventDefault(); }
      if (k === "m") { stopMic(); rerender?.(); e.preventDefault(); }
    }
    document.addEventListener("keydown", onKeyDown);

    // initial builder output
    updateBuilderOut();

    return () => {
      root.removeEventListener("click", onClick);
      root.removeEventListener("input", onInput);
      document.removeEventListener("keydown", onKeyDown);
    };
  }

  function getModel() {
    const c = current();
    return {
      mode,
      card: c,
      index,
      total: queue.length,
      rate,
      sttSupported: isSttSupported(),
      listening,
      lastTranscript,
      diffHtml
    };
  }

  return {
    setQueue,
    getModel,
    bind,
    handleAction,
    stopMic
  };
}

/* ---------- Diff (word-level) ---------- */
function buildDiffHtml(target, spoken) {
  const t = tokenize(target);
  const s = tokenize(spoken);

  const tSet = new Map();
  for (const w of t) tSet.set(w, (tSet.get(w) || 0) + 1);

  const sSet = new Map();
  for (const w of s) sSet.set(w, (sSet.get(w) || 0) + 1);

  const targetHtml = t.map(w => {
    const ok = (sSet.get(w) || 0) > 0;
    if (ok) sSet.set(w, (sSet.get(w) || 0) - 1);
    return `<span style="color:${ok ? "inherit" : "var(--danger)"}; font-weight:${ok ? "700" : "900"};">${escapeHtml(w)}</span>`;
  }).join(" ");

  // rebuild sSet for extras calc
  const sCount = new Map();
  for (const w of s) sCount.set(w, (sCount.get(w) || 0) + 1);
  for (const w of t) if ((sCount.get(w) || 0) > 0) sCount.set(w, sCount.get(w) - 1);

  const spokenHtml = s.map(w => {
    const extra = (sCount.get(w) || 0) > 0;
    if (extra) sCount.set(w, (sCount.get(w) || 0) - 1);
    return `<span style="color:${extra ? "#60a5fa" : "inherit"}; font-weight:${extra ? "900" : "700"};">${escapeHtml(w)}</span>`;
  }).join(" ");

  return `
    <div class="small muted">Ziel (rot = fehlend):</div>
    <div class="card"><div class="pt">${targetHtml}</div></div>
    <div class="small muted">Du (blau = extra):</div>
    <div class="card"><div class="pt">${spokenHtml}</div></div>
  `;
}

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^\wáéíóúãõçàâêô ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
