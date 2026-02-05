// src/features/speak/stt.engine.js
/* =========================================
   STT Engine 2.0 — SpeechRecognition wrapper
   iOS note: WebKit STT may be limited/unstable
   ========================================= */

let _rec = null;

export function isSttSupported() {
  try {
    return typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  } catch {
    return false;
  }
}

export function startListening({
  lang = "pt-BR",
  onPartial,
  onFinal,
  onError,
  continuous = false,
  interimResults = true
} = {}) {
  stopListening();

  const SR = (() => {
    try { return window.SpeechRecognition || window.webkitSpeechRecognition; } catch { return null; }
  })();

  if (!SR) {
    return { ok: false, reason: "SpeechRecognition nicht verfügbar (iOS/Safari Einschränkung möglich)." };
  }

  const rec = new SR();
  rec.lang = String(lang || "pt-BR");
  rec.continuous = !!continuous;
  rec.interimResults = !!interimResults;

  // Some engines require this for better results (harmless if ignored)
  try { rec.maxAlternatives = 1; } catch {}

  let finalText = "";

  rec.onresult = (e) => {
    try {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        const t = String(res?.[0]?.transcript || "");
        if (res?.isFinal) finalText += (t ? t + " " : "");
        else interim += t;
      }

      const partial = (finalText + interim).trim();
      if (typeof onPartial === "function") onPartial(partial);

      const ft = finalText.trim();
      if (ft && typeof onFinal === "function") onFinal(ft);
    } catch (err) {
      if (typeof onError === "function") onError(err);
    }
  };

  rec.onerror = (e) => {
    try { if (typeof onError === "function") onError(e); } catch {}
  };

  rec.onend = () => {
    // only clear if this is the active instance
    if (_rec === rec) _rec = null;
  };

  try {
    rec.start();
  } catch (e) {
    _rec = null;
    return { ok: false, reason: "STT konnte nicht gestartet werden (Permission/State)." };
  }

  _rec = rec;
  return { ok: true };
}

export function stopListening() {
  if (_rec) {
    try { _rec.onresult = null; _rec.onerror = null; _rec.onend = null; } catch {}
    try { _rec.stop(); } catch {}
    try { _rec.abort?.(); } catch {}
    _rec = null;
  }
}