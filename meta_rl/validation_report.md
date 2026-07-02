# HEV Simulink Model Validation Report

## 1. Model Information
- model name: `HEV_MetaEMS_Model`
- model path: `/home/yejun/meta_rl/models/modified/HEV_MetaEMS_Model.slx`
- simulation date: 01-Jul-2026 17:00:10
- solver type: Fixed-step discrete
- sample time: 1 s
- drive cycles tested: urban, highway, high_load, low_SOC_urban, low_SOC_high_load, SOC_recovery_test
- output directory: `/home/yejun/meta_rl/results/validation`

Meta-RL interface principle: meta-RL must not directly output engine or motor commands. It may adapt `delta_P_eng_on` and optionally `delta_SOC_ref`; the map/rule EMS must remain responsible for `P_eng_cmd` and `P_mot_cmd`.

## 2. Summary
| Category | Status | Notes |
|---|---|---|
| Vehicle dynamics | PASS | Longitudinal dynamics and demand reconstruction. |
| Power balance | PASS | P_dem versus engine plus motor actual power. |
| SOC model | PASS | SOC integration and battery limits. |
| Fuel model | PASS | Fuel-rate sign, total fuel monotonicity, efficiency sanity. |
| EMS logic | PASS | Mode validity, hysteresis, and timer behavior. |
| Meta interface | PASS | Offset-only meta-RL interface checks. |

Overall status: **PASS**

### Required Signal Availability
- urban missing: none
- urban aliases: delta_P_eng_on -> delta_P_eng_on_bounded, delta_SOC_ref -> delta_SOC_ref_bounded
- urban derived: time, v_ref
- highway missing: none
- highway aliases: delta_P_eng_on -> delta_P_eng_on_bounded, delta_SOC_ref -> delta_SOC_ref_bounded
- highway derived: time, v_ref
- high_load missing: none
- high_load aliases: delta_P_eng_on -> delta_P_eng_on_bounded, delta_SOC_ref -> delta_SOC_ref_bounded
- high_load derived: time, v_ref
- low_soc_urban missing: none
- low_soc_urban aliases: delta_P_eng_on -> delta_P_eng_on_bounded, delta_SOC_ref -> delta_SOC_ref_bounded
- low_soc_urban derived: time, v_ref
- low_soc_high_load missing: none
- low_soc_high_load aliases: delta_P_eng_on -> delta_P_eng_on_bounded, delta_SOC_ref -> delta_SOC_ref_bounded
- low_soc_high_load derived: time, v_ref
- soc_recovery_test missing: none
- soc_recovery_test aliases: delta_P_eng_on -> delta_P_eng_on_bounded, delta_SOC_ref -> delta_SOC_ref_bounded
- soc_recovery_test derived: time, v_ref

## 3. Vehicle Dynamics Checks
### urban: PASS
| Check | Status | Notes |
|---|---|---|
| NaN/Inf signal count | PASS | nonfinite_count=0 |
| Vehicle speed nonnegative | PASS | negative_speed_count=0 |
| Speed derivative matches acceleration | PASS | max_abs_accel=5.58 m/s^2, accel_dvdt_rmse=0.422 m/s^2 |
| Drive-cycle tracking error | PASS | mean_abs=0 m/s, max_abs=0 m/s |
| Demand power reconstruction and sign | PASS | comparison=P_wheel, traction_sign_bad=0, braking_sign_bad=0 |

### highway: PASS
| Check | Status | Notes |
|---|---|---|
| NaN/Inf signal count | PASS | nonfinite_count=0 |
| Vehicle speed nonnegative | PASS | negative_speed_count=0 |
| Speed derivative matches acceleration | PASS | max_abs_accel=0.328 m/s^2, accel_dvdt_rmse=0.0282 m/s^2 |
| Drive-cycle tracking error | PASS | mean_abs=0 m/s, max_abs=0 m/s |
| Demand power reconstruction and sign | PASS | comparison=P_wheel, traction_sign_bad=0, braking_sign_bad=0 |

### high_load: PASS
| Check | Status | Notes |
|---|---|---|
| NaN/Inf signal count | PASS | nonfinite_count=0 |
| Vehicle speed nonnegative | PASS | negative_speed_count=0 |
| Speed derivative matches acceleration | PASS | max_abs_accel=0.67 m/s^2, accel_dvdt_rmse=0.0434 m/s^2 |
| Drive-cycle tracking error | PASS | mean_abs=0 m/s, max_abs=0 m/s |
| Demand power reconstruction and sign | PASS | comparison=P_wheel, traction_sign_bad=0, braking_sign_bad=0 |

