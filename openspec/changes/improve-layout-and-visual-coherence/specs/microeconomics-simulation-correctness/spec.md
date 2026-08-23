# Delta for Microeconomics Simulation Correctness

## ADDED Requirements

### Requirement: Natural-Monopoly CTM SVG Derived from Active Parameters

The system MUST derive the natural-monopoly CTM SVG path from the active `naturalParams`, not from hardcoded coordinates.

#### Scenario: CTM path from injected parameters

- GIVEN `naturalParams` defines the active cost structure
- WHEN the Monopolio natural CTM curve renders
- THEN every SVG coordinate on the CTM path MUST be computed from `naturalParams` within tolerance ≤ 0.01

#### Scenario: Parameter change updates CTM

- GIVEN the user changes a natural monopoly parameter
- WHEN the CTM curve re-renders
- THEN the SVG path MUST update to reflect the new parameter values

## MODIFIED Requirements

### Requirement: Inelastic Curve Rendering and Shock Explanation

The system SHOULD warn when a shock is combined with a perfectly inelastic curve, MUST explain the resulting behavior, and MUST render the inelastic curve anchored to the computed equilibrium quantity with a price-absorption visual cue.

(Previously: Requirement only required a warning and explanation for inelastic shocks; it did not require SVG anchoring or a price-absorption cue.)

#### Scenario: Inelastic demand with demand shock

- GIVEN `isDInelastic` is true and `shiftD` ≠ 0
- WHEN the explanation renders
- THEN a non-blocking warning SHOULD appear and the text MUST state price absorbs the shock while quantity stays fixed

#### Scenario: Inelastic curve anchored at equilibrium quantity

- GIVEN `isDInelastic` is true and the computed equilibrium quantity is Q*
- WHEN the market graph renders
- THEN the inelastic demand curve MUST be a vertical line at x = Q* within SVG coordinate tolerance ≤ 1 px

#### Scenario: Price absorption visual cue

- GIVEN `isDInelastic` is true and a non-zero shock moves equilibrium price
- WHEN the market graph renders
- THEN the price-absorption cue MUST visually indicate that quantity remains at Q* while price changes

## REMOVED Requirements

None.

## RENAMED Requirements

None.
