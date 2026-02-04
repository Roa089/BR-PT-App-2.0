// src/core/store.js
/* =========================================
   Store 2.0 — State + Persist + Migrations
   Vanilla JS • localStorage • subscribe
   ========================================= */

const STORAGE_KEY = "ptbr2_store";
const SCHEMA_VERSION = 1;

/* ---------- Default State ---------- */
export function defaultState() {
  return {
    schemaVersion: SCHEMA_VERSION,

    userPrefs: {
      timeBudgetMin: 20,                 // 10/20/30/45 typical
      showTranslationByDefault: false,   // PT front, DE on flip by default
      hardMode: false                   // e.g. require flip before rating / no hints
    },

    progress: {
      // cardId -> { reps, lapses, ease, interval, due, lastRatedAt }
      comprehensionSrs: {},
      productionSrs: {}
    },

    missions: {
      xp: 0,
      streak: 0,
      lastActiveDay: null, // "YYYY-MM-DD"
      dailyProgress: {
        // dayKey -> { reviews, newInput, speaking, story, xpEarned }
      }
    },

    content: {
      enabledPacks: {},   // packKey -> boolean
      importedCards: []   // array of Card objects
    },

    ui: {
      route: "daily",
      modals: {
        open: false,
        type: null,  // "modal" | "sheet"
        payload: null
      }
    }
  };
}

/* ---------- Migrations ---------- */
function migrations() {
  return {
    1: (s) => {
      // v1 baseline: ensure all keys exist
      const d = defaultState();
      return deepMerge(d, s);
    }
  };
}

function migrateIfNeeded(raw) {
  if (!raw || typeof raw !== "object") return defaultState();

  const from = Number(raw.schemaVersion || 0);
  if (!from) return defaultState();

  if (from === SCHEMA_VERSION) {
    // still ensure missing keys
    return deepMerge(defaultState(), raw);
  }

  // Forward migrations (best-effort)
  let s = raw;
  for (let v = from + 1; v <= SCHEMA_VERSION; v++) {
    const m = migrations()[v];
    if (typeof m === "function") s = m(s);
  }
  s.schemaVersion = SCHEMA_VERSION;
  return deepMerge(defaultState(), s);
}

/* ---------- Persistence ---------- */
function load() {
  try {
    const txt = localStorage.getItem(STORAGE_KEY);
    if (!txt) return defaultState();
    const raw = JSON.parse(txt);
    return migrateIfNeeded(raw);
  } catch {
    return defaultState();
  }
}

function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota / private mode issues
  }
}

/* ---------- Store Core ---------- */
let _state = load();
let _subs = new Set();

export function getState() {
  return _state;
}

/**
 * setState(updater)
 * - updater can be: (prev)=>next OR partial object
 */
export function setState(updater) {
  const prev = _state;
  const next =
    typeof updater === "function"
      ? updater(prev)
      : deepMerge(prev, updater || {});

  _state = normalize(next);
  save(_state);

  // notify
  _subs.forEach((fn) => {
    try { fn(_state, prev); } catch {}
  });

  return _state;
}

export function subscribe(fn) {
  _subs.add(fn);
  return () => _subs.delete(fn);
}

export function resetStore() {
  _state = defaultState();
  save(_state);
  _subs.forEach((fn) => {
    try { fn(_state, null); } catch {}
  });
  return _state;
}

