// src/features/stats/stats.view.js
/* =========================================
   Stats View 2.0
   - 3 KPIs
   - Weekly XP bars
   - Mastery donut (SVG)
   ========================================= */

export function renderStatsView(model) {
  const { kpis, week, mastery } = model;

  const maxXP = Math.max(1, ...week.map(d => d.xp));
  const bars = week.map((d) => {
    const h = Math.round((d.xp / maxXP) * 46);
    const lbl = d.dayKey.slice(5); // MM-DD
    return `
      <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:6px;">
        <div style="width:12px; height:52px; border-radius:999px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.04); display:flex; align-items:flex-end; overflow:hidden;">
          <div style="width:100%; height:${h}px; background:rgba(34,197,94,.35); border-top:1px solid rgba(34,197,94,.55);"></div>
        </div>
        <div class="small muted">${lbl}</div>
      </div>
    `;
  }).join("");

  const donut = renderDonut(mastery.ratio);

  return `
    <div class="card">
      <div class="title">📈 Stats</div>
      <div class="muted">Wenig, aber aussagekräftig.</div>
      <hr/>

      <div class="row">
        ${kpiCard("XP gesamt", kpis.xpTotal)}
        ${kpiCard("Streak", `${kpis.streak} 🔥`)}
        ${kpiCard("Heute XP", kpis.todayXP)}
      </div>
    </div>

    <div class="card">
      <div class="row" style="justify-content:space-between;">
        <div class="title" style="margin:0;">Letzte 7 Tage</div>
        <div class="pill">Max: ${maxXP} XP</div>
      </div>
      <div style="display:flex; gap:10px; margin-top:14px; align-items:flex-end;">
        ${bars}
      </div>
    </div>

    <div class="card">
      <div class="row" style="justify-content:space-between; align-items:center;">
        <div>
          <div class="title" style="margin:0;">Mastery</div>
          <div class="muted">Grobe Schätzung: Verstehen + Produzieren.</div>
        </div>
        <div style="width:110px; height:110px;">
          ${donut}
        </div>
      </div>

      <hr/>
      <div class="row">
        <div class="pill">Mastered: <b>${mastery.mastered}</b></div>
        <div class="pill">Deck: <b>${mastery.deckSize}</b></div>
        <div class="pill">Rate: <b>${Math.round(mastery.ratio * 100)}%</b></div>
      </div>
    </div>
  `;
}

function kpiCard(label, value) {
  return `
    <div class="card" style="flex:1; margin:0; min-width:160px;">
      <div class="small muted">${escapeHtml(label)}</div>
      <div class="title" style="margin:8px 0 0;">${escapeHtml(String(value))}</div>
    </div>
  `;
}

function renderDonut(ratio) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const filled = c * clamp(ratio, 0, 1);
  const empty = c - filled;

  return `
    <svg viewBox="0 0 120 120" width="110" height="110" aria-label="Mastery donut">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.2" result="b"/>
          <feMerge>
            <feMergeNode in="b"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <circle cx="60" cy="60" r="${r}" fill="none" stroke="rgba(255,255,255,.10)" stroke-width="14"/>
      <g transform="rotate(-90 60 60)" filter="url(#glow)">
        <circle cx="60" cy="60" r="${r}" fill="none"
          stroke="rgba(34,197,94,.60)" stroke-width="14"
          stroke-linecap="round"
          stroke-dasharray="${filled} ${empty}"
        />
      </g>
      <text x="60" y="64" text-anchor="middle" font-size="18" fill="rgba(244,246,255,.92)" font-weight="900">
        ${Math.round(ratio * 100)}%
      </text>
    </svg>
  `;
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
