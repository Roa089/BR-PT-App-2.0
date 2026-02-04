// src/core/audio.js
/* =========================================
   Audio 2.0 — TTS helper (pt-BR) + queue
   - speak(text, {lang, rate, pitch, volume})
   - stop()
   - isSupported()
   ========================================= */

let _current = null;

export function isSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

export function stop() {
  try {
    window.speechSynthesis?.cancel();
  } catch {}
  _current = null;
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
    const u = new SpeechSynthesisUtterance(t);
    u.lang = lang;
    u.rate = clamp(Number(rate), 0.7, 1.3);
    u.pitch = clamp(Number(pitch), 0.7, 1.3);
    u.volume = clamp(Number(volume), 0, 1);

    u.onend = () => {
      _current = null;
      onEnd?.();
    };
    u.onerror = (e) => {
      _current = null;
      onError?.(e);
    };

    _current = u;
    window.speechSynthesis.speak(u);
    return { ok: true };
  } catch (e) {
    _current = null;
    return { ok: false, reason: "tts_error" };
  }
}

export function speakSequence(lines, opts = {}) {
  const arr = Array.isArray(lines) ? lines.map(x => String(x || "").trim()).filter(Boolean) : [];
  if (!arr.length) return { ok: false, reason: "empty" };
  let i = 0;

  const playNext = () => {
    if (i >= arr.length) {
      opts.onDone?.();
      return;
    }
    const line = arr[i++];
    speak(line, {
      ...opts,
      onEnd: playNext
    });
  };

  playNext();
  return { ok: true };
}

function clamp(n, a, b) {
  if (!Number.isFinite(n)) return a;
  return Math.max(a, Math.min(b, n));
}
