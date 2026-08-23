# Design: Correct Microeconomics Simulations

## Technical Approach

Keep the existing split between pure calculations in `src/domain/` and local React state/SVG rendering in `src/components/`. Make formulas produce all economic anchors, classifications, warnings, and monopoly solutions; components will only map those results to controls, copy, and visuals. This implements the proposal and every scenario in the `microeconomics-simulation-correctness` spec without redesigning the tabs.

## Architecture Decisions

| Option | Tradeoff | Decision and rationale |
|---|---|---|
| Hardcoded anchors vs. pure formula helpers | Constants are smaller but silently drift from rendered curves. | Add named cost functions and derive minima once with bounded numeric root solving. The same functions drive calculations and SVG paths, preserving one source of truth. |
| Approximate vs. strict FPP status | A tolerance feels forgiving but teaches an incorrect category. | Classify from the ellipse residual using only machine epsilon; return a separate `nearFrontier` cue for vertical distance ≤ 0.5. This keeps pedagogy strict while retaining the approved visual aid. |
| Component-authored vs. domain-authored market interpretation | UI-only copy can diverge from computed outcomes. | Return warning/explanation keys from `calcularMercado`. Perfectly inelastic shock combinations remain usable, keep quantity fixed, move price under the documented simplified interpretation, and emit a non-blocking warning. |
| One vs. both `P = ATC` roots | One point is simpler but hides the regulatory choice. | Solve the quadratic, sort valid positive roots, select the higher-output/lower-price root, and expose the other as a faded alternative. Guard negative discriminants with an explicit no-solution result. |

## Data Flow

    Local controls → domain calculator → typed result fields
         ↑                  ↓                 ↓
      Reset defaults   formulas/status   banner + SVG + explanation

Market scenario selection first clears `shiftD` and `shiftS` when leaving `libre`, then recalculates from the new scenario. No hidden shock reaches tax/subsidy calculations.

## File Changes

| File | Action | Description |
|---|---|---|
| `src/domain/costos.js` | Modify | Centralize cost formulas, derive AVC/ATC minima, use ≤0.01 break-even tolerance, and return fixed cost. |
| `src/components/Costos.jsx` | Modify | Reuse domain formulas for paths, place derived anchors, render a labeled hatched `−CF` shutdown-loss area, and add reset. |
| `src/domain/fpp.js` | Modify | Return strict status, frontier value, and independent `nearFrontier`. |
| `src/components/FPP.jsx` | Modify | Preserve strict banner color/text, add a dashed near-frontier halo, and add reset. |
| `src/domain/mercado.js` | Modify | Align inelastic shock outcomes and return warning/explanation keys. |
| `src/components/Mercado.jsx` | Modify | Clear shocks on scenario exit; render an inline, non-blocking warning and result-driven explanation. |
| `src/domain/monopolio.js` | Modify | Compute dual intersections, selected/alternative outcomes, and no-solution state. |
| `src/components/Monopolio.jsx` | Modify | Render the selected root prominently, the alternative faded and labeled, explanatory choice/no-solution copy, and reset. |
| `package.json`, `vite.config.js` | Modify | Add Vitest, jsdom, React Testing Library, and test scripts/configuration. |
| `src/domain/*.test.js` | Create | Formula and boundary tests for all four calculators. |
| `src/components/simulations.test.jsx`, `src/test/setup.js` | Create | Interaction, reset, warning, and SVG semantic tests. |

## Interfaces / Contracts

- Costs add `fixedCost` and formula-derived `minCVM_*`/`minCTM_*`; shutdown returns `firmQ: 0`, `currentProfit: -fixedCost`.
- FPP returns `{ maxPossibleYAtX, status, nearFrontier }`; `nearFrontier` never changes `status`.
- Market adds stable `warningKey` and `explanationKey` (nullable), derived from the same branch as equilibrium values.
- Natural monopoly adds `regulation: { status, selected, alternative, intersections }`; points are `{ q, p, ctm, profit }`, and no-solution has empty intersections and null outcomes.

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit | Cost minima/profit boundaries, ellipse categories, shock isolation semantics, two/no monopoly roots | Vitest table tests with ≤0.01 numeric tolerances and exact boundary cases. |
| Integration | Resets, scenario shock clearing, non-blocking warning/copy, shutdown hatch, FPP halo without status change, primary/faded monopoly markers | React Testing Library with jsdom; query accessible controls and SVG labels/attributes. |
| E2E | Application composition | No new E2E framework; `npm run build` plus a focused manual tab smoke check. |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary is introduced or changed.

## Migration / Rollout

No migration required. Ship as targeted formula/UI corrections; rollback is the single change set. The combined source and tests may approach the 400-line review budget, so `sdd-tasks` must forecast size and, under `ask-on-risk`, stop for approval if risk becomes high.

## Open Questions

None.
