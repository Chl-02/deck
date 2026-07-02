# Internal Logic Validation Report

- model: `HEV_MetaEMS_Model`
- generated: 01-Jul-2026 17:01:21
- overall status: **WARN**
- static audit: `/home/yejun/meta_rl/docs/internal_logic_audit.md`
- read-only model analysis: `/home/yejun/meta_rl/results/validation/internal_logic_model_analysis`

## Summary

| Area | Status | Notes |
|---|---|---|
| Static logic audit | WARN | 3 documented risks |
| Transition table | WARN | actual branch order documented; one low-SOC/min-off convention is ambiguous |
| Maps and calibrations | WARN | engine maps, battery limits, regen limit plotted |
| Unit tests | PASS | 8/8 pass |
| Property tests | PASS | 10000 samples, 0 violations |
| Fault injection | PASS | 8/8 pass |
| Reward audit | PASS | 6 cycles |

## Static Audit Summary

Detailed static audit is in `/home/yejun/meta_rl/docs/internal_logic_audit.md`.

Key risks/conventions:

- Regen mode with engine_on_cmd=true during minimum-on hold commands P_eng_req=0 but PowertrainPlant applies idle fuel while the physical engine remains on.
- When low-SOC start is blocked by minimum off-time, engine_on_request=true and engine_state=3, but EMS_mode falls through to EV until the guarded start is allowed.
- delta_P_eng_on bound is large relative to the lowest base threshold; threshold saturation protects the output but low-speed sensitivity should be considered in policy design.

## EMS Transition Table

Convention:

- `engine_on_request` is the raw supervisory request before global timer guards.
- `engine_on_cmd` is the guarded physical engine state command.
- `EMS_mode` is a power-management mode, not the physical engine state.
- Regen can coexist with `engine_on_cmd=true` during minimum-on hold; engine traction power is zero, but plant idle fuel may remain until physical off.

| Condition | Previous engine state | Timer guard | engine_on_request | engine_on_cmd result | EMS_mode | transition_reason | Match to branch order |
|---|---|---|---:|---:|---:|---:|---|
| `P_dem < -0.1` | Off | n/a | 0 | 0 | 3 Regen | 0 | Match: Regen request branch, no transition needed |
| `P_dem < -0.1` | On | `on_timer < min_on` | 0 | 1 | 3 Regen | 5 | Match: Regen request then MinOnHold guard |
| `P_dem < -0.1` | On | `on_timer >= min_on` | 0 | 0 | 3 Regen | 4 | Match: Regen request then guarded off |
| `SOC < SOC_low` | Off | `off_timer >= min_off` | 1 | 1 | 2 Charge | 2 | Match: Charge request then guarded on |
| `SOC < SOC_low` | Off | `off_timer < min_off` | 1 | 0 | 0 EV | 6 | Ambiguous convention: Charge request exists but mode falls through to EV while start is blocked |
| `P_dem > P_on` | Off | `off_timer >= min_off` | 1 | 1 | 1 HEV | 1 | Match: power threshold start |
| `P_dem > P_on` | Off | `off_timer < min_off` | 1 | 0 | 0 EV | 6 | Match: start blocked by min-off guard |
| `P_dem < P_off && SOC > SOC_ref` | On | `on_timer >= min_on` | 0 | 0 | 0 EV | 3 | Match: hysteresis off |
| `P_dem < P_off && SOC > SOC_ref` | On | `on_timer < min_on` | 0 | 1 | 1 HEV | 5 | Match: off blocked by min-on guard |

## Map and Calibration Sanity

| Check | Result |
|---|---:|
| P_on min kW | 5 |
| P_on max kW | 70 |
| P_off min kW | 0 |
| P_off max kW | 65 |
| threshold monotone speed | 1 |
| threshold monotone SOC | 1 |
| battery discharge shape | 1 |
| battery charge shape | 1 |
| regen limit sane | 1 |
| delta/base-min ratio | 2 |

Plots:

- `/home/yejun/meta_rl/results/validation/internal_logic_plots_20260701_170112/engine_on_off_threshold_maps.png`
- `/home/yejun/meta_rl/results/validation/internal_logic_plots_20260701_170112/battery_power_limits.png`
- `/home/yejun/meta_rl/results/validation/internal_logic_plots_20260701_170112/regen_limit_surface.png`
- `/home/yejun/meta_rl/results/validation/internal_logic_plots_20260701_170112/soc_ref_bounds.png`

Notes:

- delta_P_eng_on bound exceeds the minimum base threshold; adapted threshold saturation is active at low threshold points.
- regen_limit has a 0.2 speed factor floor, so the limit is nonzero at zero vehicle speed when SOC room exists.

## Unit Test Results

