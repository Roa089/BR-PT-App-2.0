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
  _seen = new Set();
}

export function generateBatch(batchSize = 200) {
  const { templates } = getAllBanksAndTemplates();
  const out = [];

  const size = Math.max(0, Number(batchSize) || 0);
  if (!size) return out;
  if (!Array.isArray(templates) || templates.length === 0) return out;

  let attempts = 0;
  const MAX = size * 50;

  while (out.length < size && attempts < MAX) {
    attempts++;

    const t = pick(templates);
    if (!t || typeof t.pt !== "function") continue;

    const ptRaw = safeCall(t.pt);
    const pt = String(ptRaw || "").trim();
    if (!pt) continue;

    const card = {
      id: makeId(),
      topic: String(t.topic || "general"),
      cefr: String(t.cefr || "A1"),
      skill: String(t.skill || "statement"),
      pt,
      deHint: String(t.deHint || ""),
      forms: Array.isArray(t.forms) ? t.forms : [],
      tags: Array.isArray(t.tags) ? t.tags : []
    };

    if (!qualityCheck(card, _seen)) continue;

    const norm = normalize(card.pt);
    if (!norm) continue;
    _seen.add(norm);
    out.push(card);
  }

  if (out.length) _cache.push(...out);
  return out;
}

export function getCardsLazy(target = 6000) {
  const t = Math.max(0, Math.floor(Number(target) || 0));
  if (!t) return [];

  if (_cache.length >= t) return _cache.slice(0, t);

  // harte Grenze gegen Endlosschleifen / fehlende Templates
  const MAX_TOTAL = Math.min(Math.max(t, 1), 12000);
  const MAX_ROUNDS = 200;
  let rounds = 0;

  while (_cache.length < t && _cache.length < MAX_TOTAL && rounds < MAX_ROUNDS) {
    rounds++;
    const before = _cache.length;
    generateBatch(300);
    // Wenn nichts mehr rauskommt, abbrechen
    if (_cache.length === before) break;
  }

  return _cache.slice(0, Math.min(t, _cache.length));
}

/* ---------- Utils ---------- */
function pick(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return arr[(Math.random() * arr.length) | 0];
}

function safeCall(fn) {
  try { return fn(); } catch { return ""; }
}

function makeId() {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {}
  return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}