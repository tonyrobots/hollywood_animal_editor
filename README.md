Hollywood Animal — Savegame Editor (MVP)

Overview
- Local, static web app to edit “Hollywood Animal” save files.
- Tabs: Actors (implemented), Directors, Producers, Writers, Editors (placeholders), Movies (placeholder).
- MVP supports editing Actors:
  - Acting Skill (`professions.Actor`) via slider (0–1, step 0.01)
  - Limit (`limit` and `Limit` kept in sync) via slider (0–1, step 0.01)
  - ART and COM ratings under `whiteTagsNEW` (dropdown values)
  - Age column (derived from in‑game year) — editing age updates `birthDate` year

What You Need
- A browser (Chrome/Edge/Firefox recommended).
- Your game save exported to JSON.
- The name map file is bundled at `web/data/CHARACTER_NAMES.json` for automatic loading.

Run Locally
- Recommended: serve from repo root and open `/web/`:
  - Python: `python -m http.server` then open `http://localhost:8000/web/`
  - Node: `npx serve` (or any static server) then open the served `/web/` path
- Direct file open works, but the browser may block fetching the name map. In that case, use the “Load Name Map” input and select `web/data/CHARACTER_NAMES.json`.

Using the Editor
1) Tabs
   - Default tab is Actors. Other tabs are placeholders for now.
2) Load Save
   - Drag & drop your save JSON onto the drop zone, or use the file picker.
   - The app extracts actors and lists them (default sort: Acting Skill, descending).
3) Names
   - The app auto-loads `web/data/CHARACTER_NAMES.json`. If running from a different path, use “Load Name Map” to select it manually.
4) Search & Sort
   - Search filters by any substring of full name.
   - Click column headers to sort: first click = descending, second = ascending. Arrows show direction.
5) Edit Fields (Actors tab)
   - Acting Skill: slider (0–1, 0.01 step). Writes to `professions.Actor` (string, three decimals).
   - Limit: slider (0–1, 0.01 step). Writes to `limit` and `Limit` (strings, three decimals).
   - ART & COM: dropdowns (0.000, 0.150, 0.300, 0.700, 1.000) under `whiteTagsNEW.ART/COM.value`.
     - Creates tag entries if missing with safe defaults.
   - Age: numeric input shows `gameYear - birthYear`. Edit to adjust `birthDate` year (keeps day/month).
   - Game Year: auto-detected from save (prefers `gameDate`); override in the control if needed.
6) Download Save
   - Click “Download Edited Save” to export.
   - The download preserves the original uploaded filename.

Notes
- Large Saves: Browsers handle ~25MB JSON, but initial load may take a moment.
- Numeric Formatting: Values are stored as strings with three decimals (e.g., "0.700").
- Minimal Changes: The editor only modifies fields you adjust; other content is preserved as-is.

Repository Structure
- `web/` — static web app (open `web/index.html`).
  - `index.html`, `style.css`, `app.js`
  - `data/CHARACTER_NAMES.json` — canonical name map used by the app
- `data/CHARACTER_NAMES.json` — original name map (kept for reference)
- `docs/` — example saves for reference only

Troubleshooting
- Names show as “Unknown Name (x y)”: ensure `web/data/CHARACTER_NAMES.json` is accessible; load it manually if needed.
- “Could not find characters array”: some JSON structures vary; try a full save exported by the game, or share a snippet where `characters`/TalentData appears so we can extend detection.

License
- For personal use; no game assets are distributed beyond the name map provided in this repo for convenience.
