# HEV Meta-EMS Meta-RL Experiment Design Report

작성일: 2026-07-06

## 1. 논문 Claim

본 실험의 중심 주장은 다음이다.

> A production-like HEV map/rule EMS can be improved by a task-aware Meta-RL calibration adapter, which enhances SOC regulation and constraint robustness under unseen driving conditions while preserving bounded, interpretable calibration authority.

핵심은 Meta-RL이 차량의 엔진/모터 파워 명령을 직접 만들지 않는다는 점이다. Meta-RL은 제한된 calibration offset만 출력하고, 최종 engine state, EMS mode, power split은 기존 map/rule EMS가 유지한다.

```text
Meta-RL -> delta_P_eng_on, delta_SOC_ref
Map/rule EMS -> engine state, EMS mode, power split, final commands
```

## 2. Testbed 위치

현재 모델은 실제 OEM ECU 복제가 아니라, HEV EMS 연구를 위한 power-domain simplified testbed이다. 차량/컴포넌트 스케일은 public FASTSim Prius-class data에 기반하고, EMS calibration map과 SOC reference, hysteresis, timer, simplified battery limits는 투명한 연구용 calibration으로 둔다.

이 표현은 논문에서 중요하다. 성능 claim은 특정 production Prius calibration을 이겼다는 뜻이 아니라, production-like map/rule EMS의 bounded task-aware calibration adapter가 unseen driving condition에서 SOC regulation과 constraint robustness를 개선할 수 있는지 검증하는 것이다.

## 3. 알고리즘 구조

기본 알고리즘은 probabilistic PEARL-style context encoder + SAC이다.

```text
support history
  -> raw sequence branch
  -> physics-summary branch
  -> q_phi(z | support) = N(mu_z, sigma_z)
  -> z sample / latent context
  -> SAC policy(obs, z)
  -> delta_P_eng_on, delta_SOC_ref
  -> bounded/rate-limited adapter interface
  -> map/rule EMS
```

Raw branch는 최근 시계열의 형태를 보고, summary branch는 HEV 물리 의미가 있는 causal feature를 본다. 이 둘을 합쳐 latent task variable `z`를 추정한다.

## 4. Action Interface

논문 기본 action은 두 개의 calibration offset이다.

| Action | 의미 | Bound |
|---|---|---:|
| `delta_P_eng_on` | engine-on threshold offset | `[-3, +3] kW` |
| `delta_SOC_ref` | SOC reference offset | `[-0.01, +0.01]` |

추가 제한:

```text
delta_P_eng_on rate limit = 0.5 kW/s
delta_SOC_ref rate limit = 0.001 /s
adapter target update period = 10 s
```

따라서 policy가 불안정한 값을 내더라도 실제 EMS에는 bounded and rate-limited calibration change만 전달된다.

## 5. Observation, Support, Query

제어용 observation은 현재 상태 중심이다.

```text
current speed
current acceleration / P_dem
current SOC
engine_on
previous action
optional current road_grade
```

Context encoder는 support history를 사용한다.

```text
raw history = 30 s
support summary = 120 s
query horizon = 240 s
sample rate = 1 Hz
z_dim = 4
```

Support-query는 다음과 같이 해석한다.

| 구분 | 역할 |
|---|---|
| Support | 지금 주행/상태가 어떤 task인지 추정하는 과거 causal evidence |
| Query | 추정된 `z`를 가지고 실제 control 성능을 평가하는 미래 rollout |
| Rolling adaptation | 실제 EMS-like 운용에서 최근 history로 `z_t`를 계속 갱신하는 방식 |

## 6. Task 정의

Task는 사람이 붙인 도메인 라벨이 아니라 다음 조합으로 정의한다.

```text
task = drive segment + slow operating condition
```

구현 관점의 variation:

```text
profile_id
initial_SOC
road_grade condition/profile
mass_scale
```

`source_family`, `source_id`, `profile_class`, `driver_style_label`은 split/reporting metadata로 유지하되, 기본 policy/context input으로 직접 넣지 않는다. 즉, 알고리즘이 "EPA", "SUMO", "urban", "aggressive"라는 이름을 외워서 행동하지 않게 한다.

## 7. Encoder Feature

Raw branch 후보:

```text
speed
acceleration
P_dem
SOC
engine_on
previous_action
```

Summary branch 후보:

```text
accel_std_10s
P_dem_90_10s
mean_speed_60s
idle_fraction_60s
stop_count_per_km_60s
P_dem_95_60s
regen_opportunity_60s
SOC_slope_120s
mean_P_dem_120s
road_grade_mean_120s
```

금융 차트 보조지표류는 이름을 그대로 가져오지 않고, causal multi-timescale driving indicator로 재정의한다. 예: short-long EMA gap, rolling variability, change score, persistence score.

## 8. Reward와 논문 Metric

Reward는 학습 목적함수이고, 논문 claim의 직접 지표는 아니다.

Reward 구성:

```text
- fuel_consumption
- SOC_tracking_error
- terminal_SOC_error
- engine_switching_penalty
- constraint_violation_penalty
- battery_throughput_penalty
- action_magnitude_penalty
- action_rate_penalty
```

논문 primary metric:

```text
SOC_RMSE
|final_SOC_error|
constraint_violation_steps
```

Guardrail metric:

```text
SOC_corrected_fuel
engine_switch_count
```

성공 기준:

```text
heldout SOC_RMSE reduction >= 10%
heldout |final_SOC_error| reduction >= 20%
heldout constraint violation reduction >= 30%
SOC-corrected fuel degradation <= 2%
engine switch increase <= 10%
```

## 9. Dataset Split

Profile split은 source metadata를 활용하지만, source metadata는 policy input이 아니다.

기본 원칙:

- EPA 표준 사이클은 heldout evaluation anchor로 둔다.
- NGSIM 등 짧은 실차 micro-profile은 validation/heldout 보조로 둔다.
- DriveCAT은 vocation 단위 holdout을 포함한다.
- SUMO profile은 feature-diverse split을 유지하고, 일부 unseen network/source를 heldout으로 둔다.
- Long-horizon composite는 학습이 아니라 sustainability/stress evaluation에 둔다.

목표는 단순히 train/test random split 점수를 높이는 것이 아니라, unseen driving condition에서 task-aware adaptation이 작동하는지 보는 것이다.

## 10. Experiment Matrix

Main method:

```text
raw_summary_probabilistic_encoder_SAC
5 seeds
200k training steps per seed
eval every 10k steps
64 profiles per split
```

Minimum comparisons:

```text
map_rule_zero_offset
summary_only_encoder_SAC
raw_only_encoder_SAC
raw_summary_probabilistic_encoder_SAC
```

Sensitivity candidates:

```text
support_length: 30 / 60 / 120 s
z_dim: 2 / 4 / 8
wider action bound
reward_without_action_rate_penalty
reward_without_engine_switch_penalty
```

## 11. 해석 기준

좋은 결과는 단순히 reward가 증가하는 것이 아니다. 다음이 함께 보여야 한다.

1. Heldout SOC regulation 개선
2. Constraint violation 감소
3. SOC-corrected fuel 악화 제한
4. Engine switching guardrail 통과
5. Offset action이 해석 가능한 범위에 머무름
6. Source/domain label 없이도 latent context가 주행 패턴 변화에 반응함

이 구조에서 novelty는 새로운 SAC/PEARL 수식 자체가 아니라, production-like map/rule EMS의 권한을 보존하면서 Meta-RL을 bounded calibration adapter로 제한하고, support-query/heldout-task generalization으로 EMS 배포 관점의 강건성을 검증하는 실험 설계에 있다.
