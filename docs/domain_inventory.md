# Domain Helper Inventory (Legacy `web/app.js`)

This checklist captures the data/domain-focused helpers currently embedded inside the legacy script. They now live in TypeScript modules under `src/domain/` as part of Step 2 of the refactor plan.

## Parsing & Extraction
- `extractCharacters(root)` — breadth-first search to locate the `characters` array containing `TalentData`.
- `findStudioRoot(root)` — discovers the object holding studio-level keys (`budget`, `cash`, etc.).
- `extractMovies(root)` — scans for the movies collection with stage results.
- `findFirstValueByKey(root, key)` — utility to retrieve the first occurrence of a key in the save tree.

## Normalization & Formatting
- `normalizeDecimalString(value)` — coerces numbers to three-decimal strings.
- `normalizeArtCom(value)` — snaps art/com values to allowed increments.
- `formatUnitToTen(value)` / `formatUnitToHundred(value)` — display helpers (retain for compatibility, may move to view utils later).
- `formatBirthDate(day, month, year)` and `parseBirthDateParts(str)` — birthdate utilities.
- `getAge(entity)` — derives age from `birthDate` and `gameYear`.
- `getNumeric(value)` — numeric coercion fallback used across lists.

## Validation & Schema Checks
- `validateBirthDateString(dateStr)` — validates `DD-MM-YYYY` strings.
- `isThreeDecimalString(value)` — ensures numeric-string formatting.
- `validateTalentEntry(entity)` — sanity checks for key properties.
- `validateSaveSchema(root)` — wraps validation for the first few characters.

## Tag & Profession Helpers
- `ensureWhiteTagsContainer(actor)` — guarantees `whiteTagsNEW` exists.
- `ensureTag(actor, tagId)` — creates or normalizes tag entries (ART/COM).
- `getTagValue(actor, tagId)` / `getTagValueRaw(actor, tagId)` — value lookups with normalization.
- `isActorEntry(obj)` / `isRoleEntry(obj, role)` / `isExecutiveEntry(obj)` — role detection predicates.
- `moviesCountForRole(entity, role)` and `normalizeSkillForRole(entity, role)` — shared role metrics.
- `establishedGenres(entity, topN)` — aggregates frequent genres (directors/producers tables).
- `computeMovieArtCom(movie)` / `getMovieTotalIncome(movie)` — derived metrics for Movies tab.

## Game-Year & Date Discovery
- `extractYearFromDateString(str)` — utility used during game-year detection.
- `computeGameYearFromData(root)` — derives `gameYear` by scanning timestamps.
- `parseYearFromDateTime(str)` — extracts release year for movies.

## Name Resolution
- `getNameById(idLike)` — lookup into `names` array (to be generalized alongside name-map service).
- `fullNameFor(entity)` — resolves custom/first/last names with fallbacks.
- `isPlayerStudioEntity(entity)` — detects membership via `studioId`.

## Change Tracking Helpers (revisit during state refactor)
- `recordEdit(...)`, `applyField(...)`, `readField(...)`, `pushChange(...)`, `refreshChangeUI()`, `attachUndoRedo()` — currently mix domain mutations with DOM updates; these will migrate into the new state layer (`src/state/`).

## Notes
- Rendering functions (`renderActors`, `renderDirectors`, etc.) and DOM wiring are intentionally excluded—they will be replaced entirely by the new component system.
- Some helpers (e.g., `formatUnitToTen`) straddle the line between domain and presentation. During extraction, decide whether they belong in `src/domain/format.ts` or `src/utils/view.ts`.
- Keep this document updated as functions migrate; strike through items once refactored modules own the responsibility.
