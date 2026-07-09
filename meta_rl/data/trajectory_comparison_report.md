# Meta-RL Controller Trajectory Comparison Report

Baseline vs Old Adapter vs Robust Confidence Adapter

## 핵심 주의 문구

- old/new reward formula의 episode_reward 절대값은 직접 비교하지 않는다.
- 비교는 동일 rollout 조건에서 계산한 reward-independent physical metrics를 중심으로 수행한다.
- baseline은 학습된 정책이 아니라 zero-offset map/rule EMS이다.
- `SOC_corrected_fuel`은 reward가 아니라 charge-sustaining fairness metric으로 사용한다.

## 비교 대상

| controller | 역할 | checkpoint | 선택 근거 |
|---|---|---|---|
| Baseline zero-offset EMS | map_rule_zero_offset | `` | zero-offset map/rule EMS; no learned policy or training reward |
| Old Meta-RL adapter | old_latent_sac_adapter | `/home/yejun/meta_rl/results/meta_rl_paper/main_raw_summary_soc_guarded/20260706_164901/seed_20260710/policy.pt` | seed_20260710: selected final policy by heldout physical deltas |
| New robustness adapter, no gate | new_robust_adapter_no_gate | `/home/yejun/meta_rl/results/meta_rl_paper/robustness_v2_raw_summary/20260709_161421/seed_20260707/policy.pt` | seed_20260707: selected final policy by heldout physical deltas |
| New robustness/confidence adapter | new_robust_confidence_adapter | `/home/yejun/meta_rl/results/meta_rl_paper/confidence_gate_current_bound/20260709_173821/seed_20260708/checkpoints/policy_step_90000.pt` | seed_20260708: selected heldout step 90000 |

## 전체 metric summary

| controller | SOC RMSE | Final SOC err | Constraint | SOC-corr fuel | Engine switches | Confidence mean | Fallback ratio |
|---|---:|---:|---:|---:|---:|---:|---:|
| Baseline zero-offset EMS | 0.0723 | 0.0712 | 2.562 | 0.1246 | 6.750 | 1.000 | 0.0000 |
| Old Meta-RL adapter | 0.0725 | 0.0695 | 2.562 | 0.1248 | 6.875 | 1.000 | 0.0000 |
| New robustness adapter, no gate | 0.0718 | 0.0664 | 2.375 | 0.1249 | 7.000 | 1.000 | 0.0000 |
| New robustness/confidence adapter | 0.0692 | 0.0670 | 2.562 | 0.1246 | 6.688 | 0.480 | 0.0339 |

## 대표 case 선정 기준

총 16개 case를 선정했다. meta_validation/heldout representative, SOC tail risk, constraint violation, low-SOC, high-mass, uphill grade, weather/friction stress(wet/snow/ice), old/new 차이가 큰 case, new adapter 개선/악화 case를 섞었다.

| case | split | profile | condition | initial SOC | mass | grade | reason |
|---|---|---|---|---:|---:|---:|---|
| C01_nominal_bc8a04551c | meta_validation | bc8a04551cdd08b3 | nominal | 0.650 | 1.15 | 2.00 | meta_validation representative |
| C02_nominal_d25b7810d6 | meta_validation | d25b7810d65f4813 | nominal | 0.550 | 1.00 | -2.00 | meta_validation representative |
| C03_nominal_e85b8857ed | heldout_evaluation | e85b8857ed7397c3 | nominal | 0.550 | 1.00 | 0.00 | heldout_evaluation representative |
| C04_nominal_cfef57d4ff | heldout_evaluation | cfef57d4ffb59267 | nominal | 0.650 | 1.15 | -2.00 | heldout_evaluation representative |
| C05_low_soc_stress_e85b8857ed | low_soc_stress | e85b8857ed7397c3 | low_soc_stress | 0.450 | 1.00 | 0.00 | large baseline SOC RMSE / tail risk; large SOC tail-risk integral; low-SOC stress |
| C06_low_soc_high_mass_uphill_e85b8857ed | low_soc_high_mass_uphill | e85b8857ed7397c3 | low_soc_high_mass_uphill | 0.450 | 1.30 | 6.00 | large baseline SOC RMSE / tail risk; large SOC tail-risk integral; combined low-SOC/mass/uphill stress |
| C07_low_soc_high_mass_uphill_cfef57d4ff | low_soc_high_mass_uphill | cfef57d4ffb59267 | low_soc_high_mass_uphill | 0.450 | 1.30 | 6.00 | baseline constraint violation case; battery-limit proximity stress |
| C08_high_mass_stress_cfef57d4ff | high_mass_stress | cfef57d4ffb59267 | high_mass_stress | 0.550 | 1.30 | 0.00 | baseline constraint violation case |
| C09_uphill_grade_stress_cfef57d4ff | uphill_grade_stress | cfef57d4ffb59267 | uphill_grade_stress | 0.550 | 1.00 | 6.00 | battery-limit proximity stress |
| C10_high_mass_stress_e85b8857ed | high_mass_stress | e85b8857ed7397c3 | high_mass_stress | 0.550 | 1.30 | 0.00 | high-mass stress |
| C11_uphill_grade_stress_e85b8857ed | uphill_grade_stress | e85b8857ed7397c3 | uphill_grade_stress | 0.550 | 1.00 | 6.00 | uphill grade stress |
| C12_weather_wet_57da69baf0 | weather_wet | 57da69baf0315620 | weather_wet | 0.550 | 1.00 | 0.00 | wet weather/friction stress |
| C13_weather_snow_b0a2f5c7a2 | weather_snow | b0a2f5c7a2354bfd | weather_snow | 0.550 | 1.00 | 0.00 | snow weather/friction stress; new confidence adapter worsens baseline composite physical score |
| C14_weather_ice_56f447713a | weather_ice | 56f447713a5f22af | weather_ice | 0.550 | 1.00 | 0.00 | ice weather/friction stress |
| C15_weather_ice_a0f3f873c6 | weather_ice | a0f3f873c6e2a43b | weather_ice | 0.550 | 1.00 | 0.00 | large old-vs-new trajectory/metric difference; new confidence adapter improves baseline composite physical score |
| C16_nominal_e8a36196fd | heldout_evaluation | e8a36196fd7b4c36 | nominal | 0.650 | 1.15 | 2.00 | large old-vs-new trajectory/metric difference; new confidence adapter improves baseline composite physical score |

