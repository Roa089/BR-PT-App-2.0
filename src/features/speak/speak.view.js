// src/features/speak/speak.view.js
/* =========================================
   Speak View 2.0
   - Shadowing (TTS) + STT optional + Stop Mic
   - Phrase Builder mini-mode
   ========================================= */

export function renderSpeakView(model) {
  const {
    mode, // "shadowing" | "builder"
    card,
    index,
    total,
    rate,
    sttSupported,
    listening,
    lastTranscript,
    diffHtml
  } = model;

  return `
    <div class="card">
      <div class="row" style="justify-content:space-between;">
        <div class="title" style="margin:0;">🎤 Sprechen</div>
        <div class="row">
          <button class="btn ${mode === "shadowing" ? "primary" : ""}" data-act="mode:shadowing" type="button">Shadowing</button>
          <button class="btn ${mode === "builder" ? "primary" : ""}" data-act="mode:builder" type="button">Phrase Builder</button>
        </div>
      </div>
      <div class="muted" style="margin-top:6px;">Fokus: laut sprechen. Kurz. Oft. Variationen.</div>
    </div>

    ${mode === "shadowing" ? renderShadowing({ card, index, total, rate, sttSupported, listening, lastTranscript, diffHtml }) : renderBuilder()}
  `;
}

function renderShadowing({ card, index, total, rate, sttSupported, listening, lastTranscript, diffHtml }) {
  return `
    <div class="card">
      <div class="row" style="justify-content:space-between;">
        <div class="pill">Queue: <b>${index + 1}</b>/${total}</div>
        <div class="pill">Speed: <b>${Number(rate || 1).toFixed(1)}x</b></div>
      </div>

      <div style="margin-top:12px;">
        <input data-act="rate" id="rate" type="range" min="0.7" max="1.3" step="0.1" value="${Number(rate || 1)}" />
      </div>

      <hr/>

      ${card ? `
        <div class="pt-big">${escapeHtml(card.pt)}</div>
        ${card.deHint ? `<div class="small muted" style="margin-top:10px;">${escapeHtml(card.deHint)}</div>` : ""}

        <div class="row" style="margin-top:14px;">
          <button class="btn" data-act="prev" type="button">◀︎</button>
          <button class="btn primary" data-act="play" type="button">▶︎ Anhören</button>
          <button class="btn" data-act="repeat" type="button">↻</button>
          <button class="btn" data-act="next" type="button">▶︎▶︎</button>
        </div>

        <hr/>

        <div class="row" style="justify-content:space-between;">
          <div class="small muted">STT (optional)</div>
          <div class="pill">${sttSupported ? "Verfügbar" : "Nicht verfügbar"}</div>
        </div>

        <div class="row" style="margin-top:10px;">
          <button class="btn ${listening ? "danger" : ""}" data-act="stt:start" type="button" ${sttSupported ? "" : "disabled"}>
            ${listening ? "🎙️ hört zu…" : "🎙️ Sprechen & Vergleichen"}
          </button>
          <button class="btn danger" data-act="stt:stop" type="button">🔇 Mikro aus</button>
        </div>

        <div style="margin-top:12px;">
          <div class="small muted">Du gesagt:</div>
          <div class="pill" style="width:100%; justify-content:flex-start; border-radius:16px;">
            ${escapeHtml(lastTranscript || "—")}
          </div>
        </div>

        <div style="margin-top:12px;">
          ${diffHtml ? diffHtml : `<div class="small muted">Tipp: Sprich den Satz nach. Dann vergleicht die App Wort für Wort.</div>`}
        </div>
      ` : `
        <div class="muted">Noch keine Shadowing-Queue. Starte über Daily Flow (kommt) oder später Explorer.</div>
      `}
    </div>
  `;
}

function renderBuilder() {
  return `
    <div class="card">
      <div class="title">🧩 Phrase Builder</div>
      <div class="muted">Baue schnell Alltagssätze aus Bausteinen. (Mini-Mode)</div>
      <hr/>

      <div class="small muted">Person</div>
      <div class="row" style="margin-top:8px;">
        ${chip("eu")} ${chip("você")} ${chip("a gente")} ${chip("ele/ela")} ${chip("nós")}
      </div>

      <div class="small muted" style="margin-top:12px;">Verb</div>
      <div class="row" style="margin-top:8px;">
        ${chip("quero")} ${chip("preciso")} ${chip("posso")} ${chip("gosto de")} ${chip("vou")} ${chip("estou")}
      </div>

      <div class="small muted" style="margin-top:12px;">Objekt / Ergänzung</div>
      <div class="row" style="margin-top:8px;">
        ${chip("um café")} ${chip("água")} ${chip("ajuda")} ${chip("ir ao mercado")} ${chip("falar com você")} ${chip("comer agora")}
      </div>

      <div class="small muted" style="margin-top:12px;">Connector</div>
      <div class="row" style="margin-top:8px;">
        ${chip("porque")} ${chip("mas")} ${chip("então")} ${chip("agora")} ${chip("hoje")} ${chip("amanhã")}
      </div>

      <hr/>

      <div class="small muted">Dein Satz</div>
      <div class="pill" id="builderOut" style="width:100%; justify-content:flex-start; border-radius:16px; min-height:44px;">
        —
      </div>

      <div class="row" style="margin-top:12px;">
        <button class="btn primary" data-act="builder:tts" type="button">🔊 Anhören</button>
        <button class="btn" data-act="builder:clear" type="button">Löschen</button>
      </div>

      <div class="flip-hint">Tippe Bausteine an. Ziel: schnell sprechen, nicht perfekt schreiben.</div>
    </div>
  `;
}

function chip(text) {
  const t = escapeHtml(text);
  return `<button class="btn" data-act="builder:add" data-val="${t}" type="button">${t}</button>`;
}

function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
