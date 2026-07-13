# Meta-RL Production Calibration Knob 조사 보고서

## 핵심 결론

현재 Meta-RL adapter의 `delta_P_eng_on`, `delta_SOC_ref` 두 offset은
production-like boundary를 지키기에는 좋지만, 이미 SOC deficit과 demand 조건을
직접 반영하는 `adaptive_rule_calibration`을 유의하게 넘기기에는 action authority가
좁다. 다음 단계는 direct torque/power command가 아니라 실제 EMS calibration
table/gain으로 존재할 법한 threshold, hysteresis, dwell time, safety margin,
feedback gain을 bounded offset/multiplier로 추가하는 방향이 가장 자연스럽다.

권한 경계는 유지한다.

```text
Meta-RL -> bounded calibration offsets/multipliers
Map/rule EMS -> engine state, mode decision, power split, final commands
```

## 실제 EMS에 가까운 knob 후보

| Knob | 의미 | Meta-RL action화 | 판단 |
| --- | --- | --- | --- |
| Engine start/stop threshold, hysteresis, dwell time | 엔진을 켜는 요구 power/SOC 조건, hysteresis 폭, 최소 on/off 유지 시간 | `delta_P_hysteresis`, `delta_min_on_time`, `delta_min_off_time`, `delta_engine_on_SOC_sensitivity` | 우선 추가 |
| SOC target, sustaining setpoint, feedback gain | charge-sustaining 목표 SOC와 SOC error 회복 gain | `delta_SOC_ref`, `delta_SOC_recovery_gain` | 우선 추가 |
| Battery charge/discharge power limit margin | BMS max charge/discharge power 주변의 보수 margin 또는 derating multiplier | `battery_power_margin_scale` | 강한 후보 |
| Regeneration availability or regen margin | 감속 시 회수 가능한 regen 한계의 보수 margin | `regen_margin_scale` | 강한 후보 |
| EV or motor-assist power limit, mode threshold | 전동 구동 허용 power/mode threshold | `delta_EV_assist_limit` 또는 `delta_mode_threshold` | 권한 경계 주의 |
| ECMS equivalence factor or SOC-costate gain | fuel과 electric energy tradeoff를 정하는 factor/gain | `delta_equivalence_factor` | ECMS-lite variant 권장 |
| Warm-up operating point, charging power target | coolant/heating request 기반 engine operating point offset | `warmup_engine_speed_offset`, `cabin_heat_SOC_reserve` | thermal/accessory model 전까지 보류 |

## V3 권장 action set

```text
Keep:
  residual_delta_P_eng_on
  residual_delta_SOC_ref

Add:
  delta_SOC_recovery_gain
  delta_engine_on_SOC_sensitivity
  delta_P_hysteresis
  delta_min_on_time
  delta_min_off_time
  battery_power_margin_scale
  regen_margin_scale

Defer until thermal/accessory model exists:
  warmup_engine_speed_offset
  cabin_heat_SOC_reserve
  temperature_derating_slope
```

## 논문 표현

사용 가능:

```text
Meta-RL as a task-aware calibration adapter over a production-like map/rule EMS.
Bounded offsets/multipliers on calibration thresholds, gains, dwell times, and safety margins.
```

피할 표현:

```text
Meta-RL directly controls engine/motor power split.
OEM calibration or exact production EMS.
Two simple offsets are enough to always beat a handcrafted adaptive rule.
```

## 근거 링크

- https://www.researchgate.net/publication/275258614_Optimal_Control_based_Calibration_of_Rule-Based_Energy_Management_for_Parallel_Hybrid_Electric_Vehicles
- https://patents.google.com/patent/US9573585B2/en
- https://arxiv.org/abs/2203.16126
- https://www.epa.gov/sites/default/files/2018-10/documents/sae-paper-2018-01-0413.pdf
- https://patents.google.com/patent/CN101133514B/en
- https://patents.google.com/patent/CN117818424A/en
- https://patents.google.com/patent/US20110166732A1/en
- https://patents.justia.com/patent/12208788
- https://publications.lib.chalmers.se/records/fulltext/203412/local_203412.pdf