## 주요 해석

- new confidence adapter가 가장 개선한 case는 `C15_weather_ice_a0f3f873c6`이며 composite physical delta는 -0.0599이다.
- new confidence adapter가 가장 악화한 case는 `C13_weather_snow_b0a2f5c7a2`이며 composite physical delta는 0.0398이다.
- action 관점에서는 old/new 모두 `delta_P_eng_on`, `delta_SOC_ref` bounded offset만 내보내며, engine state/mode/power split은 map/rule EMS가 결정한다.
- confidence gate가 낮아지는 구간에서는 raw action 대비 final action attenuation과 fallback 여부를 confidence plot에서 확인한다.
- 논문 본문에는 reward 절대값 비교 대신 SOC trajectory, SOC tail risk, constraint/battery-limit risk, fuel/switching guardrail을 사용한다.

## 논문에 쓸 수 있는 문장

> Under identical rollout conditions, the robust confidence adapter preserves the production-like EMS authority boundary and changes only bounded calibration offsets; therefore, controller comparisons are based on reward-independent physical metrics and trajectory behavior rather than the absolute episode rewards of different reward formulae.

## 아직 쓰면 위험한 문장

- new adapter가 모든 unseen condition에서 연료를 직접 개선한다고 쓰는 문장
- full power-split optimality 또는 direct power controller처럼 해석되는 문장
- old/new reward formula의 episode_reward 절대값으로 우열을 말하는 문장

## Summary Plots

### Metric summary bars

![Metric summary bars](figures/trajectory_summary_metric_bars.png)

### SOC RMSE heatmap

![SOC RMSE heatmap](figures/trajectory_soc_rmse_heatmap.png)

### SOC-corrected fuel delta

![SOC-corrected fuel delta](figures/trajectory_soc_corrected_fuel_delta.png)

### Constraint delta

![Constraint delta](figures/trajectory_constraint_delta.png)

### Action magnitude/rate

![Action magnitude/rate](figures/trajectory_action_magnitude_rate.png)

### Confidence vs stress

![Confidence vs stress](figures/trajectory_confidence_vs_stress.png)

### New adapter waterfall

![New adapter waterfall](figures/trajectory_new_adapter_waterfall.png)

## Case Trajectory Gallery

### C01_nominal_bc8a04551c

- reason: meta_validation representative
- trajectory CSV: `trajectories/C01_nominal_bc8a04551c.csv`

![C01_nominal_bc8a04551c trajectory](figures/C01_nominal_bc8a04551c_trajectory.png)

### C02_nominal_d25b7810d6

- reason: meta_validation representative
- trajectory CSV: `trajectories/C02_nominal_d25b7810d6.csv`

![C02_nominal_d25b7810d6 trajectory](figures/C02_nominal_d25b7810d6_trajectory.png)

### C03_nominal_e85b8857ed

- reason: heldout_evaluation representative
- trajectory CSV: `trajectories/C03_nominal_e85b8857ed.csv`

