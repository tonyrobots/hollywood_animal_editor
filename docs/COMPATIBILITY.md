Hollywood Animal — Save Format Compatibility (2025-09)

Scope
- This document captures what the editor expects and tolerates in game save JSONs. It’s based on observed samples in this repository and live testing via the web app (`web/`).

Supported Versions
- New-format saves as of 2025-09 are supported. The app performs a tolerant scan to locate the `characters` array and handles UTF‑8 BOM.

Character Records
- Type: entries are `Data.GameObject.Character.TalentData`.
- Identity: `id` (number), `firstNameId` (string), `lastNameId` (string), `gender` (number), `birthDate` and `deathDate` (`DD-MM-YYYY`).
- Professions: string decimals in [0,1]. Known keys used by the app/UI mapping:
  - Actor → `Actor`
  - Director → `Director`
  - Producer → `Producer`
  - Writer → `Scriptwriter` (not `Writer`)
  - Editor → `FilmEditor` (not `Editor`)
  - Other tabs: `Agent`, `Composer`, `Cinematographer` are read/edit where applicable.
- Limit: maintain both `limit` and `Limit` as equal string decimals with exactly three places (e.g., "0.700"). The app keeps them synchronized.
- Tags: `whiteTagsNEW` is an object keyed by tag id (e.g., `ART`, `COM`). Tag entry shape: `{ overallValues: [], id, dateAdded, movieId, value, IsOverall }`. For actors, `ART`/`COM` are editable.

Characters Array Location
- The app does a breadth‑first search to find a suitable `characters` list. These shapes are accepted:
  - Root key `characters` containing an array of objects that look like talent data; or
  - `stateJson` string/object containing the same. When `stateJson` is a string, the app parses it as JSON.

Numeric Normalization
- Edited numeric fields are written as strings with exactly three decimals: profession skills, `limit`/`Limit`, actor `ART`/`COM` values. Unedited numeric strings are preserved as-is.

Actor ART/COM Values
- UI shows 0.0–10.0 for readability; values are stored as normalized [0,1] strings with three decimals.
- Actor sliders snap to the set {0.000, 0.150, 0.300, 0.700, 1.000}. If tags are missing for an actor, the app creates them with safe defaults.

Executives (Management)
- Identification heuristics: presence of profession keys starting with `Cpt*` or `Lieut*` (e.g., `CptHR`, `CptLawyer`, `LieutTech`).
- Displayed columns: Department (derived), Level (`level`), EXP (`xp`), Happiness (`mood`), Morale (`attitude`), Upgrade‑Money (`BonusCardMoney`), Upgrade‑Influence (`BonusCardInfluencePoints`).

Movies
- Per‑role movie arrays live under `movies.<Role>` (e.g., `movies.Actor`). Movies are displayed read‑only.

Studio Fields
- The Studio tab edits top‑level numeric fields on the save root: `budget` (int), `cash` (int), `influence` (int), and `reputation` (string with three decimals). The app formats these and records changes minimally.
- Player Studio label: the app finds the first `StudioName` value in the save to label the `PL` option in studio selectors.

Names Map
- `web/data/CHARACTER_NAMES.json` is the canonical map. Structure: `locStrings` (array of strings) and optional `IdMap`. Both direct index and `IdMap` lookups are handled by tools.

Known Quirks
- Writers/Editors use `Scriptwriter`/`FilmEditor` keys in `professions`.
- Some entries lack `ART`/`COM`; only actors will have tags auto‑created by the editor when edited.
- Saves may exceed 25MB; initial parsing may take time but remains within browser limits.

Validation & Warnings
- On load, the app performs lightweight checks and shows warnings for malformed records (e.g., missing three‑decimal strings, wrong tag shape). It does not block editing.

Versioning
- Update this document as the app’s supported entities or schema tolerances evolve.

