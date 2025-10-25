import { useEffect, useMemo, useState } from 'preact/hooks';
import { DetailDrawer } from '../components/DetailDrawer';
import { AgeField } from '../components/AgeField';
import { SliderField } from '../components/SliderField';
import { TagValueInput } from '../components/TagValueInput';
import { ROLE_CONFIG, useAppStore } from '../state';
import { fullName, getAge, formatStudioDisplay, getTagValue, normalizeDecimalString } from '../domain';
const READINESS_OPTIONS = [
    { value: '0', label: 'No tricks' },
    { value: '1', label: 'Only clean tricks' },
    { value: '2', label: 'Dirty tricks allowed' }
];
export function TalentDetailDrawer({ kind, entity, open, onClose }) {
    const store = useAppStore();
    const config = ROLE_CONFIG[kind];
    const names = store.signals.names.value;
    const gameYear = store.signals.gameYear.value;
    const timeline = store.signals.timeline.value;
    const timelineVersion = timeline.applied.length + timeline.undone.length;
    const collections = store.signals[config.collectionKey].value;
    const [jsonDraft, setJsonDraft] = useState('');
    const [jsonError, setJsonError] = useState(null);
    const [isDirty, setDirty] = useState(false);
    const [lastEntityKey, setLastEntityKey] = useState(null);
    const [mode, setMode] = useState('form');
    const [nameDraft, setNameDraft] = useState('');
    const [genderDraft, setGenderDraft] = useState(0);
    const [readinessDraft, setReadinessDraft] = useState('0');
    const [selfEsteemDraft, setSelfEsteemDraft] = useState('');
    const [skillPreview, setSkillPreview] = useState(null);
    const [limitPreview, setLimitPreview] = useState(null);
    const entityKey = useMemo(() => {
        if (!entity)
            return null;
        if (typeof entity.id === 'number' && Number.isFinite(entity.id))
            return entity.id;
        const index = collections.indexOf(entity);
        return index >= 0 ? index : null;
    }, [entity, collections]);
    useEffect(() => {
        if (!entity || !open) {
            setJsonDraft('');
            setJsonError(null);
            setDirty(false);
            setLastEntityKey(null);
            setMode('form');
            setNameDraft('');
            setGenderDraft(0);
            setReadinessDraft('0');
            setSelfEsteemDraft('');
            setSkillPreview(null);
            setLimitPreview(null);
            return;
        }
        const changed = entityKey !== lastEntityKey;
        if (changed || !isDirty) {
            setJsonDraft(JSON.stringify(entity, null, 2));
            setJsonError(null);
            setDirty(false);
            setLastEntityKey(entityKey);
            if (changed) {
                setMode('form');
            }
            setNameDraft(typeof entity.customName === 'string' ? entity.customName : '');
            setGenderDraft(Number(entity.gender) === 1 ? 1 : 0);
            const draftReadiness = Math.min(Math.max(Math.round(Number(entity.readinessForTricks) || 0), 0), READINESS_OPTIONS.length - 1);
            setReadinessDraft(String(draftReadiness));
            const seDraft = normalizeDecimalString(entity.selfEsteem ?? '');
            setSelfEsteemDraft(seDraft);
            setSkillPreview(null);
            setLimitPreview(null);
        }
    }, [entity, entityKey, open, timelineVersion]);
    const roleLabel = config.detailLabel;
    const displayName = entity
        ? names
            ? fullName(names, {
                firstId: entity.firstNameId,
                lastId: entity.lastNameId,
                customName: entity.customName
            })
            : entity.customName ||
                `${entity.firstNameId ?? ''}${entity.firstNameId && entity.lastNameId ? ' ' : ''}${entity.lastNameId ?? ''}`.trim() ||
                `Unknown ${roleLabel}`
        : `${roleLabel} detail`;
    const age = entity ? getAge(entity, gameYear) : '';
    const professionKey = config.professionKey;
    const skillValue = entity ? normalizeDecimalString(entity.professions?.[professionKey] ?? '') : '';
    const limitValue = entity ? normalizeDecimalString(entity.limit ?? entity.Limit ?? '') : '';
    const skillNumber = entity ? Number(skillValue || '0') : 0;
    const safeSkill = Number.isFinite(skillNumber) ? Math.min(Math.max(skillNumber, 0), 1) : 0;
    const limitNumber = entity ? Number(limitValue || skillValue || '0') : 0;
    const safeLimit = Number.isFinite(limitNumber) ? Math.min(Math.max(limitNumber, safeSkill), 1) : safeSkill;
    const studioCode = entity
        ? entity.studioId == null
            ? ''
            : String(entity.studioId)
        : '';
    const studioDisplay = entity ? (studioCode ? formatStudioDisplay(studioCode) : 'None') : '—';
    const moodRaw = entity ? Number(normalizeDecimalString(entity.mood ?? '')) : 0;
    const safeMood = Number.isFinite(moodRaw) ? Math.min(Math.max(moodRaw, 0), 1) : 0;
    const attitudeRaw = entity ? Number(normalizeDecimalString(entity.attitude ?? '')) : 0;
    const safeAttitude = Number.isFinite(attitudeRaw) ? Math.min(Math.max(attitudeRaw, 0), 1) : 0;
    const commitSelfEsteem = () => {
        if (!entity)
            return;
        const trimmed = selfEsteemDraft.trim();
        if (trimmed === '') {
            const fallback = normalizeDecimalString(entity.selfEsteem ?? '');
            setSelfEsteemDraft(fallback);
            return;
        }
        const numeric = Number(trimmed);
        if (!Number.isFinite(numeric)) {
            const fallback = normalizeDecimalString(entity.selfEsteem ?? '');
            setSelfEsteemDraft(fallback);
            return;
        }
        store.actions.updateSelfEsteem(kind, entity, numeric);
        const formatted = normalizeDecimalString(numeric);
        setSelfEsteemDraft(formatted);
    };
    const artValue = kind === 'actor' && entity ? Number(normalizeDecimalString(getTagValue(entity, 'ART'))) || 0 : 0;
    const comValue = kind === 'actor' && entity ? Number(normalizeDecimalString(getTagValue(entity, 'COM'))) || 0 : 0;
    const skillDisplay = skillPreview ?? safeSkill;
    const limitBase = limitPreview ?? safeLimit;
    const limitDisplay = Math.max(limitBase, skillDisplay);
    const originalName = entity
        ? names
            ? fullName(names, { firstId: entity.firstNameId, lastId: entity.lastNameId })
            : `${entity.firstNameId ?? ''}${entity.firstNameId && entity.lastNameId ? ' ' : ''}${entity.lastNameId ?? ''}`.trim() ||
                `Unknown ${roleLabel}`
        : '—';
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!entity)
            return;
        try {
            const parsed = JSON.parse(jsonDraft);
            const defaultLabel = `${config.detailLabel} JSON edit`;
            store.actions.applySnapshot(kind, entity, parsed, defaultLabel);
            setJsonError(null);
            setDirty(false);
            setJsonDraft(JSON.stringify(entity, null, 2));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Invalid JSON payload.';
            setJsonError(message);
        }
    };
    return (<DetailDrawer open={open} onClose={onClose} title={displayName ?? `${roleLabel} detail`}>
      {!entity ? (<p class="drawer__empty">Select a {roleLabel.toLowerCase()} to inspect their details.</p>) : (<>
          <section class="drawer__section drawer__summary-row">
            <dl class="drawer__summary">
              <div>
                <dt>ID</dt>
                <dd>{entity.id ?? '—'}</dd>
              </div>
              <div>
                <dt>Original Name</dt>
                <dd>{originalName}</dd>
              </div>
              <div>
                <dt>Studio</dt>
                <dd>{studioDisplay}</dd>
              </div>
            </dl>
            <div class="drawer__mode">
              <button type="button" class={`drawer__mode-button${mode === 'form' ? ' drawer__mode-button--active' : ''}`} onClick={() => setMode('form')}>
                Friendly Controls
              </button>
              <button type="button" class={`drawer__mode-button${mode === 'json' ? ' drawer__mode-button--active' : ''}`} onClick={() => setMode('json')}>
                Raw JSON
              </button>
            </div>
          </section>
          <section class="drawer__section">
            <h4>Detail Editing</h4>
            {mode === 'form' ? (<div class="drawer__controls">
                <div class="drawer__control">
                  <label>Custom Name</label>
                  <input type="text" value={nameDraft} onInput={(event) => setNameDraft(event.currentTarget.value)} onBlur={() => entity && store.actions.updateCustomName(kind, entity, nameDraft)} placeholder="Leave blank to use generated name"/>
                </div>
                <div class="drawer__control">
                  <label>Gender</label>
                  <div class="drawer__radio-group">
                    <label class="drawer__radio">
                      <input type="radio" name="detailGender" checked={genderDraft === 0} onChange={() => {
                    setGenderDraft(0);
                    entity && store.actions.updateGender(kind, entity, 0);
                }}/>
                      <span>Male</span>
                    </label>
                    <label class="drawer__radio">
                      <input type="radio" name="detailGender" checked={genderDraft === 1} onChange={() => {
                    setGenderDraft(1);
                    entity && store.actions.updateGender(kind, entity, 1);
                }}/>
                      <span>Female</span>
                    </label>
                  </div>
                </div>
                <div class="drawer__control">
                  <label>Age</label>
                  <AgeField entity={entity} age={age} gameYear={gameYear} onCommit={(current, nextAge) => store.actions.updateAge(kind, current, nextAge)}/>
                </div>
                <div class="drawer__control">
                  <label>Happiness</label>
                  <SliderField value={safeMood} min={0} max={1} step={0.01} formatValue={(value) => `${Math.round(value * 100)}%`} onCommit={(value) => entity && store.actions.updateMood(kind, entity, value)} title="Happiness (0–100%)."/>
                </div>
                <div class="drawer__control">
                  <label>Loyalty</label>
                  <SliderField value={safeAttitude} min={0} max={1} step={0.01} formatValue={(value) => `${Math.round(value * 100)}%`} onCommit={(value) => entity && store.actions.updateAttitude(kind, entity, value)} title="Loyalty (0–100%)."/>
                </div>
                <div class="drawer__control">
                  <label>Self-esteem</label>
                  <input type="number" step="0.001" value={selfEsteemDraft} onInput={(event) => setSelfEsteemDraft(event.currentTarget.value)} onBlur={() => {
                    commitSelfEsteem();
                }} onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        commitSelfEsteem();
                        event.currentTarget.blur();
                    }
                }} placeholder="0.000"/>
                </div>
                {kind === 'actor' && (<div class="drawer__control">
                    <label>Readiness for Tricks</label>
                    <select class="drawer__select" value={readinessDraft} onChange={(event) => {
                        const value = event.currentTarget.value;
                        setReadinessDraft(value);
                        entity && store.actions.updateReadiness(kind, entity, Number(value));
                    }}>
                      {READINESS_OPTIONS.map((option) => (<option key={option.value} value={option.value}>
                          {option.label}
                        </option>))}
                    </select>
                  </div>)}
                <div class="drawer__control">
                  <label>{config.label}</label>
                  <SliderField value={skillDisplay} min={0} max={1} step={0.01} onChange={(value) => {
                    setSkillPreview(value);
                    setLimitPreview((prev) => {
                        const baseline = prev ?? safeLimit;
                        return value > baseline ? value : prev;
                    });
                }} onCommit={(value) => {
                    if (!entity)
                        return;
                    store.actions.updateSkill(kind, entity, value);
                    setSkillPreview(null);
                    setLimitPreview(null);
                }} title={config.skillTooltip}/>
                </div>
                <div class="drawer__control">
                  <label>Limit</label>
                  <SliderField value={limitDisplay} min={skillDisplay} max={1} step={0.01} onChange={(value) => setLimitPreview(value)} onCommit={(value) => {
                    if (!entity)
                        return;
                    store.actions.updateLimit(kind, entity, value);
                    setLimitPreview(null);
                }} title="Limit cannot be reduced below current skill."/>
                </div>
                {kind === 'actor' && (<>
                    <div class="drawer__control">
                      <label>Artistic Appeal</label>
                      <TagValueInput value={artValue} icon="🎭" title="Artistic Appeal (enter 0.0–10.0; saved as 0.000–1.000)" onCommit={(value) => store.actions.updateActorTag(entity, 'ART', value)}/>
                    </div>
                    <div class="drawer__control">
                      <label>Commercial Appeal</label>
                      <TagValueInput value={comValue} icon="⭐" title="Commercial Appeal (enter 0.0–10.0; saved as 0.000–1.000)" onCommit={(value) => store.actions.updateActorTag(entity, 'COM', value)}/>
                    </div>
                  </>)}
              </div>) : (<form class="drawer__form" onSubmit={handleSubmit}>
                <textarea value={jsonDraft} onInput={(event) => {
                    setJsonDraft(event.currentTarget.value);
                    setDirty(true);
                }} rows={18} spellCheck={false}/>
                {jsonError && <p class="drawer__error">{jsonError}</p>}
                <div class="drawer__buttons">
                  <button type="submit" disabled={!isDirty}>
                    Apply JSON Changes
                  </button>
                  <button type="button" onClick={() => {
                    if (!entity)
                        return;
                    setJsonDraft(JSON.stringify(entity, null, 2));
                    setJsonError(null);
                    setDirty(false);
                }} disabled={!isDirty}>
                    Revert Draft
                  </button>
                </div>
              </form>)}
          </section>
        </>)}
    </DetailDrawer>);
}
