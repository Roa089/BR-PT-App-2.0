// src/features/stats/stats.engine.js
/* =========================================
   Stats Engine 2.0
   - 3 KPIs
   - Weekly XP bars data
   - Mastery donut (rough)
   ========================================= */

export function buildStats(state = {}, { now = new Date() } = {}) {
  const missions = state.missions || {};
  const progress = state.progress || {};

  const xpTotal = Math.max(0, Number(missions.xp || 0));
  const streak = Math.max(0, Number(missions.streak || 0));

  const todayKey = toDayKey(now);
  const dp = missions.dailyProgress || {};
  const today = dp[todayKey] || { reviews: 0, newInput: 0, speaking: 0, story: 0, xpEarned: 0 };

  const week = last7Days(now).map((k) => {
    const e = dp[k] || { xpEarned: 0 };
    return { dayKey: k, xp: Math.max(0, Number(e.xpEarned || 0)) };
  });

  const mastery = computeMastery(progress, state);

  const kpis = {
    xpTotal,
    streak,
    todayXP: Math.max(0, Number(today.xpEarned || 0))
  };

  return { kpis, week, mastery };
}

function computeMastery(progress = {}, state = {}) {
  const comp = progress.comprehensionSrs || {};
  const prod = progress.productionSrs || {};

  const imported = Math.max(0, Number(state.content?.importedCards?.length || 0));
  const seenIds = new Set([...Object.keys(comp), ...Object.keys(prod)]);
  const deckSize = Math.max(seenIds.size, imported, 1);

  let mastered = 0;
  for (const id of seenIds) {
    const c = comp[id];
    const p = prod[id];
    const okC = (c?.reps || 0) >= 3 && (c?.lapses || 0) <= 2;
    const okP = (p?.reps || 0) >= 2 && (p?.lapses || 0) <= 2;
    if (okC && okP) mastered++;
  }

  const ratio = clamp(mastered / deckSize, 0, 1);
  return { ratio, mastered, deckSize };
}

function toDayKey(d) {
  const dt = d instanceof Date ? d : new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const da = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
}

function last7Days(now) {
  const out = [];
  const base = now instanceof Date ? now : new Date(now);
  for (let i = 6; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    out.push(toDayKey(d));
  }
  return out;
}

function clamp(n, a, b) {
  if (!Number.isFinite(n)) return a;
  return Math.max(a, Math.min(b, n));
}