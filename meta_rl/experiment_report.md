# Experiment Summary

- config: `configs/main_paper_experiments.yaml`
- cycles: urban, highway, high_load, low_SOC_urban, low_SOC_high_load, SOC_recovery_test
- methods: fixed_ems, gain_scheduling_ems, contextual_rl_adapter_placeholder, meta_rl_adapter_placeholder, ecms_reference

| Method | Cycle | Status | Fuel kg | L/100km | Final SOC | SOC err | Engine switches | Mode switches | Violations |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|
| fixed_ems | urban | PASS | 0.076679 | 6.2645 | 0.56523 | 0.015234 | 16 | 46 | 0 |
| fixed_ems | highway | PASS | 0.2033 | 3.6283 | 0.51097 | -0.039026 | 5 | 18 | 0 |
| fixed_ems | high_load | PASS | 0.32867 | 8.1697 | 0.50331 | -0.046687 | 9 | 13 | 0 |
| fixed_ems | low_soc_urban | PASS | 0.097175 | 7.939 | 0.55458 | 0.0045849 | 17 | 47 | 0 |
| fixed_ems | low_soc_high_load | PASS | 0.35208 | 8.7516 | 0.50278 | -0.047217 | 8 | 13 | 0 |
| fixed_ems | soc_recovery_test | PASS | 0.18292 | 5.0614 | 0.50734 | -0.042656 | 7 | 20 | 0 |
| gain_scheduling_ems | urban | PASS | 0.076679 | 6.2645 | 0.56523 | 0.015234 | 16 | 46 | 0 |
| gain_scheduling_ems | highway | PASS | 0.2033 | 3.6283 | 0.51097 | -0.039026 | 5 | 18 | 0 |
| gain_scheduling_ems | high_load | PASS | 0.32915 | 8.1816 | 0.51125 | -0.038751 | 9 | 13 | 0 |
| gain_scheduling_ems | low_soc_urban | PASS | 0.097848 | 7.994 | 0.5586 | 0.0086024 | 17 | 47 | 0 |
| gain_scheduling_ems | low_soc_high_load | PASS | 0.35175 | 8.7434 | 0.51117 | -0.038835 | 8 | 13 | 0 |
| gain_scheduling_ems | soc_recovery_test | PASS | 0.18303 | 5.0644 | 0.51277 | -0.037229 | 7 | 20 | 0 |
| contextual_rl_adapter_placeholder | urban | PASS | 0.071709 | 5.8585 | 0.5476 | -0.0024005 | 14 | 45 | 0 |
| contextual_rl_adapter_placeholder | highway | PASS | 0.2033 | 3.6283 | 0.51097 | -0.039026 | 5 | 18 | 0 |
| contextual_rl_adapter_placeholder | high_load | PASS | 0.32745 | 8.1394 | 0.49531 | -0.054686 | 9 | 13 | 0 |
| contextual_rl_adapter_placeholder | low_soc_urban | PASS | 0.10616 | 8.6733 | 0.58659 | 0.036592 | 19 | 48 | 0 |
| contextual_rl_adapter_placeholder | low_soc_high_load | PASS | 0.35827 | 8.9056 | 0.55212 | 0.0021248 | 8 | 13 | 0 |
| contextual_rl_adapter_placeholder | soc_recovery_test | PASS | 0.18895 | 5.228 | 0.54192 | -0.0080848 | 7 | 20 | 0 |
| meta_rl_adapter_placeholder | urban | PASS | 0.07735 | 6.3194 | 0.56672 | 0.016724 | 16 | 46 | 0 |
| meta_rl_adapter_placeholder | highway | PASS | 0.20649 | 3.6852 | 0.5267 | -0.023299 | 5 | 18 | 0 |
| meta_rl_adapter_placeholder | high_load | PASS | 0.32785 | 8.1493 | 0.49339 | -0.056614 | 9 | 13 | 0 |
| meta_rl_adapter_placeholder | low_soc_urban | PASS | 0.10128 | 8.2742 | 0.56377 | 0.013772 | 19 | 48 | 0 |
| meta_rl_adapter_placeholder | low_soc_high_load | PASS | 0.35123 | 8.7306 | 0.49288 | -0.057119 | 8 | 13 | 0 |
| meta_rl_adapter_placeholder | soc_recovery_test | PASS | 0.18499 | 5.1187 | 0.51808 | -0.031923 | 7 | 20 | 0 |
| ecms_reference | all | UNAVAILABLE | NaN | NaN | NaN | NaN | NaN | NaN | NaN |

## Method Notes

- `fixed_ems` / `urban`: Fixed map/rule EMS, external offsets disabled.
- `fixed_ems` / `highway`: Fixed map/rule EMS, external offsets disabled.
- `fixed_ems` / `high_load`: Fixed map/rule EMS, external offsets disabled.
- `fixed_ems` / `low_soc_urban`: Fixed map/rule EMS, external offsets disabled.
- `fixed_ems` / `low_soc_high_load`: Fixed map/rule EMS, external offsets disabled.
- `fixed_ems` / `soc_recovery_test`: Fixed map/rule EMS, external offsets disabled.
- `gain_scheduling_ems` / `urban`: Internal SOC-based gain scheduling mode.
- `gain_scheduling_ems` / `highway`: Internal SOC-based gain scheduling mode.
- `gain_scheduling_ems` / `high_load`: Internal SOC-based gain scheduling mode.
- `gain_scheduling_ems` / `low_soc_urban`: Internal SOC-based gain scheduling mode.
- `gain_scheduling_ems` / `low_soc_high_load`: Internal SOC-based gain scheduling mode.
- `gain_scheduling_ems` / `soc_recovery_test`: Internal SOC-based gain scheduling mode.
- `contextual_rl_adapter_placeholder` / `urban`: Context-derived bounded offset placeholder; no direct power commands.
- `contextual_rl_adapter_placeholder` / `highway`: Context-derived bounded offset placeholder; no direct power commands.
- `contextual_rl_adapter_placeholder` / `high_load`: Context-derived bounded offset placeholder; no direct power commands.
- `contextual_rl_adapter_placeholder` / `low_soc_urban`: Context-derived bounded offset placeholder; no direct power commands.
- `contextual_rl_adapter_placeholder` / `low_soc_high_load`: Context-derived bounded offset placeholder; no direct power commands.
- `contextual_rl_adapter_placeholder` / `soc_recovery_test`: Context-derived bounded offset placeholder; no direct power commands.
- `meta_rl_adapter_placeholder` / `urban`: Deterministic placeholder for meta-RL offset interface.
- `meta_rl_adapter_placeholder` / `highway`: Deterministic placeholder for meta-RL offset interface.
- `meta_rl_adapter_placeholder` / `high_load`: Deterministic placeholder for meta-RL offset interface.
- `meta_rl_adapter_placeholder` / `low_soc_urban`: Deterministic placeholder for meta-RL offset interface.
- `meta_rl_adapter_placeholder` / `low_soc_high_load`: Deterministic placeholder for meta-RL offset interface.
- `meta_rl_adapter_placeholder` / `soc_recovery_test`: Deterministic placeholder for meta-RL offset interface.
- `ecms_reference` / `all`: controllers/ecms_reference.m not present; ECMS reference was not run.
