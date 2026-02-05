// src/core/router.js
/* =========================================
   Router 2.0 — Hash Router + Bottom Tabs
   ========================================= */

export function createRouter(opts = {}) {
  const defaultRoute = String(opts.defaultRoute || "daily");
  const tabsSelector = String(opts.tabsSelector || ".tab");
  const onRouteChange = typeof opts.onRouteChange === "function"
    ? opts.onRouteChange
    : () => {};

  let current = defaultRoute;
  let started = false;

  function normalizeRoute(route) {
    const r = String(route || "").trim().toLowerCase();
    return r || defaultRoute;
  }

  function readHashRoute() {
    const h = String(window.location.hash || "");
    if (!h || h === "#") return defaultRoute;
    if (h.startsWith("#/")) return normalizeRoute(h.slice(2));
    if (h.startsWith("#route=")) return normalizeRoute(h.slice(7));
    return normalizeRoute(h.slice(1));
  }

  function writeHashRoute(route) {
    const r = normalizeRoute(route);
    const target = `#/${encodeURIComponent(r)}`;
    if (window.location.hash !== target) {
      window.location.hash = target;
    }
  }

  function setActiveTabs(route) {
    const r = normalizeRoute(route);
    const tabs = document.querySelectorAll(tabsSelector);
    tabs.forEach((el) => {
      const er = normalizeRoute(el.getAttribute("data-route"));
      const isActive = er === r;
      el.classList.toggle("active", isActive);
      el.setAttribute("aria-current", isActive ? "page" : "false");
    });
  }

  function apply(route, { fromHash = false } = {}) {
    const r = normalizeRoute(route);
    if (r === current && started) {
      setActiveTabs(r);
      return;
    }
    current = r;
    setActiveTabs(r);
    onRouteChange(r);
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
    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("click", onTabClick);

    const initial = readHashRoute();
    apply(initial, { fromHash: true });
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