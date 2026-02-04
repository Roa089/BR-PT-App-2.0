// src/core/ui.js
export function createUI({ toastRoot, modalRoot, sheetRoot }) {
  let toastTimer = null;

  function toast(message, ms = 2200) {
    if (!toastRoot) return;
    toastRoot.innerHTML = `<div class="toast">${escapeHtml(String(message))}</div>`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (toastRoot.innerHTML = ""), ms);
  }

  function openModal(html) {
    if (!modalRoot) return;
    modalRoot.hidden = false;
    modalRoot.innerHTML = `
      <div class="backdrop" data-close="1"></div>
      <div class="modal">${html}</div>
    `;
    modalRoot.querySelectorAll("[data-close]").forEach((el) =>
      el.addEventListener("click", closeModal)
    );
  }

  function closeModal() {
    if (!modalRoot) return;
    modalRoot.hidden = true;
    modalRoot.innerHTML = "";
  }

  function openSheet(html) {
    if (!sheetRoot) return;
    sheetRoot.hidden = false;
    sheetRoot.innerHTML = `
      <div class="backdrop" data-close="1"></div>
      <div class="sheet">${html}</div>
    `;
    sheetRoot.querySelectorAll("[data-close]").forEach((el) =>
      el.addEventListener("click", closeSheet)
    );
  }

  function closeSheet() {
    if (!sheetRoot) return;
    sheetRoot.hidden = true;
    sheetRoot.innerHTML = "";
  }

  function confirm(text, onYes) {
    openSheet(`
      <div class="title">Bestätigen</div>
      <p class="muted">${escapeHtml(text)}</p>
      <div class="row" style="margin-top:12px;">
        <button class="btn primary" id="uiYes" data-close="1">Ja</button>
        <button class="btn" id="uiNo" data-close="1">Nein</button>
      </div>
    `);
    document.querySelector("#uiYes")?.addEventListener("click", () => onYes?.());
  }

  return { toast, openModal, closeModal, openSheet, closeSheet, confirm };
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