/* ---------- Normalizers / Guards ---------- */
function normalize(s) {
  const d = defaultState();
  const out = deepMerge(d, s || {});
  out.schemaVersion = SCHEMA_VERSION;

  // clamp timeBudget
  const tb = Number(out.userPrefs.timeBudgetMin || 20);
  out.userPrefs.timeBudgetMin = clampToSet(tb, [10, 20, 30, 45], 20);

  out.userPrefs.showTranslationByDefault = !!out.userPrefs.showTranslationByDefault;
  out.userPrefs.hardMode = !!out.userPrefs.hardMode;

  // ensure structures
  out.progress.comprehensionSrs = out.progress.comprehensionSrs || {};
  out.progress.productionSrs = out.progress.productionSrs || {};
  out.content.enabledPacks = out.content.enabledPacks || {};
  out.content.importedCards = Array.isArray(out.content.importedCards) ? out.content.importedCards : [];

  out.ui.route = String(out.ui.route || "daily");
  out.ui.modals = out.ui.modals || { open: false, type: null, payload: null };

  // missions
  out.missions.xp = Math.max(0, Number(out.missions.xp || 0));
  out.missions.streak = Math.max(0, Number(out.missions.streak || 0));
  out.missions.lastActiveDay = out.missions.lastActiveDay || null;
  out.missions.dailyProgress = out.missions.dailyProgress || {};

  return out;
}

/* ---------- Actions ---------- */
export const actions = {
  // UI
  setRoute(route) {
    return setState((s) => ({
      ...s,
      ui: { ...s.ui, route: String(route || "daily") }
    }));
  },

  openModal(type, payload) {
    return setState((s) => ({
      ...s,
      ui: { ...s.ui, modals: { open: true, type: type || "modal", payload: payload ?? null } }
    }));
  },

  closeModal() {
    return setState((s) => ({
      ...s,
      ui: { ...s.ui, modals: { open: false, type: null, payload: null } }
    }));
  },

  // Prefs
  setTimeBudgetMin(min) {
    const v = clampToSet(Number(min), [10, 20, 30, 45], 20);
    return setState((s) => ({
      ...s,
      userPrefs: { ...s.userPrefs, timeBudgetMin: v }
    }));
  },

  setShowTranslationByDefault(on) {
    return setState((s) => ({
      ...s,
      userPrefs: { ...s.userPrefs, showTranslationByDefault: !!on }
    }));
  },

  setHardMode(on) {
    return setState((s) => ({
      ...s,
      userPrefs: { ...s.userPrefs, hardMode: !!on }
    }));
  },

  // Content
  setPackEnabled(packKey, enabled) {
    const key = String(packKey || "").trim();
    if (!key) return _state;
    return setState((s) => ({
      ...s,
      content: {
        ...s.content,
        enabledPacks: { ...s.content.enabledPacks, [key]: !!enabled }
      }
    }));
  },

  togglePack(packKey) {
    const key = String(packKey || "").trim();
    if (!key) return _state;
    const cur = !!_state.content.enabledPacks[key];
    return actions.setPackEnabled(key, !cur);
  },

  addImportedCards(cards) {
    const list = Array.isArray(cards) ? cards : [];
    if (!list.length) return _state;
    return setState((s) => ({
      ...s,
      content: {
        ...s.content,
        importedCards: dedupeImported([...(s.content.importedCards || []), ...list])
      }
    }));
  },

  clearImportedCards() {
    return setState((s) => ({
      ...s,
      content: { ...s.content, importedCards: [] }
    }));
  },

  // Missions / XP
  addXP(amount, date = new Date()) {
    const a = Math.max(0, Number(amount || 0));
    const dayKey = toDayKey(date);
    return setState((s) => {
      const dp = { ...(s.missions.dailyProgress || {}) };
      const entry = dp[dayKey] || { reviews: 0, newInput: 0, speaking: 0, story: 0, xpEarned: 0 };
      entry.xpEarned = (entry.xpEarned || 0) + a;
      dp[dayKey] = entry;

      return {
        ...s,
        missions: {
          ...s.missions,
          xp: (s.missions.xp || 0) + a,
          dailyProgress: dp
        }
      };
    });
  },

  markActive(date = new Date()) {
    const today = toDayKey(date);
    return setState((s) => {
      const last = s.missions.lastActiveDay;
      let streak = Number(s.missions.streak || 0);

      if (!last) streak = 1;
      else if (isYesterday(last, today)) streak = streak + 1;
      else if (last !== today) streak = 1;

      return {
        ...s,
        missions: { ...s.missions, streak, lastActiveDay: today }
      };
    });
  },

  addDailyProgress(type, amount = 1, date = new Date()) {
    const t = String(type || "");
    const a = Math.max(0, Number(amount || 0));
    const dayKey = toDayKey(date);

    return setState((s) => {
      const dp = { ...(s.missions.dailyProgress || {}) };
      const entry = dp[dayKey] || { reviews: 0, newInput: 0, speaking: 0, story: 0, xpEarned: 0 };

      if (t === "reviews") entry.reviews += a;
      if (t === "newInput") entry.newInput += a;
      if (t === "speaking") entry.speaking += a;
      if (t === "story") entry.story += a;

      dp[dayKey] = entry;
      return { ...s, missions: { ...s.missions, dailyProgress: dp } };
    });
  },

  // Progress setters (SRS engines will manage structures; these are generic helpers)
  setProgress(track, cardId, payload) {
    const tr = track === "production" ? "productionSrs" : "comprehensionSrs";
    const id = String(cardId || "").trim();
    if (!id) return _state;

    return setState((s) => ({
      ...s,
      progress: {
        ...s.progress,
        [tr]: {
          ...s.progress[tr],
          [id]: { ...(s.progress[tr]?.[id] || {}), ...(payload || {}) }
        }
      }
    }));
  }
};

