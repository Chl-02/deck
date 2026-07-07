(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))c(e);new MutationObserver(e=>{for(const d of e)if(d.type==="childList")for(const o of d.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&c(o)}).observe(document,{childList:!0,subtree:!0});function r(e){const d={};return e.integrity&&(d.integrity=e.integrity),e.referrerPolicy&&(d.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?d.credentials="include":e.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function c(e){if(e.ep)return;e.ep=!0;const d=r(e);fetch(e.href,d)}})();function a(t,i=4){const r=Number(t);return Number.isFinite(r)?r.toFixed(i):"n/a"}function s(t){const i=Number(t);return Number.isFinite(i)?`${i.toFixed(2)}%`:"n/a"}function n(t,i){const r=Number(t);return Number.isFinite(r)?i==="guardrail"?r>=-2?"good":"warn":r>0?"good":"warn":""}function u(t){return t.replace("_"," ")}function l(t,i){return t.summary.filter(r=>r.split===i).map(r=>`
      <tr>
        <th>${r.label}</th>
        <td>${a(r.baseline_mean,6)}</td>
        <td>${a(r.adapter_mean,6)}</td>
        <td class="${n(r.reduction_pct,r.kind)}">${s(r.reduction_pct)}</td>
        <td>${a(r.delta_mean,6)} ± ${a(r.delta_std,6)}</td>
      </tr>
    `).join("")}function p(t){const i=t.kind==="primary";return`
    <article class="metric-card">
      <div>
        <p class="eyebrow">${u(t.split)}</p>
        <h3>${t.label}</h3>
      </div>
      <dl>
        <div><dt>Baseline</dt><dd>${a(t.baseline_mean,5)}</dd></div>
        <div><dt>Adapter</dt><dd>${a(t.adapter_mean,5)}</dd></div>
        <div><dt>Reduction</dt><dd class="${n(t.reduction_pct,t.kind)}">${s(t.reduction_pct)}</dd></div>
        <div><dt>Paired delta</dt><dd>${a(t.delta_mean,5)}</dd></div>
      </dl>
      <p class="card-note">${i?"Primary claim metric":"Deployment guardrail"}</p>
    </article>
  `}function _(t){return t.heldout_seed_deltas.map(i=>`
      <tr>
        <td>${i.seed}</td>
        <td class="${i.abs_final_SOC_error_delta<=0?"good":"warn"}">${a(i.abs_final_SOC_error_delta,6)}</td>
        <td class="${i.SOC_RMSE_delta<=0?"good":"warn"}">${a(i.SOC_RMSE_delta,6)}</td>
        <td class="${i.constraint_violation_steps_delta<=0?"good":"warn"}">${a(i.constraint_violation_steps_delta,4)}</td>
        <td class="${i.SOC_corrected_fuel_kg_delta<=.002?"good":"warn"}">${a(i.SOC_corrected_fuel_kg_delta,6)}</td>
        <td class="${i.engine_switch_count_delta<=.1?"good":"warn"}">${a(i.engine_switch_count_delta,4)}</td>
      </tr>
    `).join("")}async function f(){const t=await fetch("data/full_run_summary.json").then(e=>e.json()),i=t.summary.filter(e=>e.split==="heldout_evaluation"),r=i.filter(e=>e.kind==="primary"),c=i.filter(e=>e.kind==="guardrail");document.querySelector("#app").innerHTML=`
    <section class="topbar">
      <div>
        <p class="eyebrow">HEV Meta-EMS</p>
        <h1>Meta-RL Full Run Analysis</h1>
        <p class="lead">${t.adapter_boundary}</p>
      </div>
      <div class="run-chip">
        <strong>Completed</strong>
        <span>${t.seeds.length} seeds × ${t.total_steps_per_seed.toLocaleString()} steps</span>
        <span>${t.eval_profiles_per_split} eval profiles per split</span>
      </div>
    </section>

    <section class="panel verdict">
      <div>
        <h2>Result Verdict</h2>
        <p>${t.verdict}</p>
      </div>
      <div class="verdict-grid">
        <div><span>Heldout SOC RMSE</span><strong class="${n(r.find(e=>e.metric==="SOC_RMSE").reduction_pct,"primary")}">${s(r.find(e=>e.metric==="SOC_RMSE").reduction_pct)}</strong></div>
        <div><span>Heldout abs final SOC error</span><strong class="${n(r.find(e=>e.metric==="abs_final_SOC_error").reduction_pct,"primary")}">${s(r.find(e=>e.metric==="abs_final_SOC_error").reduction_pct)}</strong></div>
        <div><span>Heldout constraint steps</span><strong class="${n(r.find(e=>e.metric==="constraint_violation_steps").reduction_pct,"primary")}">${s(r.find(e=>e.metric==="constraint_violation_steps").reduction_pct)}</strong></div>
        <div><span>Fuel guardrail</span><strong class="${n(c.find(e=>e.metric==="SOC_corrected_fuel_kg").reduction_pct,"guardrail")}">${s(c.find(e=>e.metric==="SOC_corrected_fuel_kg").reduction_pct)}</strong></div>
      </div>
    </section>

    <section class="summary-grid">
      ${i.map(p).join("")}
    </section>

    <section class="panel">
      <h2>Aggregate Metrics</h2>
      <div class="tables">
        <div>
          <h3>Heldout Evaluation</h3>
          <table>
            <thead><tr><th>Metric</th><th>Baseline</th><th>Adapter</th><th>Reduction</th><th>Paired delta</th></tr></thead>
            <tbody>${l(t,"heldout_evaluation")}</tbody>
          </table>
        </div>
        <div>
          <h3>Meta Validation</h3>
          <table>
            <thead><tr><th>Metric</th><th>Baseline</th><th>Adapter</th><th>Reduction</th><th>Paired delta</th></tr></thead>
            <tbody>${l(t,"meta_validation")}</tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="plot-grid">
      <figure>
        <img src="${t.plots.reduction_bars}" alt="Final reduction bars" loading="lazy" />
        <figcaption>Final reduction versus zero-offset baseline</figcaption>
      </figure>
      <figure>
        <img src="${t.plots.learning_trend}" alt="Learning trend" loading="lazy" />
        <figcaption>Paired delta learning trend across seeds</figcaption>
      </figure>
      <figure class="wide">
        <img src="${t.plots.seed_deltas}" alt="Heldout seed deltas" loading="lazy" />
        <figcaption>Heldout paired delta by seed</figcaption>
      </figure>
    </section>

    <section class="panel">
      <h2>Heldout Seed Deltas</h2>
      <table>
        <thead>
          <tr>
            <th>Seed</th>
            <th>Abs final SOC err</th>
            <th>SOC RMSE</th>
            <th>Constraint</th>
            <th>SOC-corr fuel</th>
            <th>Engine switches</th>
          </tr>
        </thead>
        <tbody>${_(t)}</tbody>
      </table>
    </section>

    <section class="panel artifacts">
      <h2>Report And Artifacts</h2>
      <div class="artifact-links">
        <a href="${t.report_html_path||t.report_path}">Analysis report</a>
        <a href="${t.report_path}">Markdown report</a>
        <a href="${t.artifacts.aggregate_report}">Aggregate markdown</a>
        <a href="${t.artifacts.metric_summary_csv}">Metric summary CSV</a>
        <a href="${t.artifacts.seed_delta_csv}">Seed deltas CSV</a>
        <a href="${t.artifacts.checkpoint_series_csv}">Checkpoint series CSV</a>
      </div>
    </section>
  `}f();
