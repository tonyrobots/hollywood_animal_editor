// Hollywood Animal — Save Editor (MVP)
// Edits: professions.Actor, limit/Limit, whiteTagsNEW.ART.value, whiteTagsNEW.COM.value

(function () {
  'use strict';

  // DOM
  const saveFileInput = document.getElementById('saveFileInput');
  const namesFileInput = document.getElementById('namesFileInput');
  const dropZone = document.getElementById('dropZone');
  const saveMeta = document.getElementById('saveMeta');
  const namesMeta = document.getElementById('namesMeta');
  const controls = document.getElementById('controls');
  const searchInput = document.getElementById('searchInput');
  const gameYearInput = document.getElementById('gameYearInput');
  const downloadBtn = document.getElementById('downloadBtn');
  const statusEl = document.getElementById('status');
  const tableSection = document.getElementById('tableSection');
  const tbody = document.getElementById('actorsTbody');

  // State
  let saveObj = null;           // whole parsed save JSON
  let charactersArr = null;     // reference to the characters array in saveObj
  let actors = [];              // derived list of actor objects
  let names = [];               // CHARACTER_NAMES.locStrings array
  let nameMapLoaded = false;
  let saveLoaded = false;
  let sortState = { key: 'skill', dir: 'desc' }; // default: acting skill, descending
  let gameYear = null;           // derived or user-provided
  let originalSaveName = null;   // keep original uploaded filename

  const ART_COM_OPTIONS = ["0.000", "0.150", "0.300", "0.700", "1.000"]; // normalized, include 0 default

  // Utils
  const readFileAsText = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(reader.result);
    reader.readAsText(file);
  });

  function normalizeDecimalString(value) {
    if (value === undefined || value === null || value === '') return '';
    const num = Number(String(value).replace(',', '.'));
    if (!isFinite(num)) return String(value); // leave as-is
    return num.toFixed(3);
  }

  function normalizeArtCom(value) {
    if (value === undefined || value === null || value === '') return '';
    const num = Number(String(value).replace(',', '.'));
    if (!isFinite(num)) return '';
    const fixed = num.toFixed(3);
    // snap to allowed options
    if (ART_COM_OPTIONS.includes(fixed)) return fixed;
    // closest snap by numeric distance
    let best = ART_COM_OPTIONS[0];
    let bestDist = Math.abs(Number(best) - num);
    for (const opt of ART_COM_OPTIONS.slice(1)) {
      const d = Math.abs(Number(opt) - num);
      if (d < bestDist) { best = opt; bestDist = d; }
    }
    return best;
  }

  function ensureWhiteTagsContainer(actor) {
    if (!actor.whiteTagsNEW && actor.whiteTagsNew) {
      actor.whiteTagsNEW = actor.whiteTagsNew;
    }
    if (!actor.whiteTagsNEW || typeof actor.whiteTagsNEW !== 'object') {
      actor.whiteTagsNEW = {};
    }
    return actor.whiteTagsNEW;
  }

  function ensureTag(actor, tagId) {
    const container = ensureWhiteTagsContainer(actor);
    if (!container[tagId] || typeof container[tagId] !== 'object') {
      container[tagId] = {
        overallValues: [],
        id: tagId,
        dateAdded: "0001-01-01T00:00:00",
        movieId: 0,
        value: "0.000",
        IsOverall: false
      };
    } else {
      // ensure required properties exist
      const t = container[tagId];
      if (!Array.isArray(t.overallValues)) t.overallValues = [];
      if (typeof t.id !== 'string') t.id = tagId;
      if (typeof t.dateAdded !== 'string') t.dateAdded = "0001-01-01T00:00:00";
      if (typeof t.movieId !== 'number') t.movieId = 0;
      if (typeof t.value !== 'string') t.value = normalizeArtCom(t.value) || "0.000";
      if (typeof t.IsOverall !== 'boolean') t.IsOverall = false;
    }
    return container[tagId];
  }

  // --- Game year and birthdate helpers ---
  function extractYearFromDateString(s) {
    if (typeof s !== 'string') return null;
    const m = s.match(/^(\d{4})-\d{2}-\d{2}T/);
    if (!m) return null;
    const y = Number(m[1]);
    return isFinite(y) ? y : null;
  }

  function computeGameYearFromData(root) {
    const years = [];
    const tsYears = [];
    const visited = new WeakSet();
    const queue = [root];
    let safety = 0;
    while (queue.length && safety++ < 200000) {
      const cur = queue.shift();
      if (!cur || typeof cur !== 'object') continue;
      if (visited.has(cur)) continue;
      visited.add(cur);
      if (Array.isArray(cur)) { for (const it of cur) queue.push(it); continue; }
      for (const [k, v] of Object.entries(cur)) {
        if (typeof v === 'string') {
          const yr = extractYearFromDateString(v);
          if (yr) {
            if (k === 'gameDate') years.push(yr);
            else if (k === 'timestamp' || k.toLowerCase().includes('date')) tsYears.push(yr);
          }
        } else if (v && typeof v === 'object') {
          queue.push(v);
        }
      }
    }
    if (years.length) return Math.max(...years);
    if (tsYears.length) {
      const counts = new Map();
      for (const y of tsYears) {
        if (y < 1850 || y > 2050) continue;
        counts.set(y, (counts.get(y) || 0) + 1);
      }
      if (counts.size) {
        let bestY = null, bestC = -1;
        for (const [y, c] of counts.entries()) {
          if (c > bestC || (c === bestC && bestY !== null && y <= 2000 && bestY > 2000)) {
            bestY = y; bestC = c;
          }
        }
        return bestY;
      }
    }
    return null;
  }

  function parseBirthDateParts(s) {
    if (typeof s !== 'string') return null;
    const m = s.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (!m) return null;
    const day = Number(m[1]);
    const month = Number(m[2]);
    const year = Number(m[3]);
    if (!isFinite(day) || !isFinite(month) || !isFinite(year)) return null;
    return { day, month, year };
  }

  function formatBirthDate(day, month, year) {
    const dd = String(day || 1).padStart(2, '0');
    const mm = String(month || 1).padStart(2, '0');
    const yyyy = String(year || 1).padStart(4, '0');
    return `${dd}-${mm}-${yyyy}`;
  }

  function getAge(actor) {
    if (!gameYear) return '';
    const parts = parseBirthDateParts(actor.birthDate);
    if (!parts || parts.year <= 1) return '';
    const age = gameYear - parts.year;
    return age >= 0 && age <= 200 ? age : '';
  }

  function getNameById(idLike) {
    const id = Number(idLike);
    if (!isFinite(id) || id < 0 || id >= names.length) return undefined;
    return names[id];
  }

  function fullNameFor(actor) {
    const f = getNameById(actor.firstNameId);
    const l = getNameById(actor.lastNameId);
    if (f || l) return `${f || ''}${f && l ? ' ' : ''}${l || ''}`.trim();
    // fallback when name map not loaded
    const fi = actor.firstNameId ?? '?';
    const li = actor.lastNameId ?? '?';
    return `Unknown Name (${fi} ${li})`;
  }

  function extractCharacters(root) {
    const isTalentArray = (arr) => Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'object' && (
      ('$type' in arr[0] && String(arr[0]['$type']).toLowerCase().includes('talentdata')) ||
      (('firstNameId' in arr[0]) && ('lastNameId' in arr[0])) ||
      (('professions' in arr[0]) && arr[0].professions && typeof arr[0].professions === 'object' && ('Actor' in arr[0].professions))
    );

    // common cases
    if (Array.isArray(root) && isTalentArray(root)) return root;
    if (root && Array.isArray(root.characters) && isTalentArray(root.characters)) return root.characters;

    // deep search (breadth-first) for any array that looks like actors
    const visited = new WeakSet();
    const queue = [root];
    let safety = 0;
    while (queue.length && safety++ < 100000) {
      const cur = queue.shift();
      if (!cur || typeof cur !== 'object') continue;
      if (visited.has(cur)) continue;
      visited.add(cur);

      if (Array.isArray(cur)) {
        if (isTalentArray(cur)) return cur;
        for (const item of cur) queue.push(item);
        continue;
      }

      // object: scan its values
      for (const v of Object.values(cur)) {
        if (Array.isArray(v)) {
          if (isTalentArray(v)) return v;
        }
        queue.push(v);
      }
    }
    return null;
  }

  function isActorEntry(obj) {
    const prof = obj && obj.professions;
    return !!(prof && typeof prof === 'object' && ('Actor' in prof));
  }

  function getTagValue(actor, tagId) {
    const container = actor.whiteTagsNEW || actor.whiteTagsNew;
    const raw = container && container[tagId] && container[tagId].value;
    return normalizeArtCom(raw || '0.000');
  }

  function getNumeric(value) {
    const n = Number(value);
    return isFinite(n) ? n : -Infinity;
  }

  function sortList(list) {
    const dirMul = sortState.dir === 'desc' ? -1 : 1;
    const key = sortState.key;
    list.sort((a, b) => {
      if (key === 'name') {
        const an = fullNameFor(a).toLowerCase();
        const bn = fullNameFor(b).toLowerCase();
        return an.localeCompare(bn) * dirMul;
      }
      let av, bv;
      if (key === 'skill') {
        av = getNumeric(normalizeDecimalString(a.professions?.Actor ?? ''));
        bv = getNumeric(normalizeDecimalString(b.professions?.Actor ?? ''));
      } else if (key === 'age') {
        av = getNumeric(getAge(a));
        bv = getNumeric(getAge(b));
      } else if (key === 'limit') {
        av = getNumeric(normalizeDecimalString(a.limit ?? a.Limit ?? ''));
        bv = getNumeric(normalizeDecimalString(b.limit ?? b.Limit ?? ''));
      } else if (key === 'art') {
        av = getNumeric(getTagValue(a, 'ART'));
        bv = getNumeric(getTagValue(b, 'ART'));
      } else if (key === 'com') {
        av = getNumeric(getTagValue(a, 'COM'));
        bv = getNumeric(getTagValue(b, 'COM'));
      } else {
        av = 0; bv = 0;
      }
      if (av === bv) return 0;
      return av < bv ? -1 * dirMul : 1 * dirMul;
    });
  }

  function updateSortIndicators() {
    const ths = document.querySelectorAll('#actorsTable thead th');
    ths.forEach((th) => {
      th.classList.remove('sort-asc', 'sort-desc');
      const key = th.getAttribute('data-sort-key');
      if (!key) return;
      if (key === sortState.key) {
        th.classList.add(sortState.dir === 'desc' ? 'sort-desc' : 'sort-asc');
      }
    });
  }

  function render() {
    if (!saveLoaded) return;
    controls.hidden = false;
    tableSection.hidden = false;
    downloadBtn.disabled = false;

    // filter by search
    const q = (searchInput.value || '').toLowerCase().trim();
    const filtered = q ? actors.filter(a => fullNameFor(a).toLowerCase().includes(q)) : actors.slice();

    // sort by current sort state
    sortList(filtered);

    statusEl.textContent = `${filtered.length} of ${actors.length} actors shown` + (!nameMapLoaded ? ' — load name map to see full names' : '');

    // render rows
    const frag = document.createDocumentFragment();
    filtered.forEach(actor => {
      const tr = document.createElement('tr');

      // Name
      const tdName = document.createElement('td');
      tdName.textContent = fullNameFor(actor);
      tr.appendChild(tdName);

      // Age (editable)
      const tdAge = document.createElement('td');
      const ageInput = document.createElement('input');
      ageInput.type = 'number';
      ageInput.min = '0'; ageInput.max = '200';
      const currentAge = getAge(actor);
      ageInput.value = currentAge === '' ? '' : String(currentAge);
      ageInput.placeholder = gameYear ? '—' : 'Set game year';
      ageInput.addEventListener('change', () => {
        if (!gameYear) return;
        const newAge = Number(ageInput.value);
        if (!isFinite(newAge) || newAge < 0 || newAge > 200) { ageInput.value = currentAge; return; }
        const parts = parseBirthDateParts(actor.birthDate) || { day: 1, month: 1, year: 1 };
        const newYear = Math.floor(gameYear - Math.floor(newAge));
        const safeYear = Math.min(Math.max(newYear, 1850), 2100);
        actor.birthDate = formatBirthDate(parts.day, parts.month, safeYear);
        render();
      });
      tdAge.appendChild(ageInput);
      tr.appendChild(tdAge);

      // Acting Skill (slider)
      const tdSkill = document.createElement('td');
      const skillWrap = document.createElement('div');
      skillWrap.className = 'slider-cell';
      const skillRange = document.createElement('input');
      skillRange.type = 'range';
      skillRange.min = '0'; skillRange.max = '1'; skillRange.step = '0.01';
      const currentSkill = actor.professions?.Actor;
      const skillNum = isFinite(Number(currentSkill)) ? Number(currentSkill) : 0;
      skillRange.value = String(skillNum);
      const skillVal = document.createElement('span');
      skillVal.className = 'slider-val';
      skillVal.textContent = normalizeDecimalString(skillNum);
      skillRange.addEventListener('input', () => {
        const norm = Number(skillRange.value).toFixed(3);
        if (!actor.professions || typeof actor.professions !== 'object') actor.professions = {};
        actor.professions.Actor = norm;
        skillVal.textContent = norm;
      });
      skillRange.addEventListener('change', () => {
        // re-render so sorting reacts if sorting by skill
        render();
      });
      skillWrap.appendChild(skillRange);
      skillWrap.appendChild(skillVal);
      tdSkill.appendChild(skillWrap);
      tr.appendChild(tdSkill);

      // Limit (slider)
      const tdLimit = document.createElement('td');
      const limitWrap = document.createElement('div');
      limitWrap.className = 'slider-cell';
      const limitRange = document.createElement('input');
      limitRange.type = 'range';
      limitRange.min = '0'; limitRange.max = '1'; limitRange.step = '0.01';
      const currentLimit = actor.limit ?? actor.Limit;
      const limitNum = isFinite(Number(currentLimit)) ? Number(currentLimit) : 0;
      limitRange.value = String(limitNum);
      const limitVal = document.createElement('span');
      limitVal.className = 'slider-val';
      limitVal.textContent = normalizeDecimalString(limitNum);
      limitRange.addEventListener('input', () => {
        const norm = Number(limitRange.value).toFixed(3);
        actor.limit = norm;
        actor.Limit = norm;
        limitVal.textContent = norm;
      });
      limitRange.addEventListener('change', () => {
        render();
      });
      limitWrap.appendChild(limitRange);
      limitWrap.appendChild(limitVal);
      tdLimit.appendChild(limitWrap);
      tr.appendChild(tdLimit);

      // ART
      const tdArt = document.createElement('td');
      const artSel = document.createElement('select');
      for (const val of ART_COM_OPTIONS) {
        const opt = document.createElement('option');
        opt.value = val; opt.textContent = val; artSel.appendChild(opt);
      }
      const artTag = ensureTag(actor, 'ART');
      artSel.value = normalizeArtCom(artTag.value);
      artSel.addEventListener('change', () => {
        const t = ensureTag(actor, 'ART');
        t.value = normalizeArtCom(artSel.value);
        artSel.value = t.value;
      });
      tdArt.appendChild(artSel);
      tr.appendChild(tdArt);

      // COM
      const tdCom = document.createElement('td');
      const comSel = document.createElement('select');
      for (const val of ART_COM_OPTIONS) {
        const opt = document.createElement('option');
        opt.value = val; opt.textContent = val; comSel.appendChild(opt);
      }
      const comTag = ensureTag(actor, 'COM');
      comSel.value = normalizeArtCom(comTag.value);
      comSel.addEventListener('change', () => {
        const t = ensureTag(actor, 'COM');
        t.value = normalizeArtCom(comSel.value);
        comSel.value = t.value;
      });
      tdCom.appendChild(comSel);
      tr.appendChild(tdCom);

      frag.appendChild(tr);
    });

    tbody.replaceChildren(frag);
  }

  function refreshAfterDataLoad() {
    if (!saveLoaded) return;
    // Derive characters/actors view
    charactersArr = extractCharacters(saveObj);
    if (!Array.isArray(charactersArr)) {
      saveMeta.textContent = 'Error: Could not find characters array in save file.';
      return;
    }
    // compute game year if possible and reflect in UI
    const computed = computeGameYearFromData(saveObj);
    if (computed) {
      gameYear = computed;
      if (gameYearInput) gameYearInput.value = String(gameYear);
    }
    actors = charactersArr.filter(isActorEntry);
    // initial default: acting skill, descending
    sortState = { key: 'skill', dir: 'desc' };
    updateSortIndicators();
    render();
  }

  async function tryAutoLoadNames() {
    const candidates = [
      '../data/CHARACTER_NAMES.json',
      './data/CHARACTER_NAMES.json',
      'data/CHARACTER_NAMES.json',
      './CHARACTER_NAMES.json',
      '/data/CHARACTER_NAMES.json'
    ];
    for (const url of candidates) {
      try {
        const resp = await fetch(url);
        if (!resp.ok) continue;
        const data = await resp.json();
        if (Array.isArray(data?.locStrings)) {
          names = data.locStrings;
          nameMapLoaded = true;
          namesMeta.textContent = `Loaded name map (locStrings: ${names.length}) from ${url}`;
          render();
          return;
        }
      } catch (_) {
        // try next
      }
    }
    namesMeta.textContent = 'Name map not auto-loaded. Select data/CHARACTER_NAMES.json above or serve from repo root.';
    nameMapLoaded = false;
  }

  // Event wiring — save file
  saveFileInput.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await readFileAsText(file);
      saveObj = JSON.parse(text);
      saveLoaded = true;
      originalSaveName = file.name;
      saveMeta.textContent = `Loaded save: ${file.name} (${file.size.toLocaleString()} bytes)`;
      refreshAfterDataLoad();
    } catch (err) {
      console.error(err);
      saveMeta.textContent = 'Failed to parse JSON save file.';
    }
  });

  // Drag & drop
  ;['dragenter','dragover'].forEach(evt => dropZone.addEventListener(evt, (e) => {
    e.preventDefault(); e.stopPropagation(); dropZone.classList.add('drag');
  }));
  ;['dragleave','drop'].forEach(evt => dropZone.addEventListener(evt, (e) => {
    e.preventDefault(); e.stopPropagation(); dropZone.classList.remove('drag');
  }));
  dropZone.addEventListener('drop', async (e) => {
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    try {
      const text = await readFileAsText(file);
      saveObj = JSON.parse(text);
      saveLoaded = true;
      originalSaveName = file.name;
      saveMeta.textContent = `Loaded save: ${file.name} (${file.size.toLocaleString()} bytes)`;
      refreshAfterDataLoad();
    } catch (err) {
      console.error(err);
      saveMeta.textContent = 'Failed to parse JSON save file.';
    }
  });

  // Name file input fallback
  namesFileInput.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await readFileAsText(file);
      const data = JSON.parse(text);
      if (Array.isArray(data?.locStrings)) {
        names = data.locStrings;
        nameMapLoaded = true;
        namesMeta.textContent = `Loaded name map (locStrings: ${names.length}) from ${file.name}`;
        render();
      } else {
        namesMeta.textContent = 'Invalid CHARACTER_NAMES.json (missing locStrings array).';
      }
    } catch (err) {
      console.error(err);
      namesMeta.textContent = 'Failed to parse CHARACTER_NAMES.json.';
    }
  });

  // Search
  searchInput.addEventListener('input', () => render());

  // Game year override
  gameYearInput.addEventListener('change', () => {
    const val = Number(gameYearInput.value);
    if (!isFinite(val) || val < 1850 || val > 2100) return;
    gameYear = Math.floor(val);
    render();
  });

  // Sorting handlers
  (function attachSorting() {
    const ths = document.querySelectorAll('#actorsTable thead th');
    ths.forEach((th) => {
      const key = th.getAttribute('data-sort-key');
      if (!key) return;
      th.addEventListener('click', () => {
        if (sortState.key === key) {
          // toggle dir
          sortState.dir = sortState.dir === 'desc' ? 'asc' : 'desc';
        } else {
          // first click on a column: descending
          sortState.key = key;
          sortState.dir = 'desc';
        }
        updateSortIndicators();
        render();
      });
    });
  })();

  // Download
  downloadBtn.addEventListener('click', () => {
    if (!saveLoaded) return;
    // produce JSON with indentation
    const blob = new Blob([JSON.stringify(saveObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = originalSaveName || 'edited_save.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  // Init
  tryAutoLoadNames();
})();