### low_soc_urban: PASS
| Check | Status | Notes |
|---|---|---|
| NaN/Inf signal count | PASS | nonfinite_count=0 |
| Vehicle speed nonnegative | PASS | negative_speed_count=0 |
| Speed derivative matches acceleration | PASS | max_abs_accel=5.58 m/s^2, accel_dvdt_rmse=0.422 m/s^2 |
| Drive-cycle tracking error | PASS | mean_abs=0 m/s, max_abs=0 m/s |
| Demand power reconstruction and sign | PASS | comparison=P_wheel, traction_sign_bad=0, braking_sign_bad=0 |

### low_soc_high_load: PASS
| Check | Status | Notes |
|---|---|---|
| NaN/Inf signal count | PASS | nonfinite_count=0 |
| Vehicle speed nonnegative | PASS | negative_speed_count=0 |
| Speed derivative matches acceleration | PASS | max_abs_accel=0.67 m/s^2, accel_dvdt_rmse=0.0434 m/s^2 |
| Drive-cycle tracking error | PASS | mean_abs=0 m/s, max_abs=0 m/s |
| Demand power reconstruction and sign | PASS | comparison=P_wheel, traction_sign_bad=0, braking_sign_bad=0 |

### soc_recovery_test: PASS
| Check | Status | Notes |
|---|---|---|
| NaN/Inf signal count | PASS | nonfinite_count=0 |
| Vehicle speed nonnegative | PASS | negative_speed_count=0 |
| Speed derivative matches acceleration | PASS | max_abs_accel=0.719 m/s^2, accel_dvdt_rmse=0.0578 m/s^2 |
| Drive-cycle tracking error | PASS | mean_abs=0 m/s, max_abs=0 m/s |
| Demand power reconstruction and sign | PASS | comparison=P_wheel, traction_sign_bad=0, braking_sign_bad=0 |

## 4. Power Balance Checks
Sign convention used by these checks: `P_mot > 0` means motoring and battery discharge, `P_mot < 0` means regeneration and battery charge, `P_batt > 0` means discharge, and `P_batt < 0` means charge.
### urban: PASS
| Check | Status | Notes |
|---|---|---|
| NaN/Inf signal count | PASS | nonfinite_count=0 |
| P_dem equals P_eng_actual + P_mot_actual | PASS | mean_norm=1.5e-19, max_norm=1.29e-17, samples=86 |
| Engine-off zero engine power and fuel | PASS | violation_count=0 |
| Motor/battery sign convention | PASS | Convention: P_mot>0 motoring/discharge, P_mot<0 regen/charge, P_batt>0 discharge, P_batt<0 charge. motoring_bad=0, regen_bad=0 |

### highway: PASS
| Check | Status | Notes |
|---|---|---|
| NaN/Inf signal count | PASS | nonfinite_count=0 |
| P_dem equals P_eng_actual + P_mot_actual | PASS | mean_norm=1.89e-18, max_norm=3.64e-17, samples=236 |
| Engine-off zero engine power and fuel | PASS | violation_count=0 |
| Motor/battery sign convention | PASS | Convention: P_mot>0 motoring/discharge, P_mot<0 regen/charge, P_batt>0 discharge, P_batt<0 charge. motoring_bad=0, regen_bad=0 |

### high_load: PASS
| Check | Status | Notes |
|---|---|---|
| NaN/Inf signal count | PASS | nonfinite_count=0 |
| P_dem equals P_eng_actual + P_mot_actual | PASS | mean_norm=0, max_norm=0, samples=202 |
| Engine-off zero engine power and fuel | PASS | violation_count=0 |
| Motor/battery sign convention | PASS | Convention: P_mot>0 motoring/discharge, P_mot<0 regen/charge, P_batt>0 discharge, P_batt<0 charge. motoring_bad=0, regen_bad=0 |

### low_soc_urban: PASS
| Check | Status | Notes |
|---|---|---|
| NaN/Inf signal count | PASS | nonfinite_count=0 |
| P_dem equals P_eng_actual + P_mot_actual | PASS | mean_norm=4.66e-19, max_norm=2.58e-17, samples=83 |
| Engine-off zero engine power and fuel | PASS | violation_count=0 |
| Motor/battery sign convention | PASS | Convention: P_mot>0 motoring/discharge, P_mot<0 regen/charge, P_batt>0 discharge, P_batt<0 charge. motoring_bad=0, regen_bad=0 |

### low_soc_high_load: PASS
| Check | Status | Notes |
|---|---|---|
| NaN/Inf signal count | PASS | nonfinite_count=0 |
| P_dem equals P_eng_actual + P_mot_actual | PASS | mean_norm=5.3e-20, max_norm=1.07e-17, samples=202 |
| Engine-off zero engine power and fuel | PASS | violation_count=0 |
| Motor/battery sign convention | PASS | Convention: P_mot>0 motoring/discharge, P_mot<0 regen/charge, P_batt>0 discharge, P_batt<0 charge. motoring_bad=0, regen_bad=0 |

