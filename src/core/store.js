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
      timeBudgetMin: 20,
      showTranslationByDefault: false,
      hardMode: false
    },

    progress: {
      comprehensionSrs: {},
      productionSrs: {}
    },

    missions: {
      xp: 0,
      streak: 0,
      lastActiveDay: null,
      dailyProgress: {}
    },

    content: {
      enabledPacks: {},
      importedCards: []
    },

    ui: {
      route: "daily",
      modals: {
        open: false,
        type: null,
        payload: null
      }
    }
  };
}

/* ---------- Migrations ---------- */
function migrations() {
  return {
    1: (s) => deepMerge(defaultState(), s)
  };
}

function migrateIfNeeded(raw) {
  if (!raw || typeof raw !== "object") return defaultState();

  const from = Number(raw.schemaVersion || 0);
  if (!from) return defaultState();

  let s = raw;
  if (from !== SCHEMA_VERSION) {
    const ms = migrations();
    for (let v = from + 1; v <= SCHEMA_VERSION; v++) {
      const m = ms[v];
      if (typeof m === "function") s = m(s);
    }
  }
  s.schemaVersion = SCHEMA_VERSION;
  return deepMerge(defaultState(), s);
}

/* ---------- Persistence ---------- */
function load() {
  try {
    const txt = localStorage.getItem(STORAGE_KEY);
    if (!txt) return defaultState();
    return migrateIfNeeded(JSON.parse(txt));
  } catch {
    return defaultState();
  }
}

function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

/* ---------- Store Core ---------- */
let _state = load();
let _subs = new Set();

export function getState() {
  return _state;
}

export function setState(updater) {
  const prev = _state;
  const next =
    typeof updater === "function"
      ? updater(prev)
      : deepMerge(prev, updater || {});

  _state = normalizeState(next);
  save(_state);

  [..._subs].forEach((fn) => {
    try { fn(_state, prev); } catch {}
  });

  return _state;
}

export function subscribe(fn) {
  if (typeof fn !== "function") return () => {};
  _subs.add(fn);
  return () => _subs.delete(fn);
}

export function resetStore() {
  _state = defaultState();
  save(_state);
  [..._subs].forEach((fn) => {
    try { fn(_state, null); } catch {}
  });
  return _state;
}

/* ---------- Normalizers ---------- */
function normalizeState(s) {
  const out = deepMerge(defaultState(), s || {});
  out.schemaVersion = SCHEMA_VERSION;

  out.userPrefs.timeBudgetMin = clampToSet(
    Number(out.userPrefs.timeBudgetMin || 20),
    [10, 20, 30, 45],
    20
  );
  out.userPrefs.showTranslationByDefault = !!out.userPrefs.showTranslationByDefault;
  out.userPrefs.hardMode = !!out.userPrefs.hardMode;

  out.progress.comprehensionSrs ||= {};
  out.progress.productionSrs ||= {};
  out.content.enabledPacks ||= {};
  out.content.importedCards = Array.isArray(out.content.importedCards) ? out.content.importedCards : [];

  out.ui.route = String(out.ui.route || "daily");
  out.ui.modals ||= { open: false, type: null, payload: null };

  out.missions.xp = Math.max(0, Number(out.missions.xp || 0));
  out.missions.streak = Math.max(0, Number(out.missions.streak || 0));
  out.missions.lastActiveDay ||= null;
  out.missions.dailyProgress ||= {};

  return out;
}

/* ---------- Actions ---------- */
export const actions = {
  setRoute(route) {
    return setState((s) => ({ ...s, ui: { ...s.ui, route: String(route || "daily") } }));
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

  setTimeBudgetMin(min) {
    return setState((s) => ({
      ...s,
      userPrefs: {
        ...s.userPrefs,
        timeBudgetMin: clampToSet(Number(min), [10, 20, 30, 45], 20)
      }
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
    return actions.setPackEnabled(key, !_state.content.enabledPacks[key]);
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

  addXP(amount, date = new Date()) {
    const a = Math.max(0, Number(amount || 0));
    const dayKey = toDayKey(date);

    return setState((s) => {
      const dp = { ...(s.missions.dailyProgress || {}) };
      const entry = dp[dayKey] || { reviews: 0, newInput: 0, speaking: 0, story: 0, xpEarned: 0 };
      entry.xpEarned += a;
      dp[dayKey] = entry;

      return {
        ...s,
        missions: {
          ...s.missions,
          xp: s.missions.xp + a,
          dailyProgress: dp
        }
      };
    });
  },

  markActive(date = new Date()) {
    const today = toDayKey(date);
    return setState((s) => {
      const last = s.missions.lastActiveDay;
      let streak = s.missions.streak || 0;

      if (!last) streak = 1;
      else if (isYesterdayKey(last, today)) streak += 1;
      else if (last !== today) streak = 1;

      return { ...s, missions: { ...s.missions, streak, lastActiveDay: today } };
    });
  },

  addDailyProgress(type, amount = 1, date = new Date()) {
    const a = Math.max(0, Number(amount || 0));
    const dayKey = toDayKey(date);

    return setState((s) => {
      const dp = { ...(s.missions.dailyProgress || {}) };
      const entry = dp[dayKey] || { reviews: 0, newInput: 0, speaking: 0, story: 0, xpEarned: 0 };

      if (type in entry) entry[type] += a;

      dp[dayKey] = entry;
      return { ...s, missions: { ...s.missions, dailyProgress: dp } };
    });
  },

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
  dailyProgress: (s = _state, dayKey = toDayKey(new Date())) =>
    (s.missions.dailyProgress || {})[dayKey] || null,
  comprehensionProgress: (s = _state) => s.progress.comprehensionSrs || {},
  productionProgress: (s = _state) => s.progress.productionSrs || {}
};

/* ---------- Helpers ---------- */
function deepMerge(a, b) {
  const base = a && typeof a === "object" ? a : {};
  if (!b || typeof b !== "object") return { ...base };
  const out = Array.isArray(base) ? [...base] : { ...base };

  for (const k of Object.keys(b)) {
    const bv = b[k];
    const av = out[k];
    if (Array.isArray(bv)) out[k] = [...bv];
    else if (bv && typeof bv === "object")
      out[k] = deepMerge(av && typeof av === "object" && !Array.isArray(av) ? av : {}, bv);
    else out[k] = bv;
  }
  return out;
}

function clampToSet(n, allowed, fallback) {
  if (!Number.isFinite(n)) return fallback;
  return allowed.reduce((best, v) =>
    Math.abs(v - n) < Math.abs(best - n) ? v : best, allowed[0]
  );
}

function toDayKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function isYesterdayKey(lastKey, todayKey) {
  const [y1, m1, d1] = lastKey.split("-").map(Number);
  const [y2, m2, d2] = todayKey.split("-").map(Number);
  const last = new Date(y1, m1 - 1, d1);
  const today = new Date(y2, m2 - 1, d2);
  const y = new Date(today);
  y.setDate(today.getDate() - 1);
  return last.getFullYear() === y.getFullYear() &&
         last.getMonth() === y.getMonth() &&
         last.getDate() === y.getDate();
}

function dedupeImported(list) {
  const seen = new Set();
  const out = [];
  for (const c of list) {
    const pt = normalizeText(c?.pt || "");
    if (!pt || seen.has(pt)) continue;
    seen.add(pt);
    out.push(c);
  }
  return out;
}

function normalizeText(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\w ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
