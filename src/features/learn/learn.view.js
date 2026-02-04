// src/features/learn/learn.view.js
/* =========================================
   Learn View 2.0 — Flip Card + 2-step rating
   Front: PT
   Back: DE hint + Forms + ratings
   ========================================= */

export function renderLearnView(model) {
  const {
    card,
    index,
    total,
    flipped,
    showTranslationByDefault,
    hardMode,
    phase,
    lastToast
  } = model;

  if (!card) {
    return `
      <div class="card">
        <div class="title">📚 Lernen</div>
        <div class="muted">Keine Session aktiv. Starte eine Session im Daily Flow oder hier.</div>
        <hr/>
        <div class="row">
          <button class="btn primary" data-act="learn:start" type="button">Session starten</button>
        </div>
      </div>
    `;
  }

  const isFlipped = showTranslationByDefault ? true : flipped;

  return `
    <div class="card">
      <div class="row" style="justify-content:space-between;">
        <div class="pill">${escapeHtml(card.topic)} • ${escapeHtml(card.cefr)} • ${escapeHtml(card.skill)}</div>
        <div class="pill">${index + 1}/${total}</div>
      </div>
    </div>

    <div class="flip-wrap">
      <div class="flip-card ${isFlipped ? "is-flipped" : ""}" id="learnFlip" tabindex="0" role="button" aria-label="Karte umdrehen">
        <!-- FRONT (PT) -->
        <div class="flip-face flip-front">
          <div class="pt-big">${escapeHtml(card.pt)}</div>

          <div class="flip-hint">
            Tippe, um zu drehen. (Tastatur: <b>Space</b>) • Audio: <b>J</b> • Flip: <b>K</b>
          </div>

          <div class="flip-actions">
            <button class="btn" data-act="learn:tts" type="button">🔊 Anhören</button>
            <button class="btn primary" data-act="learn:flip" type="button">Übersetzung</button>
          </div>
        </div>

        <!-- BACK (Hint + Forms + Ratings) -->
        <div class="flip-face flip-back">
          <div class="row" style="justify-content:space-between;">
            <div class="pill">Hinweis / Varianten</div>
            <button class="btn" data-act="learn:unflip" type="button">Zurück</button>
          </div>

          <hr/>
          <div class="de-hint">${escapeHtml(card.deHint || "—")}</div>

          ${Array.isArray(card.forms) && card.forms.length ? `
            <div style="margin-top:12px;">
              <div class="small muted">Varianten</div>
              ${card.forms.map(f => `<div class="pill" style="margin-top:8px;">${escapeHtml(f)}</div>`).join("")}
            </div>
          ` : ""}

          <hr/>

          ${phase === "comprehension" ? renderComprehensionControls({ hardMode }) : renderProductionControls({ hardMode })}
        </div>
      </div>
    </div>

    ${lastToast ? `<div class="card"><div class="small muted">${escapeHtml(lastToast)}</div></div>` : ""}
  `;
}

function renderComprehensionControls({ hardMode }) {
  // Verstehen: instant/hint/fail
  // Keyboard: 1/2/3
  return `
    <div class="small muted">1) Verstehen (Input)</div>
    <div class="row" style="margin-top:10px;">
      <button class="btn primary" data-act="rate:c:instant" type="button">1 • sofort</button>
      <button class="btn" data-act="rate:c:hint" type="button">2 • mit Hinweis</button>
      <button class="btn danger" data-act="rate:c:fail" type="button">3 • nicht</button>
    </div>
    ${hardMode ? `<div class="flip-hint">Hard Mode: Bewerte erst, nachdem du einmal geflippt hast.</div>` : ``}
  `;
}

function renderProductionControls({ hardMode }) {
  // Produzieren: fluent/hesitant/fail
  // Keyboard: 1/2/3
  return `
    <div class="small muted">2) Produzieren (Output)</div>
    <div class="row" style="margin-top:10px;">
      <button class="btn primary" data-act="rate:p:fluent" type="button">1 • flüssig</button>
      <button class="btn" data-act="rate:p:hesitant" type="button">2 • stockend</button>
      <button class="btn danger" data-act="rate:p:fail" type="button">3 • ging nicht</button>
    </div>
    ${hardMode ? `<div class="flip-hint">Hard Mode: Sag den Satz einmal laut, bevor du bewertest.</div>` : ``}
  `;
}

/* ---------- Local minimal styles hook classes ---------- */
export function ensureLearnStyles() {
  // This function exists so you can call it once if you want dynamic CSS injection.
  // For now, styles are in style.css in later prompts.
}

/* ---------- Util ---------- */
function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
