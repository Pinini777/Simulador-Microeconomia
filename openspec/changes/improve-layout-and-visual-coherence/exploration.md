# Exploration: improve-layout-and-visual-coherence

> Read-only investigation. Anchors cite the canonical baseline spec
> `openspec/specs/microeconomics-simulation-correctness/spec.md`, the prior
> archived change `openspec/changes/archive/2026-08-21-correct-microeconomics-simulations/`,
> and the current source under `src/`. No code, styles, or specs were modified.

## Current State

The simulator is a single-page React/Vite app (`src/App.jsx`) with four
tabs (Mercado, FPP, Costos, Monopolio). The App shell constrains every
page to a centered column with `max-w-6xl mx-auto`, capping content at
~1152 px even on a 1920 px monitor. Each module renders a
`grid-cols-1 lg:grid-cols-12` row with a control column (`lg:col-span-4`)
and a chart/result column (`lg:col-span-8`). Charts use a fixed SVG
`viewBox` (650 × 450) scaled with `w-full h-auto`, so on wide screens
the chart grows but the control column stays narrow and the row wastes
lateral space.

Three confirmed residual defects survived the previous change and remain
in the source tree:

1. **Mercado inelastic geometry is self-inconsistent.** In
   `src/components/Mercado.jsx:259-281`, the inelastic curves are drawn
   at `x = mapX(Qe_orig + shiftD)` / `mapX(Qe_orig + shiftS)`, while
   `calcularMercado` in `src/domain/mercado.js:21-50` keeps `Qe =
   Qe_orig` for perfectly inelastic demand/supply. The chart therefore
   shows the vertical curve sliding across Q as the user moves the
   shock slider, while the reported `(Pe, Qe)` and the equilibrium dot
   stay anchored to `Qe_orig`. The visual contradicts the math.

2. **Monopolio natural CTM SVG path is hardcoded.** In
   `src/components/Monopolio.jsx:55-61`, `pathCTMeNat` is computed with
   literal `4 + 160/i`. The component receives a `naturalParams` prop
   (passed by `App.jsx` only as `undefined`, then defaulted inside
   `calcularMonopolio`), but the SVG ignores it entirely. Any future
   change to `cme_base` or `cme_fixed` desynchronizes the rendered CTMe
   curve from the regulator math (which already uses `naturalParams`).

3. **App shell and metadata are vestigial.** `src/App.css` carries
   184 lines of unused Vite boilerplate (`.counter`, `.hero`,
   `.framework`, `.vite`, `#center`, `#next-steps`, `.ticks`) — it is
   not imported anywhere. `package.json` `name` is `"temp-app"`,
   `index.html` `<title>` is `"temp-app"`, and `index.html` declares
   `lang="en"` while every visible label is Spanish. The reset button
   exists on every tab after the prior change but its visual treatment
   differs (Mercado uses a text-only red chip; Costos/FPP/Monopolio use
   an icon chip in a control panel header).

The previous change archived `verify-report.md` with passing tests for
the corrections and established a Vitest + React Testing Library harness.
`npm run test` / `npm run build` / `npm run lint` scripts exist; there
is no `.github/workflows/` directory and no CI is wired.

## Affected Areas

- `src/components/Mercado.jsx` — vertical demand/supply curve
  positioning (defect 1); shared layout shell (defect 3).
- `src/components/Monopolio.jsx` — `pathCTMeNat` formula and `naturalParams`
  propagation through the SVG (defect 2); reset button visual (defect 3).
- `src/components/Costos.jsx`, `src/components/FPP.jsx`,
  `src/components/Monopolio.jsx`, `src/components/Mercado.jsx` — every
  module renders its own ad-hoc control column + chart column with no
  shared wrapper (defect 3).
- `src/App.jsx` — outer container cap (`max-w-6xl`); tab navigation
  grid; module composition (defect 3).
- `src/index.css`, `src/App.css` — Tailwind entry plus a 184-line
  orphan stylesheet (defect 3).
- `package.json` — `name`, scripts (defect 3, CI/lint/build deliverable).
- `index.html` — `<title>`, `lang`, `<meta>` description (defect 3).
- `src/domain/mercado.test.js`, `src/domain/monopolio.test.js`,
  `src/components/simulations.test.jsx` — extend with parameter-injection
  and geometry assertions (defects 1, 2).
- `.github/workflows/ci.yml` (new, optional) — minimal CI posture.
- `openspec/changes/improve-layout-and-visual-coherence/` — new change
  folder for this slice.

## Approaches

