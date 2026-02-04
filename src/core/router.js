// src/core/router.js
export function createRouter({ defaultRoute = "daily", tabsSelector = ".tab", onRoute }) {
  const routes = new Set(["daily", "learn", "speak", "explore", "stats", "settings"]);

  function normalize(r) {
    const x = String(r || "").replace(/^#\/?/, "").trim();
    return routes.has(x) ? x : defaultRoute;
  }

  function getHashRoute() {
    return normalize(location.hash || `#/${defaultRoute}`);
  }

  function setRoute(route) {
    const r = normalize(route);
    if (location.hash !== `#/${r}`) location.hash = `#/${r}`;
    updateTabs(r);
    onRoute?.(r);
  }

  function updateTabs(route) {
    document.querySelectorAll(tabsSelector).forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.route === route);
    });
  }

  function bindTabs() {
    document.querySelectorAll(tabsSelector).forEach((btn) => {
      btn.addEventListener("click", () => setRoute(btn.dataset.route));
    });
  }

  function start() {
    bindTabs();
    const initial = getHashRoute();
    updateTabs(initial);
    onRoute?.(initial);

    window.addEventListener("hashchange", () => {
      const r = getHashRoute();
      updateTabs(r);
      onRoute?.(r);
    });
  }

  return { start, setRoute };
}
