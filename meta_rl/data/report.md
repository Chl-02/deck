# Meta-RL Training Smoke Result

This run trains a PEARL-style latent-context SAC calibration adapter on the fast native HEV EMS simulator.
The policy outputs only `delta_P_eng_on` and `delta_SOC_ref`; map/rule EMS keeps engine-state and power-split authority.

## Run Config

- total_steps: 6000
- horizon_s: 240
- z_dim: 4
- device: cpu

## Final Evaluation

| split | policy | episodes | reward mean | SOC-corr fuel kg | final SOC err | engine switches | constraints |
|---|---|---:|---:|---:|---:|---:|---:|
| meta_validation | map_rule_zero_offset | 8 | -3.5381 | 0.10868 | -0.07557 | 11.00 | 0.38 |
| meta_validation | latent_sac_adapter | 8 | -2.0489 | 0.11015 | -0.05146 | 13.00 | 0.12 |
| heldout_evaluation | map_rule_zero_offset | 8 | -4.4058 | 0.06364 | -0.03595 | 5.88 | 0.62 |
| heldout_evaluation | latent_sac_adapter | 8 | -3.0176 | 0.06568 | -0.02215 | 7.50 | 0.38 |

## Paired Delta

Negative `SOC-corr fuel kg` and `constraints` deltas are better; positive reward delta is better.

| split | reward delta | SOC-corr fuel kg delta | final SOC err delta | engine switch delta | constraint delta |
|---|---:|---:|---:|---:|---:|
| meta_validation | 1.4892 | 0.00147 | 0.02411 | 2.00 | -0.25 |
| heldout_evaluation | 1.3882 | 0.00204 | 0.01380 | 1.62 | -0.25 |

## Caveat

This is a short implementation smoke run, not a final paper-scale training result. Use longer training and more evaluation profiles before making performance claims.
