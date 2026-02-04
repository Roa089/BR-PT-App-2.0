// src/core/ui.js
/* =========================================
   UI 2.0 — Toast + Modal + Sheet + Confirm
   Vanilla JS • minimal dependencies
   ========================================= */

export function createUI({ toastRoot, modalRoot, sheetRoot } = {}) {
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
    bindClose(modalRoot, closeModal);
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
    bindClose(sheetRoot, closeSheet);
  }

  function closeSheet() {
    if (!sheetRoot) return;
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
    document.querySelector("#uiYes")?.addEventListener("click", () => onYes?.());
  }

  function bindClose(root, onClose) {
    root.querySelectorAll("[data-close]").forEach((el) => {
      el.addEventListener("click", (e) => {
        // If backdrop clicked or button clicked
        const isBackdrop = el.classList.contains("backdrop");
        if (isBackdrop || el.tagName.toLowerCase() === "button") onClose();
        else onClose();
      });
    });

    // ESC support for desktop
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") onClose();
    }, { once: true });
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
