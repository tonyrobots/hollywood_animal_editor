import { computed, signal } from '@preact/signals';
import { computeGameYearFromData, ensureTag, extractCharacters, formatBirthDate, formatStudioDisplay, formatUnitToHundred, formatUnitToTen, fullName, isActorEntry, isPlayerStudioEntity, isRoleEntry, normalizeArtCom, normalizeDecimalString, parseBirthDateParts } from '../domain';
const MIN_BIRTH_YEAR = 1850;
const MAX_BIRTH_YEAR = 2100;
let changeSequence = 0;
const GENDER_LABELS = {
    0: 'Male',
    1: 'Female'
};
const READINESS_LABELS = ['No tricks', 'Only clean tricks', 'Dirty tricks allowed'];
export const ROLE_CONFIG = {
    actor: {
        professionKey: 'Actor',
        label: 'Acting Skill',
        predicate: isActorEntry,
        collectionKey: 'actors',
        filteredKey: 'filteredActors',
        detailLabel: 'Actor',
        title: 'Actors',
        skillTooltip: 'Acting skill (0–1 range shown as 0–10).'
    },
    director: {
        professionKey: 'Director',
        label: 'Directing Skill',
        predicate: isRoleEntry('Director'),
        collectionKey: 'directors',
        filteredKey: 'filteredDirectors',
        detailLabel: 'Director',
        title: 'Directors',
        skillTooltip: 'Directing skill (0–1 range shown as 0–10).'
    },
    producer: {
        professionKey: 'Producer',
        label: 'Producing Skill',
        predicate: isRoleEntry('Producer'),
        collectionKey: 'producers',
        filteredKey: 'filteredProducers',
        detailLabel: 'Producer',
        title: 'Producers',
        skillTooltip: 'Producing skill (0–1 range shown as 0–10).'
    },
    writer: {
        professionKey: 'Scriptwriter',
        label: 'Writing Skill',
        predicate: isRoleEntry('Scriptwriter'),
        collectionKey: 'writers',
        filteredKey: 'filteredWriters',
        detailLabel: 'Writer',
        title: 'Writers',
        skillTooltip: 'Writing skill (0–1 range shown as 0–10).'
    },
    editor: {
        professionKey: 'FilmEditor',
        label: 'Editing Skill',
        predicate: isRoleEntry('FilmEditor'),
        collectionKey: 'editors',
        filteredKey: 'filteredEditors',
        detailLabel: 'Editor',
        title: 'Editors',
        skillTooltip: 'Editing skill (0–1 range shown as 0–10).'
    },
    composer: {
        professionKey: 'Composer',
        label: 'Composing Skill',
        predicate: isRoleEntry('Composer'),
        collectionKey: 'composers',
        filteredKey: 'filteredComposers',
        detailLabel: 'Composer',
        title: 'Composers',
        skillTooltip: 'Composing skill (0–1 range shown as 0–10).'
    },
    cinematographer: {
        professionKey: 'Cinematographer',
        label: 'Cinematography Skill',
        predicate: isRoleEntry('Cinematographer'),
        collectionKey: 'cinematographers',
        filteredKey: 'filteredCinematographers',
        detailLabel: 'Cinematographer',
        title: 'Cinematographers',
        skillTooltip: 'Cinematography skill (0–1 range shown as 0–10).'
    },
    agent: {
        professionKey: 'Agent',
        label: 'Agent Skill',
        predicate: isRoleEntry('Agent'),
        collectionKey: 'agents',
        filteredKey: 'filteredAgents',
        detailLabel: 'Agent',
        title: 'Agents',
        skillTooltip: 'Agent skill (0–1 range shown as 0–10).'
    }
};
export const ROLE_KINDS = Object.keys(ROLE_CONFIG);
function isSupportedKind(kind) {
    return ROLE_CONFIG[kind] != null;
}
function nextChangeId() {
    changeSequence += 1;
    return `change-${Date.now()}-${changeSequence}`;
}
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
function defaultFilters() {
    return {
        search: ''
    };
}
function defaultGlobalFilters() {
    return {
        playerStudioOnly: false
    };
}
function defaultTimeline() {
    return {
        applied: [],
        undone: []
    };
}
function ensureProfessions(entity) {
    if (!entity.professions || typeof entity.professions !== 'object') {
        entity.professions = {};
    }
    return entity.professions;
}
function readSkill(entity, professionKey) {
    const professions = ensureProfessions(entity);
    const normalized = normalizeDecimalString(professions[professionKey] ?? '');
    return normalized === '' ? '0.000' : normalized;
}
function writeSkill(entity, professionKey, value) {
    const professions = ensureProfessions(entity);
    professions[professionKey] = value;
}
function readLimit(entity) {
    const normalized = normalizeDecimalString(entity.limit ?? entity.Limit ?? '');
    return normalized === '' ? '' : normalized;
}
function writeLimit(entity, value) {
    entity.limit = value;
    entity.Limit = value;
}
function labelForTag(tagId) {
    return tagId === 'ART' ? 'Artistic Appeal' : 'Commercial Appeal';
}
function deepClone(value) {
    if (typeof structuredClone === 'function') {
        return structuredClone(value);
    }
    return JSON.parse(JSON.stringify(value));
}
export function createAppStore(initial) {
    const save = signal(initial?.save ?? null);
    const names = signal(initial?.names ?? initial?.save?.names ?? null);
    const gameYear = signal(initial?.gameYear ?? initial?.save?.gameYear ?? null);
    const globalFilters = signal(initial?.globalFilters ?? defaultGlobalFilters());
    const collections = {
        actor: signal(initial?.actors ?? []),
        director: signal(initial?.directors ?? []),
        producer: signal(initial?.producers ?? []),
        writer: signal(initial?.writers ?? []),
        editor: signal(initial?.editors ?? []),
        composer: signal(initial?.composers ?? []),
        cinematographer: signal(initial?.cinematographers ?? []),
        agent: signal(initial?.agents ?? [])
    };
    const filters = {
        actor: signal(initial?.filters?.actors ?? defaultFilters()),
        director: signal(initial?.filters?.directors ?? defaultFilters()),
        producer: signal(initial?.filters?.producers ?? defaultFilters()),
        writer: signal(initial?.filters?.writers ?? defaultFilters()),
        editor: signal(initial?.filters?.editors ?? defaultFilters()),
        composer: signal(initial?.filters?.composers ?? defaultFilters()),
        cinematographer: signal(initial?.filters?.cinematographers ?? defaultFilters()),
        agent: signal(initial?.filters?.agents ?? defaultFilters())
    };
    const actors = collections.actor;
    const directors = collections.director;
    const producers = collections.producer;
    const writers = collections.writer;
    const editors = collections.editor;
    const composers = collections.composer;
    const cinematographers = collections.cinematographer;
    const agents = collections.agent;
    const timeline = signal(initial?.timeline ?? defaultTimeline());
    const lastAction = signal(initial?.lastAction ?? null);
    const fallbackIds = {
        actor: new WeakMap(),
        director: new WeakMap(),
        producer: new WeakMap(),
        writer: new WeakMap(),
        editor: new WeakMap(),
        composer: new WeakMap(),
        cinematographer: new WeakMap(),
        agent: new WeakMap()
    };
    const fallbackSequences = {
        actor: 1,
        director: 1,
        producer: 1,
        writer: 1,
        editor: 1,
        composer: 1,
        cinematographer: 1,
        agent: 1
    };
    const filteredCollections = {};
    for (const kind of ROLE_KINDS) {
        filteredCollections[kind] = createFilteredCollection(kind);
    }
    const filteredActors = filteredCollections.actor;
    const filteredDirectors = filteredCollections.director;
    const filteredProducers = filteredCollections.producer;
    const filteredWriters = filteredCollections.writer;
    const filteredEditors = filteredCollections.editor;
    const filteredComposers = filteredCollections.composer;
    const filteredCinematographers = filteredCollections.cinematographer;
    const filteredAgents = filteredCollections.agent;
    const hasChanges = computed(() => timeline.value.applied.length > 0);
    const snapshot = computed(() => ({
        save: save.value,
        actors: actors.value,
        directors: directors.value,
        producers: producers.value,
        writers: writers.value,
        editors: editors.value,
        composers: composers.value,
        cinematographers: cinematographers.value,
        agents: agents.value,
        globalFilters: globalFilters.value,
        filters: {
            actors: filters.actor.value,
            directors: filters.director.value,
            producers: filters.producer.value,
            writers: filters.writer.value,
            editors: filters.editor.value,
            composers: filters.composer.value,
            cinematographers: filters.cinematographer.value,
            agents: filters.agent.value
        },
        timeline: timeline.value,
        names: names.value,
        gameYear: gameYear.value,
        derived: {
            filteredActors: filteredActors.value,
            filteredDirectors: filteredDirectors.value,
            filteredProducers: filteredProducers.value,
            filteredWriters: filteredWriters.value,
            filteredEditors: filteredEditors.value,
            filteredComposers: filteredComposers.value,
            filteredCinematographers: filteredCinematographers.value,
            filteredAgents: filteredAgents.value,
            hasChanges: hasChanges.value
        },
        lastAction: lastAction.value
    }));
    function noteAction(type, payload) {
        lastAction.value = { type, payload };
    }
    function createFilteredCollection(kind) {
        const source = collections[kind];
        const filterSignal = filters[kind];
        return computed(() => {
            const map = names.value;
            const current = source.value;
            const { search } = filterSignal.value;
            const { playerStudioOnly } = globalFilters.value;
            const term = search.trim().toLowerCase();
            return current.filter((entity) => {
                if (playerStudioOnly && !isPlayerStudioEntity(entity))
                    return false;
                if (!term)
                    return true;
                const searchable = [
                    entity.customName,
                    entity.firstNameId,
                    entity.lastNameId,
                    entity.id != null ? String(entity.id) : ''
                ]
                    .filter(Boolean)
                    .map((value) => String(value).toLowerCase());
                if (map) {
                    const resolved = fullName(map, {
                        firstId: entity.firstNameId,
                        lastId: entity.lastNameId,
                        customName: entity.customName
                    });
                    if (resolved)
                        searchable.push(resolved.toLowerCase());
                }
                return searchable.some((value) => value.includes(term));
            });
        });
    }
    function refreshCollectionsAndSave() {
        for (const kind of ROLE_KINDS) {
            const signalRef = collections[kind];
            signalRef.value = [...signalRef.value];
        }
        if (save.value) {
            save.value = { ...save.value };
        }
    }
    function resetFallbacks(kind, entities) {
        fallbackIds[kind] = new WeakMap();
        fallbackSequences[kind] = 1;
        entities.forEach((entity, index) => {
            if (typeof entity.id !== 'number' || !Number.isFinite(entity.id)) {
                fallbackIds[kind].set(entity, index);
            }
        });
    }
    function isKnown(kind, entity) {
        return collections[kind].value.includes(entity);
    }
    function toEntityRef(kind, entity) {
        const explicit = typeof entity.id === 'number' && Number.isFinite(entity.id) ? entity.id : null;
        if (explicit !== null) {
            return { kind, id: explicit };
        }
        const map = fallbackIds[kind];
        const existing = map.get(entity);
        if (existing != null) {
            return { kind, id: existing };
        }
        const collection = collections[kind].value;
        const index = collection.indexOf(entity);
        const assigned = index >= 0 ? index : fallbackSequences[kind]++;
        map.set(entity, assigned);
        return { kind, id: assigned };
    }
    function pushChange(entry) {
        timeline.value = {
            applied: [...timeline.value.applied, entry],
            undone: []
        };
        noteAction('applyChange', entry);
    }
    function applySnapshot(kind, entity, snapshot) {
        const target = entity;
        const next = snapshot;
        const keysToRemove = new Set(Object.keys(target));
        for (const [key, value] of Object.entries(next)) {
            target[key] = value;
            keysToRemove.delete(key);
        }
        keysToRemove.forEach((key) => {
            delete target[key];
        });
        refreshCollectionsAndSave();
    }
    function updateFilters(kind, partial) {
        filters[kind].value = {
            ...filters[kind].value,
            ...partial
        };
        noteAction('applyChange', { scope: `filters.${kind}`, partial });
    }
    function updateGlobalFiltersImpl(partial) {
        globalFilters.value = {
            ...globalFilters.value,
            ...partial
        };
        noteAction('applyChange', { scope: 'globalFilters', partial });
    }
    function updateCustomNameForRole(kind, entity, name) {
        if (!isKnown(kind, entity))
            return;
        const trimmed = typeof name === 'string' ? name.trim() : '';
        const next = trimmed === '' ? null : trimmed;
        const previous = typeof entity.customName === 'string' && entity.customName.trim() !== '' ? entity.customName : null;
        if (previous === next)
            return;
        const applyName = (value) => {
            if (value === null) {
                delete entity.customName;
            }
            else {
                entity.customName = value;
            }
            refreshCollectionsAndSave();
        };
        const label = next ? `Custom Name → "${next}"` : 'Custom Name cleared';
        const change = {
            id: nextChangeId(),
            entity: toEntityRef(kind, entity),
            label,
            path: 'customName',
            previous,
            next,
            timestamp: Date.now(),
            apply: () => applyName(next),
            revert: () => applyName(previous)
        };
        applyName(next);
        pushChange(change);
    }
    function updateGenderForRole(kind, entity, gender) {
        if (!isKnown(kind, entity))
            return;
        const next = Number(gender) === 1 ? 1 : 0;
        const previous = typeof entity.gender === 'number' ? (Number(entity.gender) === 1 ? 1 : 0) : undefined;
        if (previous === next)
            return;
        const applyGender = (value) => {
            if (value === undefined) {
                delete entity.gender;
            }
            else {
                entity.gender = value;
            }
            refreshCollectionsAndSave();
        };
        const label = `Gender → ${GENDER_LABELS[next] ?? String(next)}`;
        const change = {
            id: nextChangeId(),
            entity: toEntityRef(kind, entity),
            label,
            path: 'gender',
            previous,
            next,
            timestamp: Date.now(),
            apply: () => applyGender(next),
            revert: () => applyGender(previous)
        };
        applyGender(next);
        pushChange(change);
    }
    function updateScalarStatForRole(kind, entity, key, value, label, format) {
        if (!isKnown(kind, entity))
            return;
        const numeric = Number(value);
        const base = Number.isFinite(numeric) ? numeric : 0;
        const bounded = key === 'selfEsteem' ? base : Math.min(Math.max(base, 0), 1);
        const sanitized = Math.abs(bounded) < 0.0005 ? 0 : bounded;
        const next = sanitized.toFixed(3);
        const previous = normalizeDecimalString(entity[key] ?? '');
        if (previous === next)
            return;
        const applyValue = (val) => {
            entity[key] = val;
            refreshCollectionsAndSave();
        };
        const change = {
            id: nextChangeId(),
            entity: toEntityRef(kind, entity),
            label: `${label} → ${format(sanitized)}`,
            path: key,
            previous,
            next,
            timestamp: Date.now(),
            apply: () => applyValue(next),
            revert: () => applyValue(previous)
        };
        applyValue(next);
        pushChange(change);
    }
    function updateReadinessForRole(kind, entity, readiness) {
        if (!isKnown(kind, entity))
            return;
        const normalized = Math.min(Math.max(Math.round(Number(readiness) || 0), 0), READINESS_LABELS.length - 1);
        const previousRaw = Number.isFinite(Number(entity.readinessForTricks)) ? Number(entity.readinessForTricks) : 0;
        if (previousRaw === normalized)
            return;
        const applyValue = (val) => {
            entity.readinessForTricks = val;
            refreshCollectionsAndSave();
        };
        const change = {
            id: nextChangeId(),
            entity: toEntityRef(kind, entity),
            label: `Readiness for Tricks → ${READINESS_LABELS[normalized] ?? normalized}`,
            path: 'readinessForTricks',
            previous: previousRaw,
            next: normalized,
            timestamp: Date.now(),
            apply: () => applyValue(normalized),
            revert: () => applyValue(previousRaw)
        };
        applyValue(normalized);
        pushChange(change);
    }
    function updateSkillForRole(kind, entity, value) {
        if (!isKnown(kind, entity))
            return;
        const { professionKey, label } = ROLE_CONFIG[kind];
        const normalizedInput = normalizeDecimalString(value);
        const nextSkill = normalizedInput === '' ? '0.000' : normalizedInput;
        const currentSkill = readSkill(entity, professionKey);
        const currentLimit = readLimit(entity) || currentSkill;
        let nextLimit = currentLimit;
        const skillNumber = Number(nextSkill);
        const limitNumber = Number(currentLimit || '0');
        if (Number.isFinite(skillNumber) && (!Number.isFinite(limitNumber) || skillNumber > limitNumber)) {
            nextLimit = nextSkill;
        }
        if (nextSkill === currentSkill && nextLimit === currentLimit)
            return;
        const applyValues = (skill, limit) => {
            writeSkill(entity, professionKey, skill);
            writeLimit(entity, limit);
            refreshCollectionsAndSave();
        };
        const change = {
            id: nextChangeId(),
            entity: toEntityRef(kind, entity),
            label: `${label} → ${formatUnitToTen(nextSkill) || nextSkill}`,
            path: `professions.${professionKey}`,
            previous: { skill: currentSkill, limit: currentLimit },
            next: { skill: nextSkill, limit: nextLimit },
            timestamp: Date.now(),
            apply: () => applyValues(nextSkill, nextLimit),
            revert: () => applyValues(currentSkill, currentLimit)
        };
        applyValues(nextSkill, nextLimit);
        pushChange(change);
    }
    function updateLimitForRole(kind, entity, value) {
        if (!isKnown(kind, entity))
            return;
        const { professionKey } = ROLE_CONFIG[kind];
        const normalizedInput = normalizeDecimalString(value);
        if (normalizedInput === '')
            return;
        const skill = readSkill(entity, professionKey);
        const currentLimit = readLimit(entity) || skill;
        const requested = normalizedInput;
        const requestedNumber = Number(requested);
        const skillNumber = Number(skill);
        let nextLimit = requested;
        if (Number.isFinite(skillNumber) &&
            Number.isFinite(requestedNumber) &&
            requestedNumber < skillNumber) {
            nextLimit = skill;
        }
        if (nextLimit === currentLimit)
            return;
        const applyLimit = (limit) => {
            writeLimit(entity, limit);
            refreshCollectionsAndSave();
        };
        const change = {
            id: nextChangeId(),
            entity: toEntityRef(kind, entity),
            label: `Limit → ${formatUnitToTen(nextLimit) || nextLimit}`,
            path: 'limit',
            previous: currentLimit,
            next: nextLimit,
            timestamp: Date.now(),
            apply: () => applyLimit(nextLimit),
            revert: () => applyLimit(currentLimit)
        };
        applyLimit(nextLimit);
        pushChange(change);
    }
    function updateAgeForRole(kind, entity, age) {
        if (!isKnown(kind, entity))
            return;
        const currentYear = gameYear.value;
        if (typeof currentYear !== 'number')
            return;
        const numericAge = Number(age);
        if (!Number.isFinite(numericAge))
            return;
        const clampedAge = clamp(Math.floor(numericAge), 0, 200);
        const targetYear = currentYear - clampedAge;
        const safeYear = clamp(targetYear, MIN_BIRTH_YEAR, MAX_BIRTH_YEAR);
        const previousValue = typeof entity.birthDate === 'string' ? entity.birthDate : null;
        const parts = parseBirthDateParts(previousValue ?? undefined) ?? {
            day: 1,
            month: 1,
            year: safeYear
        };
        const nextBirthDate = formatBirthDate(parts.day, parts.month, safeYear);
        if (previousValue === nextBirthDate)
            return;
        const applyBirthDate = (value) => {
            if (value === null) {
                delete entity.birthDate;
            }
            else {
                entity.birthDate = value;
            }
            refreshCollectionsAndSave();
        };
        const change = {
            id: nextChangeId(),
            entity: toEntityRef(kind, entity),
            label: `Age → ${clampedAge}`,
            path: 'birthDate',
            previous: previousValue,
            next: nextBirthDate,
            timestamp: Date.now(),
            apply: () => applyBirthDate(nextBirthDate),
            revert: () => applyBirthDate(previousValue)
        };
        applyBirthDate(nextBirthDate);
        pushChange(change);
    }
    function updateStudioForRole(kind, entity, studioId) {
        if (!isKnown(kind, entity))
            return;
        const previousRaw = typeof entity.studioId === 'string'
            ? entity.studioId
            : entity.studioId == null
                ? null
                : String(entity.studioId);
        const normalized = studioId && studioId.trim() ? studioId.trim().toUpperCase() : null;
        if (previousRaw === normalized)
            return;
        const applyStudio = (value) => {
            if (value === null) {
                entity.studioId = null;
            }
            else {
                entity.studioId = value;
            }
            refreshCollectionsAndSave();
        };
        const change = {
            id: nextChangeId(),
            entity: toEntityRef(kind, entity),
            label: `Studio → ${formatStudioDisplay(normalized)}`,
            path: 'studioId',
            previous: previousRaw,
            next: normalized,
            timestamp: Date.now(),
            apply: () => applyStudio(normalized),
            revert: () => applyStudio(previousRaw)
        };
        applyStudio(normalized);
        pushChange(change);
    }
    function applyRoleSnapshot(kind, entity, snapshot, label = 'Talent JSON edit') {
        if (!isKnown(kind, entity))
            return;
        if (!snapshot || typeof snapshot !== 'object')
            return;
        const previousSnapshot = deepClone(entity);
        const nextSnapshot = deepClone(snapshot);
        const apply = (source) => {
            applySnapshot(kind, entity, source);
        };
        apply(nextSnapshot);
        const change = {
            id: nextChangeId(),
            entity: toEntityRef(kind, entity),
            label,
            path: '*',
            previous: previousSnapshot,
            next: deepClone(entity),
            timestamp: Date.now(),
            apply: () => apply(deepClone(nextSnapshot)),
            revert: () => apply(deepClone(previousSnapshot))
        };
        pushChange(change);
    }
    return {
        state: {
            snapshot: () => snapshot.value
        },
        signals: {
            save,
            actors,
            directors,
            producers,
            writers,
            editors,
            composers,
            cinematographers,
            agents,
            globalFilters,
            filters: {
                actors: filters.actor,
                directors: filters.director,
                producers: filters.producer,
                writers: filters.writer,
                editors: filters.editor,
                composers: filters.composer,
                cinematographers: filters.cinematographer,
                agents: filters.agent
            },
            timeline,
            names,
            gameYear,
            lastAction
        },
        derived: {
            filteredActors,
            filteredDirectors,
            filteredProducers,
            filteredWriters,
            filteredEditors,
            filteredComposers,
            filteredCinematographers,
            filteredAgents,
            hasChanges
        },
        actions: {
            loadSave(raw, meta, nameOverride = names.value ?? null) {
                let characters = [];
                try {
                    const extracted = extractCharacters(raw);
                    characters = Array.isArray(extracted) ? extracted : [];
                }
                catch (error) {
                    if (import.meta.env.DEV) {
                        console.warn('Failed to extract characters from save.', error);
                    }
                    characters = [];
                }
                const computedYear = computeGameYearFromData(raw);
                names.value = nameOverride;
                gameYear.value = typeof computedYear === 'number' ? computedYear : null;
                save.value = {
                    raw,
                    meta,
                    characters,
                    names: nameOverride,
                    gameYear: gameYear.value
                };
                for (const kind of ROLE_KINDS) {
                    const predicate = ROLE_CONFIG[kind].predicate;
                    const entities = predicate ? characters.filter((entity) => predicate(entity)) : [];
                    collections[kind].value = [...entities];
                    resetFallbacks(kind, entities);
                    filters[kind].value = defaultFilters();
                }
                globalFilters.value = defaultGlobalFilters();
                timeline.value = defaultTimeline();
                noteAction('loadSave', {
                    meta,
                    counts: ROLE_KINDS.reduce((acc, kind) => {
                        acc[kind] = collections[kind].value.length;
                        return acc;
                    }, {})
                });
            },
            setNameMap(newNames) {
                names.value = newNames;
                if (save.value) {
                    save.value = {
                        ...save.value,
                        names: newNames
                    };
                }
                noteAction('applyChange', { scope: 'names', size: newNames?.length ?? 0 });
            },
            updateGlobalFilters(partial) {
                updateGlobalFiltersImpl(partial);
            },
            updateCollectionFilters(kind, partial) {
                if (!isSupportedKind(kind))
                    return;
                updateFilters(kind, partial);
            },
            updateActorFilters(partial) {
                updateFilters('actor', partial);
            },
            updateDirectorFilters(partial) {
                updateFilters('director', partial);
            },
            recordChange(entry) {
                pushChange(entry);
            },
            updateCustomName(kind, entity, name) {
                if (!isSupportedKind(kind))
                    return;
                updateCustomNameForRole(kind, entity, name);
            },
            updateGender(kind, entity, gender) {
                if (!isSupportedKind(kind))
                    return;
                updateGenderForRole(kind, entity, gender);
            },
            updateMood(kind, entity, value) {
                if (!isSupportedKind(kind))
                    return;
                updateScalarStatForRole(kind, entity, 'mood', value, 'Happiness', (v) => `${formatUnitToHundred(v)}%`);
            },
            updateAttitude(kind, entity, value) {
                if (!isSupportedKind(kind))
                    return;
                updateScalarStatForRole(kind, entity, 'attitude', value, 'Loyalty', (v) => `${formatUnitToHundred(v)}%`);
            },
            updateSelfEsteem(kind, entity, value) {
                if (!isSupportedKind(kind))
                    return;
                updateScalarStatForRole(kind, entity, 'selfEsteem', value, 'Self-esteem', (v) => formatUnitToTen(v));
            },
            updateReadiness(kind, entity, readiness) {
                if (!isSupportedKind(kind))
                    return;
                updateReadinessForRole(kind, entity, readiness);
            },
            updateStudio(kind, entity, studioId) {
                if (!isSupportedKind(kind))
                    return;
                updateStudioForRole(kind, entity, studioId);
            },
            updateSkill(kind, entity, value) {
                if (!isSupportedKind(kind))
                    return;
                updateSkillForRole(kind, entity, value);
            },
            updateLimit(kind, entity, value) {
                if (!isSupportedKind(kind))
                    return;
                updateLimitForRole(kind, entity, value);
            },
            updateAge(kind, entity, age) {
                if (!isSupportedKind(kind))
                    return;
                updateAgeForRole(kind, entity, age);
            },
            applySnapshot(kind, entity, snapshot, label) {
                if (!isSupportedKind(kind))
                    return;
                const fallbackLabel = `${ROLE_CONFIG[kind].detailLabel} JSON edit`;
                applyRoleSnapshot(kind, entity, snapshot, label ?? fallbackLabel);
            },
            updateActorSkill(entity, value) {
                updateSkillForRole('actor', entity, value);
            },
            updateActorLimit(entity, value) {
                updateLimitForRole('actor', entity, value);
            },
            updateActorTag(entity, tagId, value) {
                if (!isKnown('actor', entity))
                    return;
                const normalized = normalizeArtCom(value);
                const nextValue = normalized === '' ? '0.000' : normalized;
                const tag = ensureTag(entity, tagId);
                const currentValue = normalizeDecimalString(tag.value ?? '') || '0.000';
                if (currentValue === nextValue)
                    return;
                const applyTagValue = (val) => {
                    const target = ensureTag(entity, tagId);
                    target.value = val;
                    refreshCollectionsAndSave();
                };
                const change = {
                    id: nextChangeId(),
                    entity: toEntityRef('actor', entity),
                    label: `${labelForTag(tagId)} → ${formatUnitToTen(nextValue) || nextValue}`,
                    path: `whiteTagsNEW.${tagId}.value`,
                    previous: currentValue,
                    next: nextValue,
                    timestamp: Date.now(),
                    apply: () => applyTagValue(nextValue),
                    revert: () => applyTagValue(currentValue)
                };
                applyTagValue(nextValue);
                pushChange(change);
            },
            updateActorAge(entity, age) {
                updateAgeForRole('actor', entity, age);
            },
            updateActorCustomName(entity, name) {
                updateCustomNameForRole('actor', entity, name);
            },
            updateActorGender(entity, gender) {
                updateGenderForRole('actor', entity, gender);
            },
            updateActorMood(entity, value) {
                updateScalarStatForRole('actor', entity, 'mood', value, 'Happiness', (v) => `${formatUnitToHundred(v)}%`);
            },
            updateActorAttitude(entity, value) {
                updateScalarStatForRole('actor', entity, 'attitude', value, 'Loyalty', (v) => `${formatUnitToHundred(v)}%`);
            },
            updateActorSelfEsteem(entity, value) {
                updateScalarStatForRole('actor', entity, 'selfEsteem', value, 'Self-esteem', (v) => formatUnitToTen(v));
            },
            updateActorReadiness(entity, readiness) {
                updateReadinessForRole('actor', entity, readiness);
            },
            updateActorStudio(entity, studioId) {
                updateStudioForRole('actor', entity, studioId);
            },
            updateDirectorSkill(entity, value) {
                updateSkillForRole('director', entity, value);
            },
            updateDirectorLimit(entity, value) {
                updateLimitForRole('director', entity, value);
            },
            updateDirectorAge(entity, age) {
                updateAgeForRole('director', entity, age);
            },
            updateDirectorCustomName(entity, name) {
                updateCustomNameForRole('director', entity, name);
            },
            updateDirectorGender(entity, gender) {
                updateGenderForRole('director', entity, gender);
            },
            updateDirectorStudio(entity, studioId) {
                updateStudioForRole('director', entity, studioId);
            },
            applyActorSnapshot(entity, snapshot, label) {
                applyRoleSnapshot('actor', entity, snapshot, label ?? 'Actor JSON edit');
            },
            applyDirectorSnapshot(entity, snapshot, label) {
                applyRoleSnapshot('director', entity, snapshot, label ?? 'Director JSON edit');
            },
            undo() {
                const applied = [...timeline.value.applied];
                if (!applied.length)
                    return;
                const last = applied.pop();
                last.revert?.();
                timeline.value = {
                    applied,
                    undone: [last, ...timeline.value.undone]
                };
                noteAction('undo', last);
            },
            redo() {
                const undone = [...timeline.value.undone];
                if (!undone.length)
                    return;
                const next = undone.shift();
                next.apply?.();
                timeline.value = {
                    applied: [...timeline.value.applied, next],
                    undone
                };
                noteAction('redo', next);
            },
            reset() {
                for (const kind of ROLE_KINDS) {
                    filters[kind].value = defaultFilters();
                }
                globalFilters.value = defaultGlobalFilters();
                timeline.value = defaultTimeline();
                noteAction('reset');
            }
        }
    };
}
