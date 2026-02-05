// src/features/content/content.registry.js
/* =========================================
   Content Registry 2.0 — Packs Management
   ========================================= */

const _packs = new Map();
const _enabled = new Set();

export function registerPack(pack) {
  if (!pack || !pack.key) return;
  const key = String(pack.key).trim();
  if (!key) return;

  const normalized = {
    key,
    name: String(pack.name || key),
    enabledByDefault: !!pack.enabledByDefault,
    BANK: pack.BANK && typeof pack.BANK === "object" ? pack.BANK : {},
    TEMPLATES: Array.isArray(pack.TEMPLATES) ? pack.TEMPLATES : [],
    ...pack
  };

  _packs.set(key, normalized);
  if (normalized.enabledByDefault) _enabled.add(key);
}

export function getPacks() {
  return Array.from(_packs.values()).map((p) => ({
    key: p.key,
    name: p.name || p.key,
    enabled: _enabled.has(p.key)
  }));
}

export function enablePack(key) {
  const k = String(key || "").trim();
  if (!k) return;
  if (_packs.has(k)) _enabled.add(k);
}

export function disablePack(key) {
  const k = String(key || "").trim();
  if (!k) return;
  _enabled.delete(k);
}

export function togglePack(key) {
  const k = String(key || "").trim();
  if (!k) return;
  if (_enabled.has(k)) _enabled.delete(k);
  else if (_packs.has(k)) _enabled.add(k);
}

export function getEnabledPacks() {
  return Array.from(_enabled)
    .map((k) => _packs.get(k))
    .filter(Boolean);
}

export function getAllBanksAndTemplates() {
  const banks = {};
  const templates = [];
  for (const p of getEnabledPacks()) {
    const bank = p?.BANK;
    if (bank && typeof bank === "object") Object.assign(banks, bank);
    const tpls = p?.TEMPLATES;
    if (Array.isArray(tpls) && tpls.length) templates.push(...tpls);
  }
  return { banks, templates };
}