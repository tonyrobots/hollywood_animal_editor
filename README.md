Hollywood Animal — Savegame Editor

Overview
- Local, static web app to edit “Hollywood Animal” save files, hosted at https://hollywood-animal-editor.vercel.app
- Tabs: Studio, Actors, Directors, Producers, Writers, Editors, Composers, Cinematographers, Security Agents, Management, Movies.
- Editing Support for key fields like age, skill level, skill limit directly in list, or click a name to pull up a detail view for more in-depth editing, and a json editor to fly directly into the sun.


Run Locally
- Recommended: serve from repo root and open `/web/`:
  - Python: `python -m http.server` then open `http://localhost:8000/web/`
  - Node: `npx serve` (or any static server) then open the served `/web/` path
- Direct file open works, but the browser may block fetching the name map. In that case, use the “Load Name Map” input and select `web/data/CHARACTER_NAMES.json`.

or, just use it online at https://hollywood-animal-editor.vercel.app

Using the Editor
1) Tabs
   - Select a character type (e.g. actor, director, writer, management, etc.) The "studio" tab allows you to edit money, IP, etc. The movies tab is read-only for now, but shows all of your movies, box office totals etc.
2) Load Save
   - Drag & drop your save JSON onto the drop zone, or use the file picker.
   - The app extracts actors and lists them (default sort: Acting Skill, descending).
3) Names
   - The app auto-loads `web/data/CHARACTER_NAMES.json`. If running from a different path, use “Load Name Map” to select it manually. This should never be necessary, unless the devs put out a new name map and I haven't updated it yet.
4) Search & Sort
   - Search filters by any substring of full name.
   - Click column headers to sort: first click = descending, second = ascending. Arrows show direction. Edits do not auto resort; click again to resort.
5) Edit Fields 
   - Skill: slider (0–1, 0.01 step).
   - Limit: slider (0–1, 0.01 step). Writes to `limit` and `Limit` (strings, three decimals). Cannot go below current skill.
   - Artistic Appeal & Commercial Appeal: sliders under `whiteTagsNEW.ART/COM.value` with tick marks at 0.000/0.150/0.300/0.700/1.000; UI shows 0.0–10.0.
   - Age: numeric input shows `gameYear - birthYear`. Edit to adjust `birthDate` year (keeps day/month).
   - Game Year: auto-detected from save (prefers `gameDate`); override in the control if needed.
6) Detail View & Advanced Editor
- Click a row to open a detail overlay with friendly controls (including age, skills, limits, and actor ART/COM). A toggle exposes a raw JSON editor for advanced users.
7) Changes & Download
   - Changes panel logs edits and enables Undo/Redo; slider drags record a single change on release.
   - The global “Download Edited Save” button appears in the header once a save is loaded and at least one change exists; exports preserving the original filename.

Notes
- Large Saves: Browsers handle ~25MB JSON, but initial load may take a moment.
- Numeric Formatting: Values are stored as strings with three decimals (e.g., "0.700"). UI displays many values as 0.0–10.0 for readability.
- Minimal Changes: The editor only modifies fields you adjust; other content is preserved as-is.

Compatibility
- See `docs/COMPATIBILITY.md` for current save-format notes (2025-09) and schema tolerance.

Repository Structure
- `web/` — static web app (open `web/index.html`).
  - `index.html`, `style.css`, `app.js`
  - `data/CHARACTER_NAMES.json` — canonical name map used by the app
- `docs/` — reference docs and samples
  - `DATA_MODEL.md` — field locations and role key mapping
  - `CONTRIBUTING.md` — local setup and dev guidelines
- `python_scripts/` — helper scripts (e.g., `actor_finder.py`, `find_char_by_state.py`)
   - `python_scripts/actor_finder.py` can resolve name IDs and pretty‑format saves.
   - `python_scripts/find_char_by_state.py` lists characters by state/bitmask.


Troubleshooting
- Names show as “Unknown Name (x y)”: ensure `web/data/CHARACTER_NAMES.json` is accessible; load it manually if needed.
- “Could not find characters array”: some JSON structures vary; try a full save exported by the game, or share a snippet where `characters`/TalentData appears so we can extend detection.

License
- For personal use; no game assets are distributed beyond the name map provided in this repo for convenience.