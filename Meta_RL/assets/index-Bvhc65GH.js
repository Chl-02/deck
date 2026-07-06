(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function i(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(t){if(t.ep)return;t.ep=!0;const r=i(t);fetch(t.href,r)}})();const d=[["training_log_overview.png","Training log overview"],["evaluation_progress.png","Evaluation progress"],["final_metric_comparison.png","Final metric comparison"],["paired_delta.png","Paired delta"],["episode_soc_fuel_scatter.png","Episode SOC/fuel scatter"],["learned_offset_scatter.png","Learned offset scatter"]];function n(e,a=4){return Number(e).toFixed(a)}function c(e){const a=e.reward_delta>=0,i=e.constraint_delta<=0;return`
    <article class="metric-card">
      <div>
        <h3>${e.split.replace("_"," ")}</h3>
        <p class="subtle">paired adapter minus zero-offset baseline</p>
      </div>
      <dl>
        <div><dt>Reward delta</dt><dd class="${a?"good":"warn"}">${n(e.reward_delta)}</dd></div>
        <div><dt>SOC-corr fuel delta</dt><dd class="${e.soc_corrected_fuel_delta_kg<=0?"good":"warn"}">${n(e.soc_corrected_fuel_delta_kg,5)} kg</dd></div>
        <div><dt>Final SOC err delta</dt><dd>${n(e.final_soc_error_delta,5)}</dd></div>
        <div><dt>Engine switch delta</dt><dd class="${e.engine_switch_delta<=0?"good":"warn"}">${n(e.engine_switch_delta,2)}</dd></div>
        <div><dt>Constraint delta</dt><dd class="${i?"good":"warn"}">${n(e.constraint_delta,2)}</dd></div>
      </dl>
    </article>
  `}async function l(){const e=await fetch("data/dashboard_summary.json").then(i=>i.json()),a=e.run_config;document.querySelector("#app").innerHTML=`
  <section class="topbar">
    <div>
      <p class="eyebrow">HEV Meta-EMS</p>
      <h1>Meta-RL Training Result Dashboard</h1>
    </div>
    <div class="run-chip">6k-step smoke run | z=${a.z_dim} | horizon ${a.horizon}s</div>
  </section>

  <section class="summary-grid">
    ${e.summary_cards.map(c).join("")}
  </section>

  <section class="panel verdict">
    <h2>Result Readout</h2>
    <div class="notes">
      ${e.interpretation.map(i=>`<p>${i}</p>`).join("")}
    </div>
  </section>

  <section class="plot-grid">
    ${d.map(([i,o])=>`
      <figure>
        <img src="plots/${i}" alt="${o}" loading="lazy" />
        <figcaption>${o}</figcaption>
      </figure>
    `).join("")}
  </section>

  <section class="panel artifacts">
    <h2>Artifacts</h2>
    <div class="artifact-links">
      <a href="data/report.md">Report</a>
      <a href="data/training_log.csv">Training log</a>
      <a href="data/evaluation_summary_step_6000.csv">Final summary CSV</a>
      <a href="data/evaluation_episodes_step_6000.csv">Episode CSV</a>
      <a href="data/run_config.json">Run config</a>
    </div>
  </section>
`}l();
