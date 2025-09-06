Project: Hollywood Animal — Savegame Editor

Purpose
- Build a local, static web app to edit “Hollywood Animal” save files.
- Tabs: Actors (implemented), Directors, Producers, Writers, Editors (placeholders), Movies (placeholder).
- MVP scope (Actors):
  - Acting skill at `professions.Actor` (string number; slider input)
  - Limit at both `limit` and `Limit` (string number; slider input)
  - ART and COM ratings under `whiteTagsNEW` with constrained options
  - Age as a derived field (edits `birthDate` year; game year auto‑detected, user‑overridable)

Repository Layout
- `docs/`
  - `full_sample_savefile.json` and `_formatted.json`: full saves for analysis.
  - `sample_save_actor_data_fixed.json`: exemplar TalentData actor records.
- `data/`
  - `CHARACTER_NAMES.json`: name ID → string mapping (first and last names share the same pool).
- `python_scripts/`
  - `actor_finder.py`: utility to locate actors by name IDs and pretty‑format saves.
- `web/` — static app
  - `index.html`, `style.css`, `app.js`
  - `data/CHARACTER_NAMES.json` — canonical name map used by the app

Target Data Model (actors)
- Actor records are `Data.GameObject.Character.TalentData` objects found under (or within) the top‑level `characters` array (robustly detected).
- Relevant fields (strings unless noted):
  - `id` (number), `firstNameId` (string), `lastNameId` (string), `gender` (number)
  - `professions.Actor`: acting skill as a string decimal (e.g., "0.800")
  - `limit` and `Limit`: keep in sync
  - `whiteTagsNEW`: object keyed by tag IDs (e.g., `ART`, `COM`)
    - Tag entry shape: `overallValues`: [], `id`, `dateAdded`, `movieId: 0`, `value`, `IsOverall: false`

Editing Rules (MVP)
- Acting skill:
  - Path: `professions.Actor`
  - UI: slider 0–1, step 0.01. Save as string normalized to three decimals.
- Limit:
  - Paths: `limit` and `Limit`
  - UI: slider 0–1, step 0.01. Treat as single value; write normalized value to both keys; add missing key for consistency.
- ART and COM (Commercial):
  - Paths: `whiteTagsNEW.ART.value` and `whiteTagsNEW.COM.value`
  - Allowed values: "0.000", "0.150", "0.300", "0.700", "1.000" (default 0.000 if absent)
  - If the tag entry does not exist, create it with safe defaults; do not mutate `overallValues` in MVP.
- Age / birthDate:
  - Display age from `gameYear - birthYear`; parse `birthDate` as `DD-MM-YYYY`.
  - Editing age updates only the year component in `birthDate`.
  - `gameYear` is auto‑detected by scanning `gameDate`/timestamps; user can override.

Name Resolution
- The app fetches the canonical copy at `web/data/CHARACTER_NAMES.json`. Manual upload is available as a fallback.
- `python_scripts/actor_finder.py getid <first> <last>` can help find IDs in large saves.

File Handling Guidelines
- Save files are large (10–25+ MB). Avoid unnecessary full‑file copies beyond what the browser needs.
- Parsing in browser is acceptable; consider progressive/targeted parsing later if needed.
- When writing back:
  - Minimize diffs: only change edited fields; preserve unrelated content.
  - Write numeric fields as strings with exactly three decimals ("0.300").
  - Maintain both `limit` and `Limit` in sync.

Static Web App (MVP)
- No server required. Works offline from `index.html`.
- Flow:
  1) Drag‑and‑drop or file picker to load a save JSON.
  2) Robustly find the `characters` array and filter to `professions.Actor`.
  3) Resolve names via `CHARACTER_NAMES.json` and show a searchable table.
  4) Editable controls per actor: Acting skill (slider), Limit (slider), ART/COM (dropdowns), Age (numeric, updates birthDate).
  5) Apply edits to in‑memory JSON.
  6) Export the modified save as a downloadable `.json` file (preserve original filename).
- UX:
  - Search by any substring of full name.
  - Sort by clicking headers (first click desc, second asc) with arrow indicators.
  - Light validation; warn rather than block for atypical ranges.

Testing & Validation
- Use `docs/sample_save_actor_data_fixed.json` for quick iteration.
- Spot‑check a few name IDs against the name map.
- With large saves, sanity‑check memory and interaction latency after load.

Known Unknowns / TODOs
- Confirm whether both `limit` and `Limit` must always be present; samples show both.
- Verify whether `dateAdded` needs a specific value when creating `ART`/`COM` tags.
- Decide whether to preserve original numeric precision vs normalization (current: normalize to three decimals).
- Consider streaming or targeted JSON extraction of `characters` for very large saves.
- Implement additional tabs (Directors, Producers, Writers, Editors) and Movies editor.
- Add a detail view per entity with expanded fields (contracts, labels, etc.).
- Provide undo/redo, bulk edits, and keyboard navigation.

Workflow Tips for Agents
- Keep changes scoped; avoid touching unrelated save content.
- Prefer pure JS/TS with no external build; if adding tooling, keep it offline‑friendly.
- Keep `web/data/CHARACTER_NAMES.json` as the canonical served name map.
