// src/features/learn/learn.view.js
export function renderLearnView(model) {
  if (!model?.card) {
    return `
      <div class="card">
        <div class="title">📚 Lernen</div>
        <div class="muted">Keine Session geladen. Starte über <b>Daily → Lernen starten</b>.</div>
      </div>
    `;
  }

  const { card, flipped, step, index, total, compChoice } = model;

  return `
    <div class="card">
      <div class="row" style="justify-content:space-between; align-items:center;">
        <div class="pill">Karte ${index} / ${total}</div>
        <button class="btn" data-act="learn:skip" type="button">Skip</button>
      </div>

      <div class="flip-card" style="margin-top:12px;">
        <div class="pt" style="font-size:22px; line-height:1.25;">
          ${escapeHtml(card.pt)}
        </div>

        <div class="flip-hint" style="margin-top:10px;">
          Tipp: <b>Space</b> zeigt Rückseite • <b>Esc</b> skip
        </div>

        ${flipped ? `
          <hr/>
          <div class="small muted">DE-Hinweis</div>
          <div class="de" style="font-size:16px; margin-top:6px;">
            ${escapeHtml(card.deHint || "—")}
          </div>

          ${(card.forms?.length ? `
            <div style="margin-top:10px;">
              <div class="small muted">Forms</div>
              <div class="row" style="flex-wrap:wrap; margin-top:6px;">
                ${card.forms.map(f => `<div class="pill">${escapeHtml(f)}</div>`).join("")}
              </div>
            </div>
          ` : ``)}
        ` : ``}
      </div>

      ${step === "front" ? `
        <div class="row" style="margin-top:14px;">
          <button class="btn primary" data-act="learn:flip" type="button">Übersetzung anzeigen</button>
        </div>
      ` : ``}

      ${step === "comprehension" ? `
        <div class="card" style="margin-top:12px;">
          <div class="title" style="margin:0;">1) Verstehen</div>
          <div class="muted">Wie gut hast du es verstanden?</div>
          <div class="row" style="margin-top:12px; flex-wrap:wrap;">
            <button class="btn primary" data-act="learn:comp:instant" type="button">1 • Sofort ✅</button>
            <button class="btn" data-act="learn:comp:hint" type="button">2 • Mit Hinweis 🤏</button>
            <button class="btn" data-act="learn:comp:fail" type="button">3 • Nicht 😬</button>
          </div>
          <div class="flip-hint">Shortcuts: 1/2/3</div>
        </div>
      ` : ``}

      ${step === "production" ? `
        <div class="card" style="margin-top:12px;">
          <div class="title" style="margin:0;">2) Produzieren</div>
          <div class="muted">
            Sag den Satz laut (oder frei umformulieren). Dann bewerte dich.
            ${compChoice === "fail" ? " (Auch wenn’s schwer war: einmal raus damit.)" : ""}
          </div>

          <div class="row" style="margin-top:12px; flex-wrap:wrap;">
            <button class="btn primary" data-act="learn:prod:fluent" type="button">1 • Flüssig 🟢</button>
            <button class="btn" data-act="learn:prod:hesitant" type="button">2 • Stockend 🟡</button>
            <button class="btn" data-act="learn:prod:fail" type="button">3 • Ging nicht 🔴</button>
          </div>
          <div class="flip-hint">Shortcuts: 1/2/3</div>
        </div>
      ` : ``}
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