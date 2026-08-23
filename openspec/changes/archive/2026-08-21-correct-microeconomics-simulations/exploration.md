# Exploration: correct-microeconomics-simulations

> Read-only investigation. Anchors cite the local Mankiw PDF
> `resources/material/microeconomia-mankiw-3-pdf-free.pdf` (sexta edición,
> versión para América Latina, N. Gregory Mankiw). PDF page = printed book
> page + 33 for the cited chapters.

## Current State

The simulator is a single-page React/Vite app (`src/App.jsx`) with four
tabs. Each tab owns its own local `useState`, and the domain logic is
isolated under `src/domain/`. The authoritative conceptual source is
Mankiw, sixth Latin American edition. The previously committed audits
(`#194 audit/economic-traceability`, `#190 audit/microeconomics-simulator-2026-08-21`,
`#196 audit/mankiw-traceability`) already flagged the same set of defects
this exploration re-confirms against the PDF.

The four confirmed defects, plus one scope decision, are detailed below.
None of the source files were modified.

---

## Defect 1 — CTM minimum and shutdown logic in `src/domain/costos.js`

### What the code does

```js
const minCVM_Q = 8;
const minCVM_P = 4.0;
const minCTM_Q = 9.25;
const minCTM_P = 7.55;
// ...
const currentCTM = firmQ > 0 ? (0.1*Q^2 - 1.6*Q + 10.4 + 30/Q) : 0;
// ...
if (firmPrice < minCVM_P) status = 'cierre';
else if (Math.abs(firmPrice - minCTM_P) < 0.2) status = 'nivelacion';
// ...
```

The cost function is `CTM(Q) = 0.1·Q² − 1.6·Q + 10.4 + 30/Q` and
`CVM(Q) = 0.1·Q² − 1.6·Q + 10.4`, with fixed cost 30, drawn curves
`CMg(Q) = 0.3·Q² − 3.2·Q + 10.4`.

### Why it is wrong (Mankiw anchor)

- Mankiw, *Capítulo 13 — Los costos de producción* (PDF p. 302, libro p. 269):
  "La curva de costo marginal interseca la curva de costo total promedio en
  el **mínimo de costo total promedio**." → the canonical
  *Punto de Nivelación* is `(Q*, minATC)` where `dCTM/dQ = 0` and
  `CMg(Q*) = CTM(Q*)`.
- Numerical check on the simulator's own cost function:
  `dCTM/dQ = 0.2·Q − 1.6 − 30/Q² = 0` ⇒ `Q* ≈ 9.6206`, `CTM(Q*) ≈ 7.3809`.
  At `Q = 9.25` the actual `CTM = 7.3995`, **not** the hardcoded `7.55`.
  At `P = 7.55` on the rising branch, `Q ≈ 9.6859` and `CTM(9.6859) ≈ 7.3815`
  ⇒ the firm's profit is `(7.55 − 7.3815)·9.6859 ≈ +1.63`, **not** zero.
  ⇒ The hardcoded `(9.25, 7.55)` is **not** a break-even point; the label
  *PUNTO DE NIVELACIÓN* is being mis-applied to a small-profit price.
- Shutdown rule is correctly implemented: `firmPrice >= minCVM_P` gates
  production, matching Mankiw, *Capítulo 14 — Las empresas en mercados
  competitivos* (PDF p. 318–320, libro p. 285–287):
  "A corto plazo, la curva de oferta de la empresa competitiva es la
  curva de costo marginal (CMg) que está por encima del costo variable
  promedio (CVP). Si el precio disminuye por debajo del costo variable
  promedio, es mejor que la empresa cierre."
- Mankiw also requires that the area shown for the *cierre* state reflect
  the unavoidable fixed cost (`Beneficio = −CF`); the simulator's hardcoded
  `-30` readout in `Costos.jsx:75` matches the model's `CF = 30`, but the
  fixed-cost area is **not** drawn on the chart (the `showArea` polygon is
  hidden when `firmQ = 0`). That is a minor visual gap, not a conceptual
  defect.

### Affected areas
- `src/domain/costos.js` — wrong hardcoded `(minCTM_Q, minCTM_P)`; status
  band centered on the wrong anchor.
- `src/components/Costos.jsx` — the "P. NIVELACIÓN" badge, the polygon
  for the *nivelación* zone, and the −30 readout in the benefits card all
  depend on the wrong anchor.

