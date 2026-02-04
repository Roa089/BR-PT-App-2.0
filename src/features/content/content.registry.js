// src/features/content/content.registry.js
/* =========================================
   Content Registry 2.0 — Packs Management
   ========================================= */

const _packs = new Map();
const _enabled = new Set();

export function registerPack(pack) {
  if (!pack || !pack.key) return;
  _packs.set(pack.key, pack);
  if (pack.enabledByDefault) _enabled.add(pack.key);
}

export function getPacks() {
  return Array.from(_packs.values()).map(p => ({
    key: p.key,
    name: p.name,
    enabled: _enabled.has(p.key)
  }));
}

export function enablePack(key) {
  if (_packs.has(key)) _enabled.add(key);
}

export function disablePack(key) {
  _enabled.delete(key);
}

export function togglePack(key) {
  if (_enabled.has(key)) _enabled.delete(key);
  else if (_packs.has(key)) _enabled.add(key);
}

export function getEnabledPacks() {
  return Array.from(_enabled).map(k => _packs.get(k)).filter(Boolean);
}

export function getAllBanksAndTemplates() {
  const banks = {};
  let templates = [];
  getEnabledPacks().forEach(p => {
    Object.assign(banks, p.BANK || {});
    templates = templates.concat(p.TEMPLATES || []);
  });
  return { banks, templates };
}