### soc_recovery_test: PASS
| Check | Status | Notes |
|---|---|---|
| NaN/Inf signal count | PASS | nonfinite_count=0 |
| P_dem equals P_eng_actual + P_mot_actual | PASS | mean_norm=6.72e-19, max_norm=3.02e-17, samples=191 |
| Engine-off zero engine power and fuel | PASS | violation_count=0 |
| Motor/battery sign convention | PASS | Convention: P_mot>0 motoring/discharge, P_mot<0 regen/charge, P_batt>0 discharge, P_batt<0 charge. motoring_bad=0, regen_bad=0 |

## 5. SOC and Battery Checks
### urban: PASS
| Check | Status | Notes |
|---|---|---|
| NaN/Inf signal count | PASS | nonfinite_count=0 |
| SOC update reconstruction | PASS | rmse=0, final_error=0 |
| SOC hard bounds | PASS | violation_count=0 |
| Battery charge/discharge limits | PASS | violation_count=0, max_dis=0 kW, max_chg=0 kW |
| Regenerative braking consistency | PASS | regen_samples=120, bad_engine=0, bad_motor=0, bad_batt=0, bad_SOC=0, bad_limit=0 |

### highway: PASS
| Check | Status | Notes |
|---|---|---|
| NaN/Inf signal count | PASS | nonfinite_count=0 |
| SOC update reconstruction | PASS | rmse=0, final_error=0 |
| SOC hard bounds | PASS | violation_count=0 |
| Battery charge/discharge limits | PASS | violation_count=0, max_dis=0 kW, max_chg=0 kW |
| Regenerative braking consistency | PASS | regen_samples=35, bad_engine=0, bad_motor=0, bad_batt=0, bad_SOC=0, bad_limit=0 |

### high_load: PASS
| Check | Status | Notes |
|---|---|---|
| NaN/Inf signal count | PASS | nonfinite_count=0 |
| SOC update reconstruction | PASS | rmse=0, final_error=0 |
| SOC hard bounds | PASS | violation_count=0 |
| Battery charge/discharge limits | PASS | violation_count=0, max_dis=0 kW, max_chg=0 kW |
| Regenerative braking consistency | PASS | regen_samples=72, bad_engine=0, bad_motor=0, bad_batt=0, bad_SOC=0, bad_limit=0 |

### low_soc_urban: PASS
| Check | Status | Notes |
|---|---|---|
| NaN/Inf signal count | PASS | nonfinite_count=0 |
| SOC update reconstruction | PASS | rmse=0, final_error=0 |
| SOC hard bounds | PASS | violation_count=0 |
| Battery charge/discharge limits | PASS | violation_count=0, max_dis=0 kW, max_chg=0 kW |
| Regenerative braking consistency | PASS | regen_samples=120, bad_engine=0, bad_motor=0, bad_batt=0, bad_SOC=0, bad_limit=0 |

### low_soc_high_load: PASS
| Check | Status | Notes |
|---|---|---|
| NaN/Inf signal count | PASS | nonfinite_count=0 |
| SOC update reconstruction | PASS | rmse=0, final_error=0 |
| SOC hard bounds | PASS | violation_count=0 |
| Battery charge/discharge limits | PASS | violation_count=0, max_dis=0 kW, max_chg=0 kW |
| Regenerative braking consistency | PASS | regen_samples=72, bad_engine=0, bad_motor=0, bad_batt=0, bad_SOC=0, bad_limit=0 |

### soc_recovery_test: PASS
| Check | Status | Notes |
|---|---|---|
| NaN/Inf signal count | PASS | nonfinite_count=0 |
| SOC update reconstruction | PASS | rmse=0, final_error=0 |
| SOC hard bounds | PASS | violation_count=0 |
| Battery charge/discharge limits | PASS | violation_count=0, max_dis=0 kW, max_chg=0 kW |
| Regenerative braking consistency | PASS | regen_samples=74, bad_engine=0, bad_motor=0, bad_batt=0, bad_SOC=0, bad_limit=0 |

## 6. Fuel Consumption Checks
### urban: PASS
| Check | Status | Notes |
|---|---|---|
| Fuel rate nonnegative | PASS | negative_count=0 |
| Engine-off fuel convention | PASS | engine_off_fuel_count=0 |
| Total fuel monotonicity | PASS | decrease_count=0 |
| Engine efficiency sanity | PASS | eta_range=[0.129, 0.38], bad_count=0 |

