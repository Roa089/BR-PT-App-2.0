// src/features/daily/daily.engine.js
/* =========================================
   Daily Flow Engine 2.0
   Builds daily plan based on timeBudgetMin
   Prioritizes weak production topics
   ========================================= */

import { getCardsLazy } from "../content/generator.js";
import { getDue, getNew } from "../learn/srs.engine.js";

/**
 * buildDailyPlan(state, options)
 * options: { timeBudgetMin }
 * returns { reviews:[], newInput:[], speaking:[] }
 */
export function buildDailyPlan(state, options = {}) {
  const timeBudget = Number(options.timeBudgetMin || state.userPrefs?.timeBudgetMin || 20);

  const limits = limitsFromTime(timeBudget);

  const allCards = getCardsLazy(8000);

  // weakness by topic (production)
  const weakTopics = getWeakProductionTopics(state, allCards);

  const filters = weakTopics.length
    ? { topics: weakTopics }
    : {};

  const reviews = getDue("comprehension", allCards, filters).slice(0, limits.reviews);
  const newInput = getNew(allCards, filters, limits.newInput);

  const speaking = buildSpeakingQueue(state, allCards, weakTopics, limits.speaking);

  return { reviews, newInput, speaking };
}

/* ---------- Helpers ---------- */

function limitsFromTime(min) {
  if (min <= 10) return { reviews: 10, newInput: 20, speaking: 5 };
  if (min <= 20) return { reviews: 20, newInput: 40, speaking: 10 };
  if (min <= 30) return { reviews: 30, newInput: 60, speaking: 15 };
  return { reviews: 40, newInput: 80, speaking: 20 };
}

function getWeakProductionTopics(state, cards) {
  const prod = state.progress?.productionSrs || {};
  const topicStats = {};

  for (const c of cards) {
    const p = prod[c.id];
    if (!p) continue;

    if (!topicStats[c.topic]) {
      topicStats[c.topic] = { reps: 0, lapses: 0 };
    }
    topicStats[c.topic].reps += p.reps || 0;
    topicStats[c.topic].lapses += p.lapses || 0;
  }

  const scored = Object.entries(topicStats).map(([topic, v]) => {
    const ratio = v.reps > 0 ? v.lapses / v.reps : 1;
    return { topic, weakness: ratio };
  });

  scored.sort((a, b) => b.weakness - a.weakness);

  return scored.slice(0, 3).map(x => x.topic);
}

function buildSpeakingQueue(state, cards, weakTopics, limit) {
  const prod = state.progress?.productionSrs || {};
  let pool = cards.filter(c => c.skill === "dialog" || c.skill === "statement");

  if (weakTopics && weakTopics.length) {
    pool = pool.filter(c => weakTopics.includes(c.topic));
  }

  pool.sort((a, b) => {
    const pa = prod[a.id];
    const pb = prod[b.id];
    const wa = pa ? (pa.lapses || 0) - (pa.reps || 0) : 0;
    const wb = pb ? (pb.lapses || 0) - (pb.reps || 0) : 0;
    return wb - wa;
  });

  return pool.slice(0, limit).map(c => ({
    id: c.id,
    pt: c.pt,
    topic: c.topic,
    mode: "shadowing",
    prompt: buildRoleplayPrompt(c)
  }));
}

function buildRoleplayPrompt(card) {
  return `Responda naturalmente: "${card.pt}"`;
}
