# Microeconomics Simulation Correctness Specification

## Purpose
Define corrected, explainable behavior for the cost-curve, PPF, market-shock, and natural-monopoly simulations so rendered curves, classifications, and explanations stay consistent with the underlying formulas and Mankiw concepts.

## Out of Scope
Price ceilings, price floors, and other price-control simulations.

## Requirements

### Requirement: Cost Anchors Derived from Formulas
The system MUST derive the minimum AVC and minimum ATC points from the active cost functions, not from hardcoded constants.

#### Scenario: Break-even label at ATC minimum
- GIVEN CTM(Q) = 0.1Q² − 1.6Q + 10.4 + 30/Q
- WHEN the cost tab renders
- THEN the break-even/P. NIVELACIÓN label MUST be placed at the computed ATC minimum (Q ≈ 9.62, P ≈ 7.38) within tolerance ≤ 0.01

### Requirement: Shutdown Fixed-Cost Loss Visualization
The system MUST render the unavoidable fixed-cost loss when price is below minimum AVC.

#### Scenario: Shutdown state
- GIVEN price below minimum AVC
- WHEN the firm shuts down (Q = 0)
- THEN the benefit readout MUST show −CF and the chart MUST indicate the fixed-cost loss area

### Requirement: Strict PPF Classification
The system MUST classify PPF points strictly as frontier, inside, or outside based on the exact frontier equation.

#### Scenario: Exact classification
- GIVEN an elliptical frontier
- WHEN a point is evaluated
- THEN on-frontier points MUST be efficient, inside points inefficient, and outside points unattainable

### Requirement: Near-Frontier Visual Cue
The system MAY render a separate near-frontier indicator without altering the strict classification.

#### Scenario: Close but not on frontier
- GIVEN a point within 0.5 units of the frontier but not on it
- WHEN rendered
- THEN a near-frontier highlight MAY appear, and the banner MUST still show the strict classification

### Requirement: Market-Shock State Isolation
The system MUST reset demand and supply shock values when the user leaves the free-market scenario.

#### Scenario: Scenario change clears shocks
- GIVEN free-market is active with non-zero shiftD or shiftS
- WHEN the user selects tax or subsidy
- THEN shiftD and shiftS MUST be zeroed before the new equilibrium is computed

### Requirement: Non-Standard Inelastic Shock Warning and Explanation
The system SHOULD warn when a shock is combined with a perfectly inelastic curve and MUST explain the resulting behavior.

#### Scenario: Inelastic demand with demand shock
- GIVEN isDInelastic is true and shiftD ≠ 0
- WHEN the explanation renders
- THEN a non-blocking warning SHOULD appear and the text MUST state price absorbs the shock while quantity stays fixed

### Requirement: Natural-Monopoly Dual Intersections
The system MUST compute and render both P = ATC intersections for natural-monopoly regulation.

#### Scenario: Two real roots
- GIVEN P(Q) = 24 − 0.5Q and ATC(Q) = 4 + 160/Q
- WHEN regulacion_cme is selected
- THEN the simulator MUST compute Q ≈ 11.06 and Q ≈ 28.94, render both, and show the non-selected root as a faded alternative

#### Scenario: No real roots
- GIVEN parameters that yield no real P = ATC solution
- WHEN regulacion_cme is selected
- THEN the simulator MUST show a clear no-solution state instead of an incorrect point

### Requirement: Natural-Monopoly Regulatory Choice
The system MUST select the higher-output/lower-price intersection and explain the choice.

#### Scenario: Higher-Q outcome selected
- GIVEN both intersections exist
- WHEN the regulation outcome is presented
- THEN the simulator MUST choose the larger-Q root (≈ 28.94, P ≈ 9.53)
- AND the explanation MUST state this maximizes output and minimizes price

### Requirement: Consistent Reset Controls
The system MUST provide a reset control on every simulation tab.

#### Scenario: Tab reset
- GIVEN controls on any simulation tab have been changed
- WHEN the reset control is activated
- THEN all controls on that tab MUST return to default values