### highway: PASS
| Check | Status | Notes |
|---|---|---|
| Fuel rate nonnegative | PASS | negative_count=0 |
| Engine-off fuel convention | PASS | engine_off_fuel_count=0 |
| Total fuel monotonicity | PASS | decrease_count=0 |
| Engine efficiency sanity | PASS | eta_range=[0.155, 0.38], bad_count=0 |

### high_load: PASS
| Check | Status | Notes |
|---|---|---|
| Fuel rate nonnegative | PASS | negative_count=0 |
| Engine-off fuel convention | PASS | engine_off_fuel_count=0 |
| Total fuel monotonicity | PASS | decrease_count=0 |
| Engine efficiency sanity | PASS | eta_range=[0.162, 0.38], bad_count=0 |

### low_soc_urban: PASS
| Check | Status | Notes |
|---|---|---|
| Fuel rate nonnegative | PASS | negative_count=0 |
| Engine-off fuel convention | PASS | engine_off_fuel_count=0 |
| Total fuel monotonicity | PASS | decrease_count=0 |
| Engine efficiency sanity | PASS | eta_range=[0.121, 0.38], bad_count=0 |

### low_soc_high_load: PASS
| Check | Status | Notes |
|---|---|---|
| Fuel rate nonnegative | PASS | negative_count=0 |
| Engine-off fuel convention | PASS | engine_off_fuel_count=0 |
| Total fuel monotonicity | PASS | decrease_count=0 |
| Engine efficiency sanity | PASS | eta_range=[0.161, 0.38], bad_count=0 |

### soc_recovery_test: PASS
| Check | Status | Notes |
|---|---|---|
| Fuel rate nonnegative | PASS | negative_count=0 |
| Engine-off fuel convention | PASS | engine_off_fuel_count=0 |
| Total fuel monotonicity | PASS | decrease_count=0 |
| Engine efficiency sanity | PASS | eta_range=[0.15, 0.38], bad_count=0 |

## 7. EMS Logic Checks
Mode convention: `0=EV`, `1=HEV`, `2=Charge`, `3=Regen`. Values outside this set are treated as undefined unless the model documentation defines an extension.
### urban: PASS
| Check | Status | Notes |
|---|---|---|
| NaN/Inf signal count | PASS | nonfinite_count=0 |
| EMS request/state logging validity | PASS | invalid_engine_state=0, invalid_transition_reason=0 |
| EMS mode validity | PASS | undefined_mode_count=0 |
| EV mode consistency | PASS | sample_count=142, engine_on_bad_count=0, P_eng_bad_count=0, motor_split_bad_count=0, low_SOC_bad_count=0, discharge_limit_bad_count=0 |
| HEV mode consistency | PASS | sample_count=39, engine_off_bad_count=0, P_eng_range_bad_count=0, motor_split_bad_count=0 |
| Charge mode consistency | PASS | sample_count=0, engine_off_bad_count=0, SOC_condition_bad_count=0, P_eng_less_than_demand_bad_count=0, battery_discharge_bad_count=0 |
| Low-SOC charge activation and SOC recovery | PASS | not a low-SOC validation cycle |
| Regen mode consistency | PASS | sample_count=120, P_dem_bad_count=0, engine_on_request_bad_count=0, P_eng_bad_count=0, motor_sign_bad_count=0, charge_limit_bad_count=0 |
| Engine-on threshold adaptation | PASS | max_abs_error=0 kW |
| SOC reference adaptation | PASS | max_abs_error=0 |
| Engine-on transition condition | PASS | transitions=8, unexplained=0 |
| Engine-off transition condition | PASS | transitions=8, unexplained=0 |
| Engine hysteresis and minimum on/off time | PASS | switches=16, per_min=3.2, min_interval=5 s, timer_viol=0 |
| Logged engine timer guards | PASS | on_guard_viol=0, off_guard_viol=0 |

### highway: PASS
| Check | Status | Notes |
|---|---|---|
| NaN/Inf signal count | PASS | nonfinite_count=0 |
| EMS request/state logging validity | PASS | invalid_engine_state=0, invalid_transition_reason=0 |
| EMS mode validity | PASS | undefined_mode_count=0 |
| EV mode consistency | PASS | sample_count=102, engine_on_bad_count=0, P_eng_bad_count=0, motor_split_bad_count=0, low_SOC_bad_count=0, discharge_limit_bad_count=0 |
| HEV mode consistency | PASS | sample_count=161, engine_off_bad_count=0, P_eng_range_bad_count=0, motor_split_bad_count=0 |
| Charge mode consistency | PASS | sample_count=3, engine_off_bad_count=0, SOC_condition_bad_count=0, P_eng_less_than_demand_bad_count=0, battery_discharge_bad_count=0 |
| Low-SOC charge activation and SOC recovery | PASS | not a low-SOC validation cycle |
| Regen mode consistency | PASS | sample_count=35, P_dem_bad_count=0, engine_on_request_bad_count=0, P_eng_bad_count=0, motor_sign_bad_count=0, charge_limit_bad_count=0 |
| Engine-on threshold adaptation | PASS | max_abs_error=0 kW |
| SOC reference adaptation | PASS | max_abs_error=0 |
| Engine-on transition condition | PASS | transitions=3, unexplained=0 |
| Engine-off transition condition | PASS | transitions=2, unexplained=0 |
| Engine hysteresis and minimum on/off time | PASS | switches=5, per_min=1, min_interval=36 s, timer_viol=0 |
| Logged engine timer guards | PASS | on_guard_viol=0, off_guard_viol=0 |

