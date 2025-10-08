To do:
[ ] clean up table formatting
[x] add filter to show only your studio employees

Dev log:
2025-10-08: Added a global "Player Studio (studioName) Only" switch above tabs. Uses `studioName` (fallback to `StudioName`) from the save for the label. Applied filtering across role tabs (Actors, Directors, Producers, Writers, Editors, Composers, Cinematographers, Agents, Management). Movies left unchanged after confirming the sample save’s movies are already player-studio. Also updated UI from checkbox to a switch and added minimal CSS.
2025-10-07: Updated detail view "Readiness for Tricks" to a labeled dropdown (0 - No tricks, 1 - Only clean tricks, 2 - Dirty tricks allowed). Confirmed there is a single shared detail view across professions; actor-only fields (ART/COM) are conditionally shown.
