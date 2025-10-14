import { computed, signal, type Signal } from '@preact/signals';
import {
  computeGameYearFromData,
  ensureTag,
  extractCharacters,
  formatBirthDate,
  formatUnitToTen,
  fullName,
  isActorEntry,
  isPlayerStudioEntity,
  isRoleEntry,
  normalizeArtCom,
  normalizeDecimalString,
  parseBirthDateParts
} from '../domain';
import type { TalentData } from '../types/save';
import type {
  AppStore,
  AppStoreSnapshot,
  ChangeEntry,
  CollectionFilters,
  EntityKind,
  LoadedSave,
  SaveMeta,
  StoreAction,
  TimelineState
} from './types';

const MIN_BIRTH_YEAR = 1850;
const MAX_BIRTH_YEAR = 2100;

let changeSequence = 0;

const ROLE_CONFIG = {
  actor: {
    professionKey: 'Actor',
    label: 'Acting Skill',
    predicate: isActorEntry
  },
  director: {
    professionKey: 'Director',
    label: 'Directing Skill',
    predicate: isRoleEntry('Director')
  }
} as const;

type SupportedKind = keyof typeof ROLE_CONFIG;
const ROLE_KINDS = Object.keys(ROLE_CONFIG) as SupportedKind[];

function isSupportedKind(kind: EntityKind | SupportedKind): kind is SupportedKind {
  return (ROLE_CONFIG as Record<string, unknown>)[kind as string] != null;
}