### high_load: PASS
| Check | Status | Notes |
|---|---|---|
| NaN/Inf signal count | PASS | nonfinite_count=0 |
| EMS request/state logging validity | PASS | invalid_engine_state=0, invalid_transition_reason=0 |
| EMS mode validity | PASS | undefined_mode_count=0 |
| EV mode consistency | PASS | sample_count=73, engine_on_bad_count=0, P_eng_bad_count=0, motor_split_bad_count=0, low_SOC_bad_count=0, discharge_limit_bad_count=0 |
| HEV mode consistency | PASS | sample_count=156, engine_off_bad_count=0, P_eng_range_bad_count=0, motor_split_bad_count=0 |
| Charge mode consistency | PASS | sample_count=0, engine_off_bad_count=0, SOC_condition_bad_count=0, P_eng_less_than_demand_bad_count=0, battery_discharge_bad_count=0 |
| Low-SOC charge activation and SOC recovery | PASS | not a low-SOC validation cycle |
| Regen mode consistency | PASS | sample_count=72, P_dem_bad_count=0, engine_on_request_bad_count=0, P_eng_bad_count=0, motor_sign_bad_count=0, charge_limit_bad_count=0 |
| Engine-on threshold adaptation | PASS | max_abs_error=0 kW |
| SOC reference adaptation | PASS | max_abs_error=0 |
| Engine-on transition condition | PASS | transitions=5, unexplained=0 |
| Engine-off transition condition | PASS | transitions=4, unexplained=0 |
| Engine hysteresis and minimum on/off time | PASS | switches=9, per_min=1.8, min_interval=30 s, timer_viol=0 |
| Logged engine timer guards | PASS | on_guard_viol=0, off_guard_viol=0 |

### low_soc_urban: PASS
| Check | Status | Notes |
|---|---|---|
| NaN/Inf signal count | PASS | nonfinite_count=0 |
| EMS request/state logging validity | PASS | invalid_engine_state=0, invalid_transition_reason=0 |
| EMS mode validity | PASS | undefined_mode_count=0 |
| EV mode consistency | PASS | sample_count=133, engine_on_bad_count=0, P_eng_bad_count=0, motor_split_bad_count=0, low_SOC_bad_count=0, discharge_limit_bad_count=0 |
| HEV mode consistency | PASS | sample_count=44, engine_off_bad_count=0, P_eng_range_bad_count=0, motor_split_bad_count=0 |
| Charge mode consistency | PASS | sample_count=4, engine_off_bad_count=0, SOC_condition_bad_count=0, P_eng_less_than_demand_bad_count=0, battery_discharge_bad_count=0 |
| Low-SOC charge activation and SOC recovery | PASS | initial_SOC=0.38, final_SOC=0.5546, charge_samples=4, recovered_above_SOC_low=1 |
| Regen mode consistency | PASS | sample_count=120, P_dem_bad_count=0, engine_on_request_bad_count=0, P_eng_bad_count=0, motor_sign_bad_count=0, charge_limit_bad_count=0 |
| Engine-on threshold adaptation | PASS | max_abs_error=0 kW |
| SOC reference adaptation | PASS | max_abs_error=0 |
| Engine-on transition condition | PASS | transitions=9, unexplained=0 |
| Engine-off transition condition | PASS | transitions=9, unexplained=0 |
| Engine hysteresis and minimum on/off time | PASS | switches=18, per_min=3.6, min_interval=5 s, timer_viol=0 |
| Logged engine timer guards | PASS | on_guard_viol=0, off_guard_viol=0 |