/* ---------- Selectors ---------- */
export const selectors = {
  route: (s = _state) => s.ui.route,
  prefs: (s = _state) => s.userPrefs,
  timeBudgetMin: (s = _state) => s.userPrefs.timeBudgetMin,
  showTranslationByDefault: (s = _state) => !!s.userPrefs.showTranslationByDefault,
  hardMode: (s = _state) => !!s.userPrefs.hardMode,

  enabledPacks: (s = _state) => s.content.enabledPacks || {},
  importedCards: (s = _state) => s.content.importedCards || [],

  xp: (s = _state) => s.missions.xp || 0,
  streak: (s = _state) => s.missions.streak || 0,
  dailyProgress: (s = _state, dayKey = toDayKey(new Date())) => (s.missions.dailyProgress || {})[dayKey] || null,

  comprehensionProgress: (s = _state) => s.progress.comprehensionSrs || {},
  productionProgress: (s = _state) => s.progress.productionSrs || {}
};

/* ---------- Helpers ---------- */
function deepMerge(a, b) {
  if (!b || typeof b !== "object") return { ...a };
  const out = Array.isArray(a) ? [...a] : { ...(a || {}) };

  for (const k of Object.keys(b)) {
    const bv = b[k];
    const av = out[k];

    if (Array.isArray(bv)) out[k] = [...bv];
    else if (bv && typeof bv === "object") out[k] = deepMerge((av && typeof av === "object" && !Array.isArray(av)) ? av : {}, bv);
    else out[k] = bv;
  }
  return out;
}

function clampToSet(n, allowed, fallback) {
  if (!Number.isFinite(n)) return fallback;
  // pick nearest allowed
  let best = allowed[0];
  let bestDist = Math.abs(n - best);
  for (const v of allowed) {
    const d = Math.abs(n - v);
    if (d < bestDist) { best = v; bestDist = d; }
  }
  return best;
}

function toDayKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isYesterday(lastKey, todayKey) {
  const [y1, m1, d1] = lastKey.split("-").map(Number);
  const [y2, m2, d2] = todayKey.split("-").map(Number);
  const a = new Date(y1, m1 - 1, d1);
  const b = new Date(y2, m2 - 1, d2);
  const diff = b - a;
  return diff >= 24 * 60 * 60 * 1000 && diff < 48 * 60 * 60 * 1000;
}

function dedupeImported(list) {
  const seen = new Set();
  const out = [];
  for (const c of list) {
    const pt = normalize(c?.pt || "");
    if (!pt) continue;
    if (seen.has(pt)) continue;
    seen.add(pt);
    out.push(c);
  }
  return out;
}

function normalize(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\w ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
