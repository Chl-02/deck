# Confidence-Gated Meta-RL Adapter 결과 보고서

## 요약

이번 실험은 Meta-RL adapter가 계속 `delta_P_eng_on`, `delta_SOC_ref`만 내보내는 bounded calibration adapter라는 전제를 유지하면서, runtime confidence가 낮을 때 action을 줄이거나 zero-offset baseline EMS로 복귀하는 기능을 추가한 것이다.

confidence는 distribution confidence, safety-margin confidence, stability confidence의 minimum으로 정의했다. Distribution confidence는 학습 profile의 robust median/IQR envelope에서 벗어나는 정도를 보고, safety confidence는 SOC/battery-limit/최근 constraint margin을 보고, stability confidence는 action saturation/sign flip/rate를 본다.

SOC가 낮을 때는 모든 action을 줄이는 것이 아니라 `delta_P_eng_on > 0`, `delta_SOC_ref < 0`처럼 방전을 더 허용할 수 있는 방향만 억제한다. SOC가 높을 때는 반대로 charge-favoring 방향을 억제한다. 반복 constraint 또는 nonfinite action은 `[0, 0]` fallback으로 보낸다.

## Heldout 평균 비교

| controller | reward | SOC tail risk | SOC RMSE | final SOC err | constraint | SOC-corr fuel | confidence | attenuation | fallback |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Baseline | -128.1088 | 0.51980 | 0.06701 | 0.06893 | 0.375 | 0.08953 | 1.000 | 1.000 | 0.000 |
| Old adapter, no gate | -130.2368 | 0.52427 | 0.06801 | 0.06949 | 0.400 | 0.08948 | 1.000 | 1.000 | 0.000 |
| Gate current bound | -127.7215 | 0.51383 | 0.06697 | 0.06385 | 0.425 | 0.09002 | 0.513 | 0.747 | 0.000 |

## Combined Stress 평균 비교

| controller | SOC tail risk | SOC RMSE | final SOC err | constraint | confidence | attenuation | fallback | direction suppression |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Baseline | 0.98307 | 0.10286 | 0.06255 | 1.500 | 1.000 | 1.000 | 0.000 | 0.000 |
| Old adapter, no gate | 0.97626 | 0.10237 | 0.06378 | 1.600 | 1.000 | 1.000 | 0.000 | 0.000 |
| Gate current bound | 0.98095 | 0.10274 | 0.06246 | 1.500 | 0.182 | 0.493 | 0.020 | 0.745 |

## Lexicographic selection

선택 기준은 heldout constraint <= baseline, SOC tail risk <= baseline, SOC-corrected fuel 악화 2% 이내, engine switch 증가 10% 이내, 이후 SOC_RMSE/final SOC/reward 순이다.
- Gate current bound seed `20260709_step_50000`: SOC tail Δ -0.02281, SOC RMSE Δ -0.00115, constraint Δ 0.0000, fuel Δ 0.00046.
- Old adapter, no gate seed `20260709`: SOC tail Δ 0.00908, SOC RMSE Δ 0.00111, constraint Δ 0.0000, fuel Δ 0.00003.

## 해석

confidence gate의 핵심 가치는 평균 reward를 키우는 것이 아니라, OOD/stress에서 adapter 개입량이 자동으로 줄어드는지 눈으로 확인할 수 있게 만든 점이다. Confidence boxplot과 attenuation scatter에서 stress/weather split의 confidence가 nominal heldout보다 낮고 action attenuation이 커진다면, production-like deployment claim에 필요한 fallback behavior를 보여줄 수 있다.

wider bound는 confidence gate가 있을 때 action authority를 넓혀도 되는지 보는 실험이다. Wider가 SOC tail risk를 줄이면서 constraint/fuel/switch guardrail을 지키면 추가 권한이 타당하고, 그렇지 않으면 current bound가 더 production-like하다.

성능이 개선되지 않는 경우에는 gate가 너무 보수적이어서 학습된 action이 baseline에 가까워졌거나, distribution envelope가 stress를 과도하게 OOD로 판단해 유효한 charge-favoring action까지 줄였을 수 있다. 이 경우 threshold/top-k/feature scale ablation이 필요하다.

## Figures

### Metric bars

![Metric bars](figures/confidence_metric_bars.png)

### Confidence boxplot

![Confidence boxplot](figures/confidence_boxplot_by_split.png)

### Representative trajectory

![Representative trajectory](figures/confidence_representative_timeseries.png)

### Confidence components

![Confidence components](figures/confidence_components_timeseries.png)

### Action attenuation scatter

![Action attenuation scatter](figures/confidence_attenuation_scatter.png)

### Direction-aware gate case

![Direction-aware gate case](figures/confidence_direction_gate_case.png)

### Action-bound tradeoff

![Action-bound tradeoff](figures/confidence_bound_tradeoff.png)

