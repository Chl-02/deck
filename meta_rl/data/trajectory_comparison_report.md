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
| C01_meta_val_nominal | Meta-val | Nominal | mixed arterial dense mild seed43 | SOC 0.65, mass 1.15, grade 2.0% | Meta-val | mixed arterial dense mild seed43 | Nominal | 0.650 | 1.15 | 2.00 | meta_validation representative |
| C02_meta_val_nominal | Meta-val | Nominal | freeway corridor free flow normal seed42 | SOC 0.55, mass 1.00, grade -2.0% | Meta-val | freeway corridor free flow normal seed42 | Nominal | 0.550 | 1.00 | -2.00 | meta_validation representative |
| C03_heldout_nominal | Heldout | Nominal | suburban arterial congested normal seed46 | SOC 0.55, mass 1.00, grade 0.0% | Heldout | suburban arterial congested normal seed46 | Nominal | 0.550 | 1.00 | 0.00 | heldout_evaluation representative |
| C04_heldout_nominal | Heldout | Nominal | suburban arterial congested normal seed44 | SOC 0.65, mass 1.15, grade -2.0% | Heldout | suburban arterial congested normal seed44 | Nominal | 0.650 | 1.15 | -2.00 | heldout_evaluation representative |
| C05_low_soc_stress_low_soc | Low-SOC stress | Low SOC | suburban arterial congested normal seed46 | SOC 0.45, mass 1.00, grade 0.0% | Low-SOC stress | suburban arterial congested normal seed46 | Low SOC | 0.450 | 1.00 | 0.00 | large baseline SOC RMSE / tail risk; large SOC tail-risk integral; low-SOC stress |
| C06_combined_stress_low_soc_mass_uphill | Combined stress | Low SOC + mass + uphill | suburban arterial congested normal seed46 | SOC 0.45, mass 1.30, grade 6.0% | Combined stress | suburban arterial congested normal seed46 | Low SOC + mass + uphill | 0.450 | 1.30 | 6.00 | large baseline SOC RMSE / tail risk; large SOC tail-risk integral; combined low-SOC/mass/uphill stress |
| C07_combined_stress_low_soc_mass_uphill | Combined stress | Low SOC + mass + uphill | suburban arterial congested normal seed44 | SOC 0.45, mass 1.30, grade 6.0% | Combined stress | suburban arterial congested normal seed44 | Low SOC + mass + uphill | 0.450 | 1.30 | 6.00 | baseline constraint violation case; battery-limit proximity stress |
| C08_high_mass_stress_high_mass | High-mass stress | High mass | suburban arterial congested normal seed44 | SOC 0.55, mass 1.30, grade 0.0% | High-mass stress | suburban arterial congested normal seed44 | High mass | 0.550 | 1.30 | 0.00 | baseline constraint violation case |
| C09_uphill_stress_uphill_grade | Uphill stress | Uphill grade | suburban arterial congested normal seed44 | SOC 0.55, mass 1.00, grade 6.0% | Uphill stress | suburban arterial congested normal seed44 | Uphill grade | 0.550 | 1.00 | 6.00 | battery-limit proximity stress |
| C10_high_mass_stress_high_mass | High-mass stress | High mass | suburban arterial congested normal seed46 | SOC 0.55, mass 1.30, grade 0.0% | High-mass stress | suburban arterial congested normal seed46 | High mass | 0.550 | 1.30 | 0.00 | high-mass stress |
| C11_uphill_stress_uphill_grade | Uphill stress | Uphill grade | suburban arterial congested normal seed46 | SOC 0.55, mass 1.00, grade 6.0% | Uphill stress | suburban arterial congested normal seed46 | Uphill grade | 0.550 | 1.00 | 6.00 | uphill grade stress |
| C12_wet_weather_wet_friction | Wet weather | Wet friction | freeway corridor / wet | SOC 0.55, mass 1.00, grade 0.0% | Wet weather | freeway corridor / wet | Wet friction | 0.550 | 1.00 | 0.00 | wet weather/friction stress |
| C13_snow_weather_snow_friction | Snow weather | Snow friction | urban signalized / snow | SOC 0.55, mass 1.00, grade 0.0% | Snow weather | urban signalized / snow | Snow friction | 0.550 | 1.00 | 0.00 | snow weather/friction stress; new confidence adapter worsens baseline composite physical score |
| C14_ice_weather_ice_friction | Ice weather | Ice friction | freeway corridor / ice | SOC 0.55, mass 1.00, grade 0.0% | Ice weather | freeway corridor / ice | Ice friction | 0.550 | 1.00 | 0.00 | ice weather/friction stress |
| C15_ice_weather_ice_friction | Ice weather | Ice friction | freeway corridor / ice | SOC 0.55, mass 1.00, grade 0.0% | Ice weather | freeway corridor / ice | Ice friction | 0.550 | 1.00 | 0.00 | large old-vs-new trajectory/metric difference; new confidence adapter improves baseline composite physical score |
| C16_heldout_nominal | Heldout | Nominal | mixed arterial free flow mild seed46 | SOC 0.65, mass 1.15, grade 2.0% | Heldout | mixed arterial free flow mild seed46 | Nominal | 0.650 | 1.15 | 2.00 | large old-vs-new trajectory/metric difference; new confidence adapter improves baseline composite physical score |

