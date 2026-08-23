# Tasks: Correct Microeconomics Simulations

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | ~450–600 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1: domain + test infra → PR 2: component wiring → PR 3: integration tests & reset controls |
| Delivery strategy | ask-on-risk |
| Chain strategy | stacked-to-main |

Decision needed before apply: resolved
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|---|---|---|---|---|---|
| 1 | Formula helpers, domain calculators, and test harness | PR 1 | `npm run test -- src/domain/` | `npm run build` | Revert `src/domain/*`, `package.json`, `vite.config.js`, test setup |
| 2 | Component wiring, visuals, reset controls | PR 2 | `npm run test -- src/components/simulations.test.jsx` | `npm run dev` manual tab check | Revert `src/components/Costos.jsx`, `FPP.jsx`, `Mercado.jsx`, `Monopolio.jsx` |
| 3 | Integration tests and final verification | PR 3 | `npm run test` | `npm run build` | Revert `src/components/simulations.test.jsx` and test setup |

## Phase 1: Foundation & Test Infrastructure

- [x] 1.1 Add Vitest, jsdom, `@testing-library/react`, and user-event to `package.json` with `test` script.
- [x] 1.2 Configure `vite.config.js` `test` block for jsdom and `src/test/setup.js`.
- [x] 1.3 Create `src/test/setup.js` to register RTL cleanup.

## Phase 2: Domain Formula Corrections

- [x] 2.1 In `src/domain/costos.js`, centralize CVM/CTM/CMg formulas and derive `minCVM_*`/`minCTM_*`; return `fixedCost` and shutdown `currentProfit = -fixedCost`.
- [x] 2.2 Add `src/domain/costos.test.js` asserting ATC minimum ≈ (9.62, 7.38) and shutdown profit = -30.
- [x] 2.3 In `src/domain/fpp.js`, return strict `status` and independent `nearFrontier` flag (distance ≤ 0.5).
- [x] 2.4 Add `src/domain/fpp.test.js` for frontier/inside/outside boundaries and `nearFrontier` not altering status.
- [x] 2.5 In `src/domain/mercado.js`, zero `shiftD`/`shiftS` when leaving `libre`, align inelastic outcomes, and return `warningKey`/`explanationKey`.
- [x] 2.6 Add `src/domain/mercado.test.js` verifying shock reset, inelastic demand shock warning, and fixed quantity.
- [x] 2.7 In `src/domain/monopolio.js`, compute both `P = ATC` roots, select higher-Q/lower-P, expose alternative, guard no-solution state.
- [x] 2.8 Add `src/domain/monopolio.test.js` verifying roots ≈ 11.06 and 28.94, selected ≈ 28.94/9.53, and no-solution state.

## Phase 3: Component Wiring & Visuals

- [x] 3.1 Update `src/components/Costos.jsx` to consume derived anchors, render `−CF` shutdown-loss area, and add reset control.
- [x] 3.2 Update `src/components/FPP.jsx` to preserve strict banner, add dashed near-frontier halo, and add reset control.
- [x] 3.3 Update `src/components/Mercado.jsx` to clear shocks on scenario exit, render non-blocking warning, and use `explanationKey`.
- [x] 3.4 Update `src/components/Monopolio.jsx` to render selected root, faded alternative, no-solution copy, and add reset control.

## Phase 4: Integration & Verification

- [x] 4.1 Create `src/components/simulations.test.jsx` verifying reset controls for Costos, FPP, Mercado, and Monopolio.
- [x] 4.2 Add component tests for shutdown hatch, FPP halo without status change, market warning, and monopoly primary/faded markers.
- [x] 4.3 Run `npm run test` and `npm run build`; fix failures.