### Approach options

| Approach | Pros | Cons | Effort |
| --- | --- | --- | --- |
| A. Recompute anchors from the cost function at module load (numerical or symbolic). | Always matches the cost formulas used downstream; survives a future `CTM` change. | Slight init cost; tests need to assert ≤ 0.01 tolerance. | Low |
| B. Replace the four magic numbers with the analytical values `(8, 4.0, 9.6206, 7.3809)`. | Cheapest diff, no math at runtime. | Couples literals to the formulas; any future edit to `CTM`/`CVM` silently desyncs. | Trivial |
| C. Compute anchors lazily inside `calcularCostos` and return them with the rest. | Single source of truth; the same `useMemo` recomputes only when `firmPrice` changes (current dependency is correct). | Same as A but applied per-call. | Low |

**Recommendation:** A. Compute `(minCVM_Q, minCVM_P, minCTM_Q, minCTM_P)`
analytically from `dCVM/dQ = 0` and `dCTM/dQ = 0` (closed-form via Cardano
for the cubic) or numerically with a tight bisection (≤ 1e-4) at module
load, exported as constants. Then either replace the `±0.2` band with a
tight tolerance (≤ 0.01) or simply check `firmPrice == minCTM_P` (the
canonical "Punto de Nivelación"). Also draw the fixed-cost loss area in
the *cierre* state.

### Risks
- Any tolerance change will re-classify a small band of slider positions
  around 7.38; the UI label and the benefit readout must stay consistent.
- If the cost function changes, the analytical formula must be re-derived
  (mitigated by A).

---

## Defect 2 — FPP ±2 efficiency tolerance in `src/domain/fpp.js`

### What the code does

```js
if (pointX > techX || pointY > maxPossibleYAtX + 2) status = 'inalcanzable';
else if (pointY < maxPossibleYAtX - 2) status = 'ineficiente';
else status = 'eficiente';
```

`maxPossibleYAtX = techY · sqrt(1 − (pointX/techX)²)` for an elliptical PPF.

### Why it is wrong (Mankiw anchor)

- Mankiw, *Capítulo 2 — Pensar como economista* (PDF p. 60, libro p. 27):
  "Se dice que un resultado es **eficiente** si la economía obtiene el
  mayor provecho posible de los recursos de que dispone. **Los puntos que
  están sobre la línea** de la frontera de posibilidades son los que
  representan niveles eficientes de producción **y no aquellos que se
  encuentran dentro de la frontera**... El punto D, por ejemplo,
  representa un resultado ineficiente, ya que por alguna razón, quizá por
  el desempleo generalizado, la economía está produciendo menos de lo que
  podría producir si utilizara todos los recursos de que dispone."
  → The classification is **strict**: *on* the curve = efficient,
  *inside* = inefficient, *outside* = unattainable. There is no
  "approximately on the curve" zone in the textbook.
- The current `±2` band means that a point 1.9 units inside the curve is
  labelled *eficiente* and the legend says *"Pleno empleo. Para fabricar
  más de un bien, debes renunciar al otro."* — that is the textbook
  description of a frontier point, not of a 1.9-unit-inside point.

### Affected areas
- `src/domain/fpp.js` — the `+2 / -2` magic numbers.
- `src/components/FPP.jsx` — the diagnostic banner and the canvas fill
  (the curve fill at `opacity 0.05` is the *frontera* region, not the
  *frontera ±2* region).

### Approach options

| Approach | Pros | Cons | Effort |
| --- | --- | --- | --- |
| A. Strict comparison (`pointY > maxPossibleYAtX` / `<`) with no tolerance. | Matches Mankiw exactly; minimal diff. | Floating-point edge case at the curve itself (round-off). | Trivial |
| B. Strict comparison plus a *visual* "near frontier" highlight (separate UI state) without changing the classification. | Keeps the diagnostic truthful and adds UX hint. | One new `boolean` state + small UI affordance. | Low |
| C. Keep a narrow tolerance (e.g. 0.5) labeled as "aprox. eficiente" with a different banner. | Softens the "snap" feel of the slider. | Invents a zone the textbook does not have. | Low |

**Recommendation:** A + B. Strict classification, plus a thin
"near the frontier" indicator (e.g. dashed circle within 0.5 units) so
students see how close they are. The diagnostic banner must say
"Pleno empleo" only for points on the curve.

