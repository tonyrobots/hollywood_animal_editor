To do:
[ ] clean up table formatting
[x] add filter to show only your studio employees

Dev log:
2025-10-09: Rebuilt the Actors tab on the new stack — added reusable slider/age controls tied into the store, wired undo/redo change log, and introduced the actor detail drawer with JSON editing. Added preliminary store unit tests for skill/limit/tag/age mutations (Vitest still needs WebCrypto, so runs are blocked inside the sandbox).
2025-10-08: Stood up a new Vite/Preact shell under `src/` with domain/store modules, save loader, actor preview table, and optional name map uploader. Legacy `web/` build left intact for comparison; tests updated to cover game-year edge cases.
2025-10-08: Simplified pre-upload UX: removed separate "Load Name Map" step. We now rely on the bundled `web/data/CHARACTER_NAMES.json` and auto-load it; the loader panel focuses solely on uploading the save. Footer copy updated accordingly. Adjusted status texts to no longer prompt for manual name map loading and hid loaders immediately after save upload.
2025-10-08: Added a global "Player Studio (studioName) Only" switch above tabs. Uses `studioName` (fallback to `StudioName`) from the save for the label. Applied filtering across role tabs (Actors, Directors, Producers, Writers, Editors, Composers, Cinematographers, Agents, Management). Movies left unchanged after confirming the sample save’s movies are already player-studio. Also updated UI from checkbox to a switch and added minimal CSS.
2025-10-07: Updated detail view "Readiness for Tricks" to a labeled dropdown (0 - No tricks, 1 - Only clean tricks, 2 - Dirty tricks allowed). Confirmed there is a single shared detail view across professions; actor-only fields (ART/COM) are conditionally shown.
