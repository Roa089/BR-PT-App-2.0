// src/core/audio.js
/* =========================================
   Audio 2.0 — TTS helper (pt-BR) + queue
   - speak(text, {lang, rate, pitch, volume})
   - stop()
   - isSupported()
   ========================================= */

let _current = null;
let _queueToken = 0;

export function isSupported() {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window
  );
}

export function stop() {
  try {
    window.speechSynthesis?.cancel();
  } catch {}
  _current = null;
  _queueToken++;
}

export function speak(text, opts = {}) {
  const t = String(text || "").trim();
  if (!t) return { ok: false, reason: "empty" };
  if (!isSupported()) return { ok: false, reason: "tts_not_supported" };

  const {
    lang = "pt-BR",
    rate = 1.0,
    pitch = 1.0,
    volume = 1.0,
    onEnd,
    onError
  } = opts;

  try {
    stop();
    const token = ++_queueToken;

    const u = new SpeechSynthesisUtterance(t);
    u.lang = lang;
    u.rate = clamp(Number(rate), 0.7, 1.3);
    u.pitch = clamp(Number(pitch), 0.7, 1.3);
    u.volume = clamp(Number(volume), 0, 1);

    u.onend = () => {
      if (token !== _queueToken) return;
      _current = null;
      onEnd?.();
    };

    u.onerror = (e) => {
      if (token !== _queueToken) return;
      _current = null;
      onError?.(e);
    };

    _current = u;
    window.speechSynthesis.speak(u);
    return { ok: true };
  } catch {
    _current = null;
    return { ok: false, reason: "tts_error" };
  }
}

export function speakSequence(lines, opts = {}) {
  const arr = Array.isArray(lines)
    ? lines.map((x) => String(x || "").trim()).filter(Boolean)
    : [];

  if (!arr.length) return { ok: false, reason: "empty" };

  let i = 0;
  const token = ++_queueToken;

  const playNext = () => {
    if (token !== _queueToken) return;
    if (i >= arr.length) {
      opts.onDone?.();
      return;
    }
    const line = arr[i++];
    speak(line, {
      ...opts,
      onEnd: playNext,
      onError: () => playNext()
    });
  };

  playNext();
  return { ok: true };
}

function clamp(n, a, b) {
  if (!Number.isFinite(n)) return a;
  return Math.max(a, Math.min(b, n));
}
