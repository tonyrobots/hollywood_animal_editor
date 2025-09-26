Hollywood Animal Save Schema Notes

This file summarizes the relevant parts of the save schema used by the web editor. It captures practical field names, where data lives, and role-name quirks observed in the provided samples.

Top-Level
- Root object contains nested structures; the characters array may appear directly at `stateJson.characters` or deeper. The app does a breadth‑first search to find an array of `Data.GameObject.Character.TalentData` entries.
- Game year detection: scanned from `gameDate` fields and other timestamps to derive a plausible year for age calculations.

New Format (2025-09) Notes
- Latest saves remain compatible with the MVP editor. The following were verified unchanged:
  - `characters` array items are `Data.GameObject.Character.TalentData`.
  - `professions` values are string decimals in [0,1]; writers/editors keys remain `Scriptwriter` and `FilmEditor`.
  - `limit` and `Limit` both present and equal; the editor keeps them synchronized.
  - `whiteTagsNEW` structure and ART/COM tags unchanged; values remain string decimals (may exceed 1.000 in some categories).
  - `birthDate` remains `DD-MM-YYYY`.
- The app includes a lightweight schema check on load that surfaces warnings; it does not block editing.
- JSON with UTF‑8 BOM is handled gracefully.

Executives (corporate and lieutenants)
- Identification: entries where `professions` has keys starting with `Cpt` (e.g., `CptHR`, `CptLawyer`, `CptFinancier`, `CptPR`) or `Lieut` (e.g., `LieutRelease`, `LieutTech`).
- Displayed Department mapping (non-exhaustive):
  - `CptHR` → HR, `CptLawyer` → Legal, `CptFinancier` → Finance, `CptPR` → PR
  - `LieutRelease` → Distribution, `LieutTech` → Engineering (others may appear in different saves)
- Columns: Department, Level (`level` when present), EXP (`xp`), Happiness (`mood`, 0–1 saved; shown as 0–100), Morale (`attitude`, 0–1 saved; shown as 0–100), Upgrade-Money (`BonusCardMoney` → 0–50%), Upgrade-Influence (`BonusCardInfluencePoints` → 0–50%).
- Age editing uses shared behavior: change updates only the year in `birthDate`.

Age Editing
- Age is editable across all tabs. It is derived as `gameYear - birthYear` and editing only updates the `birthDate` year component.

Characters Array
- Entry type: `Data.GameObject.Character.TalentData`.
- Common identity fields:
  - `id` (number)
  - `firstNameId` (string ID into `CHARACTER_NAMES.json.locStrings`)
  - `lastNameId` (string ID into `CHARACTER_NAMES.json.locStrings`)
  - `birthDate` (string, `DD-MM-YYYY`)
  - `deathDate` (string, `DD-MM-YYYY` or `01-01-0001` for none)
  - `gender` (number)
  - `limit` (string decimal)
  - `Limit` (string decimal)
- Professions live under `professions` (object of string decimals). Known keys in samples:
  - Actor
  - Director
  - Producer
  - Scriptwriter  ← writers use this key (not “Writer”)
  - FilmEditor    ← editors use this key (not “Editor”)
  - Additional non‑editable keys exist (e.g., `Agent`, `Cinematographer`, etc.).
- Movies participation per role under `movies` object:
  - `movies.Actor`, `movies.Director`, `movies.Producer`, `movies.Scriptwriter`, `movies.FilmEditor` (arrays of movie IDs when present).

Actor Fields (editable)
- Acting skill: `professions.Actor` (string decimal like "0.800").
- Limit: `limit` and `Limit` — keep synchronized (strings, three decimals).
- Artistic/Commercial Appeal tags: under `whiteTagsNEW`
  - Location: `whiteTagsNEW.ART.value`, `whiteTagsNEW.COM.value`.
  - Entry shape:
    - `overallValues`: [] (array), `id` (string), `dateAdded` (string), `movieId` (number), `value` (string), `IsOverall` (boolean)
  - For MVP, we do not mutate `overallValues`.
  - App uses constrained options for Actor ART/COM: {0.000, 0.150, 0.300, 0.700, 1.000}. Missing tags are created with safe defaults.
- Age: derived as `gameYear - birthYear`. Editing age updates only the year component in `birthDate` (`DD-MM-YYYY`).

Director Fields (readable + sliders)
- Director skill: `professions.Director` (string decimal).
- Limit: `limit` and `Limit` — kept synchronized by the editor.
- ART/COM:
  - Present for some directors, but values appear as free decimals, not the discrete actor set. The MVP shows them read‑only when > 0.000.
- Movies: `movies.Director` (array) when present.

Producer Fields (readable + sliders)
- Producer skill: `professions.Producer` (string decimal).
- Limit: `limit` and `Limit` — kept synchronized.
- ART/COM: shown read‑only when > 0.000.
- Movies: `movies.Producer` (array) when present.

Writer Fields (Scriptwriter) (readable + sliders)
- Writer skill: `professions.Scriptwriter` (string decimal).
- Limit: `limit` and `Limit` — kept synchronized.
- ART/COM: shown read‑only when > 0.000.
- Movies: `movies.Scriptwriter` (array) when present.

Editor Fields (FilmEditor) (readable + sliders)
- Editor skill: `professions.FilmEditor` (string decimal).
- Limit: `limit` and `Limit` — kept synchronized.
- ART/COM: shown read‑only when > 0.000.
- Movies: `movies.FilmEditor` (array) when present.

Names
- `web/data/CHARACTER_NAMES.json` is the canonical name map for the app. Structure:
  - `locStrings`: array of strings (IDs index into this array for first and last names).
- The app supports manual upload for name fallback.

Samples
- `docs/new_format/actor_only_sample.json` provides a slim actor-only sample extracted from a full new-format save for testing and validation.

Tags (`whiteTagsNEW`)
- Container key is `whiteTagsNEW` (some saves may have `whiteTagsNew`; the app normalizes to `whiteTagsNEW`).
- Tag record shape (observed):
  - `overallValues`: array of per‑source contributions
  - `id`: string tag ID (e.g., `ART`, `COM`, `ACTION`, `ADVENTURE`, `THEME_*`, `EVENTS_*`)
  - `dateAdded`: ISO datetime string
  - `movieId`: number
  - `value`: string decimal (may exceed 1.000 depending on history)
  - `IsOverall`: boolean

Numeric Formats
- The editor normalizes numeric strings to exactly three decimals for edited fields (skills and limits). Unedited fields are preserved as in the source.
- ART/COM (labeled as Artistic/Commercial Appeal in UI) snap to the allowed set for actors; other roles are left unchanged.

Known Quirks / Notes
- Writers/Editors key names differ from UI labels:
  - Writers → `Scriptwriter`
  - Editors → `FilmEditor`
- Many talent entries do not have ART/COM. The app creates missing tags for actors only with safe defaults.
- Large saves (10–25+ MB): parsing is done in‑browser; future streaming/targeted parsing could be explored.

Identifiers Recap
- Roles (professions): `Actor`, `Director`, `Producer`, `Scriptwriter`, `FilmEditor`.
- Movies role keys: same as the profession string for the role when present under `movies`.

Studio Identifiers
- `studioId` values observed: `PL` (player studio), `EM` (Evergreen Movies), `GB` (Gerstein Bros.), `MA` (Marginese), `SU` (Supreme), `HE` (Hephaestus). Unknown codes may appear; the editor will show them as “CODE – Unknown Studio”.
- Player studio display name is available under `StudioName` somewhere in the save; the app locates the first occurrence to label the `PL` option in the Studio selector.

This document is meant as a living reference; update it as additional entity types or fields are added to the editor.
