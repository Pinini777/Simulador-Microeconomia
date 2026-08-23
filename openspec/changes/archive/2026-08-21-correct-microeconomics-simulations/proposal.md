# Proposal: Correct Microeconomics Simulations

## Intent

Correct simulation outcomes and explanations that currently conflict with the model curves or Mankiw concepts, so novice students learn reliable interpretations and instructors can demonstrate them confidently.

## Scope

### In Scope
- Derive the short-run firm's AVC/ATC minimum anchors from its cost functions; classify break-even precisely and draw the unavoidable fixed-cost loss during shutdown.
- Classify PPF points strictly as frontier, inside, or outside; retain a separate near-frontier visual cue without changing status.
- Align market-shock explanations and scenario state with rendered curves; reset shocks when leaving the free-market scenario and warn, without blocking, non-standard shock/perfect-inelasticity combinations.
- Derive both natural-monopoly `P = ATC` intersections, render and explain both, and select the higher-output/lower-price regulatory interpretation.
- Add consistent reset controls to simulation tabs where absent.

### Out of Scope
- Price ceilings, price floors, or other price-control simulations.
- New economic topics, persistence, or a redesign of the tabbed interface.

## Capabilities

### New Capabilities
- `microeconomics-simulation-correctness`: Correct, explainable outcomes and guardrails for cost, PPF, market, and monopoly simulations.

### Modified Capabilities
None; no baseline OpenSpec capabilities exist.

## Approach

Make domain formulas the source of truth for derived anchors and intersections. Keep classifications distinct from visual guidance, derive explanatory copy from active curve conditions, and use non-blocking warnings for simplified/non-standard configurations. Favor targeted component updates that keep the selected monopoly outcome visually primary.

## Affected Areas

| Area | Impact | Description |
|---|---|---|
| `src/domain/costos.js` | Modified | Derived ATC/AVC anchors and precise status logic. |
| `src/components/Costos.jsx` | Modified | Break-even and shutdown-loss visuals; reset control. |
| `src/domain/fpp.js`, `src/components/FPP.jsx` | Modified | Strict PPF status and near-frontier cue; reset control. |
| `src/domain/mercado.js`, `src/components/Mercado.jsx` | Modified | Shock-state isolation and inelastic-combination warning/copy. |
| `src/domain/monopolio.js`, `src/components/Monopolio.jsx` | Modified | Dynamic dual intersections and regulation explanation; reset control. |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Revised ATC anchor changes slider classifications. | Medium | Assert formula-derived values and keep labels/readouts synchronized. |
| Perfect-inelastic shock combinations confuse users. | Medium | Show clear non-blocking warning and explain the simplified interpretation. |
| A future curve has no two `P = ATC` roots. | Low | Guard the discriminant and present a clear no-solution state. |

## Rollback Plan

Revert the targeted domain/component changes as one change set; no data migration or persisted state is involved.

## Dependencies

- Existing Mankiw sixth Latin American edition anchors in `resources/material/microeconomia-mankiw-3-pdf-free.pdf`.

## Success Criteria

- [ ] Cost, PPF, market, and monopoly outputs match their rendered formulas and stated economic interpretation.
- [ ] Shutdown visibly explains the fixed-cost loss; natural-monopoly regulation shows both intersections and its chosen outcome.
- [ ] Non-standard inelastic shock configurations warn without blocking, and scenario changes do not retain hidden shocks.
