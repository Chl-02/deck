(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function r(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(a){if(a.ep)return;a.ep=!0;const s=r(a);fetch(a.href,s)}})();function i(t,e=4){const r=Number(t);return Number.isFinite(r)?r.toFixed(e):"n/a"}function d(t){const e=Number(t);return Number.isFinite(e)?`${e.toFixed(2)}%`:"n/a"}function c(t,e){const r=Number(t);return Number.isFinite(r)?e==="guardrail"?r>=-2?"good":"warn":r>0?"good":"warn":""}function m(t){return t.replace("_"," ")}function _(t,e){return t.summary.filter(r=>r.split===e).map(r=>`
      <tr>
        <th>${r.label}</th>
        <td>${i(r.baseline_mean,6)}</td>
        <td>${i(r.adapter_mean,6)}</td>
        <td class="${c(r.reduction_pct,r.kind)}">${d(r.reduction_pct)}</td>
        <td>${i(r.delta_mean,6)} ± ${i(r.delta_std,6)}</td>
      </tr>
    `).join("")}function $(t){const e=t.kind==="primary";return`
    <article class="metric-card">
      <div>
        <p class="eyebrow">${m(t.split)}</p>
        <h3>${t.label}</h3>
      </div>
      <dl>
        <div><dt>Baseline</dt><dd>${i(t.baseline_mean,5)}</dd></div>
        <div><dt>Adapter</dt><dd>${i(t.adapter_mean,5)}</dd></div>
        <div><dt>Reduction</dt><dd class="${c(t.reduction_pct,t.kind)}">${d(t.reduction_pct)}</dd></div>
        <div><dt>Paired delta</dt><dd>${i(t.delta_mean,5)}</dd></div>
      </dl>
      <p class="card-note">${e?"Primary claim metric":"Deployment guardrail"}</p>
    </article>
  `}function v(t){return t.heldout_seed_deltas.map(e=>`
      <tr>
        <td>${e.seed}</td>
        <td class="${e.abs_final_SOC_error_delta<=0?"good":"warn"}">${i(e.abs_final_SOC_error_delta,6)}</td>
        <td class="${e.SOC_RMSE_delta<=0?"good":"warn"}">${i(e.SOC_RMSE_delta,6)}</td>
        <td class="${e.constraint_violation_steps_delta<=0?"good":"warn"}">${i(e.constraint_violation_steps_delta,4)}</td>
        <td class="${e.SOC_corrected_fuel_kg_delta<=.002?"good":"warn"}">${i(e.SOC_corrected_fuel_kg_delta,6)}</td>
        <td class="${e.engine_switch_count_delta<=.1?"good":"warn"}">${i(e.engine_switch_count_delta,4)}</td>
      </tr>
    `).join("")}function y(t,e,r){return t.improvements.find(n=>n.split===e&&n.metric===r)}function u(t,e,r){return t.summary.find(n=>n.split===e&&n.policy===r)}function b(t){const e=t.dp_oracle;if(!e)return"";const r="heldout_evaluation",n=[["abs_final_SOC_error","Abs final SOC error"],["SOC_RMSE","SOC RMSE"],["constraint_violation_steps","Constraint steps"],["SOC_corrected_fuel_kg","SOC-corrected fuel"],["engine_switch_count","Engine switches"]],a=u(e,r,"map_rule_zero_offset")||{},s=u(e,r,"latent_sac_adapter_seed_mean")||{},l=u(e,r,"bounded_offset_dp_oracle")||{},f=n.map(([p,h])=>{const g=y(e,r,p)||{};return`
      <tr>
        <th>${h}</th>
        <td>${i(a[`${p}_mean`],6)}</td>
        <td>${i(s[`${p}_mean`],6)}</td>
        <td>${i(l[`${p}_mean`],6)}</td>
        <td>${d(g.capture_ratio_pct)}</td>
      </tr>
    `}).join(""),o=e.plots||{};return`
    <section class="panel">
      <h2>Bounded DP Oracle Comparison</h2>
      <p class="lead">Offline discretized bounded-offset DP uses future cycle knowledge but keeps the same adapter authority: only delta_P_eng_on and delta_SOC_ref.</p>
      <table>
        <thead><tr><th>Metric</th><th>Baseline</th><th>Adapter mean</th><th>DP oracle</th><th>Adapter capture</th></tr></thead>
        <tbody>${f}</tbody>
      </table>
    </section>
    <section class="plot-grid">
      ${o.dp_oracle_metric_bars?`<figure><img src="${o.dp_oracle_metric_bars}" alt="DP oracle metric bars" loading="lazy" /><figcaption>Baseline vs adapter vs DP oracle</figcaption></figure>`:""}
      ${o.dp_oracle_gap_capture?`<figure><img src="${o.dp_oracle_gap_capture}" alt="DP oracle capture ratio" loading="lazy" /><figcaption>Adapter capture of offline DP improvement</figcaption></figure>`:""}
      ${o.dp_oracle_representative_soc?`<figure class="wide"><img src="${o.dp_oracle_representative_soc}" alt="Representative SOC trajectory" loading="lazy" /><figcaption>Representative heldout SOC trajectory</figcaption></figure>`:""}
    </section>
  `}async function S(){const t=await fetch("data/full_run_summary.json").then(a=>a.json()),e=t.summary.filter(a=>a.split==="heldout_evaluation"),r=e.filter(a=>a.kind==="primary"),n=e.filter(a=>a.kind==="guardrail");document.querySelector("#app").innerHTML=`
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
        <div><span>Heldout SOC RMSE</span><strong class="${c(r.find(a=>a.metric==="SOC_RMSE").reduction_pct,"primary")}">${d(r.find(a=>a.metric==="SOC_RMSE").reduction_pct)}</strong></div>
        <div><span>Heldout abs final SOC error</span><strong class="${c(r.find(a=>a.metric==="abs_final_SOC_error").reduction_pct,"primary")}">${d(r.find(a=>a.metric==="abs_final_SOC_error").reduction_pct)}</strong></div>
        <div><span>Heldout constraint steps</span><strong class="${c(r.find(a=>a.metric==="constraint_violation_steps").reduction_pct,"primary")}">${d(r.find(a=>a.metric==="constraint_violation_steps").reduction_pct)}</strong></div>
        <div><span>Fuel guardrail</span><strong class="${c(n.find(a=>a.metric==="SOC_corrected_fuel_kg").reduction_pct,"guardrail")}">${d(n.find(a=>a.metric==="SOC_corrected_fuel_kg").reduction_pct)}</strong></div>
      </div>
    </section>

    <section class="summary-grid">
      ${e.map($).join("")}
    </section>

    <section class="panel">
      <h2>Aggregate Metrics</h2>
      <div class="tables">
        <div>
          <h3>Heldout Evaluation</h3>
          <table>
            <thead><tr><th>Metric</th><th>Baseline</th><th>Adapter</th><th>Reduction</th><th>Paired delta</th></tr></thead>
            <tbody>${_(t,"heldout_evaluation")}</tbody>
          </table>
        </div>
        <div>
          <h3>Meta Validation</h3>
          <table>
            <thead><tr><th>Metric</th><th>Baseline</th><th>Adapter</th><th>Reduction</th><th>Paired delta</th></tr></thead>
            <tbody>${_(t,"meta_validation")}</tbody>
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

    ${b(t)}

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
        <tbody>${v(t)}</tbody>
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
        ${t.dp_oracle?'<a href="data/dp_oracle_paired_improvements.csv">DP oracle CSV</a>':""}
      </div>
    </section>
  `}S();