### Geometry corrections (defects 1 and 2)

1. **Pure formula helpers, anchors and constants colocated**
   - Description: in `Mercado.jsx`, render inelastic curves at the
     chart anchor that matches the math — keep `x = mapX(Qe_orig)` for
     the inelastic line and absorb the shock into `Pe`. For the shock
     preview lines (dashed) draw a *price-absorbing* arrow (vertical
     segment at `Qe_orig` from `Pe_orig` to `Pe`) instead of the
     horizontal slide the current code implies. In `Monopolio.jsx`,
     parameterize `pathCTMeNat` with `naturalParams.cme_base` and
     `naturalParams.cme_fixed` and add `pathCTMeNat` to a `useMemo`
     dependency list on `naturalParams`.
   - Pros: smallest possible diff; tests already cover the
     math semantics (`mercado.test.js`, `monopolio.test.js`); the new
     `src/components/simulations.test.jsx` needs only two targeted
     additions (geometry + parameter injection).
   - Cons: must update tests too; a "price-absorbing" arrow is a new
     visual idiom that needs a one-line legend update.
   - Effort: Low.

2. **Refactor geometry into a domain helper**
   - Description: move the chart-anchor computation out of the
     component into `calcularMercado` and `calcularMonopolio`, returning
     explicit `chartAnchors = { dQ, sQ, dYTop, sYTop, ... }` so the
     component becomes a thin renderer.
   - Pros: domain owns the geometry; future curve additions stay
     consistent.
   - Cons: bigger surface change (signature edits in the two domains,
     updated tests, and any later change to the rendering must
     understand the helper contract).
   - Effort: Medium.

### Layout redesign (defect 3)

1. **Three-zone `SimulatorLayout` + fluid container**
   - Description: introduce a shared `<SimulatorLayout>` that takes
     `controls`, `chart`, `legend` as children and lays them out as a
     12-column grid (`controls` 3, `chart` 6, `legend` 3 at `xl`; 4 / 8
     stacked legend below at `lg`; single column at `md` and below).
     Bump `App.jsx`'s outer wrapper to `max-w-[min(1600px,96vw)]` and
     widen the per-tab gap. Keep the SVG `viewBox` at 650 × 450 — only
     the rendered pixels grow.
   - Pros: every module becomes a thin shell; consistent hierarchy
     across all four tabs; large screens use the available width
     without touching domain math; the chart becomes the visual
     anchor on `xl`.
   - Cons: requires touching all four components and `App.jsx`; the
     `lg:col-span-3/6/3` split must coexist with the existing
     `lg:col-span-4/8` in the four files during migration.
   - Effort: Medium.

2. **Tailwind utility edits only, no shared wrapper**
   - Description: edit each module's grid classes inline to a new
     `xl:col-span-3 / xl:col-span-9` split and bump the outer `max-w-`
     in `App.jsx`.
   - Pros: lowest-effort diff.
   - Cons: copy-pasted grid logic in four files drifts again; the
     `lg`/`xl` breakpoints are not used consistently across files.
   - Effort: Low.

### Tabs, hierarchy, metadata, residue (defect 3 cont.)

1. **Single pass of metadata + delete orphan CSS + standardize reset chip**
   - Description: `package.json` `name = "microeconomia-interactiva"`,
     `index.html` `<title>` set, `lang="es"`, add `<meta name="description">`,
     delete `src/App.css`, and pick one reset-button visual (the icon
     chip already used by Costos/FPP/Monopolio) and migrate Mercado to
     match.
   - Pros: one focused PR; immediate polish; aligned with the user's
     intent for hierarchy and "obsolete stylesheet residue."
   - Cons: none material.
   - Effort: Low.

2. **Defer the residue cleanup to a follow-up**
   - Description: focus the change on geometry + layout; leave
     `App.css`, `temp-app`, and `lang="en"` for another slice.
   - Pros: smaller first PR.
   - Cons: leaves the user's stated item 4 unfinished in this change.
   - Effort: Trivial.

### CI/test/build/lint (defect 5)

1. **Minimal GitHub Actions workflow**
   - Description: add `.github/workflows/ci.yml` with Node 20 setup,
     `npm ci`, then `npm run lint && npm run test && npm run build`,
     triggered on `push` and `pull_request`.
   - Pros: turns existing scripts into an automated gate; minimal
     infra cost.
   - Cons: requires the maintainer's GitHub Actions allowance.
   - Effort: Low.