## 주요 해석

- new confidence adapter가 가장 개선한 case는 `C15_ice_weather_ice_friction | Ice weather | Ice friction | freeway corridor / ice | SOC 0.55, mass 1.00, grade 0.0%`이며 composite physical delta는 -0.0599이다.
- new confidence adapter가 가장 악화한 case는 `C13_snow_weather_snow_friction | Snow weather | Snow friction | urban signalized / snow | SOC 0.55, mass 1.00, grade 0.0%`이며 composite physical delta는 0.0398이다.
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

### C01_meta_val_nominal | Meta-val | Nominal | mixed arterial dense mild seed43 | SOC 0.65, mass 1.15, grade 2.0%

- reason: meta_validation representative
- trajectory CSV: `trajectories/C01_meta_val_nominal.csv`

![C01_meta_val_nominal | Meta-val | Nominal | mixed arterial dense mild seed43 | SOC 0.65, mass 1.15, grade 2.0% trajectory](figures/C01_meta_val_nominal_trajectory.png)

### C02_meta_val_nominal | Meta-val | Nominal | freeway corridor free flow normal seed42 | SOC 0.55, mass 1.00, grade -2.0%

- reason: meta_validation representative
- trajectory CSV: `trajectories/C02_meta_val_nominal.csv`

![C02_meta_val_nominal | Meta-val | Nominal | freeway corridor free flow normal seed42 | SOC 0.55, mass 1.00, grade -2.0% trajectory](figures/C02_meta_val_nominal_trajectory.png)

### C03_heldout_nominal | Heldout | Nominal | suburban arterial congested normal seed46 | SOC 0.55, mass 1.00, grade 0.0%

- reason: heldout_evaluation representative
- trajectory CSV: `trajectories/C03_heldout_nominal.csv`

![C03_heldout_nominal | Heldout | Nominal | suburban arterial congested normal seed46 | SOC 0.55, mass 1.00, grade 0.0% trajectory](figures/C03_heldout_nominal_trajectory.png)

### C04_heldout_nominal | Heldout | Nominal | suburban arterial congested normal seed44 | SOC 0.65, mass 1.15, grade -2.0%

- reason: heldout_evaluation representative
- trajectory CSV: `trajectories/C04_heldout_nominal.csv`

![C04_heldout_nominal | Heldout | Nominal | suburban arterial congested normal seed44 | SOC 0.65, mass 1.15, grade -2.0% trajectory](figures/C04_heldout_nominal_trajectory.png)

### C05_low_soc_stress_low_soc | Low-SOC stress | Low SOC | suburban arterial congested normal seed46 | SOC 0.45, mass 1.00, grade 0.0%

- reason: large baseline SOC RMSE / tail risk; large SOC tail-risk integral; low-SOC stress
- trajectory CSV: `trajectories/C05_low_soc_stress_low_soc.csv`

![C05_low_soc_stress_low_soc | Low-SOC stress | Low SOC | suburban arterial congested normal seed46 | SOC 0.45, mass 1.00, grade 0.0% trajectory](figures/C05_low_soc_stress_low_soc_trajectory.png)

### C06_combined_stress_low_soc_mass_uphill | Combined stress | Low SOC + mass + uphill | suburban arterial congested normal seed46 | SOC 0.45, mass 1.30, grade 6.0%

- reason: large baseline SOC RMSE / tail risk; large SOC tail-risk integral; combined low-SOC/mass/uphill stress
- trajectory CSV: `trajectories/C06_combined_stress_low_soc_mass_uphill.csv`

![C06_combined_stress_low_soc_mass_uphill | Combined stress | Low SOC + mass + uphill | suburban arterial congested normal seed46 | SOC 0.45, mass 1.30, grade 6.0% trajectory](figures/C06_combined_stress_low_soc_mass_uphill_trajectory.png)

### C07_combined_stress_low_soc_mass_uphill | Combined stress | Low SOC + mass + uphill | suburban arterial congested normal seed44 | SOC 0.45, mass 1.30, grade 6.0%

- reason: baseline constraint violation case; battery-limit proximity stress
- trajectory CSV: `trajectories/C07_combined_stress_low_soc_mass_uphill.csv`

![C07_combined_stress_low_soc_mass_uphill | Combined stress | Low SOC + mass + uphill | suburban arterial congested normal seed44 | SOC 0.45, mass 1.30, grade 6.0% trajectory](figures/C07_combined_stress_low_soc_mass_uphill_trajectory.png)

