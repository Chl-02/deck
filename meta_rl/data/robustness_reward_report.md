# Robustness Reward v2 재학습 결과 보고서

## 요약

새 reward는 `SOC_corrected_fuel`을 reward에서 제외하고, normalized fuel/SOC tail/battery-limit proximity/constraint/action smoothness penalty로 구성했다. Meta-RL action은 계속 `delta_P_eng_on`, `delta_SOC_ref`만 사용한다.

Heldout 5-seed 평균에서 새 reward policy는 baseline 대비 SOC tail risk -0.00169, SOC_RMSE -0.00048, 최종 SOC 오차 -0.00137만큼 낮췄다. 다만 constraint step은 0.0344, SOC-corrected fuel은 0.00006, engine switch는 0.0938만큼 증가했다.

기존 reward policy도 같은 robustness-v2 평가에서 SOC tail risk -0.00589, SOC_RMSE -0.00043 개선을 보였으므로, 새 reward가 모든 평균 metric을 압도한다고 주장하면 과하다. 새 reward의 장점은 claim에 맞는 위험항을 reward/로그/선택 기준으로 명시하고, guardrail을 통과하는 seed를 선별할 수 있게 만든 데 있다.

## Heldout 평균 비교

| controller | reward | SOC tail risk | SOC RMSE | abs final SOC error | constraint steps | SOC-corrected fuel | engine switches |
|---|---:|---:|---:|---:|---:|---:|---:|
| baseline | -94.7484 | 0.33538 | 0.06180 | 0.05466 | 0.906 | 0.09941 | 7.375 |
| old_adapter | -93.6501 | 0.32949 | 0.06137 | 0.05426 | 0.928 | 0.09941 | 7.403 |
| new_adapter | -94.6648 | 0.33369 | 0.06132 | 0.05329 | 0.941 | 0.09947 | 7.469 |

## Lexicographic model selection

- 선택된 기존 reward seed: `20260707`
- 선택된 새 reward seed: `20260708`
- 선택 기준: heldout constraint <= baseline, SOC tail risk <= baseline, SOC-corrected fuel 악화 2% 이내, engine switch 증가 10% 이내, 이후 SOC_RMSE/최종 SOC/reward 순.
- 기존 reward 선택 seed seed `20260707`: SOC tail risk Δ -0.00144, SOC RMSE Δ -0.00011, final SOC error Δ -0.00000, constraint Δ -0.0469, SOC-corrected fuel Δ -0.00001, engine switch Δ 0.0000.
- 새 reward 선택 seed seed `20260708`: SOC tail risk Δ -0.00072, SOC RMSE Δ -0.00017, final SOC error Δ -0.00010, constraint Δ -0.0469, SOC-corrected fuel Δ 0.00005, engine switch Δ -0.0469.

## 해석

새 reward의 5-seed 평균은 SOC regulation 쪽으로 이동했지만, constraint robustness는 seed 선택 없이 평균만 보면 아직 결정적으로 좋아졌다고 보기 어렵다. 따라서 논문에서는 `production-like EMS의 task-aware calibration adapter가 unseen driving condition에서 SOC regulation을 개선하고, normalized robustness reward와 lexicographic guardrail selection으로 constraint/fuel/switch 위험을 통제한다` 정도가 현재 결과에 맞다.

새 reward seed 중에는 reward와 SOC tail 개선이 큰 대신 constraint guardrail을 넘는 경우가 있다. 그래서 단순 평균 최고 reward checkpoint가 아니라, constraint -> SOC tail -> fuel -> switch -> SOC error 순의 lexicographic selection을 반드시 model selection 절차로 문서화해야 한다.

SOC_corrected_fuel은 reward에 포함하지 않았고, 표에서는 charge-sustaining fairness guardrail로만 해석한다.

## Figures

### Heldout metric bars

![Heldout metric bars](figures/robustness_metric_bars.png)

### Seed paired deltas

![Seed paired deltas](figures/robustness_seed_deltas.png)

### Reward component breakdown

![Reward component breakdown](figures/robustness_component_breakdown.png)

### SOC-corrected fuel vs SOC RMSE tradeoff

![SOC-corrected fuel vs SOC RMSE tradeoff](figures/robustness_tradeoff.png)

### Representative SOC trajectory

![Representative SOC trajectory](figures/robustness_representative_soc.png)

### Representative action trajectory

![Representative action trajectory](figures/robustness_action_trajectory.png)

### Battery limit usage trajectory

![Battery limit usage trajectory](figures/robustness_battery_limit_usage.png)