![C03_nominal_e85b8857ed trajectory](figures/C03_nominal_e85b8857ed_trajectory.png)

### C04_nominal_cfef57d4ff

- reason: heldout_evaluation representative
- trajectory CSV: `trajectories/C04_nominal_cfef57d4ff.csv`

![C04_nominal_cfef57d4ff trajectory](figures/C04_nominal_cfef57d4ff_trajectory.png)

### C05_low_soc_stress_e85b8857ed

- reason: large baseline SOC RMSE / tail risk; large SOC tail-risk integral; low-SOC stress
- trajectory CSV: `trajectories/C05_low_soc_stress_e85b8857ed.csv`

![C05_low_soc_stress_e85b8857ed trajectory](figures/C05_low_soc_stress_e85b8857ed_trajectory.png)

### C06_low_soc_high_mass_uphill_e85b8857ed

- reason: large baseline SOC RMSE / tail risk; large SOC tail-risk integral; combined low-SOC/mass/uphill stress
- trajectory CSV: `trajectories/C06_low_soc_high_mass_uphill_e85b8857ed.csv`

![C06_low_soc_high_mass_uphill_e85b8857ed trajectory](figures/C06_low_soc_high_mass_uphill_e85b8857ed_trajectory.png)

### C07_low_soc_high_mass_uphill_cfef57d4ff

- reason: baseline constraint violation case; battery-limit proximity stress
- trajectory CSV: `trajectories/C07_low_soc_high_mass_uphill_cfef57d4ff.csv`

![C07_low_soc_high_mass_uphill_cfef57d4ff trajectory](figures/C07_low_soc_high_mass_uphill_cfef57d4ff_trajectory.png)

### C08_high_mass_stress_cfef57d4ff

- reason: baseline constraint violation case
- trajectory CSV: `trajectories/C08_high_mass_stress_cfef57d4ff.csv`

![C08_high_mass_stress_cfef57d4ff trajectory](figures/C08_high_mass_stress_cfef57d4ff_trajectory.png)

### C09_uphill_grade_stress_cfef57d4ff

- reason: battery-limit proximity stress
- trajectory CSV: `trajectories/C09_uphill_grade_stress_cfef57d4ff.csv`

![C09_uphill_grade_stress_cfef57d4ff trajectory](figures/C09_uphill_grade_stress_cfef57d4ff_trajectory.png)

### C10_high_mass_stress_e85b8857ed

- reason: high-mass stress
- trajectory CSV: `trajectories/C10_high_mass_stress_e85b8857ed.csv`

![C10_high_mass_stress_e85b8857ed trajectory](figures/C10_high_mass_stress_e85b8857ed_trajectory.png)

### C11_uphill_grade_stress_e85b8857ed

- reason: uphill grade stress
- trajectory CSV: `trajectories/C11_uphill_grade_stress_e85b8857ed.csv`

![C11_uphill_grade_stress_e85b8857ed trajectory](figures/C11_uphill_grade_stress_e85b8857ed_trajectory.png)

### C12_weather_wet_57da69baf0

- reason: wet weather/friction stress
- trajectory CSV: `trajectories/C12_weather_wet_57da69baf0.csv`

![C12_weather_wet_57da69baf0 trajectory](figures/C12_weather_wet_57da69baf0_trajectory.png)

### C13_weather_snow_b0a2f5c7a2

- reason: snow weather/friction stress; new confidence adapter worsens baseline composite physical score
- trajectory CSV: `trajectories/C13_weather_snow_b0a2f5c7a2.csv`

![C13_weather_snow_b0a2f5c7a2 trajectory](figures/C13_weather_snow_b0a2f5c7a2_trajectory.png)

### C14_weather_ice_56f447713a

- reason: ice weather/friction stress
- trajectory CSV: `trajectories/C14_weather_ice_56f447713a.csv`

![C14_weather_ice_56f447713a trajectory](figures/C14_weather_ice_56f447713a_trajectory.png)

### C15_weather_ice_a0f3f873c6

- reason: large old-vs-new trajectory/metric difference; new confidence adapter improves baseline composite physical score
- trajectory CSV: `trajectories/C15_weather_ice_a0f3f873c6.csv`

![C15_weather_ice_a0f3f873c6 trajectory](figures/C15_weather_ice_a0f3f873c6_trajectory.png)

### C16_nominal_e8a36196fd

- reason: large old-vs-new trajectory/metric difference; new confidence adapter improves baseline composite physical score
- trajectory CSV: `trajectories/C16_nominal_e8a36196fd.csv`

![C16_nominal_e8a36196fd trajectory](figures/C16_nominal_e8a36196fd_trajectory.png)

