(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))d(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&d(r)}).observe(document,{childList:!0,subtree:!0});function a(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function d(i){if(i.ep)return;i.ep=!0;const s=a(i);fetch(i.href,s)}})();function n(t,e=4){const a=Number(t);return Number.isFinite(a)?a.toFixed(e):"n/a"}function o(t){const e=Number(t);return Number.isFinite(e)?`${e.toFixed(2)}%`:"n/a"}function c(t,e){const a=Number(t);return Number.isFinite(a)?e==="guardrail"?a>=-2?"good":"warn":a>0?"good":"warn":""}function b(t){return t.replace("_"," ")}function g(t,e){return t.summary.filter(a=>a.split===e).map(a=>`
      <tr>
        <th>${a.label}</th>
        <td>${n(a.baseline_mean,6)}</td>
        <td>${n(a.adapter_mean,6)}</td>
        <td class="${c(a.reduction_pct,a.kind)}">${o(a.reduction_pct)}</td>
        <td>${n(a.delta_mean,6)} ± ${n(a.delta_std,6)}</td>
      </tr>
    `).join("")}function S(t){const e=t.kind==="primary";return`
    <article class="metric-card">
      <div>
        <p class="eyebrow">${b(t.split)}</p>
        <h3>${t.label}</h3>
      </div>
      <dl>
        <div><dt>Baseline</dt><dd>${n(t.baseline_mean,5)}</dd></div>
        <div><dt>Adapter</dt><dd>${n(t.adapter_mean,5)}</dd></div>
        <div><dt>Reduction</dt><dd class="${c(t.reduction_pct,t.kind)}">${o(t.reduction_pct)}</dd></div>
        <div><dt>Paired delta</dt><dd>${n(t.delta_mean,5)}</dd></div>
      </dl>
      <p class="card-note">${e?"Primary claim metric":"Deployment guardrail"}</p>
    </article>
  `}function C(t){return t.heldout_seed_deltas.map(e=>`
      <tr>
        <td>${e.seed}</td>
        <td class="${e.abs_final_SOC_error_delta<=0?"good":"warn"}">${n(e.abs_final_SOC_error_delta,6)}</td>
        <td class="${e.SOC_RMSE_delta<=0?"good":"warn"}">${n(e.SOC_RMSE_delta,6)}</td>
        <td class="${e.constraint_violation_steps_delta<=0?"good":"warn"}">${n(e.constraint_violation_steps_delta,4)}</td>
        <td class="${e.SOC_corrected_fuel_kg_delta<=.002?"good":"warn"}">${n(e.SOC_corrected_fuel_kg_delta,6)}</td>
        <td class="${e.engine_switch_count_delta<=.1?"good":"warn"}">${n(e.engine_switch_count_delta,4)}</td>
      </tr>
    `).join("")}function O(t,e,a){return t.improvements.find(d=>d.split===e&&d.metric===a)}function u(t,e,a){return t.summary.find(d=>d.split===e&&d.policy===a)}function P(t){var m;const e=t.dp_oracle;if(!e)return"";const a="heldout_evaluation",d=[["abs_final_SOC_error","Abs final SOC error"],["SOC_RMSE","SOC RMSE"],["constraint_violation_steps","Constraint steps"],["SOC_corrected_fuel_kg","SOC-corrected fuel"],["engine_switch_count","Engine switches"]],i=u(e,a,"map_rule_zero_offset")||{},s=u(e,a,"latent_sac_adapter_seed_mean")||{},r=u(e,a,"bounded_offset_dp_oracle")||{},f=u(e,a,"full_power_split_dp_oracle")||{},h=!!f.policy,$=d.map(([p,v])=>{const y=O(e,a,p)||{};return`
      <tr>
        <th>${v}</th>
        <td>${n(i[`${p}_mean`],6)}</td>
        <td>${n(s[`${p}_mean`],6)}</td>
        <td>${n(r[`${p}_mean`],6)}</td>
        ${h?`<td>${n(f[`${p}_mean`],6)}</td>`:""}
        <td>${o(y.capture_ratio_pct)}</td>
      </tr>
    `}).join(""),l=e.plots||{},_=(m=e.metadata)==null?void 0:m.full_power_split_dp;return`
    <section class="panel">
      <h2>Bounded DP Oracle Comparison</h2>
      <p class="lead">Offline discretized bounded-offset DP uses future cycle knowledge but keeps the same adapter authority: only delta_P_eng_on and delta_SOC_ref.${_!=null&&_.enabled?` Full split DP is an offline diagnostic oracle with direct P_eng_target authority (${_.decision_interval_s}s decision interval), so it is not an apples-to-apples adapter comparison.`:""}</p>
      <table>
        <thead><tr><th>Metric</th><th>Baseline</th><th>Adapter mean</th><th>Bounded DP oracle</th>${h?"<th>Full split DP</th>":""}<th>Adapter capture</th></tr></thead>
        <tbody>${$}</tbody>
      </table>
    </section>
    <section class="plot-grid">
      ${l.dp_oracle_metric_bars?`<figure><img src="${l.dp_oracle_metric_bars}" alt="DP oracle metric bars" loading="lazy" /><figcaption>Baseline vs adapter vs DP oracle</figcaption></figure>`:""}
      ${l.dp_oracle_gap_capture?`<figure><img src="${l.dp_oracle_gap_capture}" alt="DP oracle capture ratio" loading="lazy" /><figcaption>Adapter capture of offline DP improvement</figcaption></figure>`:""}
      ${l.dp_oracle_representative_soc?`<figure class="wide"><img src="${l.dp_oracle_representative_soc}" alt="Representative SOC trajectory" loading="lazy" /><figcaption>Representative heldout SOC trajectory</figcaption></figure>`:""}
    </section>
  `}async function R(){var i,s;const t=await fetch("data/full_run_summary.json").then(r=>r.json()),e=t.summary.filter(r=>r.split==="heldout_evaluation"),a=e.filter(r=>r.kind==="primary"),d=e.filter(r=>r.kind==="guardrail");document.querySelector("#app").innerHTML=`
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
        <div><span>Heldout SOC RMSE</span><strong class="${c(a.find(r=>r.metric==="SOC_RMSE").reduction_pct,"primary")}">${o(a.find(r=>r.metric==="SOC_RMSE").reduction_pct)}</strong></div>
        <div><span>Heldout abs final SOC error</span><strong class="${c(a.find(r=>r.metric==="abs_final_SOC_error").reduction_pct,"primary")}">${o(a.find(r=>r.metric==="abs_final_SOC_error").reduction_pct)}</strong></div>
        <div><span>Heldout constraint steps</span><strong class="${c(a.find(r=>r.metric==="constraint_violation_steps").reduction_pct,"primary")}">${o(a.find(r=>r.metric==="constraint_violation_steps").reduction_pct)}</strong></div>
        <div><span>Fuel guardrail</span><strong class="${c(d.find(r=>r.metric==="SOC_corrected_fuel_kg").reduction_pct,"guardrail")}">${o(d.find(r=>r.metric==="SOC_corrected_fuel_kg").reduction_pct)}</strong></div>
      </div>
    </section>

    <section class="summary-grid">
      ${e.map(S).join("")}
    </section>

    <section class="panel">
      <h2>Aggregate Metrics</h2>
      <div class="tables">
        <div>
          <h3>Heldout Evaluation</h3>
          <table>
            <thead><tr><th>Metric</th><th>Baseline</th><th>Adapter</th><th>Reduction</th><th>Paired delta</th></tr></thead>
            <tbody>${g(t,"heldout_evaluation")}</tbody>
          </table>
        </div>
        <div>
          <h3>Meta Validation</h3>
          <table>
            <thead><tr><th>Metric</th><th>Baseline</th><th>Adapter</th><th>Reduction</th><th>Paired delta</th></tr></thead>
            <tbody>${g(t,"meta_validation")}</tbody>
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

    ${P(t)}

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
        <tbody>${C(t)}</tbody>
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
        ${(s=(i=t.dp_oracle)==null?void 0:i.artifacts)!=null&&s["dp_oracle_full_power_split_improvements.csv"]?'<a href="data/dp_oracle_full_power_split_improvements.csv">Full split DP CSV</a>':""}
      </div>
    </section>
  `}R();
