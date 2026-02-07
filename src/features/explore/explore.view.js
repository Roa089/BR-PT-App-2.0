// src/features/explore/explore.view.js

export function renderExploreView(model = {}) {
  const packs = Array.isArray(model.packs) ? model.packs : [];
  const info = model.info || { enabledCount: 0, totalCount: 0 };

  return `
    <div class="card">
      <div class="title">🧭 Themen</div>
      <div class="muted">Aktiviere Packs, damit dein Daily mehr/andere Inhalte generiert.</div>
      <hr/>

      <div class="row" style="justify-content:space-between; align-items:center;">
        <div class="pill">Enabled: <b>${info.enabledCount}</b> / ${info.totalCount}</div>
        <button class="btn" data-act="explore:rebuild" type="button">↻ Generator Reset</button>
      </div>

      <div style="margin-top:12px; display:flex; flex-direction:column; gap:10px;">
        ${packs.length ? packs.map(p => `
          <div class="card" style="margin:0;">
            <div class="row" style="justify-content:space-between; align-items:center;">
              <div>
                <div class="pt">${escapeHtml(p.name || p.key)}</div>
                <div class="small muted">${escapeHtml(p.key)}</div>
              </div>
              <button class="btn ${p.enabled ? "primary" : ""}"
                      data-act="explore:toggle"
                      data-key="${escapeAttr(p.key)}"
                      type="button">
                ${p.enabled ? "Enabled" : "Disabled"}
              </button>
            </div>
          </div>
        `).join("") : `<div class="muted">Keine Packs registriert.</div>`}
      </div>

      <hr/>

      <div class="row" style="flex-wrap:wrap;">
        <button class="btn" data-act="explore:goDaily" type="button">⚡ Zurück zu Daily</button>
        <button class="btn" data-act="explore:goStats" type="button">📈 Zu Stats</button>
      </div>

      <div class="flip-hint">Tipp: Nach Pack-Änderung → Daily → „Plan neu berechnen“.</div>
    </div>
  `;
}

function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function escapeAttr(s) {
  return escapeHtml(String(s ?? "")).replaceAll("`", "&#096;");
}
