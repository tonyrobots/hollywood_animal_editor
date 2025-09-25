Project: Hollywood Animal — Savegame Editor

Purpose
- Build a local, static web app to edit “Hollywood Animal” save files.
- Tabs: Actors, Directors, Producers, Writers, Editors, Composers, Cinematographers, Agents (lists with skill/limit sliders), Movies (read-only table).
- Editing capabilities include profession skills and limits across roles, ART/COM for actors, and a detail view with advanced JSON editing.

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
Editing Rules
- Acting skill (actors and other roles):
  - Path for actors: `professions.Actor` (other roles analogous)
  - UI: slider 0–1, step 0.01. Saved as string normalized to three decimals.
- Limit:
  - Paths: `limit` and `Limit`
  - UI: slider 0–1, step 0.01. Treated as a single value; write normalized value to both keys; add missing key for consistency.
  - Constraint: Limit cannot go below the current skill value.
- Artistic/Commercial Appeal (formerly ART/COM in UI copy):
  - Paths: `whiteTagsNEW.ART.value` and `whiteTagsNEW.COM.value`
  - Slider range 0–1, step 0.01; visuals show tick marks at 0.000/0.150/0.300/0.700/1.000; UI shows 0.0–10.0; saved normalized to three decimals. If a tag entry does not exist for actors, create it with safe defaults; do not mutate `overallValues`.
- Age / birthDate:
  - Display age from `gameYear - birthYear`; parse `birthDate` as `DD-MM-YYYY`.
  - Editing age updates only the year component in `birthDate`.
  - `gameYear` is auto‑detected by scanning `gameDate`/timestamps; user can override.
 - Studio:
  - `studioId` is edited via a dropdown with known codes (None, PL, EM, GB, MA, SU, HE). Unknown codes are preserved and surfaced as “CODE – Unknown Studio”. The `PL` label is populated from the save's `StudioName` when available.

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

Static Web App
- No server required. Works offline from `index.html`.
- Flow:
  1) Drag‑and‑drop or file picker to load a save JSON.
  2) Robustly find the `characters` array and filter to `professions.Actor`.
  3) Resolve names via `CHARACTER_NAMES.json` and show a searchable table.
  4) Editable controls per entity: acting/role skill (slider), limit (slider), for actors: Artistic/Commercial Appeal (sliders), Age (numeric updates birthDate).
  5) Row click opens a detail overlay with friendly controls plus a toggle to a raw JSON editor (advanced). Apply saves and closes the overlay; Undo/Redo supported.
  6) Export the modified save as a downloadable `.json` file (preserve original filename).
- UX:
  - Search by any substring of full name.
  - Sort by clicking headers (first click desc, second asc) with arrow indicators. Edits do not auto resort; click again to resort.
  - Global Download button in header; hidden until a save is loaded and at least one change exists.
  - Changes panel with running log and Undo/Redo; sliders record a single change per interaction.

Testing & Validation
- Use `docs/new_format/actor_only_sample.json` for quick iteration with the latest save format; `docs/sample_save_actor_data_fixed.json` remains for reference.
- Spot‑check a few name IDs against the name map.
- With large saves, sanity‑check memory and interaction latency after load.

Known Unknowns / TODOs
- Confirm whether both `limit` and `Limit` must always be present; samples show both.
- Verify whether `dateAdded` needs a specific value when creating `ART`/`COM` tags.
- Decide whether to preserve original numeric precision vs normalization (current: normalize to three decimals).
- Consider streaming or targeted JSON extraction of `characters` for very large saves.
- Confirm any additional studio codes beyond PL/EM/GB/MA/SU/HE and their display names.

Workflow Tips for Agents
- Keep changes scoped; avoid touching unrelated save content.
- Prefer pure JS/TS with no external build; if adding tooling, keep it offline‑friendly.
- Keep `web/data/CHARACTER_NAMES.json` as the canonical served name map.
