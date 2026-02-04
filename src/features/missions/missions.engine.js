// src/features/missions/missions.engine.js
/* =========================================
   Missions Engine 2.0
   - XP per day
   - Streak logic
   - Daily progress counters
   ========================================= */

export function initMissions(store) {
  if (!store?.getState || !store?.setState) throw new Error("initMissions(store) requires getState/setState");
  return createMissionsAPI(store);
}

function createMissionsAPI(store) {
  function dayKey(d = new Date()) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${da}`;
  }

  function isYesterday(lastKey, todayKey) {
    const [y1, m1, d1] = lastKey.split("-").map(Number);
    const [y2, m2, d2] = todayKey.split("-").map(Number);
    const a = new Date(y1, m1 - 1, d1);
    const b = new Date(y2, m2 - 1, d2);
    const diff = b - a;
    return diff >= 24 * 60 * 60 * 1000 && diff < 48 * 60 * 60 * 1000;
  }

  function ensureDaily(dp, key) {
    if (!dp[key]) dp[key] = { reviews: 0, newInput: 0, speaking: 0, story: 0, xpEarned: 0 };
    return dp[key];
  }

  function markActive(date = new Date()) {
    const today = dayKey(date);
    store.setState((s) => {
      const last = s.missions?.lastActiveDay;
      let streak = Number(s.missions?.streak || 0);

      if (!last) streak = 1;
      else if (isYesterday(last, today)) streak = streak + 1;
      else if (last !== today) streak = 1;

      return {
        ...s,
        missions: { ...s.missions, streak, lastActiveDay: today }
      };
    });
  }

  function addXP(amount, date = new Date()) {
    const a = Math.max(0, Number(amount || 0));
    const key = dayKey(date);

    store.setState((s) => {
      const dp = { ...(s.missions?.dailyProgress || {}) };
      const entry = ensureDaily(dp, key);
      entry.xpEarned += a;

      return {
        ...s,
        missions: {
          ...s.missions,
          xp: Math.max(0, Number(s.missions?.xp || 0)) + a,
          dailyProgress: dp
        }
      };
    });

    markActive(date);
  }

  function addProgress(type, amount = 1, date = new Date()) {
    const t = String(type || "");
    const a = Math.max(0, Number(amount || 0));
    const key = dayKey(date);

    store.setState((s) => {
      const dp = { ...(s.missions?.dailyProgress || {}) };
      const entry = ensureDaily(dp, key);

      if (t === "reviews") entry.reviews += a;
      if (t === "newInput") entry.newInput += a;
      if (t === "speaking") entry.speaking += a;
      if (t === "story") entry.story += a;

      return { ...s, missions: { ...s.missions, dailyProgress: dp } };
    });

    markActive(date);
  }

  function getToday(date = new Date()) {
    const s = store.getState();
    const key = dayKey(date);
    const dp = s.missions?.dailyProgress || {};
    return dp[key] || { reviews: 0, newInput: 0, speaking: 0, story: 0, xpEarned: 0 };
  }

  return { dayKey, markActive, addXP, addProgress, getToday };
}
