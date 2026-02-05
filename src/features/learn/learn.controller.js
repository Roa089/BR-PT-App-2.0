// src/features/learn/learn.controller.js

import { toast } from "../shared/ui.bridge.js";

export function createLearnController({ store, ui }) {
  let session = [];
  let index = 0;
  let flipped = false;

  function startSession(cards) {
    session = cards || [];
    index = 0;
    flipped = false;
  }

  function getCurrentCard() {
    return session[index] || null;
  }

  function flip() {
    flipped = true;
  }

  function next() {
    if (index < session.length - 1) {
      index++;
      flipped = false;
    } else {
      toast("Session fertig ✅");
    }
  }

  function getModel() {
    const card = getCurrentCard();
    return {
      card,
      flipped,
      index: index + 1,
      total: session.length
    };
  }

  function bind(root, rerender) {
    function onClick(e) {
      const act = e.target.closest("[data-act]")?.dataset.act;
      if (!act) return;

      if (act === "learn:flip") {
        flip();
        rerender();
      }

      if (act === "learn:next") {
        next();
        rerender();
      }
    }

    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }

  return { startSession, getModel, bind };
}