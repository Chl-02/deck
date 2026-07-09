(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function a(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=a(i);fetch(i.href,r)}})();function d(e,t=4){const a=Number(e);return Number.isFinite(a)?a.toFixed(t):"n/a"}function f(e){const t=Number(e);return Number.isFinite(t)?`${t.toFixed(2)}%`:"n/a"}function h(e,t){const a=Number(e);return Number.isFinite(a)?t==="guardrail"?a>=-2?"good":"warn":a>0?"good":"warn":""}function O(e){return e.replace("_"," ")}function S(e,t){return e.summary.filter(a=>a.split===t).map(a=>`
      <tr>
        <th>${a.label}</th>
        <td>${d(a.baseline_mean,6)}</td>
        <td>${d(a.adapter_mean,6)}</td>
        <td class="${h(a.reduction_pct,a.kind)}">${f(a.reduction_pct)}</td>
        <td>${d(a.delta_mean,6)} ± ${d(a.delta_std,6)}</td>
      </tr>
    `).join("")}function w(e){const t=e.kind==="primary";return`
    <article class="metric-card">
      <div>
        <p class="eyebrow">${O(e.split)}</p>
        <h3>${e.label}</h3>
      </div>
      <dl>
        <div><dt>Baseline</dt><dd>${d(e.baseline_mean,5)}</dd></div>
        <div><dt>Adapter</dt><dd>${d(e.adapter_mean,5)}</dd></div>
        <div><dt>Reduction</dt><dd class="${h(e.reduction_pct,e.kind)}">${f(e.reduction_pct)}</dd></div>
        <div><dt>Paired delta</dt><dd>${d(e.delta_mean,5)}</dd></div>
      </dl>
      <p class="card-note">${t?"Primary claim metric":"Deployment guardrail"}</p>
    </article>
  `}function R(e){return e.heldout_seed_deltas.map(t=>`
      <tr>
        <td>${t.seed}</td>
        <td class="${t.abs_final_SOC_error_delta<=0?"good":"warn"}">${d(t.abs_final_SOC_error_delta,6)}</td>
        <td class="${t.SOC_RMSE_delta<=0?"good":"warn"}">${d(t.SOC_RMSE_delta,6)}</td>
        <td class="${t.constraint_violation_steps_delta<=0?"good":"warn"}">${d(t.constraint_violation_steps_delta,4)}</td>
        <td class="${t.SOC_corrected_fuel_kg_delta<=.002?"good":"warn"}">${d(t.SOC_corrected_fuel_kg_delta,6)}</td>
        <td class="${t.engine_switch_count_delta<=.1?"good":"warn"}">${d(t.engine_switch_count_delta,4)}</td>
      </tr>
    `).join("")}function P(e,t,a){return e.improvements.find(n=>n.split===t&&n.metric===a)}function b(e,t,a){return e.summary.find(n=>n.split===t&&n.policy===a)}function M(e){var v;const t=e.dp_oracle;if(!t)return"";const a="heldout_evaluation",n=[["abs_final_SOC_error","Abs final SOC error"],["SOC_RMSE","SOC RMSE"],["constraint_violation_steps","Constraint steps"],["SOC_corrected_fuel_kg","SOC-corrected fuel"],["engine_switch_count","Engine switches"]],i=b(t,a,"map_rule_zero_offset")||{},r=b(t,a,"latent_sac_adapter_seed_mean")||{},o=b(t,a,"bounded_offset_dp_oracle")||{},l=b(t,a,"full_power_split_dp_oracle")||{},s=!!l.policy,m=n.map(([g,y])=>{const C=P(t,a,g)||{};return`
      <tr>
        <th>${y}</th>
        <td>${d(i[`${g}_mean`],6)}</td>
        <td>${d(r[`${g}_mean`],6)}</td>
        <td>${d(o[`${g}_mean`],6)}</td>
        ${s?`<td>${d(l[`${g}_mean`],6)}</td>`:""}
        <td>${f(C.capture_ratio_pct)}</td>
      </tr>
    `}).join(""),c=t.plots||{},u=(v=t.metadata)==null?void 0:v.full_power_split_dp;return`
    <section class="panel">
      <h2>Bounded DP Oracle Comparison</h2>
      <p class="lead">Offline discretized bounded-offset DP uses future cycle knowledge but keeps the same adapter authority: only delta_P_eng_on and delta_SOC_ref.${u!=null&&u.enabled?` Full split DP is an offline diagnostic oracle with direct P_eng_target authority (${u.decision_interval_s}s decision interval), so it is not an apples-to-apples adapter comparison.`:""}</p>
      <table>
        <thead><tr><th>Metric</th><th>Baseline</th><th>Adapter mean</th><th>Bounded DP oracle</th>${s?"<th>Full split DP</th>":""}<th>Adapter capture</th></tr></thead>
        <tbody>${m}</tbody>
      </table>
    </section>
    <section class="plot-grid">
      ${c.dp_oracle_metric_bars?`<figure><img src="${c.dp_oracle_metric_bars}" alt="DP oracle metric bars" loading="lazy" /><figcaption>Baseline vs adapter vs DP oracle</figcaption></figure>`:""}
      ${c.dp_oracle_gap_capture?`<figure><img src="${c.dp_oracle_gap_capture}" alt="DP oracle capture ratio" loading="lazy" /><figcaption>Adapter capture of offline DP improvement</figcaption></figure>`:""}
      ${c.dp_oracle_representative_soc?`<figure class="wide"><img src="${c.dp_oracle_representative_soc}" alt="Representative SOC trajectory" loading="lazy" /><figcaption>Representative heldout SOC trajectory</figcaption></figure>`:""}
    </section>
  `}function $(e){return e?`±${d(e.delta_P_eng_on_bound_kw,3)} kW / ±${d(e.delta_SOC_ref_bound,4)} SOC`:"n/a"}function k(e){var r;const t=(r=e.dp_oracle)==null?void 0:r.bound_sweep;if(!t)return"";const a=t.selection||{},n=t.plots||{},i=(t.pareto||[]).filter(o=>o.split==="heldout_evaluation").sort((o,l)=>Number(o.delta_P_eng_on_bound_kw)-Number(l.delta_P_eng_on_bound_kw)||Number(o.delta_SOC_ref_bound)-Number(l.delta_SOC_ref_bound)).map(o=>`
      <tr>
        <th>${$(o)}</th>
        <td>${d(o.SOC_RMSE_mean,6)}</td>
        <td>${d(o.abs_final_SOC_error_mean,6)}</td>
        <td>${d(o.constraint_violation_steps_mean,3)}</td>
        <td>${d(o.SOC_corrected_fuel_kg_mean,6)}</td>
        <td>${d(o.engine_switch_count_mean,3)}</td>
        <td class="${String(o.selection_feasible).toLowerCase()==="true"?"good":"warn"}">${String(o.selection_feasible).toLowerCase()==="true"?"yes":"no"}</td>
        <td>${o.selection_label||""}</td>
      </tr>
    `).join("");return`
    <section class="panel">
      <h2>Action Bound Sweep</h2>
      <p class="lead">Bounded-offset DP sweeps the same calibration-adapter action authority as Meta-RL. Full power-split DP is used only as an offline diagnostic reference, not to inverse power-split decisions into calibration bounds.</p>
      <div class="verdict-grid">
        <div><span>Current bound</span><strong>${$(a.current_bound)}</strong></div>
        <div><span>Recommended bound</span><strong>${$(a.recommended_bound)}</strong></div>
        <div><span>Aggressive bound</span><strong>${$(a.aggressive_bound)}</strong></div>
        <div><span>Current sufficient</span><strong class="${a.current_bound_sufficient?"good":"warn"}">${a.current_bound_sufficient?"yes":"no"}</strong></div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Bound</th><th>SOC RMSE</th><th>Abs final SOC err</th><th>Constraint</th>
            <th>SOC-corr fuel</th><th>Engine switches</th><th>Feasible</th><th>Selection</th>
          </tr>
        </thead>
        <tbody>${i}</tbody>
      </table>
    </section>
    <section class="plot-grid">
      ${n.bound_sweep_heatmap_soc_rmse?`<figure><img src="${n.bound_sweep_heatmap_soc_rmse}" alt="Bound sweep SOC RMSE heatmap" loading="lazy" /><figcaption>Heldout SOC RMSE by action bound</figcaption></figure>`:""}
      ${n.bound_sweep_heatmap_constraint?`<figure><img src="${n.bound_sweep_heatmap_constraint}" alt="Bound sweep constraint heatmap" loading="lazy" /><figcaption>Constraint steps by action bound</figcaption></figure>`:""}
      ${n.bound_sweep_pareto?`<figure><img src="${n.bound_sweep_pareto}" alt="Bound sweep Pareto" loading="lazy" /><figcaption>Pareto/elbow bound selection</figcaption></figure>`:""}
      ${n.bound_sweep_gap_to_full_dp?`<figure><img src="${n.bound_sweep_gap_to_full_dp}" alt="Gap to full DP" loading="lazy" /><figcaption>Gap/capture versus full power-split DP diagnostic</figcaption></figure>`:""}
    </section>
  `}function _(e,t,a,n=6){const i=e.find(r=>r.split==="heldout_evaluation"&&r.controller_group===t)||{};return d(i[`${a}_mean`],n)}function E(e){var o,l,s,m,c,u;const t=e.robustness_reward;if(!t)return"";const a=t.summary||[],n=((s=(l=(o=t.selection)==null?void 0:o.selected)==null?void 0:l.old_adapter)==null?void 0:s.seed)||"n/a",i=((u=(c=(m=t.selection)==null?void 0:m.selected)==null?void 0:c.new_adapter)==null?void 0:u.seed)||"n/a",r=t.plots||{};return`
    <section class="panel">
      <h2>Robustness Reward v2 Re-evaluation</h2>
      <p class="lead">Old reward and robustness-v2 policies are re-evaluated on the same fixed manifest under the normalized robustness-v2 metrics. SOC_corrected_fuel is kept as a guardrail metric, not a reward term.</p>
      <div class="verdict-grid">
        <div><span>Selected old seed</span><strong>${n}</strong></div>
        <div><span>Selected new seed</span><strong>${i}</strong></div>
        <div><span>New SOC tail risk</span><strong>${_(a,"new_adapter","SOC_tail_risk")}</strong></div>
        <div><span>New constraint steps</span><strong>${_(a,"new_adapter","constraint_violation_steps",3)}</strong></div>
      </div>
      <table>
        <thead>
          <tr><th>Controller</th><th>Reward</th><th>SOC tail risk</th><th>SOC RMSE</th><th>Constraint</th><th>SOC-corr fuel</th><th>Engine switches</th></tr>
        </thead>
        <tbody>
          ${["baseline","old_adapter","new_adapter"].map(p=>`
            <tr>
              <th>${p}</th>
              <td>${_(a,p,"episode_reward",4)}</td>
              <td>${_(a,p,"SOC_tail_risk")}</td>
              <td>${_(a,p,"SOC_RMSE")}</td>
              <td>${_(a,p,"constraint_violation_steps",3)}</td>
              <td>${_(a,p,"SOC_corrected_fuel_kg")}</td>
              <td>${_(a,p,"engine_switch_count",3)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
    <section class="plot-grid">
      ${r.metric_bars?`<figure><img src="${r.metric_bars}" alt="Robustness metric bars" loading="lazy" /><figcaption>Heldout robustness metric comparison</figcaption></figure>`:""}
      ${r.seed_deltas?`<figure><img src="${r.seed_deltas}" alt="Robustness seed deltas" loading="lazy" /><figcaption>Seed-level paired deltas under robustness-v2 evaluation</figcaption></figure>`:""}
      ${r.representative_soc?`<figure class="wide"><img src="${r.representative_soc}" alt="Robustness representative SOC" loading="lazy" /><figcaption>Representative heldout SOC trajectory</figcaption></figure>`:""}
    </section>
  `}async function N(){var i,r,o,l;const e=await fetch("data/full_run_summary.json").then(s=>s.json()),t=e.summary.filter(s=>s.split==="heldout_evaluation"),a=t.filter(s=>s.kind==="primary"),n=t.filter(s=>s.kind==="guardrail");document.querySelector("#app").innerHTML=`
    <section class="topbar">
      <div>
        <p class="eyebrow">HEV Meta-EMS</p>
        <h1>Meta-RL Full Run Analysis</h1>
        <p class="lead">${e.adapter_boundary}</p>
      </div>
      <div class="run-chip">
        <strong>Completed</strong>
        <span>${e.seeds.length} seeds × ${e.total_steps_per_seed.toLocaleString()} steps</span>
        <span>${e.eval_profiles_per_split} eval profiles per split</span>
      </div>
    </section>

    <section class="panel verdict">
      <div>
        <h2>Result Verdict</h2>
        <p>${e.verdict}</p>
      </div>
      <div class="verdict-grid">
        <div><span>Heldout SOC RMSE</span><strong class="${h(a.find(s=>s.metric==="SOC_RMSE").reduction_pct,"primary")}">${f(a.find(s=>s.metric==="SOC_RMSE").reduction_pct)}</strong></div>
        <div><span>Heldout abs final SOC error</span><strong class="${h(a.find(s=>s.metric==="abs_final_SOC_error").reduction_pct,"primary")}">${f(a.find(s=>s.metric==="abs_final_SOC_error").reduction_pct)}</strong></div>
        <div><span>Heldout constraint steps</span><strong class="${h(a.find(s=>s.metric==="constraint_violation_steps").reduction_pct,"primary")}">${f(a.find(s=>s.metric==="constraint_violation_steps").reduction_pct)}</strong></div>
        <div><span>Fuel guardrail</span><strong class="${h(n.find(s=>s.metric==="SOC_corrected_fuel_kg").reduction_pct,"guardrail")}">${f(n.find(s=>s.metric==="SOC_corrected_fuel_kg").reduction_pct)}</strong></div>
      </div>
    </section>

    <section class="summary-grid">
      ${t.map(w).join("")}
    </section>

    <section class="panel">
      <h2>Aggregate Metrics</h2>
      <div class="tables">
        <div>
          <h3>Heldout Evaluation</h3>
          <table>
            <thead><tr><th>Metric</th><th>Baseline</th><th>Adapter</th><th>Reduction</th><th>Paired delta</th></tr></thead>
            <tbody>${S(e,"heldout_evaluation")}</tbody>
          </table>
        </div>
        <div>
          <h3>Meta Validation</h3>
          <table>
            <thead><tr><th>Metric</th><th>Baseline</th><th>Adapter</th><th>Reduction</th><th>Paired delta</th></tr></thead>
            <tbody>${S(e,"meta_validation")}</tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="plot-grid">
      <figure>
        <img src="${e.plots.reduction_bars}" alt="Final reduction bars" loading="lazy" />
        <figcaption>Final reduction versus zero-offset baseline</figcaption>
      </figure>
      <figure>
        <img src="${e.plots.learning_trend}" alt="Learning trend" loading="lazy" />
        <figcaption>Paired delta learning trend across seeds</figcaption>
      </figure>
      <figure class="wide">
        <img src="${e.plots.seed_deltas}" alt="Heldout seed deltas" loading="lazy" />
        <figcaption>Heldout paired delta by seed</figcaption>
      </figure>
    </section>

    ${M(e)}
    ${k(e)}
    ${E(e)}

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
        <tbody>${R(e)}</tbody>
      </table>
    </section>

    <section class="panel artifacts">
      <h2>Report And Artifacts</h2>
      <div class="artifact-links">
        <a href="${e.report_html_path||e.report_path}">Analysis report</a>
        ${e.controller_comparison_report_path?`<a href="${e.controller_comparison_report_path}">Controller comparison</a>`:""}
        ${e.robustness_reward_report_path?`<a href="${e.robustness_reward_report_path}">Robustness reward report</a>`:""}
        <a href="${e.report_path}">Markdown report</a>
        <a href="${e.artifacts.aggregate_report}">Aggregate markdown</a>
        <a href="${e.artifacts.metric_summary_csv}">Metric summary CSV</a>
        <a href="${e.artifacts.seed_delta_csv}">Seed deltas CSV</a>
        <a href="${e.artifacts.checkpoint_series_csv}">Checkpoint series CSV</a>
        ${e.artifacts.controller_representative_trajectory_csv?`<a href="${e.artifacts.controller_representative_trajectory_csv}">Controller trajectory CSV</a>`:""}
        ${e.dp_oracle?'<a href="data/dp_oracle_paired_improvements.csv">DP oracle CSV</a>':""}
        ${(r=(i=e.dp_oracle)==null?void 0:i.artifacts)!=null&&r["dp_oracle_full_power_split_improvements.csv"]?'<a href="data/dp_oracle_full_power_split_improvements.csv">Full split DP CSV</a>':""}
        ${(o=e.dp_oracle)!=null&&o.bound_sweep?'<a href="data/bound_sweep_summary.csv">Bound sweep summary CSV</a>':""}
        ${(l=e.dp_oracle)!=null&&l.bound_sweep?'<a href="data/bound_sweep_selection.json">Bound sweep selection JSON</a>':""}
        ${e.robustness_reward?'<a href="data/robustness_comparison_summary_metrics.csv">Robustness summary CSV</a>':""}
        ${e.robustness_reward?'<a href="data/robustness_comparison_paired_deltas.csv">Robustness paired deltas CSV</a>':""}
      </div>
    </section>
  `}N();
