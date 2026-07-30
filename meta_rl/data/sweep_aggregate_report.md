# Meta-RL Paper Sweep Aggregate

Run root: `/home/yejun/meta_rl/results/meta_rl_paper/main_raw_summary_soc_guarded/20260706_164901`
Seeds: 20260706, 20260707, 20260708, 20260709, 20260710

## meta_validation

| metric | baseline mean | adapter mean | reduction % | paired delta mean ± std |
|---|---:|---:|---:|---:|
| abs_final_SOC_error | 0.054443 | 0.054242 | 0.37 | -0.000201 ± 0.000612 |
| SOC_RMSE | 0.060976 | 0.060608 | 0.60 | -0.000368 ± 0.000478 |
| constraint_violation_steps | 0.918750 | 0.903125 | 1.70 | -0.015625 ± 0.061516 |
| SOC_corrected_fuel_kg | 0.111759 | 0.111807 | -0.04 | 0.000048 ± 0.000055 |
| engine_switch_count | 10.881250 | 10.912500 | -0.29 | 0.031250 ± 0.031250 |

## heldout_evaluation

| metric | baseline mean | adapter mean | reduction % | paired delta mean ± std |
|---|---:|---:|---:|---:|
| abs_final_SOC_error | 0.054238 | 0.053534 | 1.30 | -0.000704 ± 0.001380 |
| SOC_RMSE | 0.062284 | 0.061945 | 0.55 | -0.000340 ± 0.000467 |
| constraint_violation_steps | 1.143750 | 1.118750 | 2.19 | -0.025000 ± 0.046351 |
| SOC_corrected_fuel_kg | 0.111858 | 0.111936 | -0.07 | 0.000077 ± 0.000092 |
| engine_switch_count | 8.615625 | 8.646875 | -0.36 | 0.031250 ± 0.096319 |

## Notes

- Positive reduction means the adapter improved the metric relative to zero-offset map/rule baseline.
- SOC-corrected fuel and engine switching are guardrails; small negative reductions mean a small cost.
