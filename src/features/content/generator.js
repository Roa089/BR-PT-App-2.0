// src/features/content/generator.js
/* =========================================
   Generator 2.0 — Lazy Card Generation
   ========================================= */

import { getAllBanksAndTemplates } from "./content.registry.js";
import { qualityCheck, normalize } from "./quality.js";

let _cache = [];
let _seen = new Set();

export function resetGenerator() {
  _cache = [];
  _seen.clear();
}

export function generateBatch(batchSize = 200) {
  const { templates } = getAllBanksAndTemplates();
  const out = [];
  let attempts = 0;
  const MAX = batchSize * 50;

  while (out.length < batchSize && attempts < MAX) {
    attempts++;
    const t = pick(templates);
    if (!t || typeof t.pt !== "function") continue;

    const card = {
      id: crypto.randomUUID(),
      topic: t.topic || "general",
      cefr: t.cefr || "A1",
      skill: t.skill || "statement",
      pt: t.pt(),
      deHint: t.deHint || "",
      forms: t.forms || [],
      tags: t.tags || []
    };

    if (!qualityCheck(card, _seen)) continue;

    const norm = normalize(card.pt);
    _seen.add(norm);
    out.push(card);
  }

  _cache = _cache.concat(out);
  return out;
}

export function getCardsLazy(target = 6000) {
  if (_cache.length >= target) return _cache.slice(0, target);

  while (_cache.length < target) {
    generateBatch(300);
  }
  return _cache.slice(0, target);
}

/* ---------- Utils ---------- */
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
