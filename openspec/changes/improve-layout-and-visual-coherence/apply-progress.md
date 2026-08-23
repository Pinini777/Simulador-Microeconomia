# Apply Progress: improve-layout-and-visual-coherence / Work Units 1–4 (4.6 complete)

## Completed Tasks

### Phase 1: Geometry Fixes (Work Unit 1)
- [x] 1.1 RED: Added failing tests for Monopolio CTM path derived from `naturalParams` within 0.01 tolerance.
- [x] 1.2 GREEN: Implemented parameterized CTM SVG path in `src/components/Monopolio.jsx` from `naturalParams` primitives.
- [x] 1.3 RED: Added failing test for Monopolio CTM path update when `naturalParams` changes.
- [x] 1.4 GREEN: Memoized CTM SVG points on `[cmeBase, cmeFixed]` so parameter changes rerender the curve.
- [x] 1.5 RED: Added failing test for Mercado inelastic demand vertical line at `mapX(Qe)` within 1 px.
- [x] 1.6 GREEN: Drew Mercado inelastic curve anchored at computed equilibrium quantity in `src/components/Mercado.jsx`.
- [x] 1.7 RED: Added failing tests for inelastic shock warning, explanation text, and price-absorption cue.
- [x] 1.8 GREEN: Rendered warning, explanation, and vertical price-absorption cue when `isDInelastic` and a shock moves price.

### Phase 2: Shared Layout Foundation (Work Unit 2)
- [x] 2.1 Created `src/components/SimulatorLayout.jsx` with `title`, `onReset`, `resetLabel`, `controls`, `chart`, and `results` slots; three-column on `lg`, stacked below 768 px.
- [x] 2.2 Migrated `src/components/Mercado.jsx` to `SimulatorLayout`, preserving state, palette, strokes, and shadows.
- [x] 2.3 Migrated `src/components/FPP.jsx` to `SimulatorLayout`, preserving state, palette, strokes, and shadows.
- [x] 2.4 Migrated `src/components/Costos.jsx` to `SimulatorLayout`, preserving state, palette, strokes, and shadows.
- [x] 2.5 Migrated `src/components/Monopolio.jsx` to `SimulatorLayout`, preserving state, palette, strokes, and shadows.

### Phase 3: Metadata, Residue Cleanup, and Lifecycle Tests (Work Unit 2)
- [x] 3.1 Updated `src/App.jsx` to a wider `max-w-[90rem]` fluid shell and kept conditional tab mounts.
- [x] 3.2 Deleted `src/App.css`; verified no source import references it.
- [x] 3.3 Updated `index.html` with `lang="es"`, Spanish title, and Spanish description.
- [x] 3.4 Renamed package to `simulador-microeconomia` in `package.json` and regenerated `package-lock.json`.
- [x] 3.5 Created `src/App.test.jsx` proving tab switches unmount modules and restore defaults.
- [x] 3.6 Added zone-order and reset tests to `src/components/simulations.test.jsx`.

### Phase 4: CI Quality Gate (Work Unit 3)
- [x] 4.1 Remediated all existing and new lint violations without changing economic behavior, then proved `npm run lint` exits successfully.
- [x] 4.2 Created `.github/workflows/ci.yml` with Node 20, `npm ci`, lint, test, and build; no deploy step.

### Phase 4: Layout Tightening (Work Unit 4)
- [x] 4.4 Updated `SimulatorLayout` to a desktop `2/8/2` grid with `items-start`, removed `h-full` from the Mercado, FPP, Costos, and Monopolio chart wrappers, preserved single-column mobile behavior and all module state/math, and proved the fix with focused tests and a production build.
- [x] 4.5 Remediated the Human Gate regression: set outer shell to `w-full max-w-[120rem]`; replaced the `2/8/2` layout with a responsive shared grid that defines minimum control and result widths plus a two-column intermediate breakpoint; conditionally omitted the empty results region; kept the title/reset header from compressing; prevented Mercado scenario buttons from clipping; added structural tests and ran lint, tests, and a production build.
- [x] 4.6 Moved FPP's visual legend/toggles into the existing results/supporting region below the diagnostic panel; kept technology and production controls in the left controls slot; preserved all toggle state, handlers, labels, chart/SVG, math, palette, cards, and accessibility; added a focused structural test proving the legend lives inside the results region and toggles retain behavior; ran lint, tests, and a production build.

## Work Unit Evidence

### Work Unit 1 & 2 (carried forward)

| Evidence | Value |
|---|---|
| Focused test command and exact result | `npm run test -- src/App.test.jsx` → 2 tests passed, 0 failed |
| Runtime harness command/scenario and exact result | `npm run dev` → switch tabs at 1024 px and 375 px widths. Human visual acceptance gate left pending for parent/user settlement. `npm run build` succeeds. |
| Rollback boundary | Revert `src/components/SimulatorLayout.jsx`, `src/App.jsx`, all module JSX (`Mercado.jsx`, `FPP.jsx`, `Costos.jsx`, `Monopolio.jsx`), `index.html`, `package.json`, `package-lock.json`; restore `src/App.css`. Work Unit 1 geometry files remain untouched. |

### Work Unit 3 — Lint Remediation

| Evidence | Value |
|---|---|
| Focused test command and exact result | `npm run lint` → 0 errors, 0 warnings; `npm run test` → 6 test files passed, 34 tests passed, 0 failed |
| Runtime harness command/scenario and exact result | `npm run build` → production build succeeds (dist/index.html, dist/assets/index-*.css, dist/assets/index-*.js emitted); `npm run dev` → app renders all four tabs and preserves economic/UI behavior. |
| Rollback boundary | Revert lint-only changes in `src/App.jsx`, `src/App.test.jsx`, `src/components/{Costos,FPP,Mercado,Monopolio,SimulatorLayout}.jsx`, `src/components/simulations.test.jsx`, `src/domain/costos.js`, and `vite.config.js`. No economic formulas, UI markup, or tab behavior are altered. |

