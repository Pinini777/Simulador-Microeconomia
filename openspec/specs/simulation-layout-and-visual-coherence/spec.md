# Simulation Layout and Visual Coherence Specification

## Purpose

Define responsive layout, presentation consistency, reset behavior, build metadata, and visual acceptance expectations for the four microeconomics simulation modules.

## Out of Scope

- Economic formula changes, new scenarios, or price controls.
- Deployment automation.

## Requirements

### Requirement: Responsive Shared Three-Zone Layout

The system MUST render a shared three-zone layout on desktop for Mercado, FPP, Costos, and Monopolio: controls, graph focus, and results/explanation.

#### Scenario: Desktop zones

- GIVEN a viewport width of at least 1024 px
- WHEN any simulation module is active
- THEN the module MUST present controls, a larger graph focus, and results/explanation in the shared three-zone arrangement

#### Scenario: Mobile fallback

- GIVEN a viewport width below 768 px
- WHEN any simulation module is active
- THEN the module MUST collapse to a single-column layout with controls above the graph and results below

### Requirement: Larger Readable Graph Focus

The system MUST display the chart as the dominant visual element while preserving the existing editorial/neo-brutalist identity.

#### Scenario: Graph prominence

- GIVEN the desktop three-zone layout
- WHEN the module renders
- THEN the graph zone MUST occupy the largest share of available width
- AND the existing color palette, stroke weights, and shadow treatment MUST remain unchanged

### Requirement: Tab Return Reset

The system MUST reset module controls to defaults when the user returns to an inactive tab.

#### Scenario: Return to inactive tab

- GIVEN a module tab was visited, then another tab was selected, and controls were changed
- WHEN the user selects the original tab again
- THEN all controls on that module MUST return to default values

### Requirement: Consistent Reset Affordance

The system MUST provide an explicit reset control in the same location for every module.

#### Scenario: Reset control presence

- GIVEN any simulation module
- WHEN the layout renders
- THEN a reset control MUST be visible in the shared controls zone

### Requirement: Spanish Metadata

The system MUST present page metadata in Spanish and declare the HTML document language as `lang="es"`.

#### Scenario: Document metadata

- GIVEN the simulator page
- WHEN metadata is rendered
- THEN the title and description MUST be in Spanish
- AND the HTML document language MUST be declared as `lang="es"`

### Requirement: Orphan CSS Removal

The system MUST NOT include unused or orphan stylesheet files.

#### Scenario: Build output

- GIVEN the project is built
- WHEN the build completes
- THEN no imported stylesheet file MAY exist that is not referenced by any component

### Requirement: Non-Deploying CI Quality Gate

The system MUST run lint, test, and build on every push without deploying.

#### Scenario: CI workflow

- GIVEN a pull request or push to the default branch
- WHEN the GitHub Actions workflow runs
- THEN it MUST execute lint, test, and build
- AND it MUST NOT contain a deployment step

### Requirement: Human Visual Acceptance Gate

The system MUST be accepted by human review of desktop and mobile rendering before the change is considered complete.

#### Scenario: Acceptance checklist

- GIVEN the apply phase is complete
- WHEN a reviewer inspects the simulator
- THEN desktop layout, mobile layout, graph readability, reset behavior, and explanatory copy MUST be approved manually
