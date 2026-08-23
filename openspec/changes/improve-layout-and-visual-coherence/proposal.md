# Proposal: Improve Layout and Visual Coherence

## Intent

Make the simulator easier to scan and use on desktop and small screens while keeping every graph faithful to its active economic model and preserving its editorial/neo-brutalist identity.

## Scope

### In Scope
- A responsive shared three-zone layout: controls, larger graph focus, and results/explanations across Mercado, FPP, Costos, and Monopolio.
- Correct Mercado inelastic SVG anchoring and parameterize Monopolio natural CTM SVG from active parameters.
- Polish tabs/resets, metadata, and remove the orphan stylesheet; add non-deploying lint/test/build CI.
- Add automated coverage and post-apply human visual-acceptance gates.

### Out of Scope
- Preserving module state when switching tabs; inactive modules continue to reset on return.
- New economic scenarios, including price ceilings, price floors, or other price controls.
- Automatic deployment, visual redesign outside the established identity, or a redesign of domain formulas.

## Capabilities

### New Capabilities
- `simulation-layout-and-visual-coherence`: Responsive shared layout, consistent presentation, metadata, and visual acceptance expectations for simulation modules.

### Modified Capabilities
- `microeconomics-simulation-correctness`: Render inelastic market curves and natural-monopoly CTM curves consistently with active computed parameters, without changing the economics scope.

## Approach

Introduce a shared `SimulatorLayout` with fluid width and responsive three-zone breakpoints; migrate every module while retaining its SVG viewBox and visual language. Keep Mercado's inelastic line at the calculated quantity anchor and visualize price absorption; derive Monopolio CTM SVG coordinates from `naturalParams`.

Chained delivery is warranted: total forecast is about 700–900 changed lines against the 800-line budget and separates independent review concerns. Slice 1: geometry corrections and focused tests. Slice 2: shared layout, reset/tab polish, metadata, and orphan CSS removal. Slice 3: minimal Node 20 GitHub Actions workflow running lint, test, and build. This is a delivery plan, not PR creation.

## Affected Areas

| Area | Impact | Description |
|---|---|---|
| `src/App.jsx`, `src/components/SimulatorLayout.jsx` | Modified/New | Fluid shell, tabs, shared zones |
| `src/components/{Mercado,FPP,Costos,Monopolio}.jsx` | Modified | Layout migration and presentation consistency |
| `src/components/Mercado.jsx` | Modified | Inelastic SVG anchor and price-absorption cue |
| `src/components/Monopolio.jsx` | Modified | Parameterized natural CTM path |
| `src/App.css`, `src/index.css`, `index.html`, `package.json` | Modified/Removed | Residue cleanup and Spanish metadata |
| `.github/workflows/ci.yml` | New | Non-deploying quality gate |
| `src/**/*.{test,jsx}` | Modified | Geometry, parameter, reset, and layout coverage |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| SVG visuals diverge from computed results | Medium | Targeted rendered-geometry and injected-parameter tests |
| Wide-screen hierarchy or shadows regress | Medium | Desktop/mobile human acceptance at agreed viewports |
| Layout changes weaken reset behavior | Low | Preserve reset lifecycle and test tab returns |

## Rollback Plan

Revert the affected delivery slice. This restores the prior component markup/styles or SVG rendering; CI removal is isolated and has no deployment effect.

## Dependencies

- Existing React/Vite, Tailwind, Vitest, and React Testing Library scripts.
- GitHub Actions availability; no secrets or deployment configuration.

## Success Criteria

- [ ] All four modules use the responsive shared layout and retain their editorial/neo-brutalist identity.
- [ ] Inelastic Mercado and parameterized Monopolio SVGs match active model outcomes; existing correctness behavior remains green.
- [ ] Returning to an inactive tab resets its module; no state preservation is introduced.
- [ ] `npm run lint`, `npm run test`, and `npm run build` pass locally and in non-deploying CI.
- [ ] A human approves desktop and mobile layout, graph readability, reset behavior, and explanatory copy after apply.
