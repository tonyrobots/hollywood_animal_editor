Hollywood Animal Editor — Suggestions and Next Steps

Product UX
- Add column filters per tab (e.g., age range, skill thresholds), and a toggle “Only my studio employees”.
- Persist sort state and filters across tabs and reloads via `localStorage`.
- Add inline validation messages near changed controls (currently only in the global Changes panel).
- Provide a confirm dialog when attempting to close the Advanced Editor with unsaved edits.
- Add quick actions to set Actor ART/COM to the allowed discrete ticks.

Data & Compatibility
- Add a validator tool in the UI that scans the entire `characters` list and shows a compact report (malformed decimals, missing `Limit`, missing `whiteTagsNEW` entries for actors, etc.).
- Extend robust extraction to also handle compressed `stateJson` payloads if present in future formats.
- Optional: expose `state` (bitmask) and `studioId` as columns with human-readable helpers and filters.

Performance
- Virtualize tables for 5k+ rows to keep scrolling smooth; measure with large saves.
- Debounce slider change logs to ensure a single change record per interaction (already mostly handled on `mouseup`).
- Lazy compute derived columns (e.g., movies count) on demand and cache per tab.

Features
- Implement studio selector editing in Advanced Editor (currently read‑only); emit a change when `studioId` changes.
- Add read-only movie details drawer by fetching titles via a local mapping or optional upload (no game assets shipped).
- Add a bulk‑edit mode for selected rows (e.g., set Limit to max, bump skill +0.050).
- Support Directors/Producers ART/COM editing when values are present (non-discrete).

Dev Experience
- Split `web/app.js` into modules for tabs, data access, name resolution, and utilities to improve maintainability.
- Add lightweight tests for data helpers (normalization, extractCharacters, ensureTag) using a browserless harness.
- Create a `docs/CONTRIBUTING.md` covering local serve, coding style, and release steps.

Safety
- Add a “Backup before edit” reminder and an optional embedded compressor to archive the original save alongside the edited one.
- Include checksum of original file contents in the exported filename metadata to help users track versions.

Nice-to-haves
- Keyboard shortcuts (/, s) for search; (u/r) for Undo/Redo; (g) to jump to Game Year override.
- Theme toggle (dark/light) and high-contrast mode for accessibility.