### low_soc_high_load: PASS
| Check | Status | Notes |
|---|---|---|
| NaN/Inf signal count | PASS | nonfinite_count=0 |
| EMS request/state logging validity | PASS | invalid_engine_state=0, invalid_transition_reason=0 |
| EMS mode validity | PASS | undefined_mode_count=0 |
| EV mode consistency | PASS | sample_count=70, engine_on_bad_count=0, P_eng_bad_count=0, motor_split_bad_count=0, low_SOC_bad_count=0, discharge_limit_bad_count=0 |
| HEV mode consistency | PASS | sample_count=155, engine_off_bad_count=0, P_eng_range_bad_count=0, motor_split_bad_count=0 |
| Charge mode consistency | PASS | sample_count=4, engine_off_bad_count=0, SOC_condition_bad_count=0, P_eng_less_than_demand_bad_count=0, battery_discharge_bad_count=0 |
| Low-SOC charge activation and SOC recovery | PASS | initial_SOC=0.38, final_SOC=0.5028, charge_samples=4, recovered_above_SOC_low=1 |
| Regen mode consistency | PASS | sample_count=72, P_dem_bad_count=0, engine_on_request_bad_count=0, P_eng_bad_count=0, motor_sign_bad_count=0, charge_limit_bad_count=0 |
| Engine-on threshold adaptation | PASS | max_abs_error=0 kW |
| SOC reference adaptation | PASS | max_abs_error=0 |
| Engine-on transition condition | PASS | transitions=5, unexplained=0 |
| Engine-off transition condition | PASS | transitions=4, unexplained=0 |
| Engine hysteresis and minimum on/off time | PASS | switches=9, per_min=1.8, min_interval=34 s, timer_viol=0 |
| Logged engine timer guards | PASS | on_guard_viol=0, off_guard_viol=0 |

### soc_recovery_test: PASS
| Check | Status | Notes |
|---|---|---|
| NaN/Inf signal count | PASS | nonfinite_count=0 |
| EMS request/state logging validity | PASS | invalid_engine_state=0, invalid_transition_reason=0 |
| EMS mode validity | PASS | undefined_mode_count=0 |
| EV mode consistency | PASS | sample_count=97, engine_on_bad_count=0, P_eng_bad_count=0, motor_split_bad_count=0, low_SOC_bad_count=0, discharge_limit_bad_count=0 |
| HEV mode consistency | PASS | sample_count=126, engine_off_bad_count=0, P_eng_range_bad_count=0, motor_split_bad_count=0 |
| Charge mode consistency | PASS | sample_count=4, engine_off_bad_count=0, SOC_condition_bad_count=0, P_eng_less_than_demand_bad_count=0, battery_discharge_bad_count=0 |
| Low-SOC charge activation and SOC recovery | PASS | initial_SOC=0.38, final_SOC=0.5073, charge_samples=4, recovered_above_SOC_low=1 |
| Regen mode consistency | PASS | sample_count=74, P_dem_bad_count=0, engine_on_request_bad_count=0, P_eng_bad_count=0, motor_sign_bad_count=0, charge_limit_bad_count=0 |
| Engine-on threshold adaptation | PASS | max_abs_error=0 kW |
| SOC reference adaptation | PASS | max_abs_error=0 |
| Engine-on transition condition | PASS | transitions=4, unexplained=0 |
| Engine-off transition condition | PASS | transitions=4, unexplained=0 |
| Engine hysteresis and minimum on/off time | PASS | switches=8, per_min=1.6, min_interval=32 s, timer_viol=0 |
| Logged engine timer guards | PASS | on_guard_viol=0, off_guard_viol=0 |

## 8. Meta-RL Interface Checks
Correct interface: Meta-RL -> delta_P_eng_on and optional delta_SOC_ref; map/rule EMS -> P_eng_cmd and P_mot_cmd.

| Check | Status | Notes |
|---|---|---|
| meta_enable disabled ignores offsets | PASS | max_threshold_error=0 kW, max_SOC_ref_error=0 |
| meta_enable applies bounded/rate-limited offsets | PASS | max_threshold_error=0 kW, settled_delta_P=5 kW |
| delta_P_eng_on sweep trend | PASS | engine_trend=1, EV_trend=1, SOC_trend=1 |
| delta_SOC_ref sweep trend | PASS | SOC_ref_trend=1 |
| offset bounds, rate limiter, and NaN/Inf fallback | PASS | bound_ok=1, rate_ok=1, finite_ok=1, helper_nan_inf_ok=1 |

### delta_P_eng_on Sweep
| offset | engine on time s | EV duration s | final SOC | total fuel kg |
|---:|---:|---:|---:|---:|
| -10 | 46 | 108 | 0.573207 | 0.0591453 |
| -5 | 38 | 116 | 0.559246 | 0.0547581 |
| 0 | 31 | 122 | 0.544326 | 0.0503017 |
| 5 | 24 | 128 | 0.529013 | 0.0457309 |
| 10 | 17 | 135 | 0.492244 | 0.0371778 |

