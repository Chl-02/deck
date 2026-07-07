# Meta-RL Full Run Analysis Report

## Executive Summary

The 5-seed paper-scale run completed successfully with stable critic losses after the training stabilization patch.
The learned policy remained a bounded calibration adapter that outputs only `delta_P_eng_on` and `delta_SOC_ref`; the map/rule EMS retained engine-state and power-split authority.

Heldout results moved in the intended direction for SOC regulation and constraint robustness, but the effect size is small relative to the current paper success targets.

## Final Heldout Result

| Metric | Baseline | Adapter | Reduction | Interpretation |
|---|---:|---:|---:|---|
| Abs final SOC error | 0.054238 | 0.053534 | 1.30% | target 20% reduction; not met |
| SOC RMSE | 0.062284 | 0.061945 | 0.55% | target 10% reduction; not met |
| Constraint steps | 1.143750 | 1.118750 | 2.19% | target 30% reduction; not met |
| SOC-corrected fuel | 0.111858 | 0.111936 | -0.07% | guardrail cost 0.07%; within 2% |
| Engine switches | 8.615625 | 8.646875 | -0.36% | guardrail increase 0.36%; within 10% |

## Validation Split Check

| Metric | Baseline | Adapter | Reduction |
|---|---:|---:|---:|
| Abs final SOC error | 0.054443 | 0.054242 | 0.37% |
| SOC RMSE | 0.060976 | 0.060608 | 0.60% |
| Constraint steps | 0.918750 | 0.903125 | 1.70% |
| SOC-corrected fuel | 0.111759 | 0.111807 | -0.04% |
| Engine switches | 10.881250 | 10.912500 | -0.29% |

## Training Diagnostics

- Initial full run exposed critic-loss explosion; the run was stopped before wasting all seeds.
- Stabilization used Huber critic loss, Q-target clipping, gradient clipping, and separating actor updates from direct encoder updates.
- A stable reward setting was then used for the completed 5-seed sweep: fuel weight 1.5, SOC step weight 0.30, terminal SOC weight 6.0.
- Final results are stable and reproducible across 5 seeds, but the current effect size is too small for the originally proposed strong claim.

## Paper Implication

The current evidence supports a narrower statement: the task-aware calibration adapter can produce small heldout improvements in SOC regulation and constraint steps while staying within fuel and switching guardrails.
It does not yet support the stronger success criteria of 10% SOC-RMSE, 20% final-SOC-error, and 30% constraint-step reduction.

## Recommended Next Step

Before running ablations, strengthen the objective or task construction so the adapter has clearer opportunities to improve constraint robustness without merely tracking the zero-offset baseline.
