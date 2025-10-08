# Hollywood Animal Editor — Refactor Plan

This document captures the agreed-upon strategy for refactoring the Hollywood Animal save editor so future work can continue seamlessly.

## Goals
- Replace the monolithic `web/app.js` script with a modular, tested codebase.
- Improve readability and maintainability ahead of new feature work.
- Preserve current functionality (upload/edit/export) while reducing duplication and risk.

## High-Level Architecture
- **Domain Layer (`src/domain/`)**  
  Typed modules for save parsing, character modeling, tag helpers, studio extraction, and numeric normalization.
- **Services (`src/services/`)**  
  File import/export, bundled name-map loading, schema validation, and future persistence helpers.
- **Application State (`src/state/`)**  
  Central store (Preact Signals or Zustand) augmented with `immer` for immutable updates plus undo/redo timeline management.
- **Reusable Components (`src/components/`)**  
  Generic UI pieces such as `EntityTable`, `SliderField`, `AgeField`, `ChangeList`, `DetailDrawer`, and `Tabs`.
- **Views (`src/views/`)**  
  Tab-specific assemblies that configure columns, filters, and detail sections for Actors, Directors, etc.
- **Utilities (`src/utils/`)**  
  Formatting helpers (unit conversions, birthdate parsing), deep path setters/getters, and shared constants.
- **Styles (`src/styles/`)**  
  Refined CSS modules or BEM-scoped styles derived from the current `web/style.css`.

## Tooling and Dependencies
- **Build**: Vite + TypeScript targeting modern browsers.
- **UI**: Preact (with Signals) for lightweight component rendering.
- **State Helpers**: `immer` (immutable updates); consider `zustand` or Signals-only store.
- **Validation**: `zod` schemas for runtime save-file checks.
- **Testing**: Vitest + jsdom for unit/component tests, Playwright later for end-to-end.
- **Lint/Format**: ESLint (TypeScript + Preact), Prettier, Stylelint.

## Migration Steps
1. **Bootstrap Tooling**  
   Add Vite/TypeScript/Preact scaffold, lint/test scripts, and CI updates.
2. **Extract Domain Utilities**  
   Port logic such as `extractCharacters`, `findStudioRoot`, normalization, and tag helpers into TS modules with unit tests using `docs/sample_save.json`.
3. **Implement Central Store**  
   Model current change-log, filtering, and undo/redo behavior as typed actions/state. Ensure decimal normalization and limit syncing live in one place.
4. **Create Component Library**  
   Build reusable table/sliders/detail drawer components. Confirm they interact with the store via declarative props/actions.
5. **Port Actors Tab**  
   Recreate the Actors experience with the new stack to validate architecture decisions (search, filters, detail overlay, change tracking).
6. **Port Remaining Tabs**  
   Migrate Directors, Producers, Writers, Editors, Composers, Cinematographers, Agents, Management, and Movies to shared components. Remove redundant imperative renderers.
7. **Integrate IO Flow**  
   Rewire upload/drag-drop, reload, name-map loading, and download/export through service modules.
8. **Polish & Document**  
   Clean CSS, remove legacy scripts, update README, DATA_MODEL, CONTRIBUTING with new structure and extension guidance. Add smoke tests for core flows.

## Key Considerations
- Maintain numeric string formatting with three decimals and keep `limit`/`Limit` synchronized.
- Ensure the undo/redo timeline still coalesces slider drags into single entries.
- Watch bundle size; Preact + Signals should keep the vendor footprint minimal (<20 KB gz).
- Prepare for future fields by making role views configuration-driven rather than hard-coded.

## Open Questions
- Final store implementation: Signals-only vs. Zustand (decide during Step 3).
- Whether to add Playwright E2E tests in this refactor or after core migration.
- Any additional studio codes or data model tweaks that should be captured while porting.

## Next Actions
1. Scaffold Vite/TypeScript/Preact tooling and update deployment pipeline for the new bundle.
2. Begin extracting domain utilities with unit tests (Step 2).
3. Draft the central store and migrate the Actors tab as the pilot. 

All further work should reference this plan to maintain continuity if the effort pauses or shifts between contributors.
