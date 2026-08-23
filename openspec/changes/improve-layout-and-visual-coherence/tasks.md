# Tasks: Improve Layout and Visual Coherence

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 700–900 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 → PR 2 → PR 3 |
| Delivery strategy | ask-on-risk |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Mercado/Monopolio geometry + tests | PR 1 | `npm run test -- src/components/simulations.test.jsx` | `npm run dev` → open Mercado and Monopolio tabs | Revert `src/components/{Mercado,Monopolio}.jsx` and `src/components/simulations.test.jsx` |
| 2 | Shared layout, all module migrations, metadata, lifecycle tests, orphan CSS removal | PR 2 | `npm run test -- src/App.test.jsx` | `npm run dev` → switch tabs at 1024 px and 375 px widths | Revert `src/components/SimulatorLayout.jsx`, `src/App.jsx`, all module JSX, `index.html`, `package.json`, `package-lock.json`; restore `src/App.css` |
| 3 | Lint remediation and non-deploying CI quality gate | PR 3 | `npm run lint && npm run test` | Push to GitHub and verify Actions run passes | Revert lint-only changes and `.github/workflows/ci.yml` |

## Phase 1: Geometry Fixes (Work Unit 1)

- [x] 1.1 RED: Add failing tests for Monopolio CTM path derived from `naturalParams` within 0.01 tolerance.
- [x] 1.2 GREEN: Implement parameterized CTM SVG path in `src/components/Monopolio.jsx` from `naturalParams` primitives.
- [x] 1.3 RED: Add failing test for Monopolio CTM path update when `naturalParams` changes.
- [x] 1.4 GREEN: Memoize CTM SVG points on `[cmeBase, cmeFixed]` so parameter changes rerender the curve.
- [x] 1.5 RED: Add failing test for Mercado inelastic demand vertical line at `mapX(Qe)` within 1 px.
- [x] 1.6 GREEN: Draw Mercado inelastic curve anchored at computed equilibrium quantity in `src/components/Mercado.jsx`.
- [x] 1.7 RED: Add failing tests for inelastic shock warning, explanation text, and price-absorption cue.
- [x] 1.8 GREEN: Render warning, explanation, and vertical price-absorption cue when `isDInelastic` and a shock moves price.

## Phase 2: Shared Layout Foundation (Work Unit 2)

- [x] 2.1 Create `src/components/SimulatorLayout.jsx` with `title`, `onReset`, `resetLabel`, `controls`, `chart`, and `results` slots; three-column on `lg`, stacked below 768 px.
- [x] 2.2 Migrate `src/components/Mercado.jsx` to `SimulatorLayout`, preserving state, palette, strokes, and shadows.
- [x] 2.3 Migrate `src/components/FPP.jsx` to `SimulatorLayout`, preserving state, palette, strokes, and shadows.
- [x] 2.4 Migrate `src/components/Costos.jsx` to `SimulatorLayout`, preserving state, palette, strokes, and shadows.
- [x] 2.5 Migrate `src/components/Monopolio.jsx` to `SimulatorLayout`, preserving state, palette, strokes, and shadows.

## Phase 3: Metadata, Residue Cleanup, and Lifecycle Tests (Work Unit 2)

- [x] 3.1 Update `src/App.jsx` to a wider fluid shell and keep conditional tab mounts.
- [x] 3.2 Delete `src/App.css` and remove any import referencing it.
- [x] 3.3 Update `index.html` with `lang="es"`, Spanish title, and Spanish description.
- [x] 3.4 Rename package to `simulador-microeconomia` in `package.json` and regenerate `package-lock.json`.
- [x] 3.5 Create `src/App.test.jsx` proving tab switches unmount modules and restore defaults.
- [x] 3.6 Add zone-order and reset tests to `src/components/simulations.test.jsx`.

## Phase 4: CI Quality Gate (Work Unit 3)

- [x] 4.1 Remediate all existing and new lint violations without changing economic behavior, then prove `npm run lint` exits successfully.
- [x] 4.2 Create `.github/workflows/ci.yml` with Node 20, `npm ci`, lint, test, and build; no deploy step.
- [ ] 4.3 Verify workflow passes on push/PR via first remote run or local `act` invocation.
- [x] 4.4 Update `SimulatorLayout` to a desktop `2/8/2` grid with `items-start`, remove `h-full` from the Mercado, FPP, Costos, and Monopolio chart wrappers, preserve single-column mobile behavior and all module state/math, and prove the fix with focused tests and a production build.
- [x] 4.5 Remediate the Human Gate regression: set the outer shell to `w-full max-w-[120rem]`; replace the `2/8/2` layout with a responsive shared grid that defines minimum control and result widths plus a two-column intermediate breakpoint; conditionally omit the empty results region; keep the title/reset header from compressing; prevent Mercado scenario buttons from clipping; add structural tests and run lint, tests, and a production build.
- [x] 4.6 Move FPP's visual legend/toggles into the existing results/supporting region below the diagnostic; keep technology and production controls left; preserve all state, handlers, and accessibility; add focused structure tests; and run lint, tests, and a production build.

## Phase 5: Human Acceptance Gates

- [ ] 5.1 Desktop (≥1024 px): approve three-zone hierarchy, chart readability, palette/strokes/shadows, and reset placement.
- [ ] 5.2 Mobile (<768 px): approve controls → chart → results order, touch readability, and no horizontal overflow.
- [ ] 5.3 Verify returning to an inactive tab resets its module state.
- [ ] 5.4 Verify Mercado inelastic curve and price-absorption cue match computed results.
- [ ] 5.5 Verify Monopolio natural CTM curve responds to parameter changes.
- [ ] 5.6 Verify Spanish metadata in `index.html` and explanatory copy across modules.
