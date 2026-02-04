// src/features/daily/daily.view.js
/* =========================================
   Daily View 2.0 — Plan overview
   Output: minimal, motivating, 1 focus
   ========================================= */

export function renderDailyView(model) {
  const { timeBudgetMin, today, plan, weakTopics, hasTts } = model;

  return `
    <div class="card">
      <div class="row" style="justify-content:space-between; align-items:center;">
        <div>
          <div class="title" style="margin:0;">🔥 Daily</div>
          <div class="muted">Dein Plan für heute — kurz, klar, machbar.</div>
        </div>
        <div class="pill">${timeBudgetMin} min</div>
      </div>

      <div class="row" style="margin-top:12px;">
        <button class="btn ${timeBudgetMin === 10 ? "primary" : ""}" data-act="daily:budget" data-val="10" type="button">10</button>
        <button class="btn ${timeBudgetMin === 20 ? "primary" : ""}" data-act="daily:budget" data-val="20" type="button">20</button>
        <button class="btn ${timeBudgetMin === 30 ? "primary" : ""}" data-act="daily:budget" data-val="30" type="button">30</button>
        <button class="btn ${timeBudgetMin === 45 ? "primary" : ""}" data-act="daily:budget" data-val="45" type="button">45</button>
      </div>

      ${weakTopics?.length ? `
        <div style="margin-top:12px;">
          <div class="small muted">Heute priorisiert (Produktion schwach):</div>
          <div class="row" style="margin-top:8px; flex-wrap:wrap;">
            ${weakTopics.map(t => `<div class="pill">${escapeHtml(t)}</div>`).join("")}
          </div>
        </div>
      ` : ""}

      <hr/>

      <div class="row">
        ${metricPill("Reviews", plan.reviews.length)}
        ${metricPill("New", plan.newInput.length)}
        ${metricPill("Speak", plan.speaking.length)}
        ${metricPill("Heute XP", today.xpEarned || 0)}
      </div>

      <div class="row" style="margin-top:14px;">
        <button class="btn primary" data-act="daily:startLearn" type="button">📚 Lernen starten</button>
        <button class="btn" data-act="daily:startSpeak" type="button">🎤 Sprechen starten</button>
        <button class="btn" data-act="daily:refresh" type="button">↻ Neu planen</button>
      </div>

      ${!hasTts ? `<div class="flip-hint">TTS nicht verfügbar (oder blockiert). Speak/Shadowing funktioniert dann ohne Audio.</div>` : ""}

      <hr/>
      <div class="small muted">Preview (erste Karten)</div>
      ${previewList("Reviews", plan.reviews)}
      ${previewList("New Input", plan.newInput)}
      ${previewList("Speaking", plan.speaking.map(x => ({ id:x.id, pt:x.pt, deHint:"" })))}
    </div>
  `;
}

function previewList(title, cards) {
  const list = (cards || []).slice(0, 3);
  return `
    <div style="margin-top:10px;">
      <div class="pill">${escapeHtml(title)} • Preview</div>
      ${list.length ? `
        <div style="margin-top:8px; display:flex; flex-direction:column; gap:8px;">
          ${list.map(c => `
            <div class="card" style="margin:0;">
              <div class="pt">${escapeHtml(c.pt || "—")}</div>
              ${c.deHint ? `<div class="small muted" style="margin-top:6px;">${escapeHtml(c.deHint)}</div>` : ``}
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