### delta_SOC_ref Sweep
| offset | engine on time s | EV duration s | final SOC | total fuel kg |
|---:|---:|---:|---:|---:|
| -0.05 | 31 | 122 | 0.522316 | 0.0452409 |
| 0 | 31 | 122 | 0.544326 | 0.0503017 |
| 0.05 | 30 | 123 | 0.562519 | 0.0547646 |

## 9. Batch Cycle Results
| Cycle | total fuel kg | fuel L/100km | final SOC | final SOC error | SOC-corrected fuel kg | engine switches | mode switches | distance km | constraint violations |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| urban | 0.0766786 | 6.24721 | 0.565234 | 0.0152343 | 0.0742185 | 16 | 46 | 1.64752 | 0 |
| highway | 0.203303 | 3.61579 | 0.510974 | -0.0390257 | 0.209605 | 5 | 18 | 7.54716 | 0 |
| high_load | 0.328667 | 8.14255 | 0.503313 | -0.0466868 | 0.336206 | 9 | 13 | 5.418 | 0 |
| low_soc_urban | 0.0971752 | 7.91712 | 0.554585 | 0.00458495 | 0.0964348 | 17 | 47 | 1.64752 | 0 |
| low_soc_high_load | 0.352076 | 8.72251 | 0.502783 | -0.0472166 | 0.359701 | 8 | 13 | 5.418 | 0 |
| soc_recovery_test | 0.182921 | 5.04658 | 0.507344 | -0.0426561 | 0.189809 | 7 | 20 | 4.86531 | 0 |

### Low-SOC Charge Recovery
| Cycle | Status | initial SOC | final SOC | charge samples | recovered above SOC_low | Notes |
|---|---|---:|---:|---:|---:|---|
| low_soc_urban | PASS | 0.38 | 0.554585 | 4 | 1 | initial_SOC=0.38, final_SOC=0.5546, charge_samples=4, recovered_above_SOC_low=1 |
| low_soc_high_load | PASS | 0.38 | 0.502783 | 4 | 1 | initial_SOC=0.38, final_SOC=0.5028, charge_samples=4, recovered_above_SOC_low=1 |
| soc_recovery_test | PASS | 0.38 | 0.507344 | 4 | 1 | initial_SOC=0.38, final_SOC=0.5073, charge_samples=4, recovered_above_SOC_low=1 |

### Charge-Sustaining Fairness Metrics
| Cycle | final SOC error | equivalent fuel correction kg | terminal SOC penalty kg | SOC-corrected fuel kg | SOC-corrected fuel L/100km |
|---|---:|---:|---:|---:|---:|
| urban | 0.0152343 | -0.00246009 | 0.00246009 | 0.0742185 | 6.04678 |
| highway | -0.0390257 | 0.006302 | 0.006302 | 0.209605 | 3.72788 |
| high_load | -0.0466868 | 0.00753914 | 0.00753914 | 0.336206 | 8.32933 |
| low_soc_urban | 0.00458495 | -0.000740393 | 0.000740393 | 0.0964348 | 7.8568 |
| low_soc_high_load | -0.0472166 | 0.00762469 | 0.00762469 | 0.359701 | 8.91141 |
| soc_recovery_test | -0.0426561 | 0.00688825 | 0.00688825 | 0.189809 | 5.23662 |

## 9A. Calibration Sweep
Cycle: `urban`; cases: 36