### Risks
- Slider granularity (`step` is `1`) means most points will land strictly
  inside or outside; the diagnostic will toggle more often. Acceptable.

---

## Defect 3 — Market-equilibrium explanation inconsistent with the shock/vertical-curve view

### What the code does

`src/components/Mercado.jsx:294-313` writes the explanation as a single
ternary keyed on `escMercado` and `(shiftD, shiftS)` only — it never
reads `isDInelastic` or `isSInelastic`. The mathematical layer in
`src/domain/mercado.js` *does* treat inelastic demand/supply differently
(vertical lines, fixed quantity), but the textual explanation ignores
that branch.

Concretely, with `escMercado = 'libre'`, `shiftD = 5`, and
`isDInelastic = true`, the user reads:

> "Sube la Demanda (ej: mayor ingreso). Esto empuja la Cantidad y el
> Precio hacia ARRIBA (nuevo equilibrio)."

But the chart draws a **vertical** demand line at `Qe_orig + shiftD` and
the calculator returns `Qe = Qe_orig + shiftD` (Q does move) with
`Pe = sInt + sSlope·Qe` (P also moves). With a truly vertical demand and
an elastic supply, the new equilibrium is at the **same Q** as the old
(one intersection) and a higher P. The free-market branch in
`mercado.js:14-28` actually computes `Qe = Qe_orig + shiftD` (which is
not "the same Q"), so there is a layered inconsistency: the *code* moves
Q for a vertical demand, while the *chart* and the *explanation* both
imply Q should not move. This is the precise meaning of the
"inconsistent with shock/vertical-curve view" framing.

### Why it is wrong (Mankiw anchor)

- Mankiw, *Capítulo 4 — Las fuerzas del mercado de la oferta y la
  demanda* (PDF p. 110, libro p. 77): "el equilibrio del mercado. El
  precio en esta intersección se conoce como precio de equilibrio y la
  cantidad se llama cantidad de equilibrio. ... A este precio se ofrecen
  y se demandan 7 vasos de helado." → equilibrium is the intersection of
  the (possibly shifted) curves. With a perfectly inelastic demand
  (vertical), the intersection still exists, but the resulting Q is
  constant.
- Mankiw, *Capítulo 5 — Elasticidad y sus aplicaciones* (PDF p. 124+,
  libro p. 91+): defines perfect inelasticity as a vertical demand
  curve; quantity is independent of price.
- Mankiw, *Capítulo 4 — Tres pasos para analizar los cambios en el
  equilibrio* (PDF p. 112, libro p. 79): shock → new intersection →
  new (P, Q). The text the simulator shows is correct for **elastic**
  curves and incorrect for **inelastic** ones.

### Affected areas
- `src/components/Mercado.jsx:294-313` — the explanation ternary.
- `src/domain/mercado.js:14-28, 29-43` — the inelastic branches move Q
  by `shiftD` / `shiftS`, which is not the textbook behavior for a
  vertical curve. (This may be intentional UX to make the shock visible;
  if so, the explanation must say so explicitly.)

### Approach options

| Approach | Pros | Cons | Effort |
| --- | --- | --- | --- |
| A. Make the inelastic branches compute `Qe = Qe_orig` and let `Pe` absorb the shock; align the explanation. | Strictly matches Mankiw; consistent with the vertical-curve view. | The shock slider becomes invisible on Q for inelastic — needs UX copy. | Low |
| B. Keep the current calculator (Q moves) but rewrite the explanation to say "con demanda vertical, el precio absorbe todo el shock y la cantidad se mantiene" and label the chart explicitly. | Preserves the visible feedback loop. | Requires a careful explanation that doesn't contradict the on-screen number. | Low |
| C. Remove `isDInelastic` / `isSInelastic` toggles until they can be implemented faithfully. | Removes a confusing feature. | Reduces coverage. | Low |

**Recommendation:** B for the current scope, with an inline note in the
explanation pointing to Mankiw's perfect-inelasticity definition. Open a
follow-up to consider A once a separate "pure inelastic" scenario is
needed.

### Risks
- The calculator's behavior for inelastic + shock is non-standard; if
  we keep it, the explanation must be very explicit. If we change the
  calculator, the chart's vertical line must remain the visual anchor.

---

## Defect 4 — Potential state persistence across scenarios in `Mercado.jsx`

### What the code does

