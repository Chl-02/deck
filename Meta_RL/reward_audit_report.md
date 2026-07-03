# Reward Audit Report

- status: **PASS**

Formula:

```text
-fuel_rate - 0.08*abs(SOC-SOC_ref_base) - 0.02*engine_switch - 5.0*constraint_violation - 2e-4*abs(P_batt)
```

| Cycle | Status | fuel | SOC | switching | constraint | battery | reconstructed | logged |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| urban | PASS | -0.0766786 | -0.504756 | -0.32 | -0 | -0.233696 | -1.13513 | -1.13513 |
| highway | PASS | -0.203303 | -1.85688 | -0.1 | -0 | -0.406542 | -2.56673 | -2.56673 |
| high_load | PASS | -0.328667 | -0.62555 | -0.18 | -0 | -0.27864 | -1.41286 | -1.41286 |
| low_SOC_urban | PASS | -0.0971752 | -1.33797 | -0.34 | -0 | -0.26927 | -2.04441 | -2.04441 |
| low_SOC_high_load | PASS | -0.352076 | -1.01145 | -0.16 | -0 | -0.321264 | -1.84479 | -1.84479 |
| SOC_recovery_test | PASS | -0.182921 | -1.28212 | -0.14 | -0 | -0.374022 | -1.97907 | -1.97907 |

The reward is a shaped RL signal with mixed units; it is not a physical cost by itself.
