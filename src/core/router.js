// src/core/router.js
/* =========================================
   Router 2.0 — Hash Router + Bottom Tabs
   - GitHub Pages friendly
   - Vanilla JS, iPhone-first
   API:
     const router = createRouter({
       defaultRoute: "daily",
       tabsSelector: ".tab",
       onRouteChange: (route) => {}
     });
     router.start();
     router.setRoute("learn");
     router.getRoute();
   Expected HTML:
     <button class="tab" data-route="daily">...</button>
   ========================================= */

export function createRouter(opts = {}) {
  const defaultRoute = String(opts.defaultRoute || "daily");
  const tabsSelector = String(opts.tabsSelector || ".tab");
  const onRouteChange = typeof opts.onRouteChange === "function" ? opts.onRouteChange : () => {};

  let current = defaultRoute;
  let started = false;

  function normalize(route) {
    const r = String(route || "").trim().toLowerCase();
    return r || defaultRoute;
  }

  function readHashRoute() {
    const h = String(window.location.hash || "");
    if (!h || h === "#") return defaultRoute;
    // supports "#/daily" or "#daily" or "#route=daily"
    if (h.startsWith("#/")) return normalize(h.slice(2));
    if (h.startsWith("#route=")) return normalize(h.slice(7));
    return normalize(h.slice(1));
  }

  function writeHashRoute(route) {
    const r = normalize(route);
    const target = `#/${encodeURIComponent(r)}`;
    if (window.location.hash !== target) window.location.hash = target;
  }

  function setActiveTabs(route) {
    const r = normalize(route);
    const tabs = document.querySelectorAll(tabsSelector);
    tabs.forEach((el) => {
      const er = normalize(el.getAttribute("data-route"));
      const isActive = er === r;
      el.classList.toggle("active", isActive);
      // accessibility
      el.setAttribute("aria-current", isActive ? "page" : "false");
      el.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function apply(route, { fromHash = false } = {}) {
    const r = normalize(route);
    if (r === current && started) {
      // still ensure UI is correct
      setActiveTabs(r);
      return;
    }
    current = r;
    setActiveTabs(r);
    onRouteChange(r);

    // If route change originated from a click (not hash), update hash
    if (!fromHash) writeHashRoute(r);
  }

  function onHashChange() {
    apply(readHashRoute(), { fromHash: true });
  }

  function onTabClick(e) {
    const btn = e.target.closest(tabsSelector);
    if (!btn) return;
    const route = btn.getAttribute("data-route");
    if (!route) return;
    apply(route, { fromHash: false });
  }

  function start() {
    if (started) return;
    started = true;

    // bind
    window.addEventListener("hashchange", onHashChange, { passive: true });
    document.addEventListener("click", onTabClick, { passive: true });

    // initial route
    const initial = readHashRoute();
    apply(initial, { fromHash: true });

    // ensure hash is normalized (optional)
    // keeps deep-linking consistent
    writeHashRoute(current);
  }

  function stop() {
    if (!started) return;
    started = false;
    window.removeEventListener("hashchange", onHashChange);
    document.removeEventListener("click", onTabClick);
  }

  function setRoute(route) {
    apply(route, { fromHash: false });
  }

  function getRoute() {
    return current || defaultRoute;
  }

  return {
    start,
    stop,
    setRoute,
    getRoute
  };
}
