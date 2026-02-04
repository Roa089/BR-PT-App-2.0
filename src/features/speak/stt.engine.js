// src/features/speak/stt.engine.js
/* =========================================
   STT Engine 2.0 — SpeechRecognition wrapper
   iOS note: WebKit STT may be limited/unstable
   ========================================= */

let _rec = null;

export function isSttSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
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

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return { ok: false, reason: "SpeechRecognition nicht verfügbar (iOS/Safari Einschränkung möglich)." };

  const rec = new SR();
  rec.lang = lang;
  rec.continuous = !!continuous;
  rec.interimResults = !!interimResults;

  let finalText = "";

  rec.onresult = (e) => {
    let interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const t = e.results[i][0].transcript;
      if (e.results[i].isFinal) finalText += t + " ";
      else interim += t;
    }
    const partial = (finalText + interim).trim();
    onPartial?.(partial);

    // In some implementations, final arrives gradually
    if (finalText.trim()) onFinal?.(finalText.trim());
  };

  rec.onerror = (e) => {
    onError?.(e);
  };

  rec.onend = () => {
    _rec = null;
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
    try { _rec.stop(); } catch {}
    _rec = null;
  }
}
