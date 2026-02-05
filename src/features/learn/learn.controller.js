// src/features/content/quality.js
/* =========================================
   Quality Engine — Filters & Heuristics
   ========================================= */

const BLACKLIST = [
  "isso e bom",
  "isso e legal",
  "e muito bom",
  "e muito legal",
  "ok",
  "tudo"
];

export function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\w ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isBlacklisted(pt) {
  const n = normalize(pt);
  return BLACKLIST.some((b) => n.includes(b));
}

export function lengthFitsCefr(pt, cefr) {
  const len = String(pt || "").trim().split(/\s+/).length;
  switch (cefr) {
    case "A1": return len >= 2 && len <= 5;
    case "A2": return len >= 3 && len <= 8;
    case "B1": return len >= 5 && len <= 12;
    case "B2": return len >= 7 && len <= 16;
    case "C1": return len >= 10 && len <= 22;
    case "C2": return len >= 12 && len <= 28;
    default: return true;
  }
}

export function hasVariance(pt) {
  const s = String(pt || "");
  return (
    /[?!.]/.test(s) ||
    /\b(não|nunca|jamais)\b/i.test(s) ||
    /\b(porque|quando|se|entao|mas)\b/i.test(s)
  );
}

export function qualityCheck(card, seenSet) {
  if (!card || typeof card.pt !== "string") return false;

  const norm = normalize(card.pt);
  if (!norm) return false;

  if (seenSet instanceof Set && seenSet.has(norm)) return false;
  if (isBlacklisted(card.pt)) return false;
  if (!lengthFitsCefr(card.pt, card.cefr)) return false;
  if (!hasVariance(card.pt)) return false;

  return true;
}