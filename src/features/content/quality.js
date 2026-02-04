// src/features/content/quality.js
/* =========================================
   Quality Engine — Filters & Heuristics
   ========================================= */

const BLACKLIST = [
  "isso é bom",
  "isso é legal",
  "é muito bom",
  "é muito legal",
  "ok",
  "tudo"
];

export function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\wáéíóúãõçàâêô ]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function isBlacklisted(pt) {
  const n = normalize(pt);
  return BLACKLIST.some(b => n.includes(b));
}

export function lengthFitsCefr(pt, cefr) {
  const len = pt.split(" ").length;
  if (cefr === "A1") return len >= 2 && len <= 5;
  if (cefr === "A2") return len >= 3 && len <= 8;
  if (cefr === "B1") return len >= 5 && len <= 12;
  if (cefr === "B2") return len >= 7 && len <= 16;
  if (cefr === "C1") return len >= 10 && len <= 22;
  if (cefr === "C2") return len >= 12 && len <= 28;
  return true;
}

export function hasVariance(pt) {
  return /[?!.]/.test(pt) || /(não|nunca|jamais)/i.test(pt) || /(porque|quando|se|então|mas)/i.test(pt);
}

export function qualityCheck(card, seenSet) {
  if (!card || !card.pt) return false;
  const norm = normalize(card.pt);
  if (seenSet.has(norm)) return false;
  if (isBlacklisted(card.pt)) return false;
  if (!lengthFitsCefr(card.pt, card.cefr)) return false;
  if (!hasVariance(card.pt)) return false;
  return true;
}
