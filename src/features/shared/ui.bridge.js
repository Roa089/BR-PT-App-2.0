// src/features/shared/ui.bridge.js
// Minimal bridge, damit Imports nicht crashen.
// Wenn du window.UI (aus core/ui.js) nutzt, kannst du es hier durchreichen.
export function toast(msg) {
  try {
    if (window.UI?.toast) window.UI.toast(msg);
    else console.log(msg);
  } catch {
    console.log(msg);
  }
}