### C08_high_mass_stress_high_mass | High-mass stress | High mass | suburban arterial congested normal seed44 | SOC 0.55, mass 1.30, grade 0.0%

- reason: baseline constraint violation case
- trajectory CSV: `trajectories/C08_high_mass_stress_high_mass.csv`

![C08_high_mass_stress_high_mass | High-mass stress | High mass | suburban arterial congested normal seed44 | SOC 0.55, mass 1.30, grade 0.0% trajectory](figures/C08_high_mass_stress_high_mass_trajectory.png)

### C09_uphill_stress_uphill_grade | Uphill stress | Uphill grade | suburban arterial congested normal seed44 | SOC 0.55, mass 1.00, grade 6.0%

- reason: battery-limit proximity stress
- trajectory CSV: `trajectories/C09_uphill_stress_uphill_grade.csv`

![C09_uphill_stress_uphill_grade | Uphill stress | Uphill grade | suburban arterial congested normal seed44 | SOC 0.55, mass 1.00, grade 6.0% trajectory](figures/C09_uphill_stress_uphill_grade_trajectory.png)

### C10_high_mass_stress_high_mass | High-mass stress | High mass | suburban arterial congested normal seed46 | SOC 0.55, mass 1.30, grade 0.0%

- reason: high-mass stress
- trajectory CSV: `trajectories/C10_high_mass_stress_high_mass.csv`

![C10_high_mass_stress_high_mass | High-mass stress | High mass | suburban arterial congested normal seed46 | SOC 0.55, mass 1.30, grade 0.0% trajectory](figures/C10_high_mass_stress_high_mass_trajectory.png)

### C11_uphill_stress_uphill_grade | Uphill stress | Uphill grade | suburban arterial congested normal seed46 | SOC 0.55, mass 1.00, grade 6.0%

- reason: uphill grade stress
- trajectory CSV: `trajectories/C11_uphill_stress_uphill_grade.csv`

![C11_uphill_stress_uphill_grade | Uphill stress | Uphill grade | suburban arterial congested normal seed46 | SOC 0.55, mass 1.00, grade 6.0% trajectory](figures/C11_uphill_stress_uphill_grade_trajectory.png)

### C12_wet_weather_wet_friction | Wet weather | Wet friction | freeway corridor / wet | SOC 0.55, mass 1.00, grade 0.0%

- reason: wet weather/friction stress
- trajectory CSV: `trajectories/C12_wet_weather_wet_friction.csv`

![C12_wet_weather_wet_friction | Wet weather | Wet friction | freeway corridor / wet | SOC 0.55, mass 1.00, grade 0.0% trajectory](figures/C12_wet_weather_wet_friction_trajectory.png)

### C13_snow_weather_snow_friction | Snow weather | Snow friction | urban signalized / snow | SOC 0.55, mass 1.00, grade 0.0%

- reason: snow weather/friction stress; new confidence adapter worsens baseline composite physical score
- trajectory CSV: `trajectories/C13_snow_weather_snow_friction.csv`

![C13_snow_weather_snow_friction | Snow weather | Snow friction | urban signalized / snow | SOC 0.55, mass 1.00, grade 0.0% trajectory](figures/C13_snow_weather_snow_friction_trajectory.png)

### C14_ice_weather_ice_friction | Ice weather | Ice friction | freeway corridor / ice | SOC 0.55, mass 1.00, grade 0.0%

- reason: ice weather/friction stress
- trajectory CSV: `trajectories/C14_ice_weather_ice_friction.csv`

![C14_ice_weather_ice_friction | Ice weather | Ice friction | freeway corridor / ice | SOC 0.55, mass 1.00, grade 0.0% trajectory](figures/C14_ice_weather_ice_friction_trajectory.png)

### C15_ice_weather_ice_friction | Ice weather | Ice friction | freeway corridor / ice | SOC 0.55, mass 1.00, grade 0.0%

- reason: large old-vs-new trajectory/metric difference; new confidence adapter improves baseline composite physical score
- trajectory CSV: `trajectories/C15_ice_weather_ice_friction.csv`

![C15_ice_weather_ice_friction | Ice weather | Ice friction | freeway corridor / ice | SOC 0.55, mass 1.00, grade 0.0% trajectory](figures/C15_ice_weather_ice_friction_trajectory.png)

### C16_heldout_nominal | Heldout | Nominal | mixed arterial free flow mild seed46 | SOC 0.65, mass 1.15, grade 2.0%

- reason: large old-vs-new trajectory/metric difference; new confidence adapter improves baseline composite physical score
- trajectory CSV: `trajectories/C16_heldout_nominal.csv`

![C16_heldout_nominal | Heldout | Nominal | mixed arterial free flow mild seed46 | SOC 0.65, mass 1.15, grade 2.0% trajectory](figures/C16_heldout_nominal_trajectory.png)

