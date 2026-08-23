# Design: Improve Layout and Visual Coherence

## Technical Approach

Keep simulation state and economics inside the four existing modules, but render their presentation through a shared `SimulatorLayout`. The wrapper exposes controls, chart, and results/explanation zones; it expands the chart on desktop and orders all zones vertically on mobile. Geometry fixes consume existing computed results and active parameters, so domain formulas and `App`'s conditional tab rendering remain unchanged.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|---|---|---|---|
| Shared layout | `SimulatorLayout` accepts `title`, `onReset`, `resetLabel`, `controls`, `chart`, and `results` slots. At `lg` it uses three columns with the chart largest; below 768 px it is controls → chart → results. | Duplicate grids; broad panel component library | One wrapper removes layout drift without obscuring module-specific presentation. It owns the consistently placed reset header while state remains local. |
| Lifecycle | Keep `App.jsx`'s conditional rendering and module-local hooks. | Lift state into `App`; hide mounted tabs | Existing unmount/remount behavior intentionally resets a module when returning to its tab. |
| Mercado geometry | Draw each active inelastic curve at `mapX(Qe)`, the computed equilibrium-quantity anchor. For shocks, show old/new price markers joined by a labelled vertical price-absorption cue at fixed Q. | Anchor from raw shift values; alter equations | The SVG will represent `calcularMercado` output without changing economic behavior. |
| Natural CTM | Resolve primitive defaults from `naturalParams`; pass the same values to `calcularMonopolio`, and memoize `cme_base + cme_fixed / q` SVG points with `[cmeBase, cmeFixed]`. | Hardcoded path; memoize on an unstable object | Primitive dependencies guarantee injected parameter changes update both calculation and curve. |
| Visual system | Preserve current palette, 3–4 px strokes, hard shadows, typography, and module-specific panels. | Restyle or generalize every panel | The change improves hierarchy rather than replacing the neo-brutalist identity. |

## Data Flow

    App active tab ──mounts──> Module local state ──> domain calculation
                                  │                        │
                                  └── SimulatorLayout <── SVG/results

`naturalParams` primitives feed both Monopolio calculation and CTM path generation. Mercado's calculated `Qe`, `Pe_orig`, and `Pe` feed curve and absorption-cue coordinates.

## File Changes

| File | Action | Description |
|---|---|---|
| `src/components/SimulatorLayout.jsx` | Create | Responsive slots and common reset header. |
| `src/components/{Mercado,FPP,Costos,Monopolio}.jsx` | Modify | Adopt zones; move results/explanations; retain state, palette, strokes, and shadows. Mercado and Monopolio also receive geometry fixes. |
| `src/App.jsx` | Modify | Widen the fluid shell and preserve conditional tab mounts. |
| `src/components/simulations.test.jsx` | Modify | Add zone, reset, and SVG geometry/parameter coverage. |
| `src/App.test.jsx` | Create | Prove tab switches unmount and restore defaults. |
| `index.html` | Modify | Set `lang="es"`, Spanish title, and Spanish description. |
| `package.json`, `package-lock.json` | Modify | Rename package to `simulador-microeconomia`; keep quality scripts. |
| `src/App.css` | Delete | Remove unimported Vite-template residue. |
| `.github/workflows/ci.yml` | Create | Node 20 quality-only workflow using `npm ci`, lint, test, and build; no deployment. |

## Interfaces / Contracts

`SimulatorLayout` is presentation-only: slot content is required; `onReset` is invoked only by its labelled reset button. It MUST NOT store simulation state. Zone wrappers expose stable accessible labels (and test selectors where SVG geometry needs precision).

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit | Existing economic outputs remain stable | Keep Vitest domain suites green; add no formula changes. |
| Component | Three zones/order, common reset, Mercado x-coordinate within 1 px and price cue, Monopolio CTM coordinates within 0.01 and prop-driven rerender | React Testing Library; inspect labelled SVG elements/path points and rerender with changed `naturalParams`. |
| Integration | Unmount reset and metadata/build behavior | Switch tabs in `App.test.jsx`; parse document metadata and run Vite build. |
| CI | Node 20 quality gate | Validate workflow runs `npm ci`, `npm run lint`, `npm run test`, `npm run build`, with no deploy command/step. |

Human gate after apply: approve ≥1024 px three-zone hierarchy; <768 px controls/chart/results order; chart readability; unchanged palette/strokes/shadows; reset placement and tab-return reset; Mercado absorption cue; Monopolio CTM response; Spanish explanatory copy and metadata.

## Threat Matrix

N/A — the app change introduces no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary. CI YAML is quality configuration, not an application runtime boundary.

## Migration / Rollout

No data migration required. Forecast: 700–900 changed lines versus the 800-line budget. Deliver independently reviewable work units: (1) Mercado/Monopolio geometry plus tests; (2) layout, all UI migrations, metadata/package residue, and lifecycle tests; (3) CI. Roll back any unit independently: geometry restores prior SVG only, layout restores prior markup/metadata, and CI removal cannot affect runtime or deployment.

## Open Questions

None.