function nextChangeId(): string {
  changeSequence += 1;
  return `change-${Date.now()}-${changeSequence}`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function defaultFilters(): CollectionFilters {
  return {
    search: '',
    playerStudioOnly: false
  };
}

function defaultTimeline(): TimelineState {
  return {
    applied: [],
    undone: []
  };
}

function ensureProfessions(entity: TalentData) {
  if (!entity.professions || typeof entity.professions !== 'object') {
    entity.professions = {};
  }
  return entity.professions;
}

function readSkill(entity: TalentData, professionKey: string): string {
  const professions = ensureProfessions(entity);
  const normalized = normalizeDecimalString(professions[professionKey] ?? '');
  return normalized === '' ? '0.000' : normalized;
}

function writeSkill(entity: TalentData, professionKey: string, value: string) {
  const professions = ensureProfessions(entity);
  professions[professionKey] = value;
}

function readLimit(entity: TalentData): string {
  const normalized = normalizeDecimalString(entity.limit ?? entity.Limit ?? '');
  return normalized === '' ? '' : normalized;
}

function writeLimit(entity: TalentData, value: string) {
  entity.limit = value;
  entity.Limit = value;
}

function labelForTag(tagId: 'ART' | 'COM'): string {
  return tagId === 'ART' ? 'Artistic Appeal' : 'Commercial Appeal';
}

function deepClone<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

export function createAppStore(initial?: Partial<AppStoreSnapshot>): AppStore {
  const save = signal<LoadedSave | null>(initial?.save ?? null);
  const names = signal(initial?.names ?? initial?.save?.names ?? null);
  const gameYear = signal<number | null>(initial?.gameYear ?? initial?.save?.gameYear ?? null);

  const collections: Record<SupportedKind, Signal<TalentData[]>> = {
    actor: signal(initial?.actors ?? []),
    director: signal(initial?.directors ?? [])
  };

  const filters = {
    actor: signal(initial?.filters?.actors ?? defaultFilters()),
    director: signal(initial?.filters?.directors ?? defaultFilters())
  } as const;

  const actors = collections.actor;
  const directors = collections.director;

  const timeline = signal<TimelineState>(initial?.timeline ?? defaultTimeline());
  const lastAction = signal<AppStoreSnapshot['lastAction']>(initial?.lastAction ?? null);

  const fallbackIds: Record<SupportedKind, WeakMap<TalentData, number>> = {
    actor: new WeakMap(),
    director: new WeakMap()
  };
  const fallbackSequences: Record<SupportedKind, number> = {
    actor: 1,
    director: 1
  };

  const filteredActors = createFilteredCollection('actor');
  const filteredDirectors = createFilteredCollection('director');
  const hasChanges = computed(() => timeline.value.applied.length > 0);

  const snapshot = computed<AppStoreSnapshot>(() => ({
    save: save.value,
    actors: actors.value,
    directors: directors.value,
    filters: {
      actors: filters.actor.value,
      directors: filters.director.value
    },
    timeline: timeline.value,
    names: names.value,
    gameYear: gameYear.value,
    derived: {
      filteredActors: filteredActors.value,
      filteredDirectors: filteredDirectors.value,
      hasChanges: hasChanges.value
    },
    lastAction: lastAction.value
  }));

  function noteAction(type: StoreAction, payload?: unknown) {
    lastAction.value = { type, payload };
  }

  function createFilteredCollection(kind: SupportedKind) {
    const source = collections[kind];
    const filterSignal = filters[kind];
    return computed(() => {
      const map = names.value;
      const current = source.value;
      const { search, playerStudioOnly } = filterSignal.value;
      const term = search.trim().toLowerCase();
      return current.filter((entity) => {
        if (playerStudioOnly && !isPlayerStudioEntity(entity)) return false;
        if (!term) return true;
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
          if (resolved) searchable.push(resolved.toLowerCase());
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

  function resetFallbacks(kind: SupportedKind, entities: TalentData[]) {
    fallbackIds[kind] = new WeakMap();
    fallbackSequences[kind] = 1;
    entities.forEach((entity, index) => {
      if (typeof entity.id !== 'number' || !Number.isFinite(entity.id)) {
        fallbackIds[kind].set(entity, index);
      }
    });
  }

  function isKnown(kind: SupportedKind, entity: TalentData): boolean {
    return collections[kind].value.includes(entity);
  }

  function toEntityRef(kind: SupportedKind, entity: TalentData) {
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

  function pushChange(entry: ChangeEntry) {
    timeline.value = {
      applied: [...timeline.value.applied, entry],
      undone: []
    };
    noteAction('applyChange', entry);
  }

  function applySnapshot(kind: SupportedKind, entity: TalentData, snapshot: TalentData) {
    const target = entity as Record<string, unknown>;
    const next = snapshot as Record<string, unknown>;
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

  function updateFilters(kind: SupportedKind, partial: Partial<CollectionFilters>) {
    filters[kind].value = {
      ...filters[kind].value,
      ...partial
    };
    noteAction('applyChange', { scope: `filters.${kind}`, partial });
  }

  function updateSkillForRole(kind: SupportedKind, entity: TalentData, value: number | string) {
    if (!isKnown(kind, entity)) return;
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

    if (nextSkill === currentSkill && nextLimit === currentLimit) return;

    const applyValues = (skill: string, limit: string) => {
      writeSkill(entity, professionKey, skill);
      writeLimit(entity, limit);
      refreshCollectionsAndSave();
    };

    const change: ChangeEntry = {
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

  function updateLimitForRole(kind: SupportedKind, entity: TalentData, value: number | string) {
    if (!isKnown(kind, entity)) return;
    const { professionKey } = ROLE_CONFIG[kind];
    const normalizedInput = normalizeDecimalString(value);
    if (normalizedInput === '') return;

    const skill = readSkill(entity, professionKey);
    const currentLimit = readLimit(entity) || skill;
    const requested = normalizedInput;
    const requestedNumber = Number(requested);
    const skillNumber = Number(skill);
    let nextLimit = requested;

    if (
      Number.isFinite(skillNumber) &&
      Number.isFinite(requestedNumber) &&
      requestedNumber < skillNumber
    ) {
      nextLimit = skill;
    }

    if (nextLimit === currentLimit) return;

    const applyLimit = (limit: string) => {
      writeLimit(entity, limit);
      refreshCollectionsAndSave();
    };

    const change: ChangeEntry = {
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

  function updateAgeForRole(kind: SupportedKind, entity: TalentData, age: number) {
    if (!isKnown(kind, entity)) return;
    const currentYear = gameYear.value;
    if (typeof currentYear !== 'number') return;
    const numericAge = Number(age);
    if (!Number.isFinite(numericAge)) return;

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
    if (previousValue === nextBirthDate) return;

    const applyBirthDate = (value: string | null) => {
      if (value === null) {
        delete entity.birthDate;
      } else {
        entity.birthDate = value;
      }
      refreshCollectionsAndSave();
    };

    const change: ChangeEntry = {
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

  function applyRoleSnapshot(kind: SupportedKind, entity: TalentData, snapshot: TalentData, label = 'Talent JSON edit') {
    if (!isKnown(kind, entity)) return;
    if (!snapshot || typeof snapshot !== 'object') return;
    const previousSnapshot = deepClone(entity);
    const nextSnapshot = deepClone(snapshot);

    const apply = (source: TalentData) => {
      applySnapshot(kind, entity, source);
    };

    apply(nextSnapshot);

    const change: ChangeEntry = {
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
      filters: {
        actors: filters.actor,
        directors: filters.director
      },
      timeline,
      names,
      gameYear,
      lastAction
    },
    derived: {
      filteredActors,
      filteredDirectors,
      hasChanges
    },
    actions: {
      loadSave(raw, meta, nameOverride = names.value ?? null) {
        let characters: TalentData[] = [];
        try {
          const extracted = extractCharacters(raw);
          characters = Array.isArray(extracted) ? extracted : [];
        } catch (error) {
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

        timeline.value = defaultTimeline();
        noteAction('loadSave', {
          meta,
          counts: ROLE_KINDS.reduce<Record<string, number>>((acc, kind) => {
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
      updateCollectionFilters(kind, partial) {
        if (!isSupportedKind(kind)) return;
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
      updateActorSkill(entity, value) {
        updateSkillForRole('actor', entity, value);
      },
      updateActorLimit(entity, value) {
        updateLimitForRole('actor', entity, value);
      },
      updateActorTag(entity, tagId, value) {
        if (!isKnown('actor', entity)) return;
        const normalized = normalizeArtCom(value);
        const nextValue = normalized === '' ? '0.000' : normalized;
        const tag = ensureTag(entity, tagId);
        const currentValue = normalizeDecimalString(tag.value ?? '') || '0.000';
        if (currentValue === nextValue) return;

        const applyTagValue = (val: string) => {
          const target = ensureTag(entity, tagId);
          target.value = val;
          refreshCollectionsAndSave();
        };

        const change: ChangeEntry = {
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
      updateDirectorSkill(entity, value) {
        updateSkillForRole('director', entity, value);
      },
      updateDirectorLimit(entity, value) {
        updateLimitForRole('director', entity, value);
      },
      updateDirectorAge(entity, age) {
        updateAgeForRole('director', entity, age);
      },
      applyActorSnapshot(entity, snapshot, label) {
        applyRoleSnapshot('actor', entity, snapshot, label ?? 'Actor JSON edit');
      },
      applyDirectorSnapshot(entity, snapshot, label) {
        applyRoleSnapshot('director', entity, snapshot, label ?? 'Director JSON edit');
      },
      undo() {
        const applied = [...timeline.value.applied];
        if (!applied.length) return;
        const last = applied.pop()!;
        last.revert?.();
        timeline.value = {
          applied,
          undone: [last, ...timeline.value.undone]
        };
        noteAction('undo', last);
      },
      redo() {
        const undone = [...timeline.value.undone];
        if (!undone.length) return;
        const next = undone.shift()!;
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
        timeline.value = defaultTimeline();
        noteAction('reset');
      }
    }
  };
}