2. **No CI in this change**
   - Description: rely on `npm run test` and `npm run build` locally
     only.
   - Pros: keeps the slice review-only.
   - Cons: drift accumulates; the previous change already shipped
     without CI.
   - Effort: Trivial.

### Human acceptance gates (defect 6, deferred)

1. **Snapshot the current desktop layout before apply, gate after**
   - Description: capture a baseline screenshot of each module at
     1920×1080, 1440×900, and 375×812 (mobile) before any code lands.
     Re-capture after the layout PR and require a human check-off in
     `verify-report.md`. Scenario tests stay automated; the layout
     itself stays a human-reviewed gate.
   - Pros: matches the user's "screenshot reference" framing; preserves
     the previous slice's automated gate discipline.
   - Cons: requires the user to do the visual check; cannot fabricate
     evidence.
   - Effort: Low (organizational, not coding).

## Recommendation

Apply the layout slice in **three chained PRs** (delivery strategy
`ask-on-risk`, total forecast ~700–900 lines — over the 800-line
budget):

- **PR 1 — Geometry & parameter corrections**: defect 1
  (Mercado inelastic anchor) + defect 2 (Monopolio CTM SVG from
  `naturalParams`) + targeted tests in
  `src/components/simulations.test.jsx` (assert the inelastic curve
  stays at `mapX(Qe_orig)` regardless of `shift`, and assert the
  Monopolio natural SVG reflects injected `naturalParams`). Use
  Approach 1 in geometry: smallest diff, no signature churn, same
  `viewBox` so layout PR 2 can be reviewed independently. Forecast
  ~150 lines. Review budget risk: **Low**.
- **PR 2 — Layout, hierarchy, metadata, residue**: defect 3 with
  `<SimulatorLayout>` (Approach 1), the outer container widening, the
  single-pass metadata + `App.css` deletion + reset-chip
  standardization (Approach 1 of tabs). Forecast ~450–600 lines.
  Review budget risk: **High** → chain mandatory.
- **PR 3 — CI**: minimal GitHub Actions workflow
  (Approach 1 of CI). Forecast ~30 lines. Review budget risk: **Low**.

Human acceptance gates (defect 6) are recorded as **post-apply**
follow-ups in `tasks.md` and `verify-report.md`, not as final
evidence: the user owns the visual check on the new layout and the
explanation copy.

Reasons not to bundle the slices into one PR:
- The geometry slice touches two domains and four tests, all
  mathematical — a separate reviewer can confirm math correctness
  without seeing layout churn.
- The layout slice changes visual hierarchy and the outer container,
  which a separate reviewer can judge holistically.
- The CI slice is independent of either.

Reasons to ship all three in this change (rather than separate
changes): the user explicitly asked for a single cohesive slice
covering items 1–6, and the OpenSpec archive pattern preserves the
whole artifact under `improve-layout-and-visual-coherence/`.

## Risks

- **Inelastic shock visualization regresses for users who already
  learned the current (incorrect) slide behavior.** The fix changes the
  visual feedback loop. Mitigate with the new "price-absorbing" arrow
  + one-line explanation update, and the existing `warningKey` copy
  in `Mercado.jsx:308-310`.
- **SVG path-parameterization hides a domain bug if `cme_base` /
  `cme_fixed` change in `App.jsx` without the chart knowing.** Mitigate
  with an explicit `useMemo` dep list and a test that injects
  `naturalParams` and asserts a non-trivial SVG coordinate change.
- **`<SimulatorLayout>` increases file count but each module is still
  its own JSX file.** Without a shared `ResetChip` helper, the
  reset-button drift returns. Extract a tiny shared component in PR 2.
- **`max-w-[min(1600px,96vw)]` plus `grid-cols-3` may break the
  neo-brutalist shadow offsets at very wide viewports.** Mitigate by
  capping `min(1600px, 96vw)` and verifying shadows still align at
  1920 px.
- **`lang="en"` → `lang="es"` is a one-line change but every CI
  accessibility check (if added later) will key off it.** Acceptable
  because the visible UI is Spanish.
- **Adding CI without secrets.** Vite base path
  `/Simulador-Microeconomia/` implies `gh-pages` deploy; the workflow
  must not auto-deploy on PRs.

## Ready for Proposal

**Yes.** All six items map to concrete files, have authoritative
anchors (the canonical spec for math; the existing source for layout
and metadata), and the recommended chained-PR split keeps each PR
within review budget. The orchestrator should move to `sdd-propose`
with the chained-PR plan, the `<SimulatorLayout>` approach, and the
human-acceptance gate recorded as a post-apply follow-up. No
clarification is required before the proposal is written.
