Hollywood Animal — Savegame Editor (MVP)

Overview
- Local, static web app to edit “Hollywood Animal” save files.
- MVP supports editing actors only:
  - Acting Skill (`professions.Actor`)
  - Limit (`limit` and `Limit` kept in sync)
  - ART and COM ratings under `whiteTagsNEW` (dropdown values)
  - Age (edits `birthDate` year; shows age derived from in‑game year)

What You Need
- A browser (Chrome/Edge/Firefox recommended).
- Your game save exported to JSON.
- The name map file is bundled at `web/data/CHARACTER_NAMES.json` for automatic loading.

Run Locally
Option A — Simple local server (recommended):
- From the repository root:
  - Python: `python -m http.server`
  - Node: `npx serve` (or any static file server)
- Open: `http://localhost:8000/web/` (or the served equivalent)

Option B — Open directly:
- You can open `web/index.html` via `file://`, but browsers often block fetching local files. If names don’t load automatically, use the UI’s “Load Name Map” to pick `web/data/CHARACTER_NAMES.json` manually.

Using the Editor
1) Load Save
   - Drag & drop your save JSON onto the drop zone, or use the file picker.
   - The app extracts actors and lists them alphabetically.

2) Names
   - The app auto-loads `web/data/CHARACTER_NAMES.json`. If running from a different path, use “Load Name Map” to select it manually.

3) Search & Sort
   - Search box filters by any substring of full name.
   - Click column headers to sort: first click = descending, second = ascending.

4) Edit Fields
   - Acting Skill: slider (0–1, 0.01 step). Writes to `professions.Actor` as a string with three decimals.
   - Limit: slider (0–1, 0.01 step). Writes the same value to both `limit` and `Limit` (strings, three decimals).
   - ART & COM: dropdowns with values 0.000, 0.150, 0.300, 0.700, 1.000 under `whiteTagsNEW.ART/COM.value`.
     - If tags are missing, they’re created with `overallValues: []`, `movieId: 0`, `IsOverall: false`, and `dateAdded: "0001-01-01T00:00:00"`.
   - Age: numeric input showing `gameYear - birthYear`. Editing updates `birthDate` (DD‑MM‑YYYY) by changing just the year.
   - Game Year: auto-detected from the save (prefers `gameDate`). You can override it via the control.

5) Download Save
   - Click “Download Edited Save” to export.
   - The download preserves the original uploaded filename.

Notes
- Large Saves: Browsers handle ~25MB JSON, but initial load may take a moment.
- Numeric Formatting: Values are stored as strings with three decimals (e.g., "0.700").
- Minimal Changes: The editor only modifies fields you adjust; other content is preserved as-is.

Repository Structure
- `web/` — the static web app (open `web/index.html`).
  - `index.html`, `style.css`, `app.js`
  - `data/CHARACTER_NAMES.json` — name map used by the app
- `data/CHARACTER_NAMES.json` — original name map
- `docs/` — example saves for reference only

Troubleshooting
- Names show as “Unknown Name (x y)”: ensure `web/data/CHARACTER_NAMES.json` is accessible; load it manually if needed.
- “Could not find characters array”: some JSON structures vary; try a full save exported by the game, or share a snippet where `characters`/TalentData appears so we can extend detection.

License
- For personal use; no game assets are distributed beyond the name map provided in this repo for convenience.

