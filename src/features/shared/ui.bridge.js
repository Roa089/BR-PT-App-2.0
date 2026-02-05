// src/features/shared/ui.bridge.js
// Minimal bridge, damit Imports nicht crashen.
// Reicht window.UI (aus core/ui.js) defensiv durch.

export function toast(msg) {
  const m = String(msg ?? "");
  try {
    if (typeof window !== "undefined" && window.UI && typeof window.UI.toast === "function") {
      window.UI.toast(m);
    } else {
      console.log(m);
    }
  } catch {
    console.log(m);
  }
}