### Work Unit 3 — CI Workflow

| Evidence | Value |
|---|---|
| Focused test command and exact result | `npx --yes js-yaml .github/workflows/ci.yml` → YAML valid via js-yaml |
| Runtime harness command/scenario and exact result | `npm run lint && npm run test && npm run build` → all three exit successfully (0 errors, 34 tests pass, production build emits dist). Local `act` run unavailable (`act` not installed); remote workflow verification pending until authorized push/PR. |
| Rollback boundary | Revert `.github/workflows/ci.yml` and remove the `.github/workflows` directory if it becomes empty. No source code, tests, or runtime behavior are affected. |

### Work Unit 4 — Layout Tightening

| Evidence | Value |
|---|---|
| Focused test command and exact result | `npm run test` → 6 test files passed, 34 tests passed, 0 failed; `npm run test -- src/components/simulations.test.jsx` → 18 tests passed, 0 failed |
| Runtime harness command/scenario and exact result | `npm run build` → production build succeeds (dist/index.html, dist/assets/index-*.css, dist/assets/index-*.js emitted). Mobile single-column behavior preserved because `grid-cols-1` and `order-*` classes are unchanged; only `lg:` spans and `items-start` were added. |
| Rollback boundary | Revert `src/components/SimulatorLayout.jsx` and remove `h-full` restorations in `src/components/{Mercado,FPP,Costos,Monopolio}.jsx`. No state, SVG math, or economic behavior is altered. |

### Work Unit 5 — Human Gate Regression Fix

| Evidence | Value |
|---|---|
| Focused test command and exact result | `npm run test -- src/components/simulations.test.jsx` → 19 tests passed, 0 failed; `npm run test` → 6 test files passed, 35 tests passed, 0 failed; `npm run lint` → 0 errors, 0 warnings |
| Runtime harness command/scenario and exact result | `npm run build` → production build succeeds (dist/index.html, dist/assets/index-*.css, dist/assets/index-*.js emitted). The outer shell now caps at `120rem`; `SimulatorLayout` uses a responsive grid with explicit `minmax` side tracks, omits the empty Monopolio results region, and keeps the title/reset header vertical; Mercado scenario buttons use a 3-column grid with `min-w-0`. |
| Rollback boundary | Revert `src/App.jsx`, `src/components/SimulatorLayout.jsx`, `src/components/Mercado.jsx`, and `src/components/simulations.test.jsx`. No economic formulas, SVG coordinates, CI config, README, or unrelated artifacts are altered. |

### Work Unit 6 — FPP Legend Relocation

| Evidence | Value |
|---|---|
| Focused test command and exact result | `npm run test -- src/components/simulations.test.jsx` → 20 tests passed, 0 failed; `npm run test` → 6 test files passed, 36 tests passed, 0 failed; `npm run lint` → 0 errors, 0 warnings |
| Runtime harness command/scenario and exact result | `npm run build` → production build succeeds (dist/index.html, dist/assets/index-DU5_dBdz.css, dist/assets/index-BcdKWh8H.js emitted). The FPP `controls` region now contains only Technology and Production panels; the `results` region contains the Diagnostic panel followed by the Visual Legend/toggle panel. Toggle state, labels, handlers, SVG rendering, palette, and accessibility are preserved. |
| Rollback boundary | Revert `src/components/FPP.jsx` and `src/components/simulations.test.jsx`. No economic formulas, SVG coordinates, grid sizing, CI config, README, Human Gate checkboxes, or unrelated artifacts are altered. |

## Test Outcomes
- Focused lint command: `npm run lint` → 0 errors, 0 warnings
- Full test suite: `npm run test` → 36 passed, 0 failed (6 test files passed)
- Build: `npm run build` → success, no warnings
- YAML validation: `npx --yes js-yaml .github/workflows/ci.yml` → valid

## Files Changed (FPP Legend Relocation — Task 4.6)
- `src/components/FPP.jsx` — removed the Visual Legend/toggle panel from the `controls` slot; moved it into the `results` slot as a fragment directly below the existing Diagnostic panel. Preserved all toggle state, handlers, labels, chart/SVG, math, palette, cards, and accessibility.
- `src/components/simulations.test.jsx` — imported `within` from `@testing-library/react`; added a focused structural test proving the Visual Legend lives inside the `Resultados` region, is absent from the `Controles` region, and that both toggles retain click/reset behavior.
- `openspec/changes/improve-layout-and-visual-coherence/tasks.md` — marked task 4.6 complete.

## Deviations from Design
- None — the FPP legend relocation matches the design intent of separating controls from supporting results/explanation content while preserving module state and visual identity.

## Issues Found
- `act` is not installed locally, so task 4.3 cannot be marked complete. Remote verification is pending until an authorized push/PR triggers the workflow.

## Workload / PR Boundary
- Mode: stacked-to-main, Work Unit 6 FPP legend relocation slice only
- Current work unit: Work Unit 6 — FPP legend relocation (task 4.6)
- Boundary: starts after Work Unit 5 Human Gate regression merge; ends before remote workflow verification (task 4.3) and Phase 5 human gates
- Estimated review budget impact: ~55 changed lines across 3 files. Well under the 120-line target.

## evidence_revision
`a4493bea141c09038b8b2841c9af54624fc2e385a285f06e4f74a860e64d52f7`

## Outcome
passed
