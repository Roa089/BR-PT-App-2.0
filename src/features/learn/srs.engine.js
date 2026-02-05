// src/features/learn/srs.engine.js
/* =========================================
   SRS Engine 2.0 — Two Tracks (SM2-ish)
   Tracks: "comprehension" | "production"
   Ratings: "fail" | "hard" | "ok" | "easy"
   ========================================= */

let _store = null;
let _getState = null;
let _setState = null;

/**
 * init(progressStore)
 * progressStore must expose:
 *  - getState(): returns global state
 *  - setState(fnOrObj): updates global state
 */
export function init(progressStore) {
  _store = progressStore || null;
  _getState = progressStore?.getState || null;
  _setState = progressStore?.setState || null;
}

/* ---------- Public API ---------- */

export function schedule(track, cardId, rating) {
  assertInit();
  const trKey = trackKey(track);
  const id = String(cardId || "").trim();
  const r = normalizeRating(rating);
  if (!id) return null;

  const now = Date.now();
  const s = safeState();
  const prog = s.progress?.[trKey] || {};
  const prev = prog[id] || defaultItem();

  const next = computeNext(prev, r, now);

  _setState((st) => ({
    ...st,
    progress: {
      ...st.progress,
      [trKey]: {
        ...(st.progress?.[trKey] || {}),
        [id]: next
      }
    }
  }));

  return next;
}

export function getDue(track, cards, filters = {}) {
  assertInit();
  const trKey = trackKey(track);
  const s = safeState();
  const prog = s.progress?.[trKey] || {};
  const now = Date.now();

  const list = applyFilters(cards || [], filters);

  return list
    .filter((c) => {
      const id = c?.id;
      if (!id) return false;
      const p = prog[id];
      return p && (p.reps || 0) > 0 && (p.due || 0) <= now;
    })
    .sort((a, b) => (prog[a.id].due || 0) - (prog[b.id].due || 0));
}

export function getNew(cards, filters = {}, limit = 50) {
  assertInit();
  const s = safeState();
  const seen = s.progress?.comprehensionSrs || {};

  const list = applyFilters(cards || [], filters);
  const out = [];
  const lim = Math.max(0, Math.floor(Number(limit) || 0));

  for (const c of list) {
    if (out.length >= lim) break;
    const id = c?.id;
    if (!id) continue;
    const p = seen[id];
    if (!p || (p.reps || 0) === 0) out.push(c);
  }
  return out;
}

export function getMixedSession(cards, filters = {}, limits = { due: 30, new: 20 }) {
  const dueCount = Math.max(0, Math.floor(Number(limits?.due ?? 30)));
  const newCount = Math.max(0, Math.floor(Number(limits?.new ?? 20)));

  const due = getDue("comprehension", cards, filters).slice(0, dueCount);
  const neu = getNew(cards, filters, newCount);

  return interleave(due, neu);
}

/* ---------- Internals ---------- */

function defaultItem() {
  return {
    reps: 0,
    lapses: 0,
    ease: 2.4,
    interval: 0,
    due: 0,
    lastRatedAt: 0,
    lastRating: null
  };
}

function computeNext(prev, rating, now) {
  const p = { ...defaultItem(), ...(prev || {}) };

  let ease = clamp(Number(p.ease || 2.4), 1.3, 2.8);
  let reps = Math.max(0, Number(p.reps || 0));
  let lapses = Math.max(0, Number(p.lapses || 0));
  let intervalDays = Math.max(0, Number(p.interval || 0));

  const hardPenalty = 0.15;
  const okBoost = 0.05;
  const easyBoost = 0.15;
  const failPenalty = 0.20;

  if (rating === "fail") {
    lapses += 1;
    reps = Math.max(1, reps); // keep "seen"
    intervalDays = 0;
    ease = clamp(ease - failPenalty, 1.3, 2.8);
    return {
      reps,
      lapses,
      ease,
      interval: intervalDays,
      due: now + 10 * 60 * 1000,
      lastRatedAt: now,
      lastRating: rating
    };
  }

  // success path
  reps += 1;

  if (reps === 1) intervalDays = 0;
  else if (reps === 2) intervalDays = 1;
  else {
    const base = intervalDays <= 0 ? 2 : intervalDays;
    intervalDays = Math.round(base * ease);
  }

  if (rating === "hard") {
    ease = clamp(ease - hardPenalty, 1.3, 2.8);
    intervalDays = Math.max(0, Math.round(intervalDays * 0.6));
  } else if (rating === "ok") {
    ease = clamp(ease + okBoost, 1.3, 2.8);
    intervalDays = Math.max(intervalDays, reps >= 3 ? 2 : intervalDays);
  } else if (rating === "easy") {
    ease = clamp(ease + easyBoost, 1.3, 2.8);
    intervalDays = Math.max(1, Math.round(intervalDays * 1.35));
  }

  let due;
  if (reps === 1) due = todayAtHour(18);
  else if (reps === 2) due = now + 24 * HOUR;
  else due = now + intervalDays * DAY;

  return {
    reps,
    lapses,
    ease,
    interval: intervalDays,
    due,
    lastRatedAt: now,
    lastRating: rating
  };
}

function todayAtHour(hour24) {
  const d = new Date();
  d.setHours(hour24, 0, 0, 0);
  const t = d.getTime();
  return t > Date.now() ? t : Date.now() + 2 * HOUR;
}

function trackKey(track) {
  const t = String(track || "").toLowerCase();
  return t === "production" ? "productionSrs" : "comprehensionSrs";
}

function normalizeRating(r) {
  const x = String(r || "").toLowerCase();
  return x === "fail" || x === "hard" || x === "ok" || x === "easy" ? x : "ok";
}

function applyFilters(cards, filters) {
  let out = Array.isArray(cards) ? cards.filter(Boolean) : [];

  const cefr = asSet(filters?.cefr);
  const topics = asSet(filters?.topics);
  const skills = asSet(filters?.skills);
  const packKeys = asSet(filters?.packs);

  if (cefr) out = out.filter((c) => cefr.has(c?.cefr));
  if (topics) out = out.filter((c) => topics.has(c?.topic));
  if (skills) out = out.filter((c) => skills.has(c?.skill));
  if (packKeys) out = out.filter((c) => !c?.pack || packKeys.has(c.pack));

  return out;
}

function interleave(a, b) {
  const out = [];
  const A = Array.isArray(a) ? [...a] : [];
  const B = Array.isArray(b) ? [...b] : [];
  shuffle(A);
  shuffle(B);

  while (A.length || B.length) {
    if (A.length) out.push(A.shift());
    if (B.length) out.push(B.shift());
  }
  return out;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function asSet(v) {
  if (!v) return null;
  if (v instanceof Set) return v.size ? v : null;
  if (Array.isArray(v)) return v.length ? new Set(v) : null;
  return null;
}

function clamp(n, a, b) {
  if (!Number.isFinite(n)) return a;
  return Math.max(a, Math.min(b, n));
}

function safeState() {
  try {
    return _getState?.() || {};
  } catch {
    return {};
  }
}

function assertInit() {
  if (!_store || !_getState || !_setState) {
    throw new Error("SRS engine not initialized. Call init(store) first.");
  }
}

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;