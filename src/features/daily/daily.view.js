// src/features/daily/daily.view.js
/* =========================================
   Daily View 2.0 — Plan overview
   Output: minimal, motivating, 1 focus
   ========================================= */

export function renderDailyView(model = {}) {
  const {
    timeBudgetMin = 20,
    today = {},
    plan = { reviews: [], newInput: [], speaking: [] },
    weakTopics = [],
    hasTts = true
  } = model;

  const reviews = Array.isArray(plan.reviews) ? plan.reviews : [];
  const newInput = Array.isArray(plan.newInput) ? plan.newInput : [];
  const speaking = Array.isArray(plan.speaking) ? plan.speaking : [];

  const xpToday = typeof today?.xpEarned === "number" ? today.xpEarned : 0;

  return `
    <div class="card">
      <div class="row" style="justify-content:space-between; align-items:center;">
        <div>
          <div class="title" style="margin:0;">🔥 Daily</div>
          <div class="muted">Dein Plan für heute — kurz, klar, machbar.</div>
        </div>
        <div class="pill">${escapeHtml(String(timeBudgetMin))} min</div>
      </div>

      <div class="row" style="margin-top:12px;">
        ${budgetBtn(10, timeBudgetMin)}
        ${budgetBtn(20, timeBudgetMin)}
        ${budgetBtn(30, timeBudgetMin)}
        ${budgetBtn(45, timeBudgetMin)}
      </div>

      ${Array.isArray(weakTopics) && weakTopics.length ? `
        <div style="margin-top:12px;">
          <div class="small muted">Heute priorisiert (Produktion schwach):</div>
          <div class="row" style="margin-top:8px; flex-wrap:wrap;">
            ${weakTopics.map(t => `<div class="pill">${escapeHtml(t)}</div>`).join("")}
          </div>
        </div>
      ` : ""}

      <hr/>

      <div class="row">
        ${metricPill("Reviews", reviews.length)}
        ${metricPill("New", newInput.length)}
        ${metricPill("Speak", speaking.length)}
        ${metricPill("Heute XP", xpToday)}
      </div>

      <div class="row" style="margin-top:14px;">
        <button class="btn primary" data-act="daily:startLearn" type="button">📚 Lernen starten</button>
        <button class="btn" data-act="daily:startSpeak" type="button">🎤 Sprechen starten</button>
        <button class="btn" data-act="daily:refresh" type="button">↻ Neu planen</button>
      </div>

      ${!hasTts ? `<div class="small muted" style="margin-top:10px;">TTS nicht verfügbar. Speak/Shadowing läuft ohne Audio.</div>` : ""}

      <hr/>
      <div class="small muted">Preview (erste Karten)</div>
      ${previewList("Reviews", reviews)}
      ${previewList("New Input", newInput)}
      ${previewList("Speaking", speaking.map(x => ({ id: x?.id, pt: x?.pt, deHint: "" })))}
    </div>
  `;
}

function budgetBtn(val, current) {
  const isActive = Number(current) === Number(val);
  return `<button class="btn ${isActive ? "primary" : ""}" data-act="daily:budget" data-val="${val}" type="button">${val}</button>`;
}

function previewList(title, cards) {
  const list = Array.isArray(cards) ? cards.slice(0, 3) : [];
  return `
    <div style="margin-top:10px;">
      <div class="pill">${escapeHtml(title)} • Preview</div>
      ${list.length ? `
        <div style="margin-top:8px; display:flex; flex-direction:column; gap:8px;">
          ${list.map(c => `
            <div class="card" style="margin:0;">
              <div class="pt">${escapeHtml(c?.pt || "—")}</div>
              ${c?.deHint ? `<div class="small muted" style="margin-top:6px;">${escapeHtml(c.deHint)}</div>` : ``}
            </div>
          `).join("")}
        </div>
      ` : `<div class="muted" style="margin-top:6px;">—</div>`}
    </div>
  `;
}

function metricPill(label, val) {
  return `<div class="pill">${escapeHtml(label)}: <b>${escapeHtml(String(val))}</b></div>`;
}

function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
