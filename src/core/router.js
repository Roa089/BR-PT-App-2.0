// src/core/router.js
/* =========================================
   Router 2.0 — Hash Router + Tab Binding
   Vanilla JS • iPhone-first
   ========================================= */

const DEFAULT_ROUTES = ["daily", "learn", "speak", "explore", "stats", "settings"];

export function createRouter({
  routes = DEFAULT_ROUTES,
  defaultRoute = "daily",
  tabsSelector = ".tab",
  onRouteChange
} = {}) {
  const routeSet = new Set(routes);

  function normalize(r) {
    const x = String(r || "").replace(/^#\/?/, "").trim();
    return routeSet.has(x) ? x : defaultRoute;
  }

  function getRouteFromHash() {
    return normalize(location.hash || `#/${defaultRoute}`);
  }

  function setRoute(route, { replace = false } = {}) {
    const r = normalize(route);
    const nextHash = `#/${r}`;
    if (replace) history.replaceState(null, "", nextHash);
    else if (location.hash !== nextHash) location.hash = nextHash;

    updateTabs(r);
    onRouteChange?.(r);
    return r;
  }

  function updateTabs(route) {
    document.querySelectorAll(tabsSelector).forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.route === route);
      btn.setAttribute("aria-current", btn.dataset.route === route ? "page" : "false");
    });
  }

  function bindTabs() {
    document.querySelectorAll(tabsSelector).forEach((btn) => {
      btn.addEventListener("click", () => setRoute(btn.dataset.route));
    });
  }

  function start() {
    bindTabs();

    const initial = getRouteFromHash();
    updateTabs(initial);
    onRouteChange?.(initial);

    window.addEventListener("hashchange", () => {
      const r = getRouteFromHash();
      updateTabs(r);
      onRouteChange?.(r);
    });

    // Ensure hash exists
    if (!location.hash) setRoute(defaultRoute, { replace: true });
  }

  return {
    start,
    setRoute,
    getRoute: getRouteFromHash,
    updateTabs,
    routes
  };
}
