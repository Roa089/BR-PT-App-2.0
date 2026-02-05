// src/features/learn/learn.view.js

export function renderLearnView(model) {
  if (!model.card) {
    return `
      <div class="card">
        <div class="title">📚 Lernen</div>
        <div class="muted">Keine Karten geladen.</div>
      </div>
    `;
  }

  const { card, flipped, index, total } = model;

  return `
    <div class="card">
      <div class="small muted">${index} / ${total}</div>

      <div class="flip-card">
        <div class="pt">${escape(card.pt)}</div>

        ${flipped ? `
          <hr/>
          <div class="de">${escape(card.deHint || "—")}</div>
          <div class="forms">${(card.forms || []).join(" · ")}</div>
        ` : ""}
      </div>

      <div class="row" style="margin-top:16px;">
        <button class="btn" data-act="learn:flip">Übersetzung anzeigen</button>
        <button class="btn primary" data-act="learn:next">Nächste Karte</button>
      </div>
    </div>
  `;
}

function escape(s) {
  return String(s || "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;");
}