`src/components/Mercado.jsx` keeps 10 independent `useState` values for
the controls. The shock sliders (`shiftD`, `shiftS`) are **rendered
conditionally** (`escMercado === 'libre' && ...`) but their values are
**always** read by `calcularMercado`, which derives

```js
const dInt = dIntBase + dSlope * shiftD;
const sInt = sIntBase - sSlope * shiftS;
```

before any branch. So if a student sets `shiftD = 5` while exploring the
*libre* scenario, then switches to *impuesto*, the *impuesto* scenario
quietly inherits the shock: the tax wedge is computed on an already-
shifted demand curve, even though the shock slider is now hidden.

### Why it is wrong

- This is a *coupling* defect, not a textbook statement. The textbook
  treats demand shocks, taxes, and subsidies as distinct policy levers;
  the simulator silently bundles them.
- A second, smaller instance: each tab owns its own `useState` and the
  `activeTab` is in `App.jsx`. Switching tabs preserves all of each
  tab's local state. That is the default React behavior; it is not a
  defect by itself, but combined with the missing *Restablecer* in
  `Costos.jsx`, `FPP.jsx`, and `Monopolio.jsx` (only `Mercado.jsx:36`
  has one), it means there is no canonical "back to baseline" action.

### Affected areas
- `src/components/Mercado.jsx` — extend `handleReset` (already resets
  all 10 values) and/or zero out `shiftD` / `shiftS` on every scenario
  transition.
- `src/components/{Costos,FPP,Monopolio}.jsx` — add a *Restablecer*
  button consistent with `Mercado.jsx:36`.

### Approach options

| Approach | Pros | Cons | Effort |
| --- | --- | --- | --- |
| A. On `setEscMercado`, force `shiftD = shiftS = 0` whenever the new scenario is not *libre*. | Tiniest diff; addresses the hidden-state defect directly. | Removes a feature: students cannot pre-shift a curve and then add a tax. | Trivial |
| B. Move shocks into a per-scenario state object; reset on scenario change. | Conceptually clean: each scenario has its own parameters. | More refactor; needs the same change in `mercado.js` signatures. | Medium |
| C. Add a *Restablecer* button to every tab and document the persistence. | Honors user agency; minimal coupling change. | The hidden-state defect in Mercado remains unless combined with A or B. | Low |

**Recommendation:** A as a one-line guard, plus C for consistency across
the four tabs. Document in the UI: "Cambiar de escenario reinicia los
shocks."

### Risks
- A breaks the (arguably unintended) ability to keep a shock when
  switching scenarios. Acceptable trade-off for clarity.

---

## Defect 5 — Natural-monopoly regulation: missing second `P = CMe` intersection

### What the code does

`src/domain/monopolio.js:13-25` hardcodes the four natural-monopoly
regulation outcomes, with no computation:

```js
} else if (naturalReg === 'regulacion_cme') {
  // P = CMe -> 24 - 0.5Q = 4 + 160/Q -> Q ~ 28.94
  q_nat = 28.94; p_nat = 9.53; ctm_nat = 9.53; profit_nat = 0;
}
```

`Monopolio.jsx:102-106` then tells the user only:

> "Regulación P=CMe: no hay beneficios extra, pero la empresa no requiere
> subsidios para operar."

### Why it is wrong (Mankiw anchor)

- The cost function in the simulator's natural monopoly is
  `CTMe(Q) = 4 + 160/Q` (constant `CMg = 4`) with demand
  `P(Q) = 24 − 0.5·Q`. Solving `P = CTMe`:
  `24 − 0.5·Q = 4 + 160/Q ⇒ 0.5·Q² − 20·Q + 160 = 0 ⇒
  Q² − 40·Q + 320 = 0 ⇒ Q = 20 ± √80`.
  Two intersections: `(Q ≈ 11.06, P ≈ 18.47)` and
  `(Q ≈ 28.94, P ≈ 9.53)`. The simulator uses only the second
  (higher Q, lower P) — the one a regulator would prefer — but it
  never mentions the first.
- Mankiw, *Capítulo 15 — Monopolio* (PDF p. 354, libro p. 321):
  "Por definición, los monopolios naturales tienen un costo total
  promedio decreciente. Como señalamos en el capítulo 13, cuando el
  costo total promedio es decreciente, el costo marginal es menor que el
  costo total promedio. ... Si los organismos reguladores asignan un
  precio igual al costo marginal, ese precio será menor que el costo
  total promedio de la empresa, por lo que ésta perderá dinero."
  → Mankiw does mention only one `P = CMe` anchor (the regulator
  picks the higher-Q one to maximize surplus), but the simulator's
  narrative is silent on **why** `(28.94, 9.53)` and not `(11.06, 18.47)`.
  A faithful explanation must surface the two intersections and the
  reasoning.
