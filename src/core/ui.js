// src/core/ui.js
/* =========================================
   UI 2.0 — Toast + Modal + Sheet + Confirm
   Vanilla JS • minimal dependencies
   ========================================= */

export function createUI({ toastRoot, modalRoot, sheetRoot } = {}) {
  let toastTimer = null;
  let modalAbort = null;
  let sheetAbort = null;

  function toast(message, ms = 2200) {
    if (!toastRoot) return;
    clearTimeout(toastTimer);
    toastRoot.innerHTML = `<div class="toast">${escapeHtml(String(message))}</div>`;
    toastTimer = setTimeout(() => {
      if (toastRoot) toastRoot.innerHTML = "";
    }, Math.max(0, Number(ms) || 0));
  }

  function openModal(html) {
    if (!modalRoot) return;
    cleanupModal();
    modalRoot.hidden = false;
    modalRoot.innerHTML = `
      <div class="backdrop" data-close="1"></div>
      <div class="modal">${html}</div>
    `;
    modalAbort = bindClose(modalRoot, closeModal);
  }

  function closeModal() {
    if (!modalRoot) return;
    cleanupModal();
    modalRoot.hidden = true;
    modalRoot.innerHTML = "";
  }

  function openSheet(html) {
    if (!sheetRoot) return;
    cleanupSheet();
    sheetRoot.hidden = false;
    sheetRoot.innerHTML = `
      <div class="backdrop" data-close="1"></div>
      <div class="sheet">${html}</div>
    `;
    sheetAbort = bindClose(sheetRoot, closeSheet);
  }

  function closeSheet() {
    if (!sheetRoot) return;
    cleanupSheet();
    sheetRoot.hidden = true;
    sheetRoot.innerHTML = "";
  }

  function confirm(text, onYes, { yesLabel = "Ja", noLabel = "Nein", title = "Bestätigen" } = {}) {
    openSheet(`
      <div class="title">${escapeHtml(title)}</div>
      <p class="muted">${escapeHtml(text)}</p>
      <div class="row" style="margin-top:12px;">
        <button class="btn primary" id="uiYes" data-close="1" type="button">${escapeHtml(yesLabel)}</button>
        <button class="btn" id="uiNo" data-close="1" type="button">${escapeHtml(noLabel)}</button>
      </div>
    `);
    const yesBtn = document.querySelector("#uiYes");
    if (yesBtn) {
      yesBtn.addEventListener("click", () => {
        try { onYes?.(); } finally { closeSheet(); }
      }, { once: true });
    }
  }

  function bindClose(root, onClose) {
    const ac = new AbortController();
    const { signal } = ac;

    root.querySelectorAll("[data-close]").forEach((el) => {
      el.addEventListener("click", () => onClose(), { signal });
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") onClose();
    }, { signal });

    return ac;
  }

  function cleanupModal() {
    if (modalAbort) {
      modalAbort.abort();
      modalAbort = null;
    }
  }

  function cleanupSheet() {
    if (sheetAbort) {
      sheetAbort.abort();
      sheetAbort = null;
    }
  }

  return { toast, openModal, closeModal, openSheet, closeSheet, confirm };
}

function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
