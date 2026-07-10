(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function a(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=a(i);fetch(i.href,r)}})();function d(t,e=4){const a=Number(t);return Number.isFinite(a)?a.toFixed(e):"n/a"}function f(t){const e=Number(t);return Number.isFinite(e)?`${e.toFixed(2)}%`:"n/a"}function g(t,e){const a=Number(t);return Number.isFinite(a)?e==="guardrail"?a>=-2?"good":"warn":a>0?"good":"warn":""}function w(t){return t.replace("_"," ")}function S(t,e){return t.summary.filter(a=>a.split===e).map(a=>`
      <tr>
        <th>${a.label}</th>
        <td>${d(a.baseline_mean,6)}</td>
        <td>${d(a.adapter_mean,6)}</td>
        <td class="${g(a.reduction_pct,a.kind)}">${f(a.reduction_pct)}</td>
        <td>${d(a.delta_mean,6)} ± ${d(a.delta_std,6)}</td>
      </tr>
    `).join("")}function R(t){const e=t.kind==="primary";return`
    <article class="metric-card">
      <div>
        <p class="eyebrow">${w(t.split)}</p>
        <h3>${t.label}</h3>
      </div>
      <dl>
        <div><dt>Baseline</dt><dd>${d(t.baseline_mean,5)}</dd></div>
        <div><dt>Adapter</dt><dd>${d(t.adapter_mean,5)}</dd></div>
        <div><dt>Reduction</dt><dd class="${g(t.reduction_pct,t.kind)}">${f(t.reduction_pct)}</dd></div>
        <div><dt>Paired delta</dt><dd>${d(t.delta_mean,5)}</dd></div>
      </dl>
      <p class="card-note">${e?"Primary claim metric":"Deployment guardrail"}</p>
    </article>
  `}function P(t){return t.heldout_seed_deltas.map(e=>`
      <tr>
        <td>${e.seed}</td>
        <td class="${e.abs_final_SOC_error_delta<=0?"good":"warn"}">${d(e.abs_final_SOC_error_delta,6)}</td>
        <td class="${e.SOC_RMSE_delta<=0?"good":"warn"}">${d(e.SOC_RMSE_delta,6)}</td>
        <td class="${e.constraint_violation_steps_delta<=0?"good":"warn"}">${d(e.constraint_violation_steps_delta,4)}</td>
        <td class="${e.SOC_corrected_fuel_kg_delta<=.002?"good":"warn"}">${d(e.SOC_corrected_fuel_kg_delta,6)}</td>
        <td class="${e.engine_switch_count_delta<=.1?"good":"warn"}">${d(e.engine_switch_count_delta,4)}</td>
      </tr>
    `).join("")}function M(t,e,a){return t.improvements.find(n=>n.split===e&&n.metric===a)}function b(t,e,a){return t.summary.find(n=>n.split===e&&n.policy===a)}function j(t){var y;const e=t.dp_oracle;if(!e)return"";const a="heldout_evaluation",n=[["abs_final_SOC_error","Abs final SOC error"],["SOC_RMSE","SOC RMSE"],["constraint_violation_steps","Constraint steps"],["SOC_corrected_fuel_kg","SOC-corrected fuel"],["engine_switch_count","Engine switches"]],i=b(e,a,"map_rule_zero_offset")||{},r=b(e,a,"latent_sac_adapter_seed_mean")||{},s=b(e,a,"bounded_offset_dp_oracle")||{},c=b(e,a,"full_power_split_dp_oracle")||{},o=!!c.policy,$=n.map(([m,C])=>{const O=M(e,a,m)||{};return`
      <tr>
        <th>${C}</th>
        <td>${d(i[`${m}_mean`],6)}</td>
        <td>${d(r[`${m}_mean`],6)}</td>
        <td>${d(s[`${m}_mean`],6)}</td>
        ${o?`<td>${d(c[`${m}_mean`],6)}</td>`:""}
        <td>${f(O.capture_ratio_pct)}</td>
      </tr>
    `}).join(""),l=e.plots||{},u=(y=e.metadata)==null?void 0:y.full_power_split_dp;return`
    <section class="panel">
      <h2>Bounded DP Oracle Comparison</h2>
      <p class="lead">Offline discretized bounded-offset DP uses future cycle knowledge but keeps the same adapter authority: only delta_P_eng_on and delta_SOC_ref.${u!=null&&u.enabled?` Full split DP is an offline diagnostic oracle with direct P_eng_target authority (${u.decision_interval_s}s decision interval), so it is not an apples-to-apples adapter comparison.`:""}</p>
      <table>
        <thead><tr><th>Metric</th><th>Baseline</th><th>Adapter mean</th><th>Bounded DP oracle</th>${o?"<th>Full split DP</th>":""}<th>Adapter capture</th></tr></thead>
        <tbody>${$}</tbody>
      </table>
    </section>
    <section class="plot-grid">
      ${l.dp_oracle_metric_bars?`<figure><img src="${l.dp_oracle_metric_bars}" alt="DP oracle metric bars" loading="lazy" /><figcaption>Baseline vs adapter vs DP oracle</figcaption></figure>`:""}
      ${l.dp_oracle_gap_capture?`<figure><img src="${l.dp_oracle_gap_capture}" alt="DP oracle capture ratio" loading="lazy" /><figcaption>Adapter capture of offline DP improvement</figcaption></figure>`:""}
      ${l.dp_oracle_representative_soc?`<figure class="wide"><img src="${l.dp_oracle_representative_soc}" alt="Representative SOC trajectory" loading="lazy" /><figcaption>Representative heldout SOC trajectory</figcaption></figure>`:""}
    </section>
  `}function v(t){return t?`±${d(t.delta_P_eng_on_bound_kw,3)} kW / ±${d(t.delta_SOC_ref_bound,4)} SOC`:"n/a"}function k(t){var r;const e=(r=t.dp_oracle)==null?void 0:r.bound_sweep;if(!e)return"";const a=e.selection||{},n=e.plots||{},i=(e.pareto||[]).filter(s=>s.split==="heldout_evaluation").sort((s,c)=>Number(s.delta_P_eng_on_bound_kw)-Number(c.delta_P_eng_on_bound_kw)||Number(s.delta_SOC_ref_bound)-Number(c.delta_SOC_ref_bound)).map(s=>`
      <tr>
        <th>${v(s)}</th>
        <td>${d(s.SOC_RMSE_mean,6)}</td>
        <td>${d(s.abs_final_SOC_error_mean,6)}</td>
        <td>${d(s.constraint_violation_steps_mean,3)}</td>
        <td>${d(s.SOC_corrected_fuel_kg_mean,6)}</td>
        <td>${d(s.engine_switch_count_mean,3)}</td>
        <td class="${String(s.selection_feasible).toLowerCase()==="true"?"good":"warn"}">${String(s.selection_feasible).toLowerCase()==="true"?"yes":"no"}</td>
        <td>${s.selection_label||""}</td>
      </tr>
    `).join("");return`
    <section class="panel">
      <h2>Action Bound Sweep</h2>
      <p class="lead">Bounded-offset DP sweeps the same calibration-adapter action authority as Meta-RL. Full power-split DP is used only as an offline diagnostic reference, not to inverse power-split decisions into calibration bounds.</p>
      <div class="verdict-grid">
        <div><span>Current bound</span><strong>${v(a.current_bound)}</strong></div>
        <div><span>Recommended bound</span><strong>${v(a.recommended_bound)}</strong></div>
        <div><span>Aggressive bound</span><strong>${v(a.aggressive_bound)}</strong></div>
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
  `}function p(t,e,a,n=6){const i=t.find(r=>r.split==="heldout_evaluation"&&r.controller_group===e)||{};return d(i[`${a}_mean`],n)}function E(t){var s,c,o,$,l,u;const e=t.robustness_reward;if(!e)return"";const a=e.summary||[],n=((o=(c=(s=e.selection)==null?void 0:s.selected)==null?void 0:c.old_adapter)==null?void 0:o.seed)||"n/a",i=((u=(l=($=e.selection)==null?void 0:$.selected)==null?void 0:l.new_adapter)==null?void 0:u.seed)||"n/a",r=e.plots||{};return`
    <section class="panel">
      <h2>Robustness Reward v2 Re-evaluation</h2>
      <p class="lead">Old reward and robustness-v2 policies are re-evaluated on the same fixed manifest under the normalized robustness-v2 metrics. SOC_corrected_fuel is kept as a guardrail metric, not a reward term.</p>
      <div class="verdict-grid">
        <div><span>Selected old seed</span><strong>${n}</strong></div>
        <div><span>Selected new seed</span><strong>${i}</strong></div>
        <div><span>New SOC tail risk</span><strong>${p(a,"new_adapter","SOC_tail_risk")}</strong></div>
        <div><span>New constraint steps</span><strong>${p(a,"new_adapter","constraint_violation_steps",3)}</strong></div>
      </div>
      <table>
        <thead>
          <tr><th>Controller</th><th>Reward</th><th>SOC tail risk</th><th>SOC RMSE</th><th>Constraint</th><th>SOC-corr fuel</th><th>Engine switches</th></tr>
        </thead>
        <tbody>
          ${["baseline","old_adapter","new_adapter"].map(_=>`
            <tr>
              <th>${_}</th>
              <td>${p(a,_,"episode_reward",4)}</td>
              <td>${p(a,_,"SOC_tail_risk")}</td>
              <td>${p(a,_,"SOC_RMSE")}</td>
              <td>${p(a,_,"constraint_violation_steps",3)}</td>
              <td>${p(a,_,"SOC_corrected_fuel_kg")}</td>
              <td>${p(a,_,"engine_switch_count",3)}</td>
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
  `}function h(t,e,a,n,i=6){const r=(t||[]).find(s=>s.split===e&&s.controller_group===a)||{};return d(r[`${n}_mean`],i)}function z(t){const e=t.confidence_gate;if(!e)return"";const a=e.summary||[],n=e.plots||{};return`
    <section class="panel">
      <h2>Confidence-Gated Adapter</h2>
      <p class="lead">Runtime confidence combines distribution, safety-margin, and action-stability confidence. Low confidence attenuates calibration offsets or reverts to the zero-offset baseline EMS.</p>
      <table>
        <thead>
          <tr><th>Controller</th><th>SOC tail</th><th>SOC RMSE</th><th>Constraint</th><th>Confidence</th><th>Attenuation</th><th>Fallback</th></tr>
        </thead>
        <tbody>
          ${["baseline","old_no_gate","gate_current","gate_wider"].map(r=>`
            <tr>
              <th>${r}</th>
              <td>${h(a,"heldout_evaluation",r,"SOC_tail_risk")}</td>
              <td>${h(a,"heldout_evaluation",r,"SOC_RMSE")}</td>
              <td>${h(a,"heldout_evaluation",r,"constraint_violation_steps",3)}</td>
              <td>${h(a,"heldout_evaluation",r,"confidence_mean",3)}</td>
              <td>${h(a,"heldout_evaluation",r,"action_attenuation_ratio_mean",3)}</td>
              <td>${h(a,"heldout_evaluation",r,"fallback_activation_ratio",3)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
    <section class="plot-grid">
      ${n.metric_bars?`<figure><img src="${n.metric_bars}" alt="Confidence metric bars" loading="lazy" /><figcaption>Baseline/old/gated metric comparison</figcaption></figure>`:""}
      ${n.confidence_boxplot?`<figure><img src="${n.confidence_boxplot}" alt="Confidence boxplot" loading="lazy" /><figcaption>Confidence by nominal and OOD/stress split</figcaption></figure>`:""}
      ${n.representative_trace?`<figure class="wide"><img src="${n.representative_trace}" alt="Confidence representative trace" loading="lazy" /><figcaption>Representative stress trajectory with confidence and final action</figcaption></figure>`:""}
    </section>
  `}async function A(){var i,r,s,c;const t=await fetch("data/full_run_summary.json").then(o=>o.json()),e=t.summary.filter(o=>o.split==="heldout_evaluation"),a=e.filter(o=>o.kind==="primary"),n=e.filter(o=>o.kind==="guardrail");document.querySelector("#app").innerHTML=`
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
        <div><span>Heldout SOC RMSE</span><strong class="${g(a.find(o=>o.metric==="SOC_RMSE").reduction_pct,"primary")}">${f(a.find(o=>o.metric==="SOC_RMSE").reduction_pct)}</strong></div>
        <div><span>Heldout abs final SOC error</span><strong class="${g(a.find(o=>o.metric==="abs_final_SOC_error").reduction_pct,"primary")}">${f(a.find(o=>o.metric==="abs_final_SOC_error").reduction_pct)}</strong></div>
        <div><span>Heldout constraint steps</span><strong class="${g(a.find(o=>o.metric==="constraint_violation_steps").reduction_pct,"primary")}">${f(a.find(o=>o.metric==="constraint_violation_steps").reduction_pct)}</strong></div>
        <div><span>Fuel guardrail</span><strong class="${g(n.find(o=>o.metric==="SOC_corrected_fuel_kg").reduction_pct,"guardrail")}">${f(n.find(o=>o.metric==="SOC_corrected_fuel_kg").reduction_pct)}</strong></div>
      </div>
    </section>

    <section class="summary-grid">
      ${e.map(R).join("")}
    </section>

    <section class="panel">
      <h2>Aggregate Metrics</h2>
      <div class="tables">
        <div>
          <h3>Heldout Evaluation</h3>
          <table>
            <thead><tr><th>Metric</th><th>Baseline</th><th>Adapter</th><th>Reduction</th><th>Paired delta</th></tr></thead>
            <tbody>${S(t,"heldout_evaluation")}</tbody>
          </table>
        </div>
        <div>
          <h3>Meta Validation</h3>
          <table>
            <thead><tr><th>Metric</th><th>Baseline</th><th>Adapter</th><th>Reduction</th><th>Paired delta</th></tr></thead>
            <tbody>${S(t,"meta_validation")}</tbody>
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

    ${j(t)}
    ${k(t)}
    ${E(t)}
    ${z(t)}

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
        <tbody>${P(t)}</tbody>
      </table>
    </section>

    <section class="panel artifacts">
      <h2>Report And Artifacts</h2>
      <div class="artifact-links">
        <a href="${t.report_html_path||t.report_path}">Analysis report</a>
        ${t.controller_comparison_report_path?`<a href="${t.controller_comparison_report_path}">Controller comparison</a>`:""}
        ${t.trajectory_comparison_report_path?`<a href="${t.trajectory_comparison_report_path}">Trajectory comparison</a>`:""}
        ${t.robustness_reward_report_path?`<a href="${t.robustness_reward_report_path}">Robustness reward report</a>`:""}
        ${t.confidence_gate_report_path?`<a href="${t.confidence_gate_report_path}">Confidence gate report</a>`:""}
        <a href="${t.report_path}">Markdown report</a>
        <a href="${t.artifacts.aggregate_report}">Aggregate markdown</a>
        <a href="${t.artifacts.metric_summary_csv}">Metric summary CSV</a>
        <a href="${t.artifacts.seed_delta_csv}">Seed deltas CSV</a>
        <a href="${t.artifacts.checkpoint_series_csv}">Checkpoint series CSV</a>
        ${t.artifacts.controller_representative_trajectory_csv?`<a href="${t.artifacts.controller_representative_trajectory_csv}">Controller trajectory CSV</a>`:""}
        ${t.dp_oracle?'<a href="data/dp_oracle_paired_improvements.csv">DP oracle CSV</a>':""}
        ${(r=(i=t.dp_oracle)==null?void 0:i.artifacts)!=null&&r["dp_oracle_full_power_split_improvements.csv"]?'<a href="data/dp_oracle_full_power_split_improvements.csv">Full split DP CSV</a>':""}
        ${(s=t.dp_oracle)!=null&&s.bound_sweep?'<a href="data/bound_sweep_summary.csv">Bound sweep summary CSV</a>':""}
        ${(c=t.dp_oracle)!=null&&c.bound_sweep?'<a href="data/bound_sweep_selection.json">Bound sweep selection JSON</a>':""}
        ${t.robustness_reward?'<a href="data/robustness_comparison_summary_metrics.csv">Robustness summary CSV</a>':""}
        ${t.robustness_reward?'<a href="data/robustness_comparison_paired_deltas.csv">Robustness paired deltas CSV</a>':""}
        ${t.confidence_gate?'<a href="data/confidence_gate_summary_metrics.csv">Confidence gate summary CSV</a>':""}
        ${t.confidence_gate?'<a href="data/confidence_gate_representative_trace.csv">Confidence trace CSV</a>':""}
        ${t.trajectory_comparison?'<a href="data/trajectory_comparison_episode_metrics.csv">Trajectory metrics CSV</a>':""}
        ${t.trajectory_comparison?'<a href="data/trajectory_comparison_trajectories.csv">Trajectory CSV</a>':""}
      </div>
    </section>
  `}A();
