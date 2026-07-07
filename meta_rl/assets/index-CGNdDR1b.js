(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const d of o)if(d.type==="childList")for(const n of d.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function a(o){const d={};return o.integrity&&(d.integrity=o.integrity),o.referrerPolicy&&(d.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?d.credentials="include":o.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function s(o){if(o.ep)return;o.ep=!0;const d=a(o);fetch(o.href,d)}})();function i(t,e=4){const a=Number(t);return Number.isFinite(a)?a.toFixed(e):"n/a"}function c(t){const e=Number(t);return Number.isFinite(e)?`${e.toFixed(2)}%`:"n/a"}function _(t,e){const a=Number(t);return Number.isFinite(a)?e==="guardrail"?a>=-2?"good":"warn":a>0?"good":"warn":""}function S(t){return t.replace("_"," ")}function $(t,e){return t.summary.filter(a=>a.split===e).map(a=>`
      <tr>
        <th>${a.label}</th>
        <td>${i(a.baseline_mean,6)}</td>
        <td>${i(a.adapter_mean,6)}</td>
        <td class="${_(a.reduction_pct,a.kind)}">${c(a.reduction_pct)}</td>
        <td>${i(a.delta_mean,6)} ± ${i(a.delta_std,6)}</td>
      </tr>
    `).join("")}function C(t){const e=t.kind==="primary";return`
    <article class="metric-card">
      <div>
        <p class="eyebrow">${S(t.split)}</p>
        <h3>${t.label}</h3>
      </div>
      <dl>
        <div><dt>Baseline</dt><dd>${i(t.baseline_mean,5)}</dd></div>
        <div><dt>Adapter</dt><dd>${i(t.adapter_mean,5)}</dd></div>
        <div><dt>Reduction</dt><dd class="${_(t.reduction_pct,t.kind)}">${c(t.reduction_pct)}</dd></div>
        <div><dt>Paired delta</dt><dd>${i(t.delta_mean,5)}</dd></div>
      </dl>
      <p class="card-note">${e?"Primary claim metric":"Deployment guardrail"}</p>
    </article>
  `}function O(t){return t.heldout_seed_deltas.map(e=>`
      <tr>
        <td>${e.seed}</td>
        <td class="${e.abs_final_SOC_error_delta<=0?"good":"warn"}">${i(e.abs_final_SOC_error_delta,6)}</td>
        <td class="${e.SOC_RMSE_delta<=0?"good":"warn"}">${i(e.SOC_RMSE_delta,6)}</td>
        <td class="${e.constraint_violation_steps_delta<=0?"good":"warn"}">${i(e.constraint_violation_steps_delta,4)}</td>
        <td class="${e.SOC_corrected_fuel_kg_delta<=.002?"good":"warn"}">${i(e.SOC_corrected_fuel_kg_delta,6)}</td>
        <td class="${e.engine_switch_count_delta<=.1?"good":"warn"}">${i(e.engine_switch_count_delta,4)}</td>
      </tr>
    `).join("")}function P(t,e,a){return t.improvements.find(s=>s.split===e&&s.metric===a)}function g(t,e,a){return t.summary.find(s=>s.split===e&&s.policy===a)}function w(t){var m;const e=t.dp_oracle;if(!e)return"";const a="heldout_evaluation",s=[["abs_final_SOC_error","Abs final SOC error"],["SOC_RMSE","SOC RMSE"],["constraint_violation_steps","Constraint steps"],["SOC_corrected_fuel_kg","SOC-corrected fuel"],["engine_switch_count","Engine switches"]],o=g(e,a,"map_rule_zero_offset")||{},d=g(e,a,"latent_sac_adapter_seed_mean")||{},n=g(e,a,"bounded_offset_dp_oracle")||{},l=g(e,a,"full_power_split_dp_oracle")||{},r=!!l.policy,b=s.map(([u,v])=>{const y=P(e,a,u)||{};return`
      <tr>
        <th>${v}</th>
        <td>${i(o[`${u}_mean`],6)}</td>
        <td>${i(d[`${u}_mean`],6)}</td>
        <td>${i(n[`${u}_mean`],6)}</td>
        ${r?`<td>${i(l[`${u}_mean`],6)}</td>`:""}
        <td>${c(y.capture_ratio_pct)}</td>
      </tr>
    `}).join(""),p=e.plots||{},f=(m=e.metadata)==null?void 0:m.full_power_split_dp;return`
    <section class="panel">
      <h2>Bounded DP Oracle Comparison</h2>
      <p class="lead">Offline discretized bounded-offset DP uses future cycle knowledge but keeps the same adapter authority: only delta_P_eng_on and delta_SOC_ref.${f!=null&&f.enabled?` Full split DP is an offline diagnostic oracle with direct P_eng_target authority (${f.decision_interval_s}s decision interval), so it is not an apples-to-apples adapter comparison.`:""}</p>
      <table>
        <thead><tr><th>Metric</th><th>Baseline</th><th>Adapter mean</th><th>Bounded DP oracle</th>${r?"<th>Full split DP</th>":""}<th>Adapter capture</th></tr></thead>
        <tbody>${b}</tbody>
      </table>
    </section>
    <section class="plot-grid">
      ${p.dp_oracle_metric_bars?`<figure><img src="${p.dp_oracle_metric_bars}" alt="DP oracle metric bars" loading="lazy" /><figcaption>Baseline vs adapter vs DP oracle</figcaption></figure>`:""}
      ${p.dp_oracle_gap_capture?`<figure><img src="${p.dp_oracle_gap_capture}" alt="DP oracle capture ratio" loading="lazy" /><figcaption>Adapter capture of offline DP improvement</figcaption></figure>`:""}
      ${p.dp_oracle_representative_soc?`<figure class="wide"><img src="${p.dp_oracle_representative_soc}" alt="Representative SOC trajectory" loading="lazy" /><figcaption>Representative heldout SOC trajectory</figcaption></figure>`:""}
    </section>
  `}function h(t){return t?`±${i(t.delta_P_eng_on_bound_kw,3)} kW / ±${i(t.delta_SOC_ref_bound,4)} SOC`:"n/a"}function R(t){var d;const e=(d=t.dp_oracle)==null?void 0:d.bound_sweep;if(!e)return"";const a=e.selection||{},s=e.plots||{},o=(e.pareto||[]).filter(n=>n.split==="heldout_evaluation").sort((n,l)=>Number(n.delta_P_eng_on_bound_kw)-Number(l.delta_P_eng_on_bound_kw)||Number(n.delta_SOC_ref_bound)-Number(l.delta_SOC_ref_bound)).map(n=>`
      <tr>
        <th>${h(n)}</th>
        <td>${i(n.SOC_RMSE_mean,6)}</td>
        <td>${i(n.abs_final_SOC_error_mean,6)}</td>
        <td>${i(n.constraint_violation_steps_mean,3)}</td>
        <td>${i(n.SOC_corrected_fuel_kg_mean,6)}</td>
        <td>${i(n.engine_switch_count_mean,3)}</td>
        <td class="${String(n.selection_feasible).toLowerCase()==="true"?"good":"warn"}">${String(n.selection_feasible).toLowerCase()==="true"?"yes":"no"}</td>
        <td>${n.selection_label||""}</td>
      </tr>
    `).join("");return`
    <section class="panel">
      <h2>Action Bound Sweep</h2>
      <p class="lead">Bounded-offset DP sweeps the same calibration-adapter action authority as Meta-RL. Full power-split DP is used only as an offline diagnostic reference, not to inverse power-split decisions into calibration bounds.</p>
      <div class="verdict-grid">
        <div><span>Current bound</span><strong>${h(a.current_bound)}</strong></div>
        <div><span>Recommended bound</span><strong>${h(a.recommended_bound)}</strong></div>
        <div><span>Aggressive bound</span><strong>${h(a.aggressive_bound)}</strong></div>
        <div><span>Current sufficient</span><strong class="${a.current_bound_sufficient?"good":"warn"}">${a.current_bound_sufficient?"yes":"no"}</strong></div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Bound</th><th>SOC RMSE</th><th>Abs final SOC err</th><th>Constraint</th>
            <th>SOC-corr fuel</th><th>Engine switches</th><th>Feasible</th><th>Selection</th>
          </tr>
        </thead>
        <tbody>${o}</tbody>
      </table>
    </section>
    <section class="plot-grid">
      ${s.bound_sweep_heatmap_soc_rmse?`<figure><img src="${s.bound_sweep_heatmap_soc_rmse}" alt="Bound sweep SOC RMSE heatmap" loading="lazy" /><figcaption>Heldout SOC RMSE by action bound</figcaption></figure>`:""}
      ${s.bound_sweep_heatmap_constraint?`<figure><img src="${s.bound_sweep_heatmap_constraint}" alt="Bound sweep constraint heatmap" loading="lazy" /><figcaption>Constraint steps by action bound</figcaption></figure>`:""}
      ${s.bound_sweep_pareto?`<figure><img src="${s.bound_sweep_pareto}" alt="Bound sweep Pareto" loading="lazy" /><figcaption>Pareto/elbow bound selection</figcaption></figure>`:""}
      ${s.bound_sweep_gap_to_full_dp?`<figure><img src="${s.bound_sweep_gap_to_full_dp}" alt="Gap to full DP" loading="lazy" /><figcaption>Gap/capture versus full power-split DP diagnostic</figcaption></figure>`:""}
    </section>
  `}async function M(){var o,d,n,l;const t=await fetch("data/full_run_summary.json").then(r=>r.json()),e=t.summary.filter(r=>r.split==="heldout_evaluation"),a=e.filter(r=>r.kind==="primary"),s=e.filter(r=>r.kind==="guardrail");document.querySelector("#app").innerHTML=`
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
        <div><span>Heldout SOC RMSE</span><strong class="${_(a.find(r=>r.metric==="SOC_RMSE").reduction_pct,"primary")}">${c(a.find(r=>r.metric==="SOC_RMSE").reduction_pct)}</strong></div>
        <div><span>Heldout abs final SOC error</span><strong class="${_(a.find(r=>r.metric==="abs_final_SOC_error").reduction_pct,"primary")}">${c(a.find(r=>r.metric==="abs_final_SOC_error").reduction_pct)}</strong></div>
        <div><span>Heldout constraint steps</span><strong class="${_(a.find(r=>r.metric==="constraint_violation_steps").reduction_pct,"primary")}">${c(a.find(r=>r.metric==="constraint_violation_steps").reduction_pct)}</strong></div>
        <div><span>Fuel guardrail</span><strong class="${_(s.find(r=>r.metric==="SOC_corrected_fuel_kg").reduction_pct,"guardrail")}">${c(s.find(r=>r.metric==="SOC_corrected_fuel_kg").reduction_pct)}</strong></div>
      </div>
    </section>

    <section class="summary-grid">
      ${e.map(C).join("")}
    </section>

    <section class="panel">
      <h2>Aggregate Metrics</h2>
      <div class="tables">
        <div>
          <h3>Heldout Evaluation</h3>
          <table>
            <thead><tr><th>Metric</th><th>Baseline</th><th>Adapter</th><th>Reduction</th><th>Paired delta</th></tr></thead>
            <tbody>${$(t,"heldout_evaluation")}</tbody>
          </table>
        </div>
        <div>
          <h3>Meta Validation</h3>
          <table>
            <thead><tr><th>Metric</th><th>Baseline</th><th>Adapter</th><th>Reduction</th><th>Paired delta</th></tr></thead>
            <tbody>${$(t,"meta_validation")}</tbody>
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

    ${w(t)}
    ${R(t)}

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
        <tbody>${O(t)}</tbody>
      </table>
    </section>

    <section class="panel artifacts">
      <h2>Report And Artifacts</h2>
      <div class="artifact-links">
        <a href="${t.report_html_path||t.report_path}">Analysis report</a>
        ${t.controller_comparison_report_path?`<a href="${t.controller_comparison_report_path}">Controller comparison</a>`:""}
        <a href="${t.report_path}">Markdown report</a>
        <a href="${t.artifacts.aggregate_report}">Aggregate markdown</a>
        <a href="${t.artifacts.metric_summary_csv}">Metric summary CSV</a>
        <a href="${t.artifacts.seed_delta_csv}">Seed deltas CSV</a>
        <a href="${t.artifacts.checkpoint_series_csv}">Checkpoint series CSV</a>
        ${t.artifacts.controller_representative_trajectory_csv?`<a href="${t.artifacts.controller_representative_trajectory_csv}">Controller trajectory CSV</a>`:""}
        ${t.dp_oracle?'<a href="data/dp_oracle_paired_improvements.csv">DP oracle CSV</a>':""}
        ${(d=(o=t.dp_oracle)==null?void 0:o.artifacts)!=null&&d["dp_oracle_full_power_split_improvements.csv"]?'<a href="data/dp_oracle_full_power_split_improvements.csv">Full split DP CSV</a>':""}
        ${(n=t.dp_oracle)!=null&&n.bound_sweep?'<a href="data/bound_sweep_summary.csv">Bound sweep summary CSV</a>':""}
        ${(l=t.dp_oracle)!=null&&l.bound_sweep?'<a href="data/bound_sweep_selection.json">Bound sweep selection JSON</a>':""}
      </div>
    </section>
  `}M();