| P_hys kW | min on s | min off s | engine switches | mode switches | total fuel kg | final SOC | final SOC error |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 5 | 5 | 5 | 10 | 35 | 0.0503017 | 0.544326 | -0.00567428 |
| 5 | 5 | 8 | 10 | 35 | 0.0503017 | 0.544326 | -0.00567428 |
| 5 | 5 | 10 | 10 | 35 | 0.0492072 | 0.538467 | -0.0115326 |
| 5 | 8 | 5 | 10 | 36 | 0.051575 | 0.545227 | -0.00477349 |
| 5 | 8 | 8 | 10 | 36 | 0.051575 | 0.545227 | -0.00477349 |
| 5 | 8 | 10 | 10 | 35 | 0.0467069 | 0.519437 | -0.0305627 |
| 5 | 10 | 5 | 8 | 35 | 0.0506722 | 0.549072 | -0.000928273 |
| 5 | 10 | 8 | 8 | 35 | 0.0506722 | 0.549072 | -0.000928273 |
| 5 | 10 | 10 | 8 | 35 | 0.0501922 | 0.545691 | -0.00430916 |
| 8 | 5 | 5 | 10 | 35 | 0.0503017 | 0.544326 | -0.00567428 |
| 8 | 5 | 8 | 10 | 35 | 0.0503017 | 0.544326 | -0.00567428 |
| 8 | 5 | 10 | 10 | 35 | 0.0492072 | 0.538467 | -0.0115326 |
| 8 | 8 | 5 | 10 | 36 | 0.051575 | 0.545227 | -0.00477349 |
| 8 | 8 | 8 | 10 | 36 | 0.051575 | 0.545227 | -0.00477349 |
| 8 | 8 | 10 | 10 | 35 | 0.0467069 | 0.519437 | -0.0305627 |
| 8 | 10 | 5 | 8 | 35 | 0.0506722 | 0.549072 | -0.000928273 |
| 8 | 10 | 8 | 8 | 35 | 0.0506722 | 0.549072 | -0.000928273 |
| 8 | 10 | 10 | 8 | 35 | 0.0501922 | 0.545691 | -0.00430916 |
| 10 | 5 | 5 | 10 | 35 | 0.0503017 | 0.544326 | -0.00567428 |
| 10 | 5 | 8 | 10 | 35 | 0.0503017 | 0.544326 | -0.00567428 |
| 10 | 5 | 10 | 10 | 35 | 0.0492072 | 0.538467 | -0.0115326 |
| 10 | 8 | 5 | 10 | 36 | 0.051575 | 0.545227 | -0.00477349 |
| 10 | 8 | 8 | 10 | 36 | 0.051575 | 0.545227 | -0.00477349 |
| 10 | 8 | 10 | 10 | 35 | 0.0467069 | 0.519437 | -0.0305627 |
| 10 | 10 | 5 | 8 | 35 | 0.0506722 | 0.549072 | -0.000928273 |
| 10 | 10 | 8 | 8 | 35 | 0.0506722 | 0.549072 | -0.000928273 |
| 10 | 10 | 10 | 8 | 35 | 0.0501922 | 0.545691 | -0.00430916 |
| 15 | 5 | 5 | 10 | 35 | 0.0503017 | 0.544326 | -0.00567428 |
| 15 | 5 | 8 | 10 | 35 | 0.0503017 | 0.544326 | -0.00567428 |
| 15 | 5 | 10 | 10 | 35 | 0.0492072 | 0.538467 | -0.0115326 |
| 15 | 8 | 5 | 10 | 36 | 0.0535263 | 0.557447 | 0.00744717 |
| 15 | 8 | 8 | 10 | 36 | 0.0535263 | 0.557447 | 0.00744717 |
| 15 | 8 | 10 | 10 | 35 | 0.0467069 | 0.519437 | -0.0305627 |
| 15 | 10 | 5 | 8 | 35 | 0.0530759 | 0.563424 | 0.0134238 |
| 15 | 10 | 8 | 8 | 35 | 0.0530759 | 0.563424 | 0.0134238 |
| 15 | 10 | 10 | 8 | 35 | 0.0521386 | 0.557873 | 0.00787316 |

### Saved Plots
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/urban_speed_tracking.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/urban_power_balance.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/urban_soc_reconstruction.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/urban_fuel_rate_vs_P_eng.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/urban_ems_mode_timeline.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/urban_engine_on_timeline.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/urban_delta_threshold.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/highway_speed_tracking.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/highway_power_balance.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/highway_soc_reconstruction.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/highway_fuel_rate_vs_P_eng.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/highway_ems_mode_timeline.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/highway_engine_on_timeline.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/highway_delta_threshold.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/high_load_speed_tracking.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/high_load_power_balance.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/high_load_soc_reconstruction.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/high_load_fuel_rate_vs_P_eng.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/high_load_ems_mode_timeline.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/high_load_engine_on_timeline.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/high_load_delta_threshold.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/low_soc_urban_speed_tracking.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/low_soc_urban_power_balance.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/low_soc_urban_soc_reconstruction.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/low_soc_urban_fuel_rate_vs_P_eng.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/low_soc_urban_ems_mode_timeline.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/low_soc_urban_engine_on_timeline.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/low_soc_urban_delta_threshold.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/low_soc_high_load_speed_tracking.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/low_soc_high_load_power_balance.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/low_soc_high_load_soc_reconstruction.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/low_soc_high_load_fuel_rate_vs_P_eng.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/low_soc_high_load_ems_mode_timeline.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/low_soc_high_load_engine_on_timeline.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/low_soc_high_load_delta_threshold.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/soc_recovery_test_speed_tracking.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/soc_recovery_test_power_balance.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/soc_recovery_test_soc_reconstruction.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/soc_recovery_test_fuel_rate_vs_P_eng.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/soc_recovery_test_ems_mode_timeline.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/soc_recovery_test_engine_on_timeline.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/soc_recovery_test_delta_threshold.png`
- `/home/yejun/meta_rl/results/validation/plots_20260701_165929/meta_delta_threshold_case.png`

## 10. Open Issues and Recommendations
- No FAIL/WARN validation checks were reported.
- Treat this validation as a testbed consistency screen, not proof that the model is an exact real vehicle.
