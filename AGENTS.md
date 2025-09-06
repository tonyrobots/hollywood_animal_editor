Project: Hollywood Animal — Savegame Editor

Purpose
- Build a local, static web app to edit “Hollywood Animal” save files.
- MVP scope: edit actors only. Editable fields:
  - Acting skill at `professions.Actor` (string number)
  - Limit at both `limit` and `Limit` (string number)
  - ART and COM ratings under `whiteTagsNEW` with constrained options

Repository Layout
- `docs/`
  - `full_sample_savefile.json` and `_formatted.json`: full saves for analysis.
  - `sample_save_actor_data_fixed.json`: exemplar TalentData actor records.
- `data/`
  - `CHARACTER_NAMES.json`: name ID → string mapping (first and last names share the same pool).
- `python_scripts/`
  - `actor_finder.py`: utility to locate actors by name IDs and pretty‑format saves.

Target Data Model (actors)
- Actor records are `Data.GameObject.Character.TalentData` objects found under the top‑level `characters` array in full saves.
- Relevant fields (strings unless noted):
  - `id` (number), `firstNameId` (string), `lastNameId` (string), `gender` (number)
  - `professions.Actor`: acting skill as a string decimal (e.g., "0.800")
  - `limit` and `Limit`: both appear in samples; keep in sync
  - `whiteTagsNEW`: object keyed by tag IDs (e.g., `ART`, `COM`)
    - Tag entry shape:
      - `overallValues`: array (keep or initialize empty for edits)
      - `id`: "ART" | "COM"
      - `dateAdded`: ISO string; preserve if present, otherwise set to "0001-01-01T00:00:00"
      - `movieId`: 0
      - `value`: one of allowed selections (see below)
      - `IsOverall`: false (preserve if present)

Editing Rules (MVP)
- Acting skill:
  - Path: `professions.Actor`
  - Accept free entry in the UI; on save, write as a string normalized to three decimals.
- Limit:
  - Paths: `limit` and `Limit`
  - Treat as a single logical value; when edited, write the same normalized value to both keys if both exist; if only one exists, write/update that key and (preferably) add the other for consistency.
- ART and COM (Commercial):
  - Paths: `whiteTagsNEW.ART.value` and `whiteTagsNEW.COM.value`
  - Allowed values presented as a dropdown: "0.150", "0.300", "0.700", "1.000"
    - Normalize incoming variants like "0.70" → "0.700" and "1" → "1.000" on save.
  - If the tag entry does not exist, create it with the structure described above (empty `overallValues`, `movieId: 0`, `IsOverall: false`, `dateAdded: "0001-01-01T00:00:00"`).
  - Do not mutate `overallValues` history in MVP.

Name Resolution
- Use `data/CHARACTER_NAMES.json` → `locStrings` array to map `firstNameId`/`lastNameId` (string indices) to human‑readable names.
- `python_scripts/actor_finder.py getid <first> <last>` can help find IDs in large saves.

File Handling Guidelines
- Save files are large (10–25+ MB). Prefer strategies that avoid unnecessary full‑file copies in memory where possible.
- Parsing in browser is acceptable; modern browsers handle ~25 MB JSON, but consider progressive/targeted parsing for performance if needed.
- When writing back:
  - Minimize diffs: only change fields edited by the user; preserve ordering and unrelated content when feasible.
  - Always write numeric fields as strings with exactly three decimal places ("0.300").
  - Maintain both `limit` and `Limit` in sync.

Static Web App (MVP)
- No server. Works offline from `index.html`.
- Basic flow:
  1) Drag‑and‑drop or file picker to load a save JSON.
  2) Parse and extract the `characters` array; filter to entries that have `professions.Actor`.
  3) Resolve display names via `CHARACTER_NAMES.json` and show a searchable table/list.
  4) Editable controls per actor:
     - Acting skill: text input with format hint; normalize on blur/save.
     - Limit: text input; mirror to both `limit` and `Limit`.
     - ART/COM: dropdowns with the four allowed values.
  5) Apply edits back into the in‑memory JSON structure.
  6) Export the modified save as a downloadable `.json` file.
- UX notes:
  - Show original vs edited value states and a reset option per row.
  - Provide global search by name or ID.
  - Validate entries lightly; warn (don’t block) for values outside 0–1.

Conventions & Formatting
- Numbers are stored as strings; normalize to three decimals when saving.
- Key casing:
  - Use `whiteTagsNEW` (as seen in samples).
  - Tag IDs are uppercase: `ART`, `COM`.
- Dates: keep existing values; when creating tag entries, use "0001-01-01T00:00:00" for `dateAdded` unless a better game‑time source is provided later.

Testing & Validation
- Use `docs/sample_save_actor_data_fixed.json` for quick iteration.
- Validate name mapping by spot‑checking a few IDs against `data/CHARACTER_NAMES.json`.
- For full saves, sanity‑check memory usage and interaction latency after load.

Known Unknowns / TODOs
- Confirm whether both `limit` and `Limit` must always be present; samples show both.
- Verify if any game systems require `dateAdded` to be non‑default for newly created `ART`/`COM` tags.
- Decide on preserving original numeric precision vs normalizing to three decimals across the board; current convention is normalization.
- Consider streaming or targeted JSON extraction of `characters` for very large saves.
- Future fields: mood/attitude/selfEsteem and additional professional stats; expand UI accordingly.

Workflow Tips for Agents
- Keep changes scoped; do not edit unrelated save content.
- Prefer pure JS/TS with no external build if possible; if adding tooling, ensure it works offline.
- Reuse `python_scripts/actor_finder.py` for investigations; do not make it a runtime dependency of the web app.

