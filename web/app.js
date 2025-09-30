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
  const reloadBtn = document.getElementById('reloadBtn');
  const loadersSection = document.getElementById('loaders');
  const controls = document.getElementById('controls');
  const searchInput = document.getElementById('searchInput');
  const gameYearText = document.getElementById('gameYearText');
  const downloadBtn = document.getElementById('downloadBtn');
  const statusEl = document.getElementById('status');
  const tableSection = document.getElementById('tableSection');
  const tbody = document.getElementById('actorsTbody');
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  // Studio (top-level fields)
  const studioControls = document.getElementById('studioControls');
  const studioBudgetInput = document.getElementById('studioBudgetInput');
  const studioCashInput = document.getElementById('studioCashInput');
  const studioReputationInput = document.getElementById('studioReputationInput');
  const studioInfluenceInput = document.getElementById('studioInfluenceInput');
  const studioStatus = document.getElementById('studioStatus');
  const studioBudgetFmt = document.getElementById('studioBudgetFmt');
  const studioCashFmt = document.getElementById('studioCashFmt');
  const studioReputationFmt = document.getElementById('studioReputationFmt');
  const studioInfluenceFmt = document.getElementById('studioInfluenceFmt');
  const changesPanel = document.getElementById('changesPanel');
  const changesList = document.getElementById('changesList');
  const changesCount = document.getElementById('changesCount');
  const undoBtn = document.getElementById('undoBtn');
  const redoBtn = document.getElementById('redoBtn');
  // Detail overlay DOM
  const detailOverlay = document.getElementById('detailOverlay');
  const detailTitle = document.getElementById('detailTitle');
  const detailCloseBtn = document.getElementById('detailCloseBtn');
  const detailCancelBtn = document.getElementById('detailCancelBtn');
  const detailApplyBtn = document.getElementById('detailApplyBtn');
  const detailFormatBtn = document.getElementById('detailFormatBtn');
  const detailCopyBtn = document.getElementById('detailCopyBtn');
  const detailJson = document.getElementById('detailJson');
  const detailName = document.getElementById('detailName');
  const detailId = document.getElementById('detailId');
  const detailStatus = document.getElementById('detailStatus');
  // Detail form controls
  const detailForm = document.getElementById('detailForm');
  const detailCustomName = document.getElementById('detailCustomName');
  const detailGender0 = document.getElementById('detailGender0');
  const detailGender1 = document.getElementById('detailGender1');
  const detailStudioId = document.getElementById('detailStudioId');
  const detailMood = document.getElementById('detailMood');
  const detailAttitude = document.getElementById('detailAttitude');
  const detailSelfEsteem = document.getElementById('detailSelfEsteem');
  const detailReadiness = document.getElementById('detailReadiness');
  const detailState = document.getElementById('detailState');
  const detailSkill = document.getElementById('detailSkill');
  const detailLimit = document.getElementById('detailLimit');
  const detailArt = document.getElementById('detailArt');
  const detailCom = document.getElementById('detailCom');
  const detailArtWrap = document.getElementById('detailArtWrap');
  const detailComWrap = document.getElementById('detailComWrap');
  const detailAdvancedLink = document.getElementById('detailAdvancedLink');
  const detailMoodFmt = document.getElementById('detailMoodFmt');
  const detailAttitudeFmt = document.getElementById('detailAttitudeFmt');
  const detailSelfEsteemFmt = document.getElementById('detailSelfEsteemFmt');
  const detailSkillFmt = document.getElementById('detailSkillFmt');
  const detailLimitFmt = document.getElementById('detailLimitFmt');
  const detailArtFmt = document.getElementById('detailArtFmt');
  const detailComFmt = document.getElementById('detailComFmt');
  const detailMoodNum = document.getElementById('detailMoodNum');
  const detailAttitudeNum = document.getElementById('detailAttitudeNum');
  const detailSelfEsteemNum = document.getElementById('detailSelfEsteemNum');
  const detailSkillNum = document.getElementById('detailSkillNum');
  const detailLimitNum = document.getElementById('detailLimitNum');
  const detailArtNum = document.getElementById('detailArtNum');
  const detailComNum = document.getElementById('detailComNum');
  // placeholders for other tabs
  const directorsPlaceholder = document.getElementById('directorsPlaceholder');
  const producersPlaceholder = document.getElementById('producersPlaceholder');
  const writersPlaceholder = document.getElementById('writersPlaceholder');
  const editorsPlaceholder = document.getElementById('editorsPlaceholder');
  const moviesPlaceholder = document.getElementById('moviesPlaceholder');
  const moviesControls = document.getElementById('moviesControls');
  const moviesSearchInput = document.getElementById('moviesSearchInput');
  const moviesStatus = document.getElementById('moviesStatus');
  const moviesTableSection = document.getElementById('moviesTableSection');
  const moviesTbody = document.getElementById('moviesTbody');
  // New roles UI
  const composersPlaceholder = document.getElementById('composersPlaceholder');
  const composersControls = document.getElementById('composersControls');
  const composersSearchInput = document.getElementById('composersSearchInput');
  const composersStatus = document.getElementById('composersStatus');
  const composersTableSection = document.getElementById('composersTableSection');
  const composersTbody = document.getElementById('composersTbody');
  const gameYearText6 = document.getElementById('gameYearText6');
  const cinematographersPlaceholder = document.getElementById('cinematographersPlaceholder');
  const cinematographersControls = document.getElementById('cinematographersControls');
  const cinematographersSearchInput = document.getElementById('cinematographersSearchInput');
  const cinematographersStatus = document.getElementById('cinematographersStatus');
  const cinematographersTableSection = document.getElementById('cinematographersTableSection');
  const cinematographersTbody = document.getElementById('cinematographersTbody');
  const gameYearText7 = document.getElementById('gameYearText7');
  const agentsPlaceholder = document.getElementById('agentsPlaceholder');
  const agentsControls = document.getElementById('agentsControls');
  const agentsSearchInput = document.getElementById('agentsSearchInput');
  const agentsStatus = document.getElementById('agentsStatus');
  const agentsTableSection = document.getElementById('agentsTableSection');
  const agentsTbody = document.getElementById('agentsTbody');
  const gameYearText8 = document.getElementById('gameYearText8');
  // Executives UI
  const executivesPlaceholder = document.getElementById('executivesPlaceholder');
  const executivesControls = document.getElementById('executivesControls');
  const executivesSearchInput = document.getElementById('executivesSearchInput');
  const executivesStatus = document.getElementById('executivesStatus');
  const executivesTableSection = document.getElementById('executivesTableSection');
  const executivesTbody = document.getElementById('executivesTbody');
  const gameYearText9 = document.getElementById('gameYearText9');
  // Directors UI
  const directorsTableSection = document.getElementById('directorsTableSection');
  const directorsTbody = document.getElementById('directorsTbody');
  const directorsControls = document.getElementById('directorsControls');
  const directorsSearchInput = document.getElementById('directorsSearchInput');
  const directorsStatus = document.getElementById('directorsStatus');
  const gameYearText2 = document.getElementById('gameYearText2');
  // Producers UI
  const producersTableSection = document.getElementById('producersTableSection');
  const producersTbody = document.getElementById('producersTbody');
  const producersControls = document.getElementById('producersControls');
  const producersSearchInput = document.getElementById('producersSearchInput');
  const producersStatus = document.getElementById('producersStatus');
  const gameYearText3 = document.getElementById('gameYearText3');
  // Writers UI
  const writersTableSection = document.getElementById('writersTableSection');
  const writersTbody = document.getElementById('writersTbody');
  const writersControls = document.getElementById('writersControls');
  const writersSearchInput = document.getElementById('writersSearchInput');
  const writersStatus = document.getElementById('writersStatus');
  const gameYearText4 = document.getElementById('gameYearText4');
  // Editors UI
  const editorsTableSection = document.getElementById('editorsTableSection');
  const editorsTbody = document.getElementById('editorsTbody');
  const editorsControls = document.getElementById('editorsControls');
  const editorsSearchInput = document.getElementById('editorsSearchInput');
  const editorsStatus = document.getElementById('editorsStatus');
  const gameYearText5 = document.getElementById('gameYearText5');

  // State
  let saveObj = null;           // whole parsed save JSON
  let charactersArr = null;     // reference to the characters array in saveObj
  let actors = [];              // derived list of actor objects
  let executives = [];          // derived list of executive objects (Lieut* and Cpt*)
  let names = [];               // CHARACTER_NAMES.locStrings array
  let nameMapLoaded = false;
  let saveLoaded = false;
  let sortState = { key: 'skill', dir: 'desc' }; // default: acting skill, descending
  let gameYear = null;           // derived or user-provided
  let originalSaveName = null;   // keep original uploaded filename
  let lastLoadedFile = null;     // remember last File for reload
  // Change tracking
  const changeLog = [];
  const undoStack = [];
  const redoStack = [];
  // Studio root cache (object containing budget/cash/reputation/influence)
  let studioRoot = null;
  // derived role lists (placeholders for future editors)
  let directors = [];
  let producers = [];
  let writers = [];
  let editors = [];
  let composers = [];
  let cinematographers = [];
  let agents = [];
  let movies = [];
  // UI focus tracking
  let focusedEntityId = null;
  let detailEntity = null; // currently opened entity for advanced edit

  function markFocusedId(id) {
    if (id == null) return;
    focusedEntityId = id;
    // Update existing DOM rows immediately without a full re-render
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach((tr) => {
      const trId = tr.getAttribute('data-id');
      tr.classList.toggle('row-focused', trId && String(trId) === String(id));
    });
  }

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

  // Lightweight schema validation for new-format saves. Non-blocking: surfaces warnings in UI.
  function validateBirthDateString(dateStr) {
    if (typeof dateStr !== 'string') return false;
    // Expected DD-MM-YYYY (e.g., 01-01-1899) or 01-01-0001 placeholder
    return /^\d{2}-\d{2}-\d{4}$/.test(dateStr);
  }

  function isThreeDecimalString(value) {
    if (value === undefined || value === null) return false;
    const s = String(value);
    // Accept plain decimal string; we will write back normalized three-decimal strings
    return /^-?\d+(?:[\.,]\d+)?$/.test(s);
  }

  function validateTalentEntry(entity) {
    const msgs = [];
    if (typeof entity !== 'object' || !entity) { msgs.push('Entity is not an object'); return msgs; }
    if (typeof entity.id !== 'number') msgs.push('Missing numeric id');
    if (typeof entity.firstNameId !== 'string') msgs.push('Missing string firstNameId');
    if (typeof entity.lastNameId !== 'string') msgs.push('Missing string lastNameId');
    if (!validateBirthDateString(entity.birthDate)) msgs.push('birthDate not in DD-MM-YYYY');
    if (!entity.professions || typeof entity.professions !== 'object') msgs.push('Missing professions object');
    if (!isThreeDecimalString(entity.limit ?? entity.Limit)) msgs.push('Missing limit/Limit decimal');
    // If Actor, ensure Actor key exists
    if (entity.professions && ('Actor' in entity.professions)) {
      if (!isThreeDecimalString(entity.professions.Actor)) msgs.push('Actor skill not a decimal string');
    }
    // Tags container may be empty; just check type
    if (entity.whiteTagsNEW && typeof entity.whiteTagsNEW !== 'object') msgs.push('whiteTagsNEW present but not an object');
    return msgs;
  }

  function validateSaveSchema(root) {
    const result = { ok: true, warnings: [] };
    const chars = extractCharacters(root);
    if (!Array.isArray(chars)) {
      result.ok = false;
      result.warnings.push('Could not locate characters array.');
      return result;
    }
    // Validate up to first 10 entries to keep it fast
    const sample = chars.slice(0, 10);
    for (let i = 0; i < sample.length; i++) {
      const msgs = validateTalentEntry(sample[i]);
      if (msgs.length) {
        result.ok = false; // treat as schema deviation
        result.warnings.push(`characters[${i}]: ${msgs.join('; ')}`);
      }
    }
    return result;
  }

  function formatUnitToTen(value) {
    if (value === undefined || value === null || value === '') return '';
    const num = Number(String(value).replace(',', '.'));
    if (!isFinite(num)) return '';
    return (num * 10).toFixed(1);
  }

  function formatUnitToHundred(value) {
    if (value === undefined || value === null || value === '') return '';
    const num = Number(String(value).replace(',', '.'));
    if (!isFinite(num)) return '';
    return (num * 100).toFixed(0);
  }

  function refreshChangeUI() {
    if (changesPanel) changesPanel.hidden = changeLog.length === 0;
    if (changesCount) changesCount.textContent = String(changeLog.length);
    if (undoBtn) undoBtn.disabled = undoStack.length === 0;
    if (redoBtn) redoBtn.disabled = redoStack.length === 0;
    if (downloadBtn) downloadBtn.disabled = (changeLog.length === 0 || !saveLoaded);
  }

  function pushChange(entry) {
    changeLog.push(entry);
    undoStack.push(entry);
    redoStack.length = 0;
    if (changesList) {
      const li = document.createElement('li');
      li.textContent = entry.message;
      changesList.appendChild(li);
    }
    refreshChangeUI();
  }

  function openDetailEditor(entity) {
    detailEntity = entity;
    if (!detailEntity) return;
    detailTitle.textContent = 'Character Details';
    detailName.textContent = (detailEntity.customName && String(detailEntity.customName).trim()) || fullNameFor(detailEntity) || detailEntity.name || 'Unknown';
    detailId.textContent = String(detailEntity.id ?? '—');
    detailStatus.textContent = '';
    // Populate form fields
    if (detailForm) {
      detailCustomName.value = String(detailEntity.customName ?? '');
      if (String(detailEntity.gender) === '1') { detailGender1.checked = true; } else { detailGender0.checked = true; }
      // Populate studio select
      if (detailStudioId && detailStudioId.tagName === 'SELECT') {
        detailStudioId.innerHTML = '';
        const playerStudioName = findFirstValueByKey(saveObj, 'StudioName');
        const presets = [
          { value: '', label: 'None' },
          { value: 'PL', label: `PL - ${playerStudioName ? String(playerStudioName) : 'Player Studio'}` },
          { value: 'EM', label: 'EM - Evergreen Movies' },
          { value: 'GB', label: 'GB - Gerstein Bros.' },
          { value: 'MA', label: 'MA - Marginese' },
          { value: 'SU', label: 'SU - Supreme' },
          { value: 'HE', label: 'HE - Hephaestus' },
        ];
        const current = entity.studioId == null ? '' : String(entity.studioId);
        let found = presets.some(p => p.value === current || (current === '' && p.value === ''));
        for (const p of presets) {
          const opt = document.createElement('option'); opt.value = p.value; opt.textContent = p.label; detailStudioId.appendChild(opt);
        }
        // Add unknown current code if not in presets
        if (!found && current !== '') {
          const optU = document.createElement('option'); optU.value = current; optU.textContent = `${current} - Unknown Studio`; detailStudioId.appendChild(optU);
        }
        detailStudioId.value = current;
      }
      detailMood.value = String(Number(detailEntity.mood ?? 0).toFixed(3));
      detailAttitude.value = String(Number(detailEntity.attitude ?? 0).toFixed(3));
      detailSelfEsteem.value = String(Number(detailEntity.selfEsteem ?? 0).toFixed(3));
      // Readiness (integer-ish scalar)
      if (detailReadiness) detailReadiness.value = detailEntity.readinessForTricks == null ? '' : String(detailEntity.readinessForTricks);
      // State (numeric or null)
      if (detailState) detailState.value = detailEntity.state == null ? '' : String(detailEntity.state);
      if (detailMoodFmt) detailMoodFmt.textContent = formatUnitToHundred(Number(detailEntity.mood ?? 0));
      if (detailAttitudeFmt) detailAttitudeFmt.textContent = formatUnitToHundred(Number(detailEntity.attitude ?? 0));
      if (detailSelfEsteemFmt) detailSelfEsteemFmt.textContent = formatUnitToTen(Number(detailEntity.selfEsteem ?? 0));
      if (detailMoodNum) detailMoodNum.textContent = String(Number(detailEntity.mood ?? 0).toFixed(3));
      if (detailAttitudeNum) detailAttitudeNum.textContent = String(Number(detailEntity.attitude ?? 0).toFixed(3));
      if (detailSelfEsteemNum) detailSelfEsteemNum.textContent = String(Number(detailEntity.selfEsteem ?? 0).toFixed(3));
      // Skill/Limit (best effort role detection: prefer Actor, else any present key)
      const prof = detailEntity.professions || {};
      const writeKey = ('Actor' in prof) ? 'Actor' : (Object.keys(prof)[0] || 'Actor');
      detailSkill.dataset.writeKey = writeKey;
      const curSkill = Number(prof[writeKey] ?? 0);
      detailSkill.value = String(curSkill.toFixed(3));
      const lim = Number(detailEntity.limit ?? detailEntity.Limit ?? 0);
      detailLimit.value = String(lim.toFixed(3));
      if (detailSkillFmt) detailSkillFmt.textContent = formatUnitToTen(curSkill);
      if (detailLimitFmt) detailLimitFmt.textContent = formatUnitToTen(lim);
      if (detailSkillNum) detailSkillNum.textContent = String(curSkill.toFixed(3));
      if (detailLimitNum) detailLimitNum.textContent = String(lim.toFixed(3));
      // ART/COM toggle only for actors
      const isActor = ('Actor' in prof);
      if (detailArtWrap) detailArtWrap.hidden = !isActor;
      if (detailComWrap) detailComWrap.hidden = !isActor;
      if (isActor) {
        const artTag = ensureTag(detailEntity, 'ART');
        const comTag = ensureTag(detailEntity, 'COM');
        const artNum = Number(artTag.value ?? 0);
        const comNum = Number(comTag.value ?? 0);
        detailArt.value = String(artNum.toFixed(3));
        detailCom.value = String(comNum.toFixed(3));
        if (detailArtFmt) detailArtFmt.textContent = formatUnitToTen(artNum);
        if (detailComFmt) detailComFmt.textContent = formatUnitToTen(comNum);
        if (detailArtNum) detailArtNum.textContent = String(artNum.toFixed(3));
        if (detailComNum) detailComNum.textContent = String(comNum.toFixed(3));
      }
      // Hide JSON by default
      if (detailJson) detailJson.hidden = true;
      if (detailForm) detailForm.hidden = false;
    }
    detailOverlay.hidden = false;
  }

  function closeDetailEditor() {
    detailOverlay.hidden = true;
    detailEntity = null;
    if (detailJson) detailJson.value = '';
    if (detailStatus) detailStatus.textContent = '';
  }

  function applyField(obj, path, newVal) {
    const parts = path.split('.');
    let cur = obj, i = 0;
    for (; i < parts.length - 1; i++) {
      const k = parts[i];
      if (cur[k] == null || typeof cur[k] !== 'object') cur[k] = {};
      cur = cur[k];
    }
    const last = parts[i];
    cur[last] = newVal;
  }

  function readField(obj, path) {
    const parts = path.split('.');
    let cur = obj;
    for (const k of parts) {
      if (cur == null) return undefined;
      cur = cur[k];
    }
    return cur;
  }

  function recordEdit({ entity, label, path, oldValue, newValue, suppressEntityInLog, force }) {
    if (!force && oldValue === newValue) return;
    const suffix = suppressEntityInLog ? '' : ` (${fullNameFor(entity) || entity.name || 'Unknown'})`;
    pushChange({ message: `${label}: ${oldValue} → ${newValue}${suffix}`,
      undo: () => applyField(entity, path, oldValue),
      redo: () => applyField(entity, path, newValue) });
  }

  function attachUndoRedo() {
    if (undoBtn) undoBtn.addEventListener('click', () => {
      const entry = undoStack.pop();
      if (!entry) return;
      entry.undo();
      redoStack.push(entry);
      // remove last applied change from log and UI
      changeLog.pop();
      if (changesList && changesList.lastChild) changesList.removeChild(changesList.lastChild);
      refreshChangeUI();
      // no resort; refresh visible tables only
      render(); renderStudio();
      renderDirectors(); renderProducers(); renderWriters(); renderEditors(); renderComposers(); renderCinematographers(); renderAgents(); renderExecutives(); renderMovies();
    });
    if (redoBtn) redoBtn.addEventListener('click', () => {
      const entry = redoStack.pop();
      if (!entry) return;
      entry.redo();
      undoStack.push(entry);
      // append reapplied change to log and UI
      changeLog.push(entry);
      if (changesList) { const li = document.createElement('li'); li.textContent = entry.message; changesList.appendChild(li); }
      refreshChangeUI();
      render(); renderStudio();
      renderDirectors(); renderProducers(); renderWriters(); renderEditors(); renderComposers(); renderCinematographers(); renderAgents(); renderExecutives(); renderMovies();
    });
  }

  // Detail editor events
  if (detailCloseBtn) detailCloseBtn.addEventListener('click', closeDetailEditor);
  if (detailCancelBtn) detailCancelBtn.addEventListener('click', closeDetailEditor);
  if (detailOverlay) detailOverlay.addEventListener('click', (e) => { if (e.target === detailOverlay) closeDetailEditor(); });
  if (detailFormatBtn) detailFormatBtn.addEventListener('click', () => {
    if (detailJson.hidden) { detailStatus.textContent = 'Open JSON editor first (use the red link).'; return; }
    try { const obj = JSON.parse(detailJson.value); detailJson.value = JSON.stringify(obj, null, 2); detailStatus.textContent = 'Formatted.'; }
    catch { detailStatus.textContent = 'Invalid JSON. Cannot format.'; }
  });
  if (detailCopyBtn) detailCopyBtn.addEventListener('click', async () => {
    if (detailJson.hidden) { detailStatus.textContent = 'Open JSON editor first (use the red link).'; return; }
    try { await navigator.clipboard.writeText(detailJson.value); detailStatus.textContent = 'Copied to clipboard.'; }
    catch { detailStatus.textContent = 'Copy failed.'; }
  });
  if (detailAdvancedLink) detailAdvancedLink.addEventListener('click', () => {
    // Populate JSON with current entity snapshot and toggle visibility
    try { const safe = JSON.parse(JSON.stringify(detailEntity)); detailJson.value = JSON.stringify(safe, null, 2); }
    catch { detailJson.value = '{\n  "error": "Could not serialize entity"\n}'; }
    if (detailJson) detailJson.hidden = false;
    if (detailForm) detailForm.hidden = true;
    detailTitle.textContent = 'Advanced Editor';
  });

  // Detail sliders: live display updates (x10) without recording changes until Apply
  if (detailMood) detailMood.addEventListener('input', () => {
    if (detailMoodFmt) detailMoodFmt.textContent = formatUnitToHundred(Number(detailMood.value));
    if (detailMoodNum) detailMoodNum.textContent = String(Number(detailMood.value).toFixed(3));
  });
  if (detailAttitude) detailAttitude.addEventListener('input', () => {
    if (detailAttitudeFmt) detailAttitudeFmt.textContent = formatUnitToHundred(Number(detailAttitude.value));
    if (detailAttitudeNum) detailAttitudeNum.textContent = String(Number(detailAttitude.value).toFixed(3));
  });
  if (detailSelfEsteem) detailSelfEsteem.addEventListener('input', () => {
    if (detailSelfEsteemFmt) detailSelfEsteemFmt.textContent = formatUnitToTen(Number(detailSelfEsteem.value));
    if (detailSelfEsteemNum) detailSelfEsteemNum.textContent = String(Number(detailSelfEsteem.value).toFixed(3));
  });
  if (detailSkill) detailSkill.addEventListener('input', () => {
    if (detailSkillFmt) detailSkillFmt.textContent = formatUnitToTen(Number(detailSkill.value));
    if (detailSkillNum) detailSkillNum.textContent = String(Number(detailSkill.value).toFixed(3));
    // auto-clamp limit display to skill if below
    if (detailLimit && Number(detailLimit.value) < Number(detailSkill.value)) {
      detailLimit.value = String(Number(detailSkill.value).toFixed(3));
      if (detailLimitFmt) detailLimitFmt.textContent = formatUnitToTen(Number(detailLimit.value));
      if (detailLimitNum) detailLimitNum.textContent = String(Number(detailLimit.value).toFixed(3));
    }
  });
  if (detailLimit) detailLimit.addEventListener('input', () => {
    if (detailLimitFmt) detailLimitFmt.textContent = formatUnitToTen(Number(detailLimit.value));
    if (detailLimitNum) detailLimitNum.textContent = String(Number(detailLimit.value).toFixed(3));
  });
  if (detailArt) detailArt.addEventListener('input', () => {
    if (detailArtFmt) detailArtFmt.textContent = formatUnitToTen(Number(detailArt.value));
    if (detailArtNum) detailArtNum.textContent = String(Number(detailArt.value).toFixed(3));
  });
  if (detailCom) detailCom.addEventListener('input', () => {
    if (detailComFmt) detailComFmt.textContent = formatUnitToTen(Number(detailCom.value));
    if (detailComNum) detailComNum.textContent = String(Number(detailCom.value).toFixed(3));
  });
  if (detailApplyBtn) detailApplyBtn.addEventListener('click', () => {
    if (!detailEntity) return;
    // If JSON is visible, apply from JSON; else apply from form
    if (!detailJson.hidden) {
      let parsed;
      try { parsed = JSON.parse(detailJson.value); }
      catch { detailStatus.textContent = 'Invalid JSON. Please fix errors before applying.'; return; }
      if (parsed && parsed.id !== undefined && String(parsed.id) !== String(detailEntity.id)) { detailStatus.textContent = 'ID mismatch. Cannot change entity id.'; return; }
      try {
        const before = JSON.parse(JSON.stringify(detailEntity));
        for (const k of Object.keys(detailEntity)) delete detailEntity[k];
        for (const [k, v] of Object.entries(parsed)) detailEntity[k] = v;
        const lim = normalizeDecimalString(detailEntity.limit ?? detailEntity.Limit ?? '');
        if (lim) { detailEntity.limit = lim; detailEntity.Limit = lim; }
        recordEdit({ entity: detailEntity, label: 'Advanced edit applied', path: 'self', oldValue: '[complex]', newValue: '[complex]', force: true });
        const snapshotOld = before;
        const snapshotNew = JSON.parse(JSON.stringify(detailEntity));
        const target = detailEntity;
        changeLog[changeLog.length - 1].undo = () => { for (const k of Object.keys(target)) delete target[k]; Object.assign(target, JSON.parse(JSON.stringify(snapshotOld))); };
        changeLog[changeLog.length - 1].redo = () => { for (const k of Object.keys(target)) delete target[k]; Object.assign(target, JSON.parse(JSON.stringify(snapshotNew))); };
        detailStatus.textContent = 'Applied. Review table for changes.';
      } catch (_) {
        detailStatus.textContent = 'Failed to apply changes.';
        return;
      }
    } else {
      // Apply from form
      const before = JSON.parse(JSON.stringify(detailEntity));
      const writeKey = detailSkill.dataset.writeKey || 'Actor';
      // Scalars
      detailEntity.customName = String(detailCustomName.value || '').trim() || null;
      detailEntity.gender = detailGender1.checked ? 1 : 0;
      // Studio selection temporarily disabled (read-only). Leave logic intact for future re-enable.
      // if (detailStudioId && detailStudioId.tagName === 'SELECT') {
      //   const studioRaw = String(detailStudioId.value || '').trim();
      //   detailEntity.studioId = studioRaw === '' ? null : studioRaw;
      // }
      const mood = Number(detailMood.value); const attitude = Number(detailAttitude.value); const se = Number(detailSelfEsteem.value);
      if (isFinite(mood)) detailEntity.mood = mood.toFixed(3);
      if (isFinite(attitude)) detailEntity.attitude = attitude.toFixed(3);
      if (isFinite(se)) detailEntity.selfEsteem = se.toFixed(3);
      const ready = Number(detailReadiness.value); if (isFinite(ready)) detailEntity.readinessForTricks = Math.round(ready);
      // State (text input -> number or null)
      if (detailState) {
        const raw = String(detailState.value || '').trim();
        if (raw === '') detailEntity.state = null; else {
          const asNum = Number(raw);
          detailEntity.state = isFinite(asNum) ? asNum : raw;
        }
      }
      // Skill/Limit
      if (!detailEntity.professions || typeof detailEntity.professions !== 'object') detailEntity.professions = {};
      const skill = Number(detailSkill.value); if (isFinite(skill)) detailEntity.professions[writeKey] = skill.toFixed(3);
      let lim = Number(detailLimit.value); if (!isFinite(lim)) lim = Number(detailEntity.limit ?? detailEntity.Limit ?? 0);
      const skillNum = Number(detailEntity.professions[writeKey] ?? 0);
      if (lim < skillNum) lim = skillNum; // clamp
      detailEntity.limit = lim.toFixed(3); detailEntity.Limit = lim.toFixed(3);
      // ART/COM (only normalize and write if slider value changed vs original)
      if (writeKey === 'Actor') {
        const art = Number(detailArt.value); const com = Number(detailCom.value);
        const beforeArtVal = before.whiteTagsNEW?.ART?.value;
        const beforeComVal = before.whiteTagsNEW?.COM?.value;
        if (isFinite(art)) {
          const artFixed = art.toFixed(3);
          if (artFixed !== String(beforeArtVal ?? '')) {
            ensureTag(detailEntity, 'ART').value = normalizeDecimalString(art);
          }
        }
        if (isFinite(com)) {
          const comFixed = com.toFixed(3);
          if (comFixed !== String(beforeComVal ?? '')) {
            ensureTag(detailEntity, 'COM').value = normalizeDecimalString(com);
          }
        }
      }
      // Sequential change records (like list-level): compare before vs after and emit entries
      const after = detailEntity;
      // helpers to read old/new values safely
      const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
      // Custom Name
      if ((before.customName ?? '') !== (after.customName ?? '')) {
        recordEdit({ entity: after, label: 'Custom Name', path: 'customName', oldValue: before.customName ?? '', newValue: after.customName ?? '' });
      }
      // Gender
      if ((before.gender ?? 0) !== (after.gender ?? 0)) {
        recordEdit({ entity: after, label: 'Gender', path: 'gender', oldValue: String(before.gender ?? ''), newValue: String(after.gender ?? '') });
      }
      // Studio
      // Studio edits disabled for now
      // if ((before.studioId ?? '') !== (after.studioId ?? '')) {
      //   recordEdit({ entity: after, label: 'Studio', path: 'studioId', oldValue: before.studioId ?? '', newValue: after.studioId ?? '' });
      // }
      // Happiness (mood)
      if ((before.mood ?? '') !== (after.mood ?? '')) {
        recordEdit({ entity: after, label: 'Happiness', path: 'mood', oldValue: before.mood ?? '', newValue: after.mood ?? '' });
      }
      // Loyalty (attitude)
      if ((before.attitude ?? '') !== (after.attitude ?? '')) {
        recordEdit({ entity: after, label: 'Loyalty', path: 'attitude', oldValue: before.attitude ?? '', newValue: after.attitude ?? '' });
      }
      // Self Esteem
      if ((before.selfEsteem ?? '') !== (after.selfEsteem ?? '')) {
        recordEdit({ entity: after, label: 'Self Esteem', path: 'selfEsteem', oldValue: before.selfEsteem ?? '', newValue: after.selfEsteem ?? '' });
      }
      // Readiness for Tricks
      if ((before.readinessForTricks ?? '') !== (after.readinessForTricks ?? '')) {
        recordEdit({ entity: after, label: 'Readiness for Tricks', path: 'readinessForTricks', oldValue: String(before.readinessForTricks ?? ''), newValue: String(after.readinessForTricks ?? '') });
      }
      // State
      if ((before.state ?? '') !== (after.state ?? '')) {
        recordEdit({ entity: after, label: 'State', path: 'state', oldValue: String(before.state ?? ''), newValue: String(after.state ?? '') });
      }
      // Skill
      const beforeSkill = get(before, `professions.${writeKey}`);
      const afterSkill = get(after, `professions.${writeKey}`);
      if (String(beforeSkill ?? '') !== String(afterSkill ?? '')) {
        recordEdit({ entity: after, label: 'Skill', path: `professions.${writeKey}`, oldValue: beforeSkill ?? '', newValue: afterSkill ?? '' });
      }
      // Limit (only record `limit`; runtime keeps `Limit` in sync)
      if (String(before.limit ?? '') !== String(after.limit ?? '')) {
        recordEdit({ entity: after, label: 'Limit', path: 'limit', oldValue: before.limit ?? '', newValue: after.limit ?? '' });
      }
      // ART/COM (actors only)
      if (writeKey === 'Actor') {
        const beforeArt = before.whiteTagsNEW?.ART?.value;
        const afterArt = after.whiteTagsNEW?.ART?.value;
        if (String(beforeArt ?? '') !== String(afterArt ?? '')) {
          recordEdit({ entity: after, label: 'Artistic Appeal', path: 'whiteTagsNEW.ART.value', oldValue: beforeArt ?? '', newValue: afterArt ?? '' });
        }
        const beforeCom = before.whiteTagsNEW?.COM?.value;
        const afterCom = after.whiteTagsNEW?.COM?.value;
        if (String(beforeCom ?? '') !== String(afterCom ?? '')) {
          recordEdit({ entity: after, label: 'Commercial Appeal', path: 'whiteTagsNEW.COM.value', oldValue: beforeCom ?? '', newValue: afterCom ?? '' });
        }
      }
      detailStatus.textContent = 'Applied. Review table for changes.';
    }
    // Rerender active views
    render(); renderDirectors(); renderProducers(); renderWriters(); renderEditors(); renderComposers(); renderCinematographers(); renderAgents(); renderExecutives(); renderMovies(); renderStudio();
    // Close overlay after applying
    closeDetailEditor();
  });

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
      if (typeof t.value !== 'string') t.value = normalizeDecimalString(t.value) || "0.000";
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

  // Find first occurrence of a key in the save tree and return its value
  function findFirstValueByKey(root, targetKey) {
    if (!root || typeof root !== 'object') return undefined;
    const visited = new WeakSet();
    const queue = [root];
    let safety = 0;
    while (queue.length && safety++ < 300000) {
      const cur = queue.shift();
      if (!cur || typeof cur !== 'object') continue;
      if (visited.has(cur)) continue; visited.add(cur);
      if (!Array.isArray(cur) && Object.prototype.hasOwnProperty.call(cur, targetKey)) {
        return cur[targetKey];
      }
      for (const v of Array.isArray(cur) ? cur : Object.values(cur)) queue.push(v);
    }
    return undefined;
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
    const cn = actor && actor.customName && String(actor.customName).trim();
    if (cn) return cn;
    const f = getNameById(actor.firstNameId);
    const l = getNameById(actor.lastNameId);
    if (f || l) return `${f || ''}${f && l ? ' ' : ''}${l || ''}`.trim();
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

  function findStudioRoot(root) {
    if (!root || typeof root !== 'object') return null;
    const targetKeys = ['budget','cash','reputation','influence'];
    const visited = new WeakSet();
    const queue = [root];
    let best = null; let bestScore = -1; let safety = 0;
    while (queue.length && safety++ < 200000) {
      const cur = queue.shift();
      if (!cur || typeof cur !== 'object') continue;
      if (visited.has(cur)) continue;
      visited.add(cur);
      if (!Array.isArray(cur)) {
        let score = 0;
        for (const k of targetKeys) {
          if (Object.prototype.hasOwnProperty.call(cur, k)) score++;
        }
        if (score > bestScore) { best = cur; bestScore = score; if (score === targetKeys.length) break; }
      }
      for (const v of Array.isArray(cur) ? cur : Object.values(cur)) queue.push(v);
    }
    return bestScore > 0 ? best : null;
  }

  function isActorEntry(obj) {
    const prof = obj && obj.professions;
    return !!(prof && typeof prof === 'object' && ('Actor' in prof));
  }

  function isExecutiveEntry(obj) {
    const prof = obj && obj.professions;
    if (!prof || typeof prof !== 'object') return false;
    return Object.keys(prof).some(k => k.startsWith('Lieut') || k.startsWith('Cpt'));
  }

  function isRoleEntry(obj, role) {
    const prof = obj && obj.professions;
    return !!(prof && typeof prof === 'object' && (role in prof));
  }

  function getTagValue(actor, tagId) {
    const container = actor.whiteTagsNEW || actor.whiteTagsNew;
    const raw = container && container[tagId] && container[tagId].value;
    return normalizeDecimalString(raw || '0.000');
  }

  function ensureArtComDatalist() {
    let dl = document.getElementById('art-com-ticks');
    if (!dl) {
      dl = document.createElement('datalist');
      dl.id = 'art-com-ticks';
      for (const v of ART_COM_OPTIONS) {
        const opt = document.createElement('option');
        opt.value = v;
        dl.appendChild(opt);
      }
      document.body.appendChild(dl);
    }
    return dl;
  }

  function getTagValueRaw(actor, tagId) {
    const container = actor.whiteTagsNEW || actor.whiteTagsNew;
    const raw = container && container[tagId] && container[tagId].value;
    return normalizeDecimalString(raw || '0.000');
  }

  function getNumeric(value) {
    const n = Number(value);
    return isFinite(n) ? n : -Infinity;
  }

  // Shared helper for skill + limit slider cells
  function buildSkillLimitCells(entity, config) {
    const { readKeys, writeKeyCanonical, label } = config;
    const pickReadSkill = () => {
      const prof = entity.professions || {};
      for (const k of readKeys) {
        const v = prof[k];
        if (isFinite(Number(v))) return Number(v);
      }
      return 0;
    };
    const resolveWriteKey = () => {
      const prof = entity.professions || {};
      for (const k of readKeys) {
        if (k in prof) return k;
      }
      return writeKeyCanonical;
    };

    const writeKey = resolveWriteKey();

    // Skill cell
    const tdSkill = document.createElement('td');
    const skillWrap = document.createElement('div'); skillWrap.className = 'slider-cell';
    const skillRange = document.createElement('input'); skillRange.type = 'range'; skillRange.min = '0'; skillRange.max = '1'; skillRange.step = '0.01';
    const skillNum = pickReadSkill(); skillRange.value = String(skillNum);
    const skillVal = document.createElement('span'); skillVal.className = 'slider-val'; skillVal.textContent = formatUnitToTen(skillNum);

    // Limit cell
    const tdLimit = document.createElement('td');
    const limitWrap = document.createElement('div'); limitWrap.className = 'slider-cell';
    const limitRange = document.createElement('input'); limitRange.type = 'range'; limitRange.min = '0'; limitRange.max = '1'; limitRange.step = '0.01';
    const limitNum = isFinite(Number(entity.limit ?? entity.Limit)) ? Number(entity.limit ?? entity.Limit) : 0; limitRange.value = String(limitNum);
    const limitVal = document.createElement('span'); limitVal.className = 'slider-val'; limitVal.textContent = formatUnitToTen(limitNum);

    // Skill events
    skillRange.addEventListener('input', () => {
      if (!entity.professions || typeof entity.professions !== 'object') entity.professions = {};
      if (!('initial' in skillRange.dataset)) skillRange.dataset.initial = String(entity.professions?.[writeKey] ?? '');
      const norm = Number(skillRange.value).toFixed(3);
      entity.professions[writeKey] = norm;
      skillVal.textContent = formatUnitToTen(norm);
      // Auto raise limit
      const curLimit = isFinite(Number(entity.limit ?? entity.Limit)) ? Number(entity.limit ?? entity.Limit) : 0;
      if (Number(norm) > curLimit) {
        if (!('initial' in limitRange.dataset)) limitRange.dataset.initial = String(entity.limit ?? entity.Limit ?? '');
        if (!('autoLimitOld' in skillRange.dataset)) skillRange.dataset.autoLimitOld = String(entity.limit ?? entity.Limit ?? '');
        entity.limit = norm; entity.Limit = norm;
        limitRange.value = String(norm);
        limitVal.textContent = formatUnitToTen(norm);
        skillRange.dataset.autoLimitNew = norm;
      }
    });
    skillRange.addEventListener('change', () => {
      const finalVal = Number(skillRange.value).toFixed(3);
      const initialVal = skillRange.dataset.initial ?? String(finalVal);
      delete skillRange.dataset.initial;
      recordEdit({ entity, label, path: `professions.${writeKey}`, oldValue: initialVal, newValue: finalVal });
      if (skillRange.dataset.autoLimitOld && skillRange.dataset.autoLimitNew && skillRange.dataset.autoLimitOld !== skillRange.dataset.autoLimitNew) {
        recordEdit({ entity, label: 'Limit', path: 'limit', oldValue: skillRange.dataset.autoLimitOld, newValue: skillRange.dataset.autoLimitNew });
      }
      delete skillRange.dataset.autoLimitOld; delete skillRange.dataset.autoLimitNew;
    });
    skillRange.addEventListener('focus', () => markFocusedId(entity.id));
    skillWrap.appendChild(skillRange); skillWrap.appendChild(skillVal); tdSkill.appendChild(skillWrap);

    // Limit events
    limitRange.addEventListener('input', () => {
      const skillFloor = isFinite(Number(entity.professions?.[writeKey])) ? Number(entity.professions[writeKey]) : 0;
      if (!('initial' in limitRange.dataset)) limitRange.dataset.initial = String(entity.limit ?? entity.Limit ?? '');
      if (Number(limitRange.value) < skillFloor) limitRange.value = String(skillFloor);
      const norm = Number(limitRange.value).toFixed(3);
      entity.limit = norm; entity.Limit = norm;
      limitVal.textContent = formatUnitToTen(norm);
    });
    limitRange.addEventListener('change', () => {
      const finalVal = Number(limitRange.value).toFixed(3);
      const initialVal = limitRange.dataset.initial ?? String(finalVal);
      delete limitRange.dataset.initial;
      recordEdit({ entity, label: 'Limit', path: 'limit', oldValue: initialVal, newValue: finalVal });
    });
    limitRange.addEventListener('focus', () => markFocusedId(entity.id));
    limitWrap.appendChild(limitRange); limitWrap.appendChild(limitVal); tdLimit.appendChild(limitWrap);

    return { tdSkill, tdLimit };
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

  // Directors sorting state and helpers
  let directorsSortState = { key: 'skill', dir: 'desc' };
  function sortDirectorsList(list) {
    const dirMul = directorsSortState.dir === 'desc' ? -1 : 1;
    const key = directorsSortState.key;
    list.sort((a, b) => {
      if (key === 'name') {
        const an = fullNameFor(a).toLowerCase();
        const bn = fullNameFor(b).toLowerCase();
        return an.localeCompare(bn) * dirMul;
      }
      let av = 0, bv = 0;
      if (key === 'skill') {
        av = getNumeric(normalizeDecimalString(a.professions?.Director ?? ''));
        bv = getNumeric(normalizeDecimalString(b.professions?.Director ?? ''));
      } else if (key === 'age') {
        av = getNumeric(getAge(a));
        bv = getNumeric(getAge(b));
      } else if (key === 'limit') {
        av = getNumeric(normalizeDecimalString(a.limit ?? a.Limit ?? ''));
        bv = getNumeric(normalizeDecimalString(b.limit ?? b.Limit ?? ''));
      } else if (key === 'com') {
        av = getNumeric(getTagValueRaw(a, 'COM'));
        bv = getNumeric(getTagValueRaw(b, 'COM'));
      } else if (key === 'art') {
        av = getNumeric(getTagValueRaw(a, 'ART'));
        bv = getNumeric(getTagValueRaw(b, 'ART'));
      } else if (key === 'genres') {
        const ag = establishedGenres(a) || '';
        const bg = establishedGenres(b) || '';
        return String(ag).localeCompare(String(bg)) * dirMul;
      } else if (key === 'movies') {
        const ac = Array.isArray(a.movies?.Director) ? a.movies.Director.length : 0;
        const bc = Array.isArray(b.movies?.Director) ? b.movies.Director.length : 0;
        av = ac; bv = bc;
      }
      if (av === bv) return 0;
      return av < bv ? -1 * dirMul : 1 * dirMul;
    });
  }
  function updateDirectorsSortIndicators() {
    const ths = document.querySelectorAll('#directorsTable thead th');
    ths.forEach((th) => {
      th.classList.remove('sort-asc', 'sort-desc');
      const key = th.getAttribute('data-sort-key');
      if (!key) return;
      if (key === directorsSortState.key) th.classList.add(directorsSortState.dir === 'desc' ? 'sort-desc' : 'sort-asc');
    });
  }

  // Genres helper (simple): pick top N from whiteTagsNEW among known genre keys
  const KNOWN_GENRES = new Set(['ACTION','ADVENTURE','DRAMA','COMEDY','ROMANCE','DETECTIVE','HORROR','WESTERN','FANTASY','SCIFI','MUSICAL','WAR','CRIME','THRILLER']);
  function establishedGenres(entity, topN = 3) {
    const w = entity && (entity.whiteTagsNEW || entity.whiteTagsNew);
    if (!w || typeof w !== 'object') return '';
    const pairs = [];
    for (const [k, obj] of Object.entries(w)) {
      if (!KNOWN_GENRES.has(k)) continue;
      const v = Number(obj && obj.value);
      if (!isFinite(v) || v <= 0) continue;
      pairs.push([k, v]);
    }
    if (!pairs.length) return '';
    pairs.sort((a,b) => b[1]-a[1]);
    return pairs.slice(0, topN).map(p => p[0]).join(', ');
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

  // Generic helpers for role tabs
  function moviesCountForRole(obj, role) {
    if (!obj || !obj.movies) return 0;
    const m = obj.movies[role];
    if (Array.isArray(m)) return m.length;
    return 0;
  }

  function normalizeSkillForRole(obj, role) {
    const cur = obj.professions?.[role];
    return isFinite(Number(cur)) ? Number(cur) : 0;
  }

  // --- Movies extraction and helpers ---
  function extractMovies(root) {
    const visited = new WeakSet();
    const queue = [root];
    let safety=0;
    while (queue.length && safety++ < 200000) {
      const cur = queue.shift();
      if (!cur || typeof cur !== 'object') continue;
      if (visited.has(cur)) continue; visited.add(cur);
      if (Array.isArray(cur)) {
        if (cur.length && typeof cur[0] === 'object' && cur[0] && 'name' in cur[0] && 'stageResults' in cur[0]) return cur;
        for (const it of cur) queue.push(it);
        continue;
      }
      for (const v of Object.values(cur)) queue.push(v);
    }
    return [];
  }

  function parseYearFromDateTime(s) { if (typeof s !== 'string') return ''; const m = s.match(/^(\d{4})-/); return m ? m[1] : ''; }
  function computeMovieArtCom(m) {
    const sr = m && m.stageResults || {};
    const script = sr.Script || {};
    const baseline = Number(script.baseline || 0) || 0;
    let totalArt = 0, totalCom = 0;
    for (const key of ['Script','Preproduction','Production','Postproduction','Release']) {
      const s = sr[key] || {};
      const ra = (s.realArtValue != null ? s.realArtValue : s.artValue);
      const rc = (s.realCommercialValue != null ? s.realCommercialValue : s.commercialValue);
      const a = Number(ra || 0); const c = Number(rc || 0);
      if (isFinite(a)) totalArt += a; if (isFinite(c)) totalCom += c;
    }
    return { art: (baseline + totalArt), com: (baseline + totalCom) };
  }
  function getMovieTotalIncome(m) { const rel = m && m.stageResults && m.stageResults.Release || {}; const val = Number(rel.totalIncome || 0); return isFinite(val) ? val : 0; }
  function formatMoneyUSD(n) { if (!isFinite(n)) return ''; return `$${Math.round(n).toLocaleString()}`; }

  // Tabs
  function activateTab(name) {
    const valid = new Set(['studio','actors','directors','producers','writers','editors','movies','composers','cinematographers','agents','executives']);
    if (!valid.has(name)) name = 'actors';
    tabs.forEach(btn => {
      const match = btn.getAttribute('data-tab') === name;
      btn.classList.toggle('active', match);
      btn.setAttribute('aria-selected', match ? 'true' : 'false');
    });
    tabContents.forEach(sec => {
      const id = sec.id; // e.g., tab-actors
      const match = id === `tab-${name}`;
      sec.classList.toggle('active', match);
    });
    // reflect in URL hash for deep-linking and refresh persistence
    const targetHash = `#${name}`;
    if (location.hash !== targetHash) {
      try { history.replaceState(null, '', targetHash); } catch (_) { location.hash = targetHash; }
    }
    // When activating actors, ensure the table renders
    if (name === 'studio') renderStudio();
    if (name === 'actors') render();
    if (name === 'executives') renderExecutives();
    if (name === 'directors') renderDirectors();
    if (name === 'producers') renderProducers();
    if (name === 'writers') renderWriters();
    if (name === 'editors') renderEditors();
    if (name === 'composers') renderComposers();
    if (name === 'cinematographers') renderCinematographers();
    if (name === 'agents') renderAgents();
    if (name === 'movies') renderMovies();
  }

  function renderStudio() {
    if (!saveLoaded) return;
    if (studioControls) studioControls.hidden = false;
    // Prefill inputs
    const root = studioRoot || saveObj || {};
    if (studioBudgetInput) {
      const num = Number(root?.budget);
      studioBudgetInput.value = isFinite(num) ? String(num) : '';
      if (studioBudgetFmt) studioBudgetFmt.textContent = isFinite(num) ? `$${num.toLocaleString()}` : '';
    }
    if (studioCashInput) {
      const num = Number(root?.cash);
      studioCashInput.value = isFinite(num) ? String(num) : '';
      if (studioCashFmt) studioCashFmt.textContent = isFinite(num) ? `$${num.toLocaleString()}` : '';
    }
    if (studioReputationInput) {
      const num = Number(root?.reputation);
      studioReputationInput.value = isFinite(num) ? num.toFixed(3) : '';
      if (studioReputationFmt) {
        if (isFinite(num)) {
          const str = Number(num.toFixed(3)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 3 });
          studioReputationFmt.textContent = str;
        } else {
          studioReputationFmt.textContent = '';
        }
      }
    }
    if (studioInfluenceInput) {
      const num = Number(root?.influence);
      studioInfluenceInput.value = isFinite(num) ? String(num) : '';
      if (studioInfluenceFmt) studioInfluenceFmt.textContent = isFinite(num) ? num.toLocaleString() : '';
    }
    if (studioStatus) studioStatus.textContent = 'Edit studio-level values. Reputation saves as string with three decimals.';
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
      tr.setAttribute('data-id', String(actor.id ?? ''));
      tr.addEventListener('click', (e) => {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON')) return;
        openDetailEditor(actor);
      });
      tr.addEventListener('pointerdown', () => markFocusedId(actor.id));
      if (focusedEntityId != null && String(focusedEntityId) === String(actor.id)) tr.classList.add('row-focused');

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
        const prev = actor.birthDate;
        actor.birthDate = formatBirthDate(parts.day, parts.month, safeYear);
        recordEdit({ entity: actor, label: 'Age', path: 'birthDate', oldValue: prev, newValue: actor.birthDate });
        // no resort or re-render here
      });
      ageInput.addEventListener('focus', () => markFocusedId(actor.id));
      tdAge.appendChild(ageInput);
      tr.appendChild(tdAge);

      // Skill + Limit via shared helper
      const cells = buildSkillLimitCells(actor, { readKeys: ['Actor'], writeKeyCanonical: 'Actor', label: 'Acting Skill' });
      tr.appendChild(cells.tdSkill);
      tr.appendChild(cells.tdLimit);

      // ART (slider)
      const tdArt = document.createElement('td');
      const artWrap = document.createElement('div');
      artWrap.className = 'slider-cell';
      const artRange = document.createElement('input');
      artRange.type = 'range';
      artRange.min = '0'; artRange.max = '1'; artRange.step = '0.01';
      artRange.setAttribute('list', 'art-com-ticks');
      ensureArtComDatalist();
      const artTag = ensureTag(actor, 'ART');
      const artNum = isFinite(Number(artTag.value)) ? Number(artTag.value) : 0;
      artRange.value = String(artNum);
      const artVal = document.createElement('span');
      artVal.className = 'slider-val';
      artVal.textContent = formatUnitToTen(artNum);
      artRange.addEventListener('input', () => {
        const t = ensureTag(actor, 'ART');
        if (!('initial' in artRange.dataset)) artRange.dataset.initial = String(t.value ?? '');
        const norm = Number(artRange.value).toFixed(3);
        t.value = norm;
        artVal.textContent = formatUnitToTen(norm);
      });
      artRange.addEventListener('focus', () => markFocusedId(actor.id));
      artRange.addEventListener('change', () => {
        const t = ensureTag(actor, 'ART');
        const finalVal = Number(artRange.value).toFixed(3);
        const initialVal = artRange.dataset.initial ?? String(finalVal);
        delete artRange.dataset.initial;
        recordEdit({ entity: actor, label: 'Artistic Appeal', path: 'whiteTagsNEW.ART.value', oldValue: initialVal, newValue: finalVal });
      });
      artWrap.appendChild(artRange);
      artWrap.appendChild(artVal);
      tdArt.appendChild(artWrap);
      tr.appendChild(tdArt);

      // COM (slider)
      const tdCom = document.createElement('td');
      const comWrap = document.createElement('div');
      comWrap.className = 'slider-cell';
      const comRange = document.createElement('input');
      comRange.type = 'range';
      comRange.min = '0'; comRange.max = '1'; comRange.step = '0.01';
      comRange.setAttribute('list', 'art-com-ticks');
      ensureArtComDatalist();
      const comTag = ensureTag(actor, 'COM');
      const comNum = isFinite(Number(comTag.value)) ? Number(comTag.value) : 0;
      comRange.value = String(comNum);
      const comVal = document.createElement('span');
      comVal.className = 'slider-val';
      comVal.textContent = formatUnitToTen(comNum);
      comRange.addEventListener('input', () => {
        const t = ensureTag(actor, 'COM');
        if (!('initial' in comRange.dataset)) comRange.dataset.initial = String(t.value ?? '');
        const norm = Number(comRange.value).toFixed(3);
        t.value = norm;
        comVal.textContent = formatUnitToTen(norm);
      });
      comRange.addEventListener('focus', () => markFocusedId(actor.id));
      comRange.addEventListener('change', () => {
        const t = ensureTag(actor, 'COM');
        const finalVal = Number(comRange.value).toFixed(3);
        const initialVal = comRange.dataset.initial ?? String(finalVal);
        delete comRange.dataset.initial;
        recordEdit({ entity: actor, label: 'Commercial Appeal', path: 'whiteTagsNEW.COM.value', oldValue: initialVal, newValue: finalVal });
      });
      comWrap.appendChild(comRange);
      comWrap.appendChild(comVal);
      tdCom.appendChild(comWrap);
      tr.appendChild(tdCom);

      frag.appendChild(tr);
    });

    tbody.replaceChildren(frag);
  }

  function refreshAfterDataLoad() {
    if (!saveLoaded) return;
    // Derive characters/actors view
    studioRoot = findStudioRoot(saveObj) || saveObj;
    charactersArr = extractCharacters(saveObj);
    if (!Array.isArray(charactersArr)) {
      saveMeta.textContent = 'Error: Could not find characters array in save file.';
      return;
    }
    // Schema validation (non-blocking; shows warnings if any)
    const schemaCheck = validateSaveSchema(saveObj);
    if (schemaCheck && schemaCheck.warnings && schemaCheck.warnings.length) {
      const note = ` | Schema warnings: ${schemaCheck.warnings.slice(0, 3).join(' | ')}${schemaCheck.warnings.length > 3 ? ' …' : ''}`;
      saveMeta.textContent = (saveMeta.textContent || 'Loaded save') + note;
    }
    // compute game year if possible and reflect in UI
    const computed = computeGameYearFromData(saveObj);
    if (computed) {
      gameYear = computed;
    }
    const gy = gameYear ? String(gameYear) : '—';
    if (gameYearText) gameYearText.textContent = gy;
    if (gameYearText2) gameYearText2.textContent = gy;
    if (gameYearText3) gameYearText3.textContent = gy;
    if (gameYearText4) gameYearText4.textContent = gy;
    if (gameYearText5) gameYearText5.textContent = gy;
    if (gameYearText6) gameYearText6.textContent = gy;
    if (gameYearText7) gameYearText7.textContent = gy;
    if (gameYearText8) gameYearText8.textContent = gy;
    if (gameYearText9) gameYearText9.textContent = gy;
    actors = charactersArr.filter(isActorEntry);
    // derive other roles for placeholder tabs
    directors = charactersArr.filter(obj => isRoleEntry(obj, 'Director'));
    producers = charactersArr.filter(obj => isRoleEntry(obj, 'Producer'));
    // Game uses 'Scriptwriter' and 'FilmEditor' keys
    writers   = charactersArr.filter(obj => isRoleEntry(obj, 'Scriptwriter'));
    editors   = charactersArr.filter(obj => isRoleEntry(obj, 'FilmEditor'));
    composers = charactersArr.filter(obj => isRoleEntry(obj, 'Composer'));
    cinematographers = charactersArr.filter(obj => isRoleEntry(obj, 'Cinematographer'));
    agents = charactersArr.filter(obj => isRoleEntry(obj, 'Agent'));
    executives = charactersArr.filter(obj => isExecutiveEntry(obj));

    // Clear placeholder messages
    if (directorsPlaceholder) directorsPlaceholder.textContent = '';
    if (producersPlaceholder) producersPlaceholder.textContent = '';
    if (writersPlaceholder)   writersPlaceholder.textContent   = '';
    if (editorsPlaceholder)   editorsPlaceholder.textContent   = '';
    movies = extractMovies(saveObj);
    if (moviesPlaceholder)    moviesPlaceholder.textContent    = '';
    if (composersPlaceholder) composersPlaceholder.textContent = '';
    if (cinematographersPlaceholder) cinematographersPlaceholder.textContent = '';
    if (agentsPlaceholder) agentsPlaceholder.textContent = '';
    // initial default: acting skill, descending
    sortState = { key: 'skill', dir: 'desc' };
    updateSortIndicators();
    render();
    renderStudio();
    // Render role tabs if that tab is active
    const isStudioActive = Array.from(tabs).some(b => b.classList.contains('active') && b.getAttribute('data-tab') === 'studio');
    if (isStudioActive) renderStudio();
    const isDirectorsActive = Array.from(tabs).some(b => b.classList.contains('active') && b.getAttribute('data-tab') === 'directors');
    if (isDirectorsActive) renderDirectors();
    const isProducersActive = Array.from(tabs).some(b => b.classList.contains('active') && b.getAttribute('data-tab') === 'producers');
    if (isProducersActive) renderProducers();
    const isWritersActive = Array.from(tabs).some(b => b.classList.contains('active') && b.getAttribute('data-tab') === 'writers');
    if (isWritersActive) renderWriters();
    const isEditorsActive = Array.from(tabs).some(b => b.classList.contains('active') && b.getAttribute('data-tab') === 'editors');
    if (isEditorsActive) renderEditors();
    const isComposersActive = Array.from(tabs).some(b => b.classList.contains('active') && b.getAttribute('data-tab') === 'composers');
    if (isComposersActive) renderComposers();
    const isCinematographersActive = Array.from(tabs).some(b => b.classList.contains('active') && b.getAttribute('data-tab') === 'cinematographers');
    if (isCinematographersActive) renderCinematographers();
    const isAgentsActive = Array.from(tabs).some(b => b.classList.contains('active') && b.getAttribute('data-tab') === 'agents');
    if (isAgentsActive) renderAgents();
    const isMoviesActive = Array.from(tabs).some(b => b.classList.contains('active') && b.getAttribute('data-tab') === 'movies');
    if (isMoviesActive) renderMovies();
    const isExecutivesActive = Array.from(tabs).some(b => b.classList.contains('active') && b.getAttribute('data-tab') === 'executives');
    if (isExecutivesActive) renderExecutives();
    // Collapse loaders if both files are loaded
    if (loadersSection) {
      loadersSection.style.display = (saveLoaded && nameMapLoaded) ? 'none' : '';
    }
  }

  function renderDirectors() {
    if (!saveLoaded || !directorsTbody) return;
    if (directorsTableSection) directorsTableSection.hidden = false;
    if (directorsControls) directorsControls.hidden = false;

    // filter by search
    const q = (directorsSearchInput?.value || '').toLowerCase().trim();
    const filtered = q ? directors.filter(a => fullNameFor(a).toLowerCase().includes(q)) : directors.slice();

    // sort
    sortDirectorsList(filtered);
    updateDirectorsSortIndicators();

    if (directorsStatus) directorsStatus.textContent = `${filtered.length} of ${directors.length} directors shown` + (!nameMapLoaded ? ' — load name map to see full names' : '');

    const frag = document.createDocumentFragment();
    filtered.forEach((d) => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', String(d.id ?? ''));
      tr.addEventListener('pointerdown', () => markFocusedId(d.id));
      if (focusedEntityId != null && String(focusedEntityId) === String(d.id)) tr.classList.add('row-focused');

      // Name
      const tdName = document.createElement('td');
      tdName.textContent = fullNameFor(d);
      tr.appendChild(tdName);

      // Age (editable)
      const tdAge = document.createElement('td');
      const ageInput = document.createElement('input');
      ageInput.type = 'number'; ageInput.min = '0'; ageInput.max = '200';
      const currentAge = getAge(d);
      ageInput.value = currentAge === '' ? '' : String(currentAge);
      ageInput.placeholder = gameYear ? '—' : 'Set game year';
      ageInput.addEventListener('change', () => {
        if (!gameYear) return;
        const newAge = Number(ageInput.value);
        if (!isFinite(newAge) || newAge < 0 || newAge > 200) { ageInput.value = currentAge; return; }
        const parts = parseBirthDateParts(d.birthDate) || { day: 1, month: 1, year: 1 };
        const newYear = Math.floor(gameYear - Math.floor(newAge));
        const safeYear = Math.min(Math.max(newYear, 1850), 2100);
        const prev = d.birthDate;
        d.birthDate = formatBirthDate(parts.day, parts.month, safeYear);
        recordEdit({ entity: d, label: 'Age', path: 'birthDate', oldValue: prev, newValue: d.birthDate });
      });
      ageInput.addEventListener('focus', () => markFocusedId(d.id));
      tdAge.appendChild(ageInput);
      tr.appendChild(tdAge);

      // Director Skill (slider)
      const tdSkill = document.createElement('td');
      const skillWrap = document.createElement('div');
      skillWrap.className = 'slider-cell';
      const skillRange = document.createElement('input');
      skillRange.type = 'range';
      skillRange.min = '0'; skillRange.max = '1'; skillRange.step = '0.01';
      const currentSkill = d.professions?.Director;
      const skillNum = isFinite(Number(currentSkill)) ? Number(currentSkill) : 0;
      skillRange.value = String(skillNum);
      const skillVal = document.createElement('span');
      skillVal.className = 'slider-val';
      skillVal.textContent = formatUnitToTen(skillNum);
      skillRange.addEventListener('input', () => {
        if (!d.professions || typeof d.professions !== 'object') d.professions = {};
        if (!('initial' in skillRange.dataset)) skillRange.dataset.initial = String(d.professions.Director ?? '');
        const norm = Number(skillRange.value).toFixed(3);
        d.professions.Director = norm;
        skillVal.textContent = formatUnitToTen(norm);
        // Auto-raise limit if skill exceeds current limit
        const currentLimitNum = isFinite(Number(d.limit ?? d.Limit)) ? Number(d.limit ?? d.Limit) : 0;
        if (Number(norm) > currentLimitNum) {
          if (!('initial' in limitRange.dataset)) limitRange.dataset.initial = String(d.limit ?? d.Limit ?? '');
          if (!('autoLimitOld' in skillRange.dataset)) skillRange.dataset.autoLimitOld = String(d.limit ?? d.Limit ?? '');
          d.limit = norm; d.Limit = norm;
          limitRange.value = String(norm);
          limitVal.textContent = formatUnitToTen(norm);
          skillRange.dataset.autoLimitNew = norm;
        }
      });
      skillRange.addEventListener('focus', () => markFocusedId(d.id));
      skillRange.addEventListener('change', () => {
        const finalVal = Number(skillRange.value).toFixed(3);
        const initialVal = skillRange.dataset.initial ?? String(finalVal);
        delete skillRange.dataset.initial;
        recordEdit({ entity: d, label: 'Director Skill', path: 'professions.Director', oldValue: initialVal, newValue: finalVal });
        if (skillRange.dataset.autoLimitOld && skillRange.dataset.autoLimitNew && skillRange.dataset.autoLimitOld !== skillRange.dataset.autoLimitNew) {
          recordEdit({ entity: d, label: 'Limit', path: 'limit', oldValue: skillRange.dataset.autoLimitOld, newValue: skillRange.dataset.autoLimitNew });
        }
        delete skillRange.dataset.autoLimitOld;
        delete skillRange.dataset.autoLimitNew;
      });
      // no change-triggered re-render
      skillWrap.appendChild(skillRange);
      skillWrap.appendChild(skillVal);
      tdSkill.appendChild(skillWrap);
      tr.appendChild(tdSkill);

      // Limit (slider) - writes to both keys
      const tdLimit = document.createElement('td');
      const limitWrap = document.createElement('div');
      limitWrap.className = 'slider-cell';
      const limitRange = document.createElement('input');
      limitRange.type = 'range';
      limitRange.min = '0'; limitRange.max = '1'; limitRange.step = '0.01';
      const currentLimit = d.limit ?? d.Limit;
      const limitNum = isFinite(Number(currentLimit)) ? Number(currentLimit) : 0;
      limitRange.value = String(limitNum);
      const limitVal = document.createElement('span');
      limitVal.className = 'slider-val';
      limitVal.textContent = formatUnitToTen(limitNum);
      limitRange.addEventListener('input', () => {
        const skillFloor = isFinite(Number(d.professions?.Director)) ? Number(d.professions.Director) : 0;
        if (!('initial' in limitRange.dataset)) limitRange.dataset.initial = String(d.limit ?? d.Limit ?? '');
        if (Number(limitRange.value) < skillFloor) limitRange.value = String(skillFloor);
        const norm = Number(limitRange.value).toFixed(3);
        d.limit = norm;
        d.Limit = norm;
        limitVal.textContent = formatUnitToTen(norm);
      });
      limitRange.addEventListener('focus', () => markFocusedId(d.id));
      limitRange.addEventListener('change', () => {
        const finalVal = Number(limitRange.value).toFixed(3);
        const initialVal = limitRange.dataset.initial ?? String(finalVal);
        delete limitRange.dataset.initial;
        recordEdit({ entity: d, label: 'Limit', path: 'limit', oldValue: initialVal, newValue: finalVal });
      });
      // no change-triggered re-render
      limitWrap.appendChild(limitRange);
      limitWrap.appendChild(limitVal);
      tdLimit.appendChild(limitWrap);
      tr.appendChild(tdLimit);

      // COM (show only if non-zero)
      const tdCom = document.createElement('td');
      const comVal = getTagValueRaw(d, 'COM');
      const comNum = Number(comVal);
      tdCom.textContent = isFinite(comNum) && comNum > 0 ? comVal : '';
      tr.appendChild(tdCom);

      // ART (show only if non-zero)
      const tdArt = document.createElement('td');
      const artVal = getTagValueRaw(d, 'ART');
      const artNum = Number(artVal);
      tdArt.textContent = isFinite(artNum) && artNum > 0 ? artVal : '';
      tr.appendChild(tdArt);

      // Genres (derived from whiteTagsNEW, top few)
      const tdGenres = document.createElement('td');
      tdGenres.textContent = establishedGenres(d);
      tr.appendChild(tdGenres);

      // Movies count
      const tdMovies = document.createElement('td');
      const dirMovies = d.movies && Array.isArray(d.movies.Director) ? d.movies.Director : (d.movies && typeof d.movies.Director === 'object' && 'length' in d.movies.Director ? d.movies.Director : []);
      let count = 0;
      if (d.movies && d.movies.Director) {
        if (Array.isArray(d.movies.Director)) count = d.movies.Director.length;
        else if (d.movies.Director && typeof d.movies.Director === 'object' && Array.isArray(d.movies.Director)) count = d.movies.Director.length;
      }
      tdMovies.textContent = String(count);
      tr.appendChild(tdMovies);

      frag.appendChild(tr);
    });

    directorsTbody.replaceChildren(frag);
  }

  // --- Producers tab ---
  let producersSortState = { key: 'skill', dir: 'desc' };
  function sortProducersList(list) {
    const dirMul = producersSortState.dir === 'desc' ? -1 : 1;
    const key = producersSortState.key;
    list.sort((a, b) => {
      if (key === 'name') {
        const an = fullNameFor(a).toLowerCase();
        const bn = fullNameFor(b).toLowerCase();
        return an.localeCompare(bn) * dirMul;
      }
      let av = 0, bv = 0;
      if (key === 'skill') {
        av = getNumeric(normalizeDecimalString(a.professions?.Producer ?? ''));
        bv = getNumeric(normalizeDecimalString(b.professions?.Producer ?? ''));
      } else if (key === 'age') {
        av = getNumeric(getAge(a));
        bv = getNumeric(getAge(b));
      } else if (key === 'limit') {
        av = getNumeric(normalizeDecimalString(a.limit ?? a.Limit ?? ''));
        bv = getNumeric(normalizeDecimalString(b.limit ?? b.Limit ?? ''));
      } else if (key === 'genres') {
        // compare by joined genres string
        av = establishedGenres(a) || '';
        bv = establishedGenres(b) || '';
        return String(av).localeCompare(String(bv)) * dirMul;
      } else if (key === 'movies') {
        av = moviesCountForRole(a, 'Producer');
        bv = moviesCountForRole(b, 'Producer');
      }
      if (av === bv) return 0;
      return av < bv ? -1 * dirMul : 1 * dirMul;
    });
  }
  function updateProducersSortIndicators() {
    const ths = document.querySelectorAll('#producersTable thead th');
    ths.forEach((th) => {
      th.classList.remove('sort-asc', 'sort-desc');
      const key = th.getAttribute('data-sort-key');
      if (!key) return;
      if (key === producersSortState.key) th.classList.add(producersSortState.dir === 'desc' ? 'sort-desc' : 'sort-asc');
    });
  }
  function renderProducers() {
    if (!saveLoaded || !producersTbody) return;
    if (producersTableSection) producersTableSection.hidden = false;
    if (producersControls) producersControls.hidden = false;

    const q = (producersSearchInput?.value || '').toLowerCase().trim();
    const filtered = q ? producers.filter(a => fullNameFor(a).toLowerCase().includes(q)) : producers.slice();
    sortProducersList(filtered);
    updateProducersSortIndicators();
    if (producersStatus) producersStatus.textContent = `${filtered.length} of ${producers.length} producers shown` + (!nameMapLoaded ? ' — load name map to see full names' : '');

    const frag = document.createDocumentFragment();
    filtered.forEach((p) => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', String(p.id ?? ''));
      tr.addEventListener('click', (e) => {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON')) return;
        openDetailEditor(p);
      });
      tr.addEventListener('pointerdown', () => markFocusedId(p.id));
      if (focusedEntityId != null && String(focusedEntityId) === String(p.id)) tr.classList.add('row-focused');
      const tdName = document.createElement('td');
      tdName.textContent = fullNameFor(p); tr.appendChild(tdName);
      const tdAge = document.createElement('td');
      const ageInputP = document.createElement('input'); ageInputP.type='number'; ageInputP.min='0'; ageInputP.max='200';
      const currentAgeP = getAge(p); ageInputP.value = currentAgeP === '' ? '' : String(currentAgeP); ageInputP.placeholder = gameYear ? '—' : 'Set game year';
      ageInputP.addEventListener('change', () => {
        if (!gameYear) return; const newAge = Number(ageInputP.value);
        if (!isFinite(newAge) || newAge < 0 || newAge > 200) { ageInputP.value = currentAgeP; return; }
        const parts = parseBirthDateParts(p.birthDate) || { day: 1, month: 1, year: 1 };
        const newYear = Math.floor(gameYear - Math.floor(newAge));
        const safeYear = Math.min(Math.max(newYear, 1850), 2100);
        const prev = p.birthDate; p.birthDate = formatBirthDate(parts.day, parts.month, safeYear);
        recordEdit({ entity: p, label: 'Age', path: 'birthDate', oldValue: prev, newValue: p.birthDate });
      });
      ageInputP.addEventListener('focus', () => markFocusedId(p.id));
      tdAge.appendChild(ageInputP); tr.appendChild(tdAge);
      // Skill slider
      const tdSkill = document.createElement('td');
      const skillWrap = document.createElement('div'); skillWrap.className = 'slider-cell';
      const skillRange = document.createElement('input'); skillRange.type = 'range'; skillRange.min = '0'; skillRange.max = '1'; skillRange.step = '0.01';
      const skillNum = normalizeSkillForRole(p, 'Producer'); skillRange.value = String(skillNum);
      const skillVal = document.createElement('span'); skillVal.className = 'slider-val'; skillVal.textContent = formatUnitToTen(skillNum);
      skillRange.addEventListener('input', () => {
        if (!p.professions || typeof p.professions !== 'object') p.professions = {};
        if (!('initial' in skillRange.dataset)) skillRange.dataset.initial = String(p.professions.Producer ?? '');
        const norm = Number(skillRange.value).toFixed(3);
        p.professions.Producer = norm;
        skillVal.textContent = formatUnitToTen(norm);
        // Auto-raise limit if skill exceeds current limit
        const currentLimitNum = isFinite(Number(p.limit ?? p.Limit)) ? Number(p.limit ?? p.Limit) : 0;
        if (Number(norm) > currentLimitNum) {
          if (!('initial' in limitRange.dataset)) limitRange.dataset.initial = String(p.limit ?? p.Limit ?? '');
          if (!('autoLimitOld' in skillRange.dataset)) skillRange.dataset.autoLimitOld = String(p.limit ?? p.Limit ?? '');
          p.limit = norm; p.Limit = norm;
          limitRange.value = String(norm);
          limitVal.textContent = formatUnitToTen(norm);
          skillRange.dataset.autoLimitNew = norm;
        }
      });
      skillRange.addEventListener('focus', () => markFocusedId(p.id));
      skillRange.addEventListener('change', () => {
        const finalVal = Number(skillRange.value).toFixed(3);
        const initialVal = skillRange.dataset.initial ?? String(finalVal);
        delete skillRange.dataset.initial;
        recordEdit({ entity: p, label: 'Producer Skill', path: 'professions.Producer', oldValue: initialVal, newValue: finalVal });
        if (skillRange.dataset.autoLimitOld && skillRange.dataset.autoLimitNew && skillRange.dataset.autoLimitOld !== skillRange.dataset.autoLimitNew) {
          recordEdit({ entity: p, label: 'Limit', path: 'limit', oldValue: skillRange.dataset.autoLimitOld, newValue: skillRange.dataset.autoLimitNew });
        }
        delete skillRange.dataset.autoLimitOld;
        delete skillRange.dataset.autoLimitNew;
      });
      // no change-triggered re-render
      skillWrap.appendChild(skillRange); skillWrap.appendChild(skillVal); tdSkill.appendChild(skillWrap); tr.appendChild(tdSkill);
      // Limit slider
      const tdLimit = document.createElement('td');
      const limitWrap = document.createElement('div'); limitWrap.className = 'slider-cell';
      const limitRange = document.createElement('input'); limitRange.type = 'range'; limitRange.min = '0'; limitRange.max = '1'; limitRange.step = '0.01';
      const limitNum = isFinite(Number(p.limit ?? p.Limit)) ? Number(p.limit ?? p.Limit) : 0; limitRange.value = String(limitNum);
      const limitVal = document.createElement('span'); limitVal.className = 'slider-val'; limitVal.textContent = formatUnitToTen(limitNum);
      limitRange.addEventListener('input', () => { const skillFloor = isFinite(Number(p.professions?.Producer)) ? Number(p.professions.Producer) : 0; if (!('initial' in limitRange.dataset)) limitRange.dataset.initial = String(p.limit ?? p.Limit ?? ''); if (Number(limitRange.value) < skillFloor) limitRange.value = String(skillFloor); const norm = Number(limitRange.value).toFixed(3); p.limit = norm; p.Limit = norm; limitVal.textContent = formatUnitToTen(norm); });
      limitRange.addEventListener('focus', () => markFocusedId(p.id));
      limitRange.addEventListener('change', () => { const finalVal = Number(limitRange.value).toFixed(3); const initialVal = limitRange.dataset.initial ?? String(finalVal); delete limitRange.dataset.initial; recordEdit({ entity: p, label: 'Limit', path: 'limit', oldValue: initialVal, newValue: finalVal }); });
      // no change-triggered re-render
      limitWrap.appendChild(limitRange); limitWrap.appendChild(limitVal); tdLimit.appendChild(limitWrap); tr.appendChild(tdLimit);
      // Genres
      const tdGenres = document.createElement('td'); tdGenres.textContent = establishedGenres(p); tr.appendChild(tdGenres);
      // Movies count
      const tdMovies = document.createElement('td'); tdMovies.textContent = String(moviesCountForRole(p, 'Producer')); tr.appendChild(tdMovies);
      frag.appendChild(tr);
    });
    producersTbody.replaceChildren(frag);
  }

  // --- Writers tab ---
  let writersSortState = { key: 'skill', dir: 'desc' };
  function sortWritersList(list) {
    const dirMul = writersSortState.dir === 'desc' ? -1 : 1;
    const key = writersSortState.key;
    list.sort((a, b) => {
      if (key === 'name') {
        const an = fullNameFor(a).toLowerCase();
        const bn = fullNameFor(b).toLowerCase();
        return an.localeCompare(bn) * dirMul;
      }
      let av = 0, bv = 0;
      if (key === 'skill') {
        av = getNumeric(normalizeDecimalString(a.professions?.Scriptwriter ?? ''));
        bv = getNumeric(normalizeDecimalString(b.professions?.Scriptwriter ?? ''));
      } else if (key === 'age') {
        av = getNumeric(getAge(a));
        bv = getNumeric(getAge(b));
      } else if (key === 'limit') {
        av = getNumeric(normalizeDecimalString(a.limit ?? a.Limit ?? ''));
        bv = getNumeric(normalizeDecimalString(b.limit ?? b.Limit ?? ''));
      } else if (key === 'movies') {
        av = moviesCountForRole(a, 'Scriptwriter');
        bv = moviesCountForRole(b, 'Scriptwriter');
      }
      if (av === bv) return 0;
      return av < bv ? -1 * dirMul : 1 * dirMul;
    });
  }
  function updateWritersSortIndicators() {
    const ths = document.querySelectorAll('#writersTable thead th');
    ths.forEach((th) => {
      th.classList.remove('sort-asc', 'sort-desc');
      const key = th.getAttribute('data-sort-key');
      if (!key) return;
      if (key === writersSortState.key) th.classList.add(writersSortState.dir === 'desc' ? 'sort-desc' : 'sort-asc');
    });
  }
  function renderWriters() {
    if (!saveLoaded || !writersTbody) return;
    if (writersTableSection) writersTableSection.hidden = false;
    if (writersControls) writersControls.hidden = false;

    const q = (writersSearchInput?.value || '').toLowerCase().trim();
    const filtered = q ? writers.filter(a => fullNameFor(a).toLowerCase().includes(q)) : writers.slice();
    sortWritersList(filtered);
    updateWritersSortIndicators();
    if (writersStatus) writersStatus.textContent = `${filtered.length} of ${writers.length} writers shown` + (!nameMapLoaded ? ' — load name map to see full names' : '');

    const frag = document.createDocumentFragment();
    filtered.forEach((w) => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', String(w.id ?? ''));
      tr.addEventListener('click', (e) => {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON')) return;
        openDetailEditor(w);
      });
      tr.addEventListener('pointerdown', () => markFocusedId(w.id));
      if (focusedEntityId != null && String(focusedEntityId) === String(w.id)) tr.classList.add('row-focused');
      const tdName = document.createElement('td'); tdName.textContent = fullNameFor(w); tr.appendChild(tdName);
      const tdAgeW = document.createElement('td');
      const ageInputW = document.createElement('input'); ageInputW.type='number'; ageInputW.min='0'; ageInputW.max='200';
      const currentAgeW = getAge(w); ageInputW.value = currentAgeW === '' ? '' : String(currentAgeW); ageInputW.placeholder = gameYear ? '—' : 'Set game year';
      ageInputW.addEventListener('change', () => {
        if (!gameYear) return; const newAge = Number(ageInputW.value);
        if (!isFinite(newAge) || newAge < 0 || newAge > 200) { ageInputW.value = currentAgeW; return; }
        const parts = parseBirthDateParts(w.birthDate) || { day: 1, month: 1, year: 1 };
        const newYear = Math.floor(gameYear - Math.floor(newAge));
        const safeYear = Math.min(Math.max(newYear, 1850), 2100);
        const prev = w.birthDate; w.birthDate = formatBirthDate(parts.day, parts.month, safeYear);
        recordEdit({ entity: w, label: 'Age', path: 'birthDate', oldValue: prev, newValue: w.birthDate });
      });
      ageInputW.addEventListener('focus', () => markFocusedId(w.id));
      tdAgeW.appendChild(ageInputW); tr.appendChild(tdAgeW);
      // Skill slider
      const tdSkill = document.createElement('td'); const skillWrap = document.createElement('div'); skillWrap.className = 'slider-cell';
      const skillRange = document.createElement('input'); skillRange.type = 'range'; skillRange.min = '0'; skillRange.max = '1'; skillRange.step = '0.01';
      const skillNum = normalizeSkillForRole(w, 'Scriptwriter'); skillRange.value = String(skillNum);
      const skillVal = document.createElement('span'); skillVal.className = 'slider-val'; skillVal.textContent = formatUnitToTen(skillNum);
      skillRange.addEventListener('input', () => {
        if (!w.professions || typeof w.professions !== 'object') w.professions = {};
        if (!('initial' in skillRange.dataset)) skillRange.dataset.initial = String(w.professions.Scriptwriter ?? w.professions.Writer ?? '');
        const norm = Number(skillRange.value).toFixed(3);
        w.professions.Scriptwriter = norm;
        skillVal.textContent = formatUnitToTen(norm);
        // Auto-raise limit if skill exceeds current limit
        const currentLimitNum = isFinite(Number(w.limit ?? w.Limit)) ? Number(w.limit ?? w.Limit) : 0;
        if (Number(norm) > currentLimitNum) {
          if (!('initial' in limitRange.dataset)) limitRange.dataset.initial = String(w.limit ?? w.Limit ?? '');
          if (!('autoLimitOld' in skillRange.dataset)) skillRange.dataset.autoLimitOld = String(w.limit ?? w.Limit ?? '');
          w.limit = norm; w.Limit = norm;
          limitRange.value = String(norm);
          limitVal.textContent = formatUnitToTen(norm);
          skillRange.dataset.autoLimitNew = norm;
        }
      });
      skillRange.addEventListener('focus', () => markFocusedId(w.id));
      skillRange.addEventListener('change', () => {
        const finalVal = Number(skillRange.value).toFixed(3);
        const initialVal = skillRange.dataset.initial ?? String(finalVal);
        delete skillRange.dataset.initial;
        recordEdit({ entity: w, label: 'Writer Skill', path: 'professions.Scriptwriter', oldValue: initialVal, newValue: finalVal });
        if (skillRange.dataset.autoLimitOld && skillRange.dataset.autoLimitNew && skillRange.dataset.autoLimitOld !== skillRange.dataset.autoLimitNew) {
          recordEdit({ entity: w, label: 'Limit', path: 'limit', oldValue: skillRange.dataset.autoLimitOld, newValue: skillRange.dataset.autoLimitNew });
        }
        delete skillRange.dataset.autoLimitOld;
        delete skillRange.dataset.autoLimitNew;
      });
      // no change-triggered re-render
      skillWrap.appendChild(skillRange); skillWrap.appendChild(skillVal); tdSkill.appendChild(skillWrap); tr.appendChild(tdSkill);
      // Limit slider
      const tdLimit = document.createElement('td'); const limitWrap = document.createElement('div'); limitWrap.className = 'slider-cell';
      const limitRange = document.createElement('input'); limitRange.type = 'range'; limitRange.min = '0'; limitRange.max = '1'; limitRange.step = '0.01';
      const limitNum = isFinite(Number(w.limit ?? w.Limit)) ? Number(w.limit ?? w.Limit) : 0; limitRange.value = String(limitNum);
      const limitVal = document.createElement('span'); limitVal.className = 'slider-val'; limitVal.textContent = formatUnitToTen(limitNum);
      limitRange.addEventListener('input', () => { const skillFloor = isFinite(Number(w.professions?.Scriptwriter ?? w.professions?.Writer)) ? Number(w.professions.Scriptwriter ?? w.professions.Writer) : 0; if (!('initial' in limitRange.dataset)) limitRange.dataset.initial = String(w.limit ?? w.Limit ?? ''); if (Number(limitRange.value) < skillFloor) limitRange.value = String(skillFloor); const norm = Number(limitRange.value).toFixed(3); w.limit = norm; w.Limit = norm; limitVal.textContent = formatUnitToTen(norm); });
      limitRange.addEventListener('focus', () => markFocusedId(w.id));
      limitRange.addEventListener('change', () => { const finalVal = Number(limitRange.value).toFixed(3); const initialVal = limitRange.dataset.initial ?? String(finalVal); delete limitRange.dataset.initial; recordEdit({ entity: w, label: 'Limit', path: 'limit', oldValue: initialVal, newValue: finalVal }); });
      // no change-triggered re-render
      limitWrap.appendChild(limitRange); limitWrap.appendChild(limitVal); tdLimit.appendChild(limitWrap); tr.appendChild(tdLimit);
      const tdMovies = document.createElement('td'); tdMovies.textContent = String(moviesCountForRole(w, 'Scriptwriter')); tr.appendChild(tdMovies);
      frag.appendChild(tr);
    });
    writersTbody.replaceChildren(frag);
  }

  // --- Editors tab ---
  let editorsSortState = { key: 'skill', dir: 'desc' };
  function sortEditorsList(list) {
    const dirMul = editorsSortState.dir === 'desc' ? -1 : 1;
    const key = editorsSortState.key;
    list.sort((a, b) => {
      if (key === 'name') {
        const an = fullNameFor(a).toLowerCase();
        const bn = fullNameFor(b).toLowerCase();
        return an.localeCompare(bn) * dirMul;
      }
      let av = 0, bv = 0;
      if (key === 'skill') {
        av = getNumeric(normalizeDecimalString(a.professions?.FilmEditor ?? ''));
        bv = getNumeric(normalizeDecimalString(b.professions?.FilmEditor ?? ''));
      } else if (key === 'age') {
        av = getNumeric(getAge(a));
        bv = getNumeric(getAge(b));
      } else if (key === 'limit') {
        av = getNumeric(normalizeDecimalString(a.limit ?? a.Limit ?? ''));
        bv = getNumeric(normalizeDecimalString(b.limit ?? b.Limit ?? ''));
      } else if (key === 'movies') {
        av = moviesCountForRole(a, 'FilmEditor');
        bv = moviesCountForRole(b, 'FilmEditor');
      }
      if (av === bv) return 0;
      return av < bv ? -1 * dirMul : 1 * dirMul;
    });
  }
  function updateEditorsSortIndicators() {
    const ths = document.querySelectorAll('#editorsTable thead th');
    ths.forEach((th) => {
      th.classList.remove('sort-asc', 'sort-desc');
      const key = th.getAttribute('data-sort-key');
      if (!key) return;
      if (key === editorsSortState.key) th.classList.add(editorsSortState.dir === 'desc' ? 'sort-desc' : 'sort-asc');
    });
  }
  function renderEditors() {
    if (!saveLoaded || !editorsTbody) return;
    if (editorsTableSection) editorsTableSection.hidden = false;
    if (editorsControls) editorsControls.hidden = false;

    const q = (editorsSearchInput?.value || '').toLowerCase().trim();
    const filtered = q ? editors.filter(a => fullNameFor(a).toLowerCase().includes(q)) : editors.slice();
    sortEditorsList(filtered);
    updateEditorsSortIndicators();
    if (editorsStatus) editorsStatus.textContent = `${filtered.length} of ${editors.length} editors shown` + (!nameMapLoaded ? ' — load name map to see full names' : '');

    const frag = document.createDocumentFragment();
    filtered.forEach((ed) => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', String(ed.id ?? ''));
      tr.addEventListener('click', (e) => {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON')) return;
        openDetailEditor(ed);
      });
      tr.addEventListener('pointerdown', () => markFocusedId(ed.id));
      if (focusedEntityId != null && String(focusedEntityId) === String(ed.id)) tr.classList.add('row-focused');
      const tdName = document.createElement('td'); tdName.textContent = fullNameFor(ed); tr.appendChild(tdName);
      const tdAgeE = document.createElement('td');
      const ageInputE = document.createElement('input'); ageInputE.type='number'; ageInputE.min='0'; ageInputE.max='200';
      const currentAgeE = getAge(ed); ageInputE.value = currentAgeE === '' ? '' : String(currentAgeE); ageInputE.placeholder = gameYear ? '—' : 'Set game year';
      ageInputE.addEventListener('change', () => {
        if (!gameYear) return; const newAge = Number(ageInputE.value);
        if (!isFinite(newAge) || newAge < 0 || newAge > 200) { ageInputE.value = currentAgeE; return; }
        const parts = parseBirthDateParts(ed.birthDate) || { day: 1, month: 1, year: 1 };
        const newYear = Math.floor(gameYear - Math.floor(newAge));
        const safeYear = Math.min(Math.max(newYear, 1850), 2100);
        const prev = ed.birthDate; ed.birthDate = formatBirthDate(parts.day, parts.month, safeYear);
        recordEdit({ entity: ed, label: 'Age', path: 'birthDate', oldValue: prev, newValue: ed.birthDate });
      });
      ageInputE.addEventListener('focus', () => markFocusedId(ed.id));
      tdAgeE.appendChild(ageInputE); tr.appendChild(tdAgeE);
      // Skill slider
      const tdSkill = document.createElement('td'); const skillWrap = document.createElement('div'); skillWrap.className = 'slider-cell';
      const skillRange = document.createElement('input'); skillRange.type = 'range'; skillRange.min = '0'; skillRange.max = '1'; skillRange.step = '0.01';
      const skillNum = normalizeSkillForRole(ed, 'FilmEditor'); skillRange.value = String(skillNum);
      const skillVal = document.createElement('span'); skillVal.className = 'slider-val'; skillVal.textContent = formatUnitToTen(skillNum);
      skillRange.addEventListener('input', () => {
        if (!ed.professions || typeof ed.professions !== 'object') ed.professions = {};
        if (!('initial' in skillRange.dataset)) skillRange.dataset.initial = String(ed.professions.FilmEditor ?? ed.professions.Editor ?? '');
        const norm = Number(skillRange.value).toFixed(3);
        ed.professions.FilmEditor = norm;
        skillVal.textContent = formatUnitToTen(norm);
        // Auto-raise limit if skill exceeds current limit
        const currentLimitNum = isFinite(Number(ed.limit ?? ed.Limit)) ? Number(ed.limit ?? ed.Limit) : 0;
        if (Number(norm) > currentLimitNum) {
          if (!('initial' in limitRange.dataset)) limitRange.dataset.initial = String(ed.limit ?? ed.Limit ?? '');
          if (!('autoLimitOld' in skillRange.dataset)) skillRange.dataset.autoLimitOld = String(ed.limit ?? ed.Limit ?? '');
          ed.limit = norm; ed.Limit = norm;
          limitRange.value = String(norm);
          limitVal.textContent = formatUnitToTen(norm);
          skillRange.dataset.autoLimitNew = norm;
        }
      });
      skillRange.addEventListener('change', () => {
        const finalVal = Number(skillRange.value).toFixed(3);
        const initialVal = skillRange.dataset.initial ?? String(finalVal);
        delete skillRange.dataset.initial;
        recordEdit({ entity: ed, label: 'Editor Skill', path: 'professions.FilmEditor', oldValue: initialVal, newValue: finalVal });
        if (skillRange.dataset.autoLimitOld && skillRange.dataset.autoLimitNew && skillRange.dataset.autoLimitOld !== skillRange.dataset.autoLimitNew) {
          recordEdit({ entity: ed, label: 'Limit', path: 'limit', oldValue: skillRange.dataset.autoLimitOld, newValue: skillRange.dataset.autoLimitNew });
        }
        delete skillRange.dataset.autoLimitOld;
        delete skillRange.dataset.autoLimitNew;
      });
      // no change-triggered re-render
      skillWrap.appendChild(skillRange); skillWrap.appendChild(skillVal); tdSkill.appendChild(skillWrap); tr.appendChild(tdSkill);
      // Limit slider
      const tdLimit = document.createElement('td'); const limitWrap = document.createElement('div'); limitWrap.className = 'slider-cell';
      const limitRange = document.createElement('input'); limitRange.type = 'range'; limitRange.min = '0'; limitRange.max = '1'; limitRange.step = '0.01';
      const limitNum = isFinite(Number(ed.limit ?? ed.Limit)) ? Number(ed.limit ?? ed.Limit) : 0; limitRange.value = String(limitNum);
      const limitVal = document.createElement('span'); limitVal.className = 'slider-val'; limitVal.textContent = formatUnitToTen(limitNum);
      limitRange.addEventListener('input', () => { const skillFloor = isFinite(Number(ed.professions?.FilmEditor ?? ed.professions?.Editor)) ? Number(ed.professions.FilmEditor ?? ed.professions.Editor) : 0; if (!('initial' in limitRange.dataset)) limitRange.dataset.initial = String(ed.limit ?? ed.Limit ?? ''); if (Number(limitRange.value) < skillFloor) limitRange.value = String(skillFloor); const norm = Number(limitRange.value).toFixed(3); ed.limit = norm; ed.Limit = norm; limitVal.textContent = formatUnitToTen(norm); });
      limitRange.addEventListener('change', () => { const finalVal = Number(limitRange.value).toFixed(3); const initialVal = limitRange.dataset.initial ?? String(finalVal); delete limitRange.dataset.initial; recordEdit({ entity: ed, label: 'Limit', path: 'limit', oldValue: initialVal, newValue: finalVal }); });
      // no change-triggered re-render
      limitWrap.appendChild(limitRange); limitWrap.appendChild(limitVal); tdLimit.appendChild(limitWrap); tr.appendChild(tdLimit);
      const tdMovies = document.createElement('td'); tdMovies.textContent = String(moviesCountForRole(ed, 'FilmEditor')); tr.appendChild(tdMovies);
      frag.appendChild(tr);
    });
    editorsTbody.replaceChildren(frag);
  }
  // --- Movies tab ---
  let moviesSortState = { key: 'title', dir: 'asc' };
  function sortMoviesList(list) {
    const dirMul = moviesSortState.dir === 'desc' ? -1 : 1;
    const key = moviesSortState.key;
    list.sort((a, b) => {
      if (key === 'title') {
        const at = String(a.name || '').toLowerCase();
        const bt = String(b.name || '').toLowerCase();
        return at.localeCompare(bt) * dirMul;
      } else if (key === 'year') {
        const ay = parseInt(parseYearFromDateTime(a.realReleaseDate || a.scheduledRelease || ''), 10) || -Infinity;
        const by = parseInt(parseYearFromDateTime(b.realReleaseDate || b.scheduledRelease || ''), 10) || -Infinity;
        if (ay === by) return 0; return ay < by ? -1 * dirMul : 1 * dirMul;
      } else if (key === 'art' || key === 'com') {
        const av = computeMovieArtCom(a)[key];
        const bv = computeMovieArtCom(b)[key];
        if (av === bv) return 0; return av < bv ? -1 * dirMul : 1 * dirMul;
      } else if (key === 'box') {
        const av = getMovieTotalIncome(a);
        const bv = getMovieTotalIncome(b);
        if (av === bv) return 0; return av < bv ? -1 * dirMul : 1 * dirMul;
      }
      return 0;
    });
  }
  function updateMoviesSortIndicators() {
    const ths = document.querySelectorAll('#moviesTable thead th');
    ths.forEach((th) => {
      th.classList.remove('sort-asc', 'sort-desc');
      const key = th.getAttribute('data-sort-key');
      if (key && key === moviesSortState.key) th.classList.add(moviesSortState.dir === 'desc' ? 'sort-desc' : 'sort-asc');
    });
  }
  function renderMovies() {
    if (!saveLoaded || !moviesTbody) return;
    if (moviesTableSection) moviesTableSection.hidden = false;
    if (moviesControls) moviesControls.hidden = false;
    const q = (moviesSearchInput?.value || '').toLowerCase().trim();
    const filtered = q ? movies.filter(m => String(m.name || '').toLowerCase().includes(q)) : movies.slice();
    sortMoviesList(filtered);
    updateMoviesSortIndicators();
    if (moviesStatus) moviesStatus.textContent = `${filtered.length} of ${movies.length} movies shown`;
    const frag = document.createDocumentFragment();
    filtered.forEach((m) => {
      const tr = document.createElement('tr');
      const tdTitle = document.createElement('td'); tdTitle.textContent = String(m.name || ''); tr.appendChild(tdTitle);
      const tdYear = document.createElement('td');
      const yrStr = parseYearFromDateTime(m.realReleaseDate || m.scheduledRelease || '');
      tdYear.textContent = (yrStr === '0001') ? '[unreleased]' : yrStr;
      tr.appendChild(tdYear);
      const ac = computeMovieArtCom(m);
      const tdArt = document.createElement('td'); tdArt.textContent = formatUnitToTen((ac.art).toFixed(3)); tr.appendChild(tdArt);
      const tdCom = document.createElement('td'); tdCom.textContent = formatUnitToTen((ac.com).toFixed(3)); tr.appendChild(tdCom);
      const tdBox = document.createElement('td'); tdBox.textContent = formatMoneyUSD(getMovieTotalIncome(m)); tr.appendChild(tdBox);
      frag.appendChild(tr);
    });
    moviesTbody.replaceChildren(frag);
  }

  // --- Composers tab ---
  let composersSortState = { key: 'skill', dir: 'desc' };
  function sortComposersList(list) {
    const dirMul = composersSortState.dir === 'desc' ? -1 : 1;
    const key = composersSortState.key;
    list.sort((a, b) => {
      if (key === 'name') return fullNameFor(a).toLowerCase().localeCompare(fullNameFor(b).toLowerCase()) * dirMul;
      let av=0,bv=0;
      if (key==='skill') { av = getNumeric(normalizeDecimalString(a.professions?.Composer ?? '')); bv = getNumeric(normalizeDecimalString(b.professions?.Composer ?? '')); }
      else if (key==='age') { av = getNumeric(getAge(a)); bv = getNumeric(getAge(b)); }
      else if (key==='limit') { av = getNumeric(normalizeDecimalString(a.limit ?? a.Limit ?? '')); bv = getNumeric(normalizeDecimalString(b.limit ?? b.Limit ?? '')); }
      else if (key==='movies') { av = moviesCountForRole(a, 'Composer'); bv = moviesCountForRole(b, 'Composer'); }
      if (av===bv) return 0; return av < bv ? -1*dirMul : 1*dirMul;
    });
  }
  function updateComposersSortIndicators() {
    const ths = document.querySelectorAll('#composersTable thead th');
    ths.forEach((th)=>{ th.classList.remove('sort-asc','sort-desc'); const key = th.getAttribute('data-sort-key'); if (key && key===composersSortState.key) th.classList.add(composersSortState.dir==='desc'?'sort-desc':'sort-asc'); });
  }
  function renderComposers() {
    if (!saveLoaded || !composersTbody) return;
    if (composersTableSection) composersTableSection.hidden = false;
    if (composersControls) composersControls.hidden = false;
    const q = (composersSearchInput?.value || '').toLowerCase().trim();
    const filtered = q ? composers.filter(a => fullNameFor(a).toLowerCase().includes(q)) : composers.slice();
    sortComposersList(filtered); updateComposersSortIndicators();
    if (composersStatus) composersStatus.textContent = `${filtered.length} of ${composers.length} composers shown` + (!nameMapLoaded ? ' — load name map to see full names' : '');
    const frag = document.createDocumentFragment();
    filtered.forEach((c)=>{
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', String(c.id ?? ''));
      tr.addEventListener('click', (e) => {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON')) return;
        openDetailEditor(c);
      });
      tr.addEventListener('pointerdown', () => markFocusedId(c.id));
      if (focusedEntityId != null && String(focusedEntityId) === String(c.id)) tr.classList.add('row-focused');
      const tdName = document.createElement('td'); tdName.textContent = fullNameFor(c); tr.appendChild(tdName);
      const tdAgeC = document.createElement('td');
      const ageInputC = document.createElement('input'); ageInputC.type='number'; ageInputC.min='0'; ageInputC.max='200';
      const currentAgeC = getAge(c); ageInputC.value = currentAgeC === '' ? '' : String(currentAgeC); ageInputC.placeholder = gameYear ? '—' : 'Set game year';
      ageInputC.addEventListener('change', () => {
        if (!gameYear) return; const newAge = Number(ageInputC.value);
        if (!isFinite(newAge) || newAge < 0 || newAge > 200) { ageInputC.value = currentAgeC; return; }
        const parts = parseBirthDateParts(c.birthDate) || { day: 1, month: 1, year: 1 };
        const newYear = Math.floor(gameYear - Math.floor(newAge));
        const safeYear = Math.min(Math.max(newYear, 1850), 2100);
        const prev = c.birthDate; c.birthDate = formatBirthDate(parts.day, parts.month, safeYear);
        recordEdit({ entity: c, label: 'Age', path: 'birthDate', oldValue: prev, newValue: c.birthDate });
      });
      ageInputC.addEventListener('focus', () => markFocusedId(c.id));
      tdAgeC.appendChild(ageInputC); tr.appendChild(tdAgeC);
      const tdSkill = document.createElement('td');
      const skillWrap = document.createElement('div'); skillWrap.className='slider-cell';
      const skillRange=document.createElement('input'); skillRange.type='range'; skillRange.min='0'; skillRange.max='1'; skillRange.step='0.01';
      const skillNum = normalizeSkillForRole(c,'Composer'); skillRange.value=String(skillNum);
      const skillVal=document.createElement('span'); skillVal.className='slider-val'; skillVal.textContent = formatUnitToTen(skillNum);
      skillRange.addEventListener('input',()=>{
        if (!c.professions||typeof c.professions!=='object') c.professions={};
        if (!('initial' in skillRange.dataset)) skillRange.dataset.initial = String(c.professions.Composer ?? '');
        const norm=Number(skillRange.value).toFixed(3);
        c.professions.Composer=norm;
        skillVal.textContent=formatUnitToTen(norm);
        // Auto-raise limit if skill exceeds current limit
        const currentLimitNum = isFinite(Number(c.limit ?? c.Limit)) ? Number(c.limit ?? c.Limit) : 0;
        if (Number(norm) > currentLimitNum) {
          if (!('initial' in limitRange.dataset)) limitRange.dataset.initial = String(c.limit ?? c.Limit ?? '');
          if (!('autoLimitOld' in skillRange.dataset)) skillRange.dataset.autoLimitOld = String(c.limit ?? c.Limit ?? '');
          c.limit = norm; c.Limit = norm;
          limitRange.value = String(norm);
          limitVal.textContent = formatUnitToTen(norm);
          skillRange.dataset.autoLimitNew = norm;
        }
      });
      skillRange.addEventListener('focus', ()=> markFocusedId(c.id));
      skillRange.addEventListener('change',()=>{
        const finalVal = Number(skillRange.value).toFixed(3);
        const initialVal = skillRange.dataset.initial ?? String(finalVal);
        delete skillRange.dataset.initial;
        recordEdit({ entity: c, label: 'Composer Skill', path: 'professions.Composer', oldValue: initialVal, newValue: finalVal });
        if (skillRange.dataset.autoLimitOld && skillRange.dataset.autoLimitNew && skillRange.dataset.autoLimitOld !== skillRange.dataset.autoLimitNew) {
          recordEdit({ entity: c, label: 'Limit', path: 'limit', oldValue: skillRange.dataset.autoLimitOld, newValue: skillRange.dataset.autoLimitNew });
        }
        delete skillRange.dataset.autoLimitOld;
        delete skillRange.dataset.autoLimitNew;
      });
      // no change-triggered re-render
      skillWrap.appendChild(skillRange); skillWrap.appendChild(skillVal); tdSkill.appendChild(skillWrap); tr.appendChild(tdSkill);

      const tdLimit = document.createElement('td');
      const limitWrap = document.createElement('div'); limitWrap.className='slider-cell';
      const limitRange=document.createElement('input'); limitRange.type='range'; limitRange.min='0'; limitRange.max='1'; limitRange.step='0.01';
      const limitNum=isFinite(Number(c.limit??c.Limit))?Number(c.limit??c.Limit):0; limitRange.value=String(limitNum);
      const limitVal=document.createElement('span'); limitVal.className='slider-val'; limitVal.textContent=formatUnitToTen(limitNum);
      limitRange.addEventListener('input',()=>{
        const skillFloor=isFinite(Number(c.professions?.Composer))?Number(c.professions.Composer):0;
        if (!('initial' in limitRange.dataset)) limitRange.dataset.initial = String(c.limit ?? c.Limit ?? '');
        if(Number(limitRange.value)<skillFloor) limitRange.value=String(skillFloor);
        const norm=Number(limitRange.value).toFixed(3);
        c.limit=norm; c.Limit=norm;
        limitVal.textContent=formatUnitToTen(norm);
      });
      limitRange.addEventListener('focus', ()=> markFocusedId(c.id));
      limitRange.addEventListener('change',()=>{
        const finalVal = Number(limitRange.value).toFixed(3);
        const initialVal = limitRange.dataset.initial ?? String(finalVal);
        delete limitRange.dataset.initial;
        recordEdit({ entity: c, label: 'Limit', path: 'limit', oldValue: initialVal, newValue: finalVal });
      });
      // no change-triggered re-render
      limitWrap.appendChild(limitRange); limitWrap.appendChild(limitVal); tdLimit.appendChild(limitWrap); tr.appendChild(tdLimit);
      const tdMovies=document.createElement('td'); tdMovies.textContent=String(moviesCountForRole(c,'Composer')); tr.appendChild(tdMovies);
      frag.appendChild(tr);
    });
    composersTbody.replaceChildren(frag);
  }

  // --- Cinematographers tab ---
  let cinematographersSortState = { key: 'skill', dir: 'desc' };
  function sortCinematographersList(list){
    const dirMul = cinematographersSortState.dir==='desc'?-1:1; const key=cinematographersSortState.key;
    list.sort((a,b)=>{ if(key==='name') return fullNameFor(a).toLowerCase().localeCompare(fullNameFor(b).toLowerCase())*dirMul; let av=0,bv=0; if(key==='skill'){ av=getNumeric(normalizeDecimalString(a.professions?.Cinematographer??'')); bv=getNumeric(normalizeDecimalString(b.professions?.Cinematographer??'')); } else if (key==='age'){ av=getNumeric(getAge(a)); bv=getNumeric(getAge(b)); } else if (key==='limit'){ av=getNumeric(normalizeDecimalString(a.limit??a.Limit??'')); bv=getNumeric(normalizeDecimalString(b.limit??b.Limit??'')); } else if (key==='movies'){ av=moviesCountForRole(a,'Cinematographer'); bv=moviesCountForRole(b,'Cinematographer'); } if (av===bv) return 0; return av<bv?-1*dirMul:1*dirMul; });
  }
  function updateCinematographersSortIndicators(){ const ths=document.querySelectorAll('#cinematographersTable thead th'); ths.forEach((th)=>{ th.classList.remove('sort-asc','sort-desc'); const key=th.getAttribute('data-sort-key'); if(key&&key===cinematographersSortState.key) th.classList.add(cinematographersSortState.dir==='desc'?'sort-desc':'sort-asc'); }); }
  function renderCinematographers() {
    if (!saveLoaded || !cinematographersTbody) return;
    if (cinematographersTableSection) cinematographersTableSection.hidden = false;
    if (cinematographersControls) cinematographersControls.hidden = false;

    const q = (cinematographersSearchInput?.value || '').toLowerCase().trim();
    const filtered = q ? cinematographers.filter(a => fullNameFor(a).toLowerCase().includes(q)) : cinematographers.slice();
    sortCinematographersList(filtered);
    updateCinematographersSortIndicators();
    if (cinematographersStatus) cinematographersStatus.textContent = `${filtered.length} of ${cinematographers.length} cinematographers shown` + (!nameMapLoaded ? ' — load name map to see full names' : '');

    const frag = document.createDocumentFragment();
    filtered.forEach((ci) => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', String(ci.id ?? ''));
      tr.addEventListener('click', (e) => {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON')) return;
        openDetailEditor(ci);
      });
      tr.addEventListener('pointerdown', () => markFocusedId(ci.id));
      if (focusedEntityId != null && String(focusedEntityId) === String(ci.id)) tr.classList.add('row-focused');

      const tdName = document.createElement('td'); tdName.textContent = fullNameFor(ci); tr.appendChild(tdName);
      const tdAge = document.createElement('td'); tdAge.textContent = getAge(ci) === '' ? '' : String(getAge(ci)); tr.appendChild(tdAge);

      // Skill slider
      const tdSkill = document.createElement('td');
      const skillWrap = document.createElement('div'); skillWrap.className = 'slider-cell';
      const skillRange = document.createElement('input'); skillRange.type = 'range'; skillRange.min = '0'; skillRange.max = '1'; skillRange.step = '0.01';
      const skillNum = normalizeSkillForRole(ci, 'Cinematographer'); skillRange.value = String(skillNum);
      const skillVal = document.createElement('span'); skillVal.className = 'slider-val'; skillVal.textContent = formatUnitToTen(skillNum);
      skillRange.addEventListener('input', () => {
        if (!ci.professions || typeof ci.professions !== 'object') ci.professions = {};
        if (!('initial' in skillRange.dataset)) skillRange.dataset.initial = String(ci.professions.Cinematographer ?? '');
        const norm = Number(skillRange.value).toFixed(3);
        ci.professions.Cinematographer = norm;
        skillVal.textContent = formatUnitToTen(norm);
        // Auto-raise limit if skill exceeds current limit
        const currentLimitNum = isFinite(Number(ci.limit ?? ci.Limit)) ? Number(ci.limit ?? ci.Limit) : 0;
        if (Number(norm) > currentLimitNum) {
          if (!('initial' in limitRange.dataset)) limitRange.dataset.initial = String(ci.limit ?? ci.Limit ?? '');
          if (!('autoLimitOld' in skillRange.dataset)) skillRange.dataset.autoLimitOld = String(ci.limit ?? ci.Limit ?? '');
          ci.limit = norm; ci.Limit = norm;
          limitRange.value = String(norm);
          limitVal.textContent = formatUnitToTen(norm);
          skillRange.dataset.autoLimitNew = norm;
        }
      });
      skillRange.addEventListener('focus', () => markFocusedId(ci.id));
      skillRange.addEventListener('change', () => {
        const finalVal = Number(skillRange.value).toFixed(3);
        const initialVal = skillRange.dataset.initial ?? String(finalVal);
        delete skillRange.dataset.initial;
        recordEdit({ entity: ci, label: 'Cinematographer Skill', path: 'professions.Cinematographer', oldValue: initialVal, newValue: finalVal });
        if (skillRange.dataset.autoLimitOld && skillRange.dataset.autoLimitNew && skillRange.dataset.autoLimitOld !== skillRange.dataset.autoLimitNew) {
          recordEdit({ entity: ci, label: 'Limit', path: 'limit', oldValue: skillRange.dataset.autoLimitOld, newValue: skillRange.dataset.autoLimitNew });
        }
        delete skillRange.dataset.autoLimitOld; delete skillRange.dataset.autoLimitNew;
      });
      skillWrap.appendChild(skillRange); skillWrap.appendChild(skillVal); tdSkill.appendChild(skillWrap); tr.appendChild(tdSkill);

      // Limit slider
      const tdLimit = document.createElement('td');
      const limitWrap = document.createElement('div'); limitWrap.className = 'slider-cell';
      const limitRange = document.createElement('input'); limitRange.type = 'range'; limitRange.min = '0'; limitRange.max = '1'; limitRange.step = '0.01';
      const limitNum = isFinite(Number(ci.limit ?? ci.Limit)) ? Number(ci.limit ?? ci.Limit) : 0; limitRange.value = String(limitNum);
      const limitVal = document.createElement('span'); limitVal.className = 'slider-val'; limitVal.textContent = formatUnitToTen(limitNum);
      limitRange.addEventListener('input', () => {
        const skillFloor = isFinite(Number(ci.professions?.Cinematographer)) ? Number(ci.professions.Cinematographer) : 0;
        if (!('initial' in limitRange.dataset)) limitRange.dataset.initial = String(ci.limit ?? ci.Limit ?? '');
        if (Number(limitRange.value) < skillFloor) limitRange.value = String(skillFloor);
        const norm = Number(limitRange.value).toFixed(3);
        ci.limit = norm; ci.Limit = norm;
        limitVal.textContent = formatUnitToTen(norm);
      });
      limitRange.addEventListener('focus', () => markFocusedId(ci.id));
      limitRange.addEventListener('change', () => {
        const finalVal = Number(limitRange.value).toFixed(3);
        const initialVal = limitRange.dataset.initial ?? String(finalVal);
        delete limitRange.dataset.initial;
        recordEdit({ entity: ci, label: 'Limit', path: 'limit', oldValue: initialVal, newValue: finalVal });
      });
      limitWrap.appendChild(limitRange); limitWrap.appendChild(limitVal); tdLimit.appendChild(limitWrap); tr.appendChild(tdLimit);

      const tdMovies = document.createElement('td'); tdMovies.textContent = String(moviesCountForRole(ci, 'Cinematographer')); tr.appendChild(tdMovies);
      frag.appendChild(tr);
    });
    cinematographersTbody.replaceChildren(frag);
  }

  // --- Security Agents tab ---
  let agentsSortState = { key: 'skill', dir: 'desc' };
  function sortAgentsList(list){ const dirMul=agentsSortState.dir==='desc'?-1:1; const key=agentsSortState.key; list.sort((a,b)=>{ if(key==='name') return fullNameFor(a).toLowerCase().localeCompare(fullNameFor(b).toLowerCase())*dirMul; let av=0,bv=0; if(key==='skill'){ av=getNumeric(normalizeDecimalString(a.professions?.Agent??'')); bv=getNumeric(normalizeDecimalString(b.professions?.Agent??'')); } else if(key==='age'){ av=getNumeric(getAge(a)); bv=getNumeric(getAge(b)); } else if(key==='limit'){ av=getNumeric(normalizeDecimalString(a.limit??a.Limit??'')); bv=getNumeric(normalizeDecimalString(b.limit??b.Limit??'')); } else if(key==='movies'){ av=moviesCountForRole(a,'Agent'); bv=moviesCountForRole(b,'Agent'); } if(av===bv) return 0; return av<bv?-1*dirMul:1*dirMul; }); }
  function updateAgentsSortIndicators(){ const ths=document.querySelectorAll('#agentsTable thead th'); ths.forEach((th)=>{ th.classList.remove('sort-asc','sort-desc'); const key=th.getAttribute('data-sort-key'); if(key&&key===agentsSortState.key) th.classList.add(agentsSortState.dir==='desc'?'sort-desc':'sort-asc'); }); }
  function renderAgents() {
    if (!saveLoaded || !agentsTbody) return;
    if (agentsTableSection) agentsTableSection.hidden = false;
    if (agentsControls) agentsControls.hidden = false;
    const q = (agentsSearchInput?.value || '').toLowerCase().trim();
    const filtered = q ? agents.filter(a => fullNameFor(a).toLowerCase().includes(q)) : agents.slice();
    sortAgentsList(filtered);
    updateAgentsSortIndicators();
    if (agentsStatus) agentsStatus.textContent = `${filtered.length} of ${agents.length} security agents shown` + (!nameMapLoaded ? ' — load name map to see full names' : '');
    const frag = document.createDocumentFragment();
    filtered.forEach((ag) => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', String(ag.id ?? ''));
      tr.addEventListener('click', (e) => {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON')) return;
        openDetailEditor(ag);
      });
      tr.addEventListener('pointerdown', () => markFocusedId(ag.id));
      if (focusedEntityId != null && String(focusedEntityId) === String(ag.id)) tr.classList.add('row-focused');
      const tdName = document.createElement('td'); tdName.textContent = fullNameFor(ag); tr.appendChild(tdName);
      const tdAge = document.createElement('td');
      const ageInputAg=document.createElement('input'); ageInputAg.type='number'; ageInputAg.min='0'; ageInputAg.max='200';
      const currentAgeAg=getAge(ag); ageInputAg.value=currentAgeAg===''?'':String(currentAgeAg); ageInputAg.placeholder=gameYear?'—':'Set game year';
      ageInputAg.addEventListener('change',()=>{ if(!gameYear) return; const newAge=Number(ageInputAg.value); if(!isFinite(newAge)||newAge<0||newAge>200){ ageInputAg.value=currentAgeAg; return;} const parts=parseBirthDateParts(ag.birthDate)||{day:1,month:1,year:1}; const newYear=Math.floor(gameYear-Math.floor(newAge)); const safeYear=Math.min(Math.max(newYear,1850),2100); const prev=ag.birthDate; ag.birthDate=formatBirthDate(parts.day,parts.month,safeYear); recordEdit({ entity: ag, label: 'Age', path: 'birthDate', oldValue: prev, newValue: ag.birthDate }); });
      ageInputAg.addEventListener('focus',()=>markFocusedId(ag.id));
      tdAge.appendChild(ageInputAg); tr.appendChild(tdAge);
      // Skill slider
      const tdSkill = document.createElement('td');
      const skillWrap = document.createElement('div'); skillWrap.className = 'slider-cell';
      const skillRange = document.createElement('input'); skillRange.type = 'range'; skillRange.min = '0'; skillRange.max = '1'; skillRange.step = '0.01';
      const skillNum = normalizeSkillForRole(ag, 'Agent'); skillRange.value = String(skillNum);
      const skillVal = document.createElement('span'); skillVal.className = 'slider-val'; skillVal.textContent = formatUnitToTen(skillNum);
      skillRange.addEventListener('input', () => {
        if (!ag.professions || typeof ag.professions !== 'object') ag.professions = {};
        if (!('initial' in skillRange.dataset)) skillRange.dataset.initial = String(ag.professions.Agent ?? '');
        const norm = Number(skillRange.value).toFixed(3);
        ag.professions.Agent = norm;
        skillVal.textContent = formatUnitToTen(norm);
        const currentLimitNum = isFinite(Number(ag.limit ?? ag.Limit)) ? Number(ag.limit ?? ag.Limit) : 0;
        if (Number(norm) > currentLimitNum) {
          if (!('initial' in limitRange.dataset)) limitRange.dataset.initial = String(ag.limit ?? ag.Limit ?? '');
          if (!('autoLimitOld' in skillRange.dataset)) skillRange.dataset.autoLimitOld = String(ag.limit ?? ag.Limit ?? '');
          ag.limit = norm; ag.Limit = norm;
          limitRange.value = String(norm);
          limitVal.textContent = formatUnitToTen(norm);
          skillRange.dataset.autoLimitNew = norm;
        }
      });
      skillRange.addEventListener('focus', () => markFocusedId(ag.id));
      skillRange.addEventListener('change', () => {
        const finalVal = Number(skillRange.value).toFixed(3);
        const initialVal = skillRange.dataset.initial ?? String(finalVal);
        delete skillRange.dataset.initial;
        recordEdit({ entity: ag, label: 'Security Agent Skill', path: 'professions.Agent', oldValue: initialVal, newValue: finalVal });
        if (skillRange.dataset.autoLimitOld && skillRange.dataset.autoLimitNew && skillRange.dataset.autoLimitOld !== skillRange.dataset.autoLimitNew) {
          recordEdit({ entity: ag, label: 'Limit', path: 'limit', oldValue: skillRange.dataset.autoLimitOld, newValue: skillRange.dataset.autoLimitNew });
        }
        delete skillRange.dataset.autoLimitOld; delete skillRange.dataset.autoLimitNew;
      });
      skillWrap.appendChild(skillRange); skillWrap.appendChild(skillVal); tdSkill.appendChild(skillWrap); tr.appendChild(tdSkill);
      // Limit slider
      const tdLimit = document.createElement('td'); const limitWrap = document.createElement('div'); limitWrap.className = 'slider-cell';
      const limitRange = document.createElement('input'); limitRange.type = 'range'; limitRange.min = '0'; limitRange.max = '1'; limitRange.step = '0.01';
      const limitNum = isFinite(Number(ag.limit ?? ag.Limit)) ? Number(ag.limit ?? ag.Limit) : 0; limitRange.value = String(limitNum);
      const limitVal = document.createElement('span'); limitVal.className = 'slider-val'; limitVal.textContent = formatUnitToTen(limitNum);
      limitRange.addEventListener('input', () => {
        const skillFloor = isFinite(Number(ag.professions?.Agent)) ? Number(ag.professions.Agent) : 0;
        if (!('initial' in limitRange.dataset)) limitRange.dataset.initial = String(ag.limit ?? ag.Limit ?? '');
        if (Number(limitRange.value) < skillFloor) limitRange.value = String(skillFloor);
        const norm = Number(limitRange.value).toFixed(3);
        ag.limit = norm; ag.Limit = norm;
        limitVal.textContent = formatUnitToTen(norm);
      });
      limitRange.addEventListener('focus', () => markFocusedId(ag.id));
      limitRange.addEventListener('change', () => {
        const finalVal = Number(limitRange.value).toFixed(3);
        const initialVal = limitRange.dataset.initial ?? String(finalVal);
        delete limitRange.dataset.initial;
        recordEdit({ entity: ag, label: 'Limit', path: 'limit', oldValue: initialVal, newValue: finalVal });
      });
      limitWrap.appendChild(limitRange); limitWrap.appendChild(limitVal); tdLimit.appendChild(limitWrap); tr.appendChild(tdLimit);
      const tdMovies = document.createElement('td'); tdMovies.textContent = String(moviesCountForRole(ag, 'Agent')); tr.appendChild(tdMovies);
      frag.appendChild(tr);
    });
    agentsTbody.replaceChildren(frag);
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
          if (loadersSection && saveLoaded && nameMapLoaded) loadersSection.style.display = 'none';
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
      lastLoadedFile = file;
      saveMeta.textContent = `Loaded save: ${file.name} (${file.size.toLocaleString()} bytes)`;
      if (reloadBtn) reloadBtn.disabled = false;
      if (loadersSection && saveLoaded && nameMapLoaded) loadersSection.style.display = 'none';
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
      lastLoadedFile = file;
      saveMeta.textContent = `Loaded save: ${file.name} (${file.size.toLocaleString()} bytes)`;
      if (reloadBtn) reloadBtn.disabled = false;
      if (loadersSection && saveLoaded && nameMapLoaded) loadersSection.style.display = 'none';
      refreshAfterDataLoad();
    } catch (err) {
      console.error(err);
      saveMeta.textContent = 'Failed to parse JSON save file.';
    }
  });

  // Reload current save
  if (reloadBtn) {
    reloadBtn.addEventListener('click', async () => {
      const candidate = (saveFileInput && saveFileInput.files && saveFileInput.files[0]) ? saveFileInput.files[0] : lastLoadedFile;
      if (!candidate) return;
      try {
        const text = await readFileAsText(candidate);
        saveObj = JSON.parse(text);
        saveLoaded = true;
        originalSaveName = candidate.name;
        lastLoadedFile = candidate;
        saveMeta.textContent = `Reloaded save: ${candidate.name} (${candidate.size.toLocaleString()} bytes)`;
        refreshAfterDataLoad();
      } catch (err) {
        console.error(err);
        saveMeta.textContent = 'Failed to reload save file.';
      }
    });
  }

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
        if (loadersSection && saveLoaded && nameMapLoaded) loadersSection.style.display = 'none';
        render();
      } else {
        namesMeta.textContent = 'Invalid CHARACTER_NAMES.json (missing locStrings array).';
      }
    } catch (err) {
      console.error(err);
      namesMeta.textContent = 'Failed to parse CHARACTER_NAMES.json.';
    }
  });

  // Studio inputs
  if (studioBudgetInput) {
    studioBudgetInput.addEventListener('input', () => {
      const root = studioRoot || saveObj || {};
      if (!('initial' in studioBudgetInput.dataset)) studioBudgetInput.dataset.initial = String(root?.budget ?? '');
      const val = Number(studioBudgetInput.value);
      if (studioBudgetFmt) studioBudgetFmt.textContent = isFinite(val) ? `$${val.toLocaleString()}` : '';
    });
    studioBudgetInput.addEventListener('change', () => {
      if (!saveLoaded) return;
      const root = studioRoot || saveObj || {};
      const initialVal = studioBudgetInput.dataset.initial ?? String(root?.budget ?? '');
      delete studioBudgetInput.dataset.initial;
      const parsed = Math.round(Number(studioBudgetInput.value));
      if (!isFinite(parsed)) { renderStudio(); return; }
      const prev = root.budget;
      root.budget = parsed;
      recordEdit({ entity: root, label: 'Budget', path: 'budget', oldValue: prev, newValue: parsed, suppressEntityInLog: true });
      if (studioBudgetFmt) studioBudgetFmt.textContent = `$${parsed.toLocaleString()}`;
    });
  }
  if (studioCashInput) {
    studioCashInput.addEventListener('input', () => {
      const root = studioRoot || saveObj || {};
      if (!('initial' in studioCashInput.dataset)) studioCashInput.dataset.initial = String(root?.cash ?? '');
      const val = Number(studioCashInput.value);
      if (studioCashFmt) studioCashFmt.textContent = isFinite(val) ? `$${val.toLocaleString()}` : '';
    });
    studioCashInput.addEventListener('change', () => {
      if (!saveLoaded) return;
      const root = studioRoot || saveObj || {};
      const initialVal = studioCashInput.dataset.initial ?? String(root?.cash ?? '');
      delete studioCashInput.dataset.initial;
      const parsed = Math.round(Number(studioCashInput.value));
      if (!isFinite(parsed)) { renderStudio(); return; }
      const prev = root.cash;
      root.cash = parsed;
      recordEdit({ entity: root, label: 'Cash', path: 'cash', oldValue: prev, newValue: parsed, suppressEntityInLog: true });
      if (studioCashFmt) studioCashFmt.textContent = `$${parsed.toLocaleString()}`;
    });
  }
  if (studioInfluenceInput) {
    studioInfluenceInput.addEventListener('input', () => {
      const root = studioRoot || saveObj || {};
      if (!('initial' in studioInfluenceInput.dataset)) studioInfluenceInput.dataset.initial = String(root?.influence ?? '');
      const val = Number(studioInfluenceInput.value);
      if (studioInfluenceFmt) studioInfluenceFmt.textContent = isFinite(val) ? val.toLocaleString() : '';
    });
    studioInfluenceInput.addEventListener('change', () => {
      if (!saveLoaded) return;
      const root = studioRoot || saveObj || {};
      const initialVal = studioInfluenceInput.dataset.initial ?? String(root?.influence ?? '');
      delete studioInfluenceInput.dataset.initial;
      const parsed = Math.round(Number(studioInfluenceInput.value));
      if (!isFinite(parsed)) { renderStudio(); return; }
      const prev = root.influence;
      root.influence = parsed;
      recordEdit({ entity: root, label: 'Influence', path: 'influence', oldValue: prev, newValue: parsed, suppressEntityInLog: true });
      if (studioInfluenceFmt) studioInfluenceFmt.textContent = parsed.toLocaleString();
    });
  }
  if (studioReputationInput) {
    studioReputationInput.addEventListener('input', () => {
      const root = studioRoot || saveObj || {};
      if (!('initial' in studioReputationInput.dataset)) studioReputationInput.dataset.initial = String(root?.reputation ?? '');
      const val = Number(studioReputationInput.value);
      if (studioReputationFmt) {
        if (isFinite(val)) {
          const str = Number(val.toFixed(3)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 3 });
          studioReputationFmt.textContent = str;
        } else {
          studioReputationFmt.textContent = '';
        }
      }
    });
    studioReputationInput.addEventListener('change', () => {
      if (!saveLoaded) return;
      const root = studioRoot || saveObj || {};
      const initialVal = studioReputationInput.dataset.initial ?? String(root?.reputation ?? '');
      delete studioReputationInput.dataset.initial;
      const num = Number(studioReputationInput.value);
      if (!isFinite(num)) { renderStudio(); return; }
      const norm = num.toFixed(3);
      const prev = root.reputation;
      root.reputation = norm;
      // ensure input displays normalized value
      studioReputationInput.value = norm;
      recordEdit({ entity: root, label: 'Reputation', path: 'reputation', oldValue: prev, newValue: norm, suppressEntityInLog: true });
      if (studioReputationFmt) studioReputationFmt.textContent = Number(norm).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 3 });
    });
  }

  // Search
  searchInput.addEventListener('input', () => render());
  if (directorsSearchInput) directorsSearchInput.addEventListener('input', () => renderDirectors());
  if (producersSearchInput) producersSearchInput.addEventListener('input', () => renderProducers());
  if (writersSearchInput) writersSearchInput.addEventListener('input', () => renderWriters());
  if (editorsSearchInput) editorsSearchInput.addEventListener('input', () => renderEditors());
  if (composersSearchInput) composersSearchInput.addEventListener('input', () => renderComposers());
  if (cinematographersSearchInput) cinematographersSearchInput.addEventListener('input', () => renderCinematographers());
  if (agentsSearchInput) agentsSearchInput.addEventListener('input', () => renderAgents());
  if (executivesSearchInput) executivesSearchInput.addEventListener('input', () => renderExecutives());
  if (moviesSearchInput) moviesSearchInput.addEventListener('input', () => renderMovies());
  if (composersSearchInput) composersSearchInput.addEventListener('input', () => renderComposers());
  if (cinematographersSearchInput) cinematographersSearchInput.addEventListener('input', () => renderCinematographers());
  if (agentsSearchInput) agentsSearchInput.addEventListener('input', () => renderAgents());

  // Game year: display-only (no inputs)

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

  // Executives helpers and renderer
  function executiveDepartmentFor(obj) {
    const prof = obj.professions || {};
    const known = [
      ['CptHR','HR'],
      ['CptLawyer','Legal'],
      ['CptFinancier','Finance'],
      ['CptPR','PR'],
      ['LieutRelease','Distribution'],
      ['LieutTech','Engineering'],
      ['LieutServices','Services'],
      ['LieutProduction','Production'],
      ['LieutPost','Post-Production'],
      ['LieutPre','Pre-Production']
    ];
    for (const [key,label] of known) if (key in prof) return label;
    const first = Object.keys(prof).find(k => k.startsWith('Cpt') || k.startsWith('Lieut'));
    return first || 'Executive';
  }
  function getExecutiveRoleKey(obj){ const prof=obj.professions||{}; return Object.keys(prof).find(k=>k.startsWith('Lieut')||k.startsWith('Cpt')) || null; }
  function getExecutiveSkill(obj){ const key=getExecutiveRoleKey(obj); const val= key? obj.professions[key]: '0'; return getNumeric(normalizeDecimalString(val)); }
  let executivesSortState = { key: 'dept', dir: 'asc' };
  function sortExecutivesList(list){ const dirMul=executivesSortState.dir==='desc'?-1:1; const key=executivesSortState.key; list.sort((a,b)=>{ if(key==='name') return fullNameFor(a).toLowerCase().localeCompare(fullNameFor(b).toLowerCase())*dirMul; let av=0,bv=0; if(key==='dept'){ return executiveDepartmentFor(a).localeCompare(executiveDepartmentFor(b))*dirMul; } else if(key==='level'){ av=getNumeric(a.level??0); bv=getNumeric(b.level??0); } else if(key==='exp'){ av=getNumeric(a.xp??0); bv=getNumeric(b.xp??0); } else if(key==='mood'){ av=getNumeric(normalizeDecimalString(a.mood??'')); bv=getNumeric(normalizeDecimalString(b.mood??'')); } else if(key==='attitude'){ av=getNumeric(normalizeDecimalString(a.attitude??'')); bv=getNumeric(normalizeDecimalString(b.attitude??'')); } else if(key==='umoney'){ av=getNumeric(a.BonusCardMoney??0); bv=getNumeric(b.BonusCardMoney??0); } else if(key==='uinfluence'){ av=getNumeric(a.BonusCardInfluencePoints??0); bv=getNumeric(b.BonusCardInfluencePoints??0); } else if(key==='age'){ av=getNumeric(getAge(a)); bv=getNumeric(getAge(b)); } if(av===bv) return 0; return av<bv?-1*dirMul:1*dirMul; }); }
  function updateExecutivesSortIndicators(){ const ths=document.querySelectorAll('#executivesTable thead th'); ths.forEach((th)=>{ th.classList.remove('sort-asc','sort-desc'); const key=th.getAttribute('data-sort-key'); if(key&&key===executivesSortState.key) th.classList.add(executivesSortState.dir==='desc'?'sort-desc':'sort-asc'); }); }
  function renderExecutives(){
    if (!saveLoaded || !executivesTbody) return;
    if (executivesTableSection) executivesTableSection.hidden = false;
    if (executivesControls) executivesControls.hidden = false;
    const q = (executivesSearchInput?.value || '').toLowerCase().trim();
    const base = executives.filter(ex => Number(ex.state) === 2);
    const filtered = q ? base.filter(a => fullNameFor(a).toLowerCase().includes(q)) : base.slice();
    sortExecutivesList(filtered);
    updateExecutivesSortIndicators();
    if (executivesStatus) executivesStatus.textContent = `${filtered.length} of ${base.length} management shown` + (!nameMapLoaded ? ' — load name map to see full names' : '');
    const frag = document.createDocumentFragment();
    filtered.forEach((ex) => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', String(ex.id ?? ''));
      tr.addEventListener('click', (e) => {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON')) return;
        openDetailEditor(ex);
      });
      tr.addEventListener('pointerdown', () => markFocusedId(ex.id));
      const tdName=document.createElement('td'); tdName.textContent=fullNameFor(ex); tr.appendChild(tdName);
      const tdAge=document.createElement('td'); const ageInputEx=document.createElement('input'); ageInputEx.type='number'; ageInputEx.min='0'; ageInputEx.max='200'; const currentAgeEx=getAge(ex); ageInputEx.value=currentAgeEx===''?'':String(currentAgeEx); ageInputEx.placeholder=gameYear?'—':'Set game year'; ageInputEx.addEventListener('change',()=>{ if(!gameYear) return; const newAge=Number(ageInputEx.value); if(!isFinite(newAge)||newAge<0||newAge>200){ ageInputEx.value=currentAgeEx; return;} const parts=parseBirthDateParts(ex.birthDate)||{day:1,month:1,year:1}; const newYear=Math.floor(gameYear-Math.floor(newAge)); const safeYear=Math.min(Math.max(newYear,1850),2100); const prev=ex.birthDate; ex.birthDate=formatBirthDate(parts.day,parts.month,safeYear); recordEdit({ entity: ex, label: 'Age', path: 'birthDate', oldValue: prev, newValue: ex.birthDate }); }); ageInputEx.addEventListener('focus',()=>markFocusedId(ex.id)); tdAge.appendChild(ageInputEx); tr.appendChild(tdAge);
      const tdDept=document.createElement('td'); tdDept.textContent=executiveDepartmentFor(ex); tr.appendChild(tdDept);
      const tdLevel=document.createElement('td'); tdLevel.textContent=String(ex.level ?? '—'); tr.appendChild(tdLevel);
      const tdXP=document.createElement('td'); tdXP.textContent=String(ex.xp ?? '0'); tr.appendChild(tdXP);
      const tdMood=document.createElement('td'); const mw=document.createElement('div'); mw.className='slider-cell'; const mr=document.createElement('input'); mr.type='range'; mr.min='0'; mr.max='1'; mr.step='0.01'; const mnum=isFinite(Number(ex.mood))?Number(ex.mood):0; mr.value=String(mnum.toFixed(3)); const mv=document.createElement('span'); mv.className='slider-val'; mv.textContent=formatUnitToHundred(mnum); mw.appendChild(mr); mw.appendChild(mv); tdMood.appendChild(mw); tr.appendChild(tdMood);
      mr.addEventListener('input', ()=>{ if(!('initial' in mr.dataset)) mr.dataset.initial=String(ex.mood ?? ''); const norm=Number(mr.value).toFixed(3); ex.mood=norm; mv.textContent=formatUnitToHundred(norm); });
      mr.addEventListener('change', ()=>{ const finalVal=Number(mr.value).toFixed(3); const initialVal=mr.dataset.initial ?? String(finalVal); delete mr.dataset.initial; recordEdit({ entity: ex, label: 'Happiness', path: 'mood', oldValue: initialVal, newValue: finalVal }); });
      const tdAtt=document.createElement('td'); const aw=document.createElement('div'); aw.className='slider-cell'; const ar=document.createElement('input'); ar.type='range'; ar.min='0'; ar.max='1'; ar.step='0.01'; const anum=isFinite(Number(ex.attitude))?Number(ex.attitude):0; ar.value=String(anum.toFixed(3)); const av=document.createElement('span'); av.className='slider-val'; av.textContent=formatUnitToHundred(anum); aw.appendChild(ar); aw.appendChild(av); tdAtt.appendChild(aw); tr.appendChild(tdAtt);
      ar.addEventListener('input', ()=>{ if(!('initial' in ar.dataset)) ar.dataset.initial=String(ex.attitude ?? ''); const norm=Number(ar.value).toFixed(3); ex.attitude=norm; av.textContent=formatUnitToHundred(norm); });
      ar.addEventListener('change', ()=>{ const finalVal=Number(ar.value).toFixed(3); const initialVal=ar.dataset.initial ?? String(finalVal); delete ar.dataset.initial; recordEdit({ entity: ex, label: 'Morale', path: 'attitude', oldValue: initialVal, newValue: finalVal }); });
      const tdUM=document.createElement('td'); tdUM.textContent=`${Math.round((Number(ex.BonusCardMoney||0))*10)}%`; tr.appendChild(tdUM);
      const tdUI=document.createElement('td'); tdUI.textContent=`${Math.round((Number(ex.BonusCardInfluencePoints||0))*10)}%`; tr.appendChild(tdUI);
      frag.appendChild(tr);
    });
    executivesTbody.replaceChildren(frag);
  }
  // Directors sorting handlers
  (function attachDirectorsSorting() {
    const ths = document.querySelectorAll('#directorsTable thead th');
    ths.forEach((th) => {
      const key = th.getAttribute('data-sort-key');
      if (!key) return;
      th.addEventListener('click', () => {
        if (directorsSortState.key === key) {
          directorsSortState.dir = directorsSortState.dir === 'desc' ? 'asc' : 'desc';
        } else {
          directorsSortState.key = key;
          directorsSortState.dir = 'desc';
        }
        updateDirectorsSortIndicators();
        renderDirectors();
      });
    });
  })();
  // Movies sorting handlers
  (function attachMoviesSorting(){
    const ths = document.querySelectorAll('#moviesTable thead th');
    ths.forEach((th)=>{
      const key = th.getAttribute('data-sort-key'); if (!key) return;
      th.addEventListener('click', () => {
        if (moviesSortState.key === key) moviesSortState.dir = moviesSortState.dir === 'desc' ? 'asc' : 'desc';
        else { moviesSortState.key = key; moviesSortState.dir = 'desc'; }
        updateMoviesSortIndicators(); renderMovies();
      });
    });
  })();
  // Producers sorting handlers
  (function attachProducersSorting() {
    const ths = document.querySelectorAll('#producersTable thead th');
    ths.forEach((th) => {
      const key = th.getAttribute('data-sort-key');
      if (!key) return;
      th.addEventListener('click', () => {
        if (producersSortState.key === key) producersSortState.dir = producersSortState.dir === 'desc' ? 'asc' : 'desc';
        else { producersSortState.key = key; producersSortState.dir = 'desc'; }
        updateProducersSortIndicators();
        renderProducers();
      });
    });
  })();
  // Writers sorting handlers
  (function attachWritersSorting() {
    const ths = document.querySelectorAll('#writersTable thead th');
    ths.forEach((th) => {
      const key = th.getAttribute('data-sort-key');
      if (!key) return;
      th.addEventListener('click', () => {
        if (writersSortState.key === key) writersSortState.dir = writersSortState.dir === 'desc' ? 'asc' : 'desc';
        else { writersSortState.key = key; writersSortState.dir = 'desc'; }
        updateWritersSortIndicators();
        renderWriters();
      });
    });
  })();
  // Editors sorting handlers
  (function attachEditorsSorting() {
    const ths = document.querySelectorAll('#editorsTable thead th');
    ths.forEach((th) => {
      const key = th.getAttribute('data-sort-key');
      if (!key) return;
      th.addEventListener('click', () => {
        if (editorsSortState.key === key) editorsSortState.dir = editorsSortState.dir === 'desc' ? 'asc' : 'desc';
        else { editorsSortState.key = key; editorsSortState.dir = 'desc'; }
        updateEditorsSortIndicators();
        renderEditors();
      });
    });
  })();
  // Composers sorting handlers
  (function attachComposersSorting(){
    const ths=document.querySelectorAll('#composersTable thead th');
    ths.forEach((th)=>{
      const key=th.getAttribute('data-sort-key'); if(!key) return;
      th.addEventListener('click',()=>{
        if(composersSortState.key===key) composersSortState.dir = composersSortState.dir==='desc'?'asc':'desc';
        else { composersSortState.key=key; composersSortState.dir='desc'; }
        updateComposersSortIndicators(); renderComposers();
      });
    });
  })();
  // Cinematographers sorting handlers
  (function attachCinematographersSorting(){
    const ths=document.querySelectorAll('#cinematographersTable thead th');
    ths.forEach((th)=>{
      const key=th.getAttribute('data-sort-key'); if(!key) return;
      th.addEventListener('click',()=>{
        if(cinematographersSortState.key===key) cinematographersSortState.dir = cinematographersSortState.dir==='desc'?'asc':'desc';
        else { cinematographersSortState.key=key; cinematographersSortState.dir='desc'; }
        updateCinematographersSortIndicators(); renderCinematographers();
      });
    });
  })();
  // Agents sorting handlers
  (function attachAgentsSorting(){
    const ths=document.querySelectorAll('#agentsTable thead th');
    ths.forEach((th)=>{
      const key=th.getAttribute('data-sort-key'); if(!key) return;
      th.addEventListener('click',()=>{
        if(agentsSortState.key===key) agentsSortState.dir = agentsSortState.dir==='desc'?'asc':'desc';
        else { agentsSortState.key=key; agentsSortState.dir='desc'; }
        updateAgentsSortIndicators(); renderAgents();
      });
    });
  })();
  // Executives sorting handlers
  (function attachExecutivesSorting(){
    const ths=document.querySelectorAll('#executivesTable thead th');
    ths.forEach((th)=>{
      const key=th.getAttribute('data-sort-key'); if(!key) return;
      th.addEventListener('click',()=>{
        if(executivesSortState.key===key) executivesSortState.dir = executivesSortState.dir==='desc'?'asc':'desc';
        else { executivesSortState.key=key; executivesSortState.dir='desc'; }
        updateExecutivesSortIndicators(); renderExecutives();
      });
    });
  })();

  // Tab handlers
  (function attachTabs() {
    tabs.forEach((btn) => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-tab');
        activateTab(name);
      });
    });
    // initial active via URL hash (e.g., #directors)
    const initial = (location.hash || '#studio').slice(1);
    activateTab(initial);
    window.addEventListener('hashchange', () => {
      const n = (location.hash || '#studio').slice(1);
      activateTab(n);
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
  attachUndoRedo();
  refreshChangeUI();
  tryAutoLoadNames();
})();