| Test | Status | Expected | Actual |
|---|---|---|---|
| low SOC + positive demand -> Charge mode request | PASS | EMS_mode=2, engine_on_request=1, engine_on_cmd=1, transition_reason=2 | mode=2, request=1, engine_on=1, engine_state=1, reason=2, P_eng=25.3, P_mot=-15.3, P_on=9.632, SOC_ref=0.55 |
| negative demand -> Regen mode | PASS | EMS_mode=3, request=0, engine_on_cmd=0, P_eng_req=0, P_mot_req<=0 | mode=3, request=0, engine_on=0, engine_state=0, reason=0, P_eng=0, P_mot=-5, P_on=23.28, SOC_ref=0.55 |
| engine off + high P_dem + off_timer satisfied -> engine on | PASS | high P_dem above adapted threshold starts engine with reason=1 | mode=1, request=1, engine_on=1, engine_state=1, reason=1, P_eng=35, P_mot=0, P_on=27.6, SOC_ref=0.55 |
| engine on + low P_dem + high SOC + on_timer satisfied -> engine off | PASS | after min on-time, low P_dem and high SOC turn engine off with reason=3 | mode=0, request=0, engine_on=0, engine_state=0, reason=3, P_eng=0, P_mot=0, P_on=40.4, SOC_ref=0.55 |
| engine on + Regen + on_timer not satisfied -> engine_state not forced off | PASS | Regen requests off, but physical engine remains guarded on with reason=5 | mode=3, request=0, engine_on=1, engine_state=2, reason=5, P_eng=0, P_mot=-8, P_on=27.6, SOC_ref=0.55 |
| meta_enable=0 + nonzero offsets -> offsets ignored | PASS | delta_P_eng_on=0 and delta_SOC_ref=0 when meta_enable=0 | delta_P=0, delta_SOC=0 |
| NaN/Inf offsets -> fallback and finite outputs | PASS | finite bounded meta outputs and finite EMS outputs | delta_P=0, delta_SOC=0, P_on=20.8, SOC_ref=0.55 |
| SOC below hard minimum -> no EV discharge | PASS | P_batt_actual<=0 and battery flag 16 set at SOC_min under discharge request | P_batt_cmd=5, P_batt_actual=0, battery_flags=16 |

JSON: `/home/yejun/meta_rl/results/validation/ems_logic_unit_results.json`

## Property-Based Test Results

- samples: 10000
- violations: 0
- saved examples: 0
- JSON: `/home/yejun/meta_rl/results/validation/ems_logic_property_results.json`

## Fault Injection Results

| Test | Status | Expected | Actual |
|---|---|---|---|
| extreme positive offsets saturate after rate limit | PASS | delta_P_eng_on=+10 kW, delta_SOC_ref=+0.05 after repeated saturated input | delta_P=10, delta_SOC=0.05 |
| extreme negative offsets saturate after rate limit | PASS | delta_P_eng_on=-10 kW, delta_SOC_ref=-0.05 after repeated saturated input | delta_P=-10, delta_SOC=-0.05 |
| NaN/Inf offsets fall back to finite values | PASS | NaN/Inf raw offsets return zero finite outputs | delta_P=0, delta_SOC=0 |
| forced low discharge battery limit derates motoring power | PASS | P_batt_cmd<=1 kW and discharge-limit flag 4 set | P_batt_cmd=1, P_mot_cmd=0.92283, flags=4 |
| forced low charge battery limit derates regen power | PASS | P_batt_cmd>=-1 kW and charge-limit flag 8 set | P_batt_cmd=-1, P_mot_cmd=-1.08469, flags=8 |
| extreme positive P_dem is saturated by engine/motor/battery limits | PASS | engine, motor, and battery discharge commands saturate within limits | EMS_mode=1, P_eng_cmd=71, P_mot_cmd=46.92, P_batt=51, flags=6 |
| extreme negative P_dem is limited by regen and charge limits | PASS | Regen request is clipped by EMS regen limit and battery charge limit | P_regen_max=29.7143, P_mot_req=-29.7143, P_batt=-27.9314, P_chg=-35, flags=0 |
| constraint flags aggregate EMS, limiter, and battery faults | PASS | EMS, limiter, and battery flags contribute to nonzero aggregate flags | ems=1, limiter=6, battery=32, aggregate=39 |

JSON: `/home/yejun/meta_rl/results/validation/fault_injection_results.json`

## Reward Function Audit

Formula:

```text
-fuel_rate - 0.08*abs(SOC-SOC_ref_base) - 0.02*engine_switch - 5.0*constraint_violation - 2e-4*abs(P_batt)
```

| Cycle | Status | fuel | SOC | switching | constraint | battery | reconstructed | logged | Notes |
|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| urban | PASS | -0.0766786 | -0.504756 | -0.32 | -0 | -0.233696 | -1.13513 | -1.13513 | abs reconstruction error 4.44e-16 |
| highway | PASS | -0.203303 | -1.85688 | -0.1 | -0 | -0.406542 | -2.56673 | -2.56673 | abs reconstruction error 4.44e-16 |
| high_load | PASS | -0.328667 | -0.62555 | -0.18 | -0 | -0.27864 | -1.41286 | -1.41286 | abs reconstruction error 0 |
| low_SOC_urban | PASS | -0.0971752 | -1.33797 | -0.34 | -0 | -0.26927 | -2.04441 | -2.04441 | abs reconstruction error 0 |
| low_SOC_high_load | PASS | -0.352076 | -1.01145 | -0.16 | -0 | -0.321264 | -1.84479 | -1.84479 | abs reconstruction error 2.22e-16 |
| SOC_recovery_test | PASS | -0.182921 | -1.28212 | -0.14 | -0 | -0.374022 | -1.97907 | -1.97907 | abs reconstruction error 2.22e-16 |

JSON: `/home/yejun/meta_rl/results/validation/reward_audit_results.json`

## Remaining Issues and Recommendations

- Keep the current EMS; no model behavior change was made by this audit.
- Consider whether `EMS_mode` should expose a separate `ChargePending` or `StartBlocked` mode when low SOC requests engine-on but min-off guard blocks the physical start.
- Decide whether Regen with guarded engine-on should keep the current idle fuel convention or implement explicit fuel cut while the engine is physically spinning.
- Keep meta-RL restricted to bounded `delta_P_eng_on` and `delta_SOC_ref`; do not let it command `P_eng_cmd` or `P_mot_cmd` directly.