- The simulator's `p_nat` and `ctm_nat` are hardcoded, so any future
  change to the demand or cost function desynchronizes the badge.

### Affected areas
- `src/domain/monopolio.js:13-25` — hardcoded regulation outcomes.
- `src/components/Monopolio.jsx:102-106` — narrative for the
  `regulacion_cme` case.
- `src/components/Monopolio.jsx:226-242` — chart must show *both*
  intersections (a marker and a label for the alternative, with
  reduced opacity, so the active choice stays primary).

### Approach options

| Approach | Pros | Cons | Effort |
| --- | --- | --- | --- |
| A. Compute `q_nat`, `p_nat`, `ctm_nat` from the demand and ATC formulas (solve the quadratic in `monopolio.js`). | Self-consistent with the rest of the simulator. | Two roots; must select the higher-Q one explicitly. | Low |
| B. Hardcode both intersections in the constants, pick one as the active regulation, show the other as a faded alternative on the chart. | Smallest diff. | Constants still fragile. | Trivial |
| C. Compute the active regulation, render the inactive intersection as a labeled point, and update the explanation to read "El regulador elige la intersección de mayor Q (más producción, menor precio) para acercarse al óptimo social; la otra intersección daría menos cantidad y un precio mayor." | Conceptually complete. | Needs a small chart update. | Low–Medium |

**Recommendation:** A + C. Compute the two intersections dynamically, pick
the higher-Q one as the regulated outcome, render the other as a
faded alternative, and rewrite the explanation. This also makes the
narrative robust to future changes in the demand or cost parameters.

### Risks
- If a future demand curve is **not** downward-sloping enough to cross
  the decreasing ATC twice, the code must fall back to a clear
  "no `P = CMe` solution" state. Add a guard for `discriminant < 0`.

---

## Scope decision (not a defect) — unimplemented price controls

Per the change brief, **price controls** (price ceilings, price floors)
are not part of this slice. They are a Mankiw topic
(*Capítulo 6 — Oferta, demanda y políticas del gobierno*, PDF p. 146,
libro p. 113) that the simulator does not implement; the *libre*,
*impuesto*, and *subsidio* scenarios cover most of chapter 6 except
direct price caps. We treat this as a known scope gap, not a defect,
and exclude it from this exploration.

---

## Affected Areas (consolidated)

- `src/domain/costos.js` — CTM minimum anchor and status logic.
- `src/components/Costos.jsx` — `P. NIVELACIÓN` badge, status banner,
  fixed-cost area, and (minor) absence of a *Restablecer* button.
- `src/domain/fpp.js` — `±2` efficiency tolerance.
- `src/components/FPP.jsx` — diagnostic banner and curve fill; missing
  *Restablecer* button.
- `src/domain/mercado.js` — inelastic branch behavior (Defect 3) and
  shock coupling (Defect 4).
- `src/components/Mercado.jsx` — explanation ternary (Defect 3),
  scenario-change reset (Defect 4).
- `src/domain/monopolio.js` — hardcoded natural-monopoly regulation
  outcomes (Defect 5).
- `src/components/Monopolio.jsx` — `regulacion_cme` narrative, missing
  second-intersection chart marker, missing *Restablecer* button.

## Recommendation

Apply the four low-effort, high-correction-value fixes in the order
they appear above (Defect 1 → 2 → 3 → 4 → 5). They are independent and
each one is small enough to fit a single PR; together they stay well
under the 400-line review budget. The `ask-on-risk` delivery strategy
remains appropriate: the only risk surface is Defect 1, where the
anchor change re-classifies a small slider band, and a one-sentence UI
note ("El *Punto de Nivelación* está exactamente donde el CMg corta al
CTM desde abajo") mitigates it.

## Ready for Proposal

**Yes.** All five items have an authoritative Mankiw anchor, a
reproducible numerical check, and a recommended approach. The
orchestrator can move to `sdd-propose` and bundle these as one
proposal; `sdd-tasks` should forecast a chained-PR plan only if the
cumulative diff exceeds 400 lines (it will not).
