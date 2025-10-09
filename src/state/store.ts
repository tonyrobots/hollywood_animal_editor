import { computed, signal } from '@preact/signals';
import {
  extractCharacters,
  isActorEntry,
  isPlayerStudioEntity,
  fullName,
  computeGameYearFromData,
  normalizeDecimalString,
  normalizeArtCom,
  ensureTag,
  formatUnitToTen,
  parseBirthDateParts,
  formatBirthDate
} from '../domain';
import type { TalentData } from '../types/save';
import type {
  ActorFilters,
  AppStore,
  AppStoreSnapshot,
  ChangeEntry,
  LoadedSave,
  SaveMeta,
  StoreAction,
  TimelineState
} from './types';

const MIN_BIRTH_YEAR = 1850;
const MAX_BIRTH_YEAR = 2100;

let changeSequence = 0;

function nextChangeId(): string {
  changeSequence += 1;
  return `change-${Date.now()}-${changeSequence}`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function ensureActorProfessions(actor: TalentData) {
  if (!actor.professions || typeof actor.professions !== 'object') {
    actor.professions = {};
  }
  return actor.professions;
}

function readActorSkill(actor: TalentData): string {
  const professions = ensureActorProfessions(actor);
  const normalized = normalizeDecimalString(professions.Actor ?? '');
  return normalized === '' ? '0.000' : normalized;
}

function writeActorSkill(actor: TalentData, value: string) {
  const professions = ensureActorProfessions(actor);
  professions.Actor = value;
}

function readActorLimit(actor: TalentData): string {
  const normalized = normalizeDecimalString(actor.limit ?? actor.Limit ?? '');
  return normalized === '' ? '' : normalized;
}

function writeActorLimit(actor: TalentData, value: string) {
  actor.limit = value;
  actor.Limit = value;
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

function defaultActorFilters(): ActorFilters {
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

export function createAppStore(initial?: Partial<AppStoreSnapshot>): AppStore {
  const save = signal<LoadedSave | null>(initial?.save ?? null);
  const actors = signal(initial?.actors ?? []);
  const names = signal(initial?.names ?? initial?.save?.names ?? null);
  const gameYear = signal<number | null>(initial?.gameYear ?? initial?.save?.gameYear ?? null);
  const filters = {
    actors: signal(initial?.filters?.actors ?? defaultActorFilters())
  };
  const timeline = signal<TimelineState>(initial?.timeline ?? defaultTimeline());
  const lastAction = signal<AppStoreSnapshot['lastAction']>(initial?.lastAction ?? null);

  let actorFallbackIds = new WeakMap<TalentData, number>();
  let fallbackSequence = 1;

  const filteredActors = computed(() => {
    const map = names.value;
    const current = actors.value;
    const { search, playerStudioOnly } = filters.actors.value;
    const term = search.trim().toLowerCase();
    return current.filter((actor) => {
      if (playerStudioOnly && !isPlayerStudioEntity(actor)) return false;
      if (!term) return true;
      const searchable = [
        actor.customName,
        actor.firstNameId,
        actor.lastNameId,
        actor.id != null ? String(actor.id) : ''
      ]
        .filter(Boolean)
        .map((value) => String(value).toLowerCase());
      if (map) {
        const resolved = fullName(map, {
          firstId: actor.firstNameId,
          lastId: actor.lastNameId,
          customName: actor.customName
        });
        if (resolved) searchable.push(resolved.toLowerCase());
      }
      return searchable.some((value) => value.includes(term));
    });
  });

  const hasChanges = computed(() => timeline.value.applied.length > 0);

  const snapshot = computed<AppStoreSnapshot>(() => ({
    save: save.value,
    actors: actors.value,
    filters: {
      actors: filters.actors.value
    },
    timeline: timeline.value,
    names: names.value,
    gameYear: gameYear.value,
    derived: {
      filteredActors: filteredActors.value,
      hasChanges: hasChanges.value
    },
    lastAction: lastAction.value
  }));

  function noteAction(type: StoreAction, payload?: unknown) {
    lastAction.value = { type, payload };
  }

  function refreshActorsAndSave() {
    actors.value = [...actors.value];
    if (save.value) {
      save.value = { ...save.value };
    }
  }

  function isKnownActor(actor: TalentData): boolean {
    return actors.value.includes(actor);
  }

  function toEntityRef(actor: TalentData) {
    const explicit = typeof actor.id === 'number' && Number.isFinite(actor.id) ? actor.id : null;
    if (explicit !== null) {
      return { kind: 'actor', id: explicit };
    }
    const existing = actorFallbackIds.get(actor);
    if (existing != null) {
      return { kind: 'actor', id: existing };
    }
    const index = actors.value.indexOf(actor);
    const assigned = index >= 0 ? index : fallbackSequence++;
    actorFallbackIds.set(actor, assigned);
    return { kind: 'actor', id: assigned };
  }

  function pushChange(entry: ChangeEntry) {
    timeline.value = {
      applied: [...timeline.value.applied, entry],
      undone: []
    };
    noteAction('applyChange', entry);
  }

  function applySnapshot(actor: TalentData, snapshot: TalentData) {
    const target = actor as Record<string, unknown>;
    const next = snapshot as Record<string, unknown>;
    const keysToRemove = new Set(Object.keys(target));
    for (const [key, value] of Object.entries(next)) {
      target[key] = value;
      keysToRemove.delete(key);
    }
    keysToRemove.forEach((key) => {
      delete target[key];
    });
    refreshActorsAndSave();
  }

  return {
    state: {
      snapshot: () => snapshot.value
    },
    signals: {
      save,
      actors,
      filters,
      timeline,
      names,
      gameYear,
      lastAction
    },
    derived: {
      filteredActors,
      hasChanges
    },
    actions: {
      loadSave(raw, meta, nameOverride = names.value ?? null) {
        let characters = [];
        try {
          const extracted = extractCharacters(raw);
          characters = Array.isArray(extracted) ? extracted : [];
        } catch (error) {
          if (import.meta.env.DEV) {
            console.warn('Failed to extract characters from save.', error);
          }
          characters = [];
        }
        const actorEntities = characters.filter((entity) => isActorEntry(entity));
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
        actors.value = [...actorEntities];
        actorFallbackIds = new WeakMap<TalentData, number>();
        fallbackSequence = 1;
        actorEntities.forEach((entity, index) => {
          if (typeof entity.id !== 'number') {
            actorFallbackIds.set(entity, index);
          }
        });
        filters.actors.value = defaultActorFilters();
        timeline.value = defaultTimeline();
        noteAction('loadSave', { meta, actors: actorEntities.length });
      },
      updateActorFilters(partial) {
        filters.actors.value = {
          ...filters.actors.value,
          ...partial
        };
        noteAction('applyChange', { scope: 'filters.actors', partial });
      },
      recordChange(entry) {
        pushChange(entry);
      },
      updateActorSkill(actor, value) {
        if (!actor || !isKnownActor(actor)) return;
        const normalizedInput = normalizeDecimalString(value);
        const nextSkill = normalizedInput === '' ? '0.000' : normalizedInput;
        const currentSkill = readActorSkill(actor);
        const currentLimit = readActorLimit(actor) || currentSkill;
        let nextLimit = currentLimit;

        const skillNumber = Number(nextSkill);
        const limitNumber = Number(currentLimit || '0');
        if (Number.isFinite(skillNumber) && (!Number.isFinite(limitNumber) || skillNumber > limitNumber)) {
          nextLimit = nextSkill;
        }

        if (nextSkill === currentSkill && nextLimit === currentLimit) return;

        const applyValues = (skill: string, limit: string) => {
          writeActorSkill(actor, skill);
          writeActorLimit(actor, limit);
          refreshActorsAndSave();
        };

        const change: ChangeEntry = {
          id: nextChangeId(),
          entity: toEntityRef(actor),
          label: `Acting Skill → ${formatUnitToTen(nextSkill) || nextSkill}`,
          path: 'professions.Actor',
          previous: { skill: currentSkill, limit: currentLimit },
          next: { skill: nextSkill, limit: nextLimit },
          timestamp: Date.now(),
          apply: () => applyValues(nextSkill, nextLimit),
          revert: () => applyValues(currentSkill, currentLimit)
        };

        applyValues(nextSkill, nextLimit);
        pushChange(change);
      },
      updateActorLimit(actor, value) {
        if (!actor || !isKnownActor(actor)) return;
        const normalizedInput = normalizeDecimalString(value);
        if (normalizedInput === '') return;

        const skill = readActorSkill(actor);
        const nextLimitNumber = Number(normalizedInput);
        const skillNumber = Number(skill);
        let nextLimit = normalizedInput;

        if (Number.isFinite(skillNumber) && (!Number.isFinite(nextLimitNumber) || nextLimitNumber < skillNumber)) {
          nextLimit = skill;
        }

        const currentLimit = readActorLimit(actor) || skill;
        if (nextLimit === currentLimit) return;

        const applyLimit = (limit: string) => {
          writeActorLimit(actor, limit);
          refreshActorsAndSave();
        };

        const change: ChangeEntry = {
          id: nextChangeId(),
          entity: toEntityRef(actor),
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
      },
      updateActorTag(actor, tagId, value) {
        if (!actor || !isKnownActor(actor)) return;
        const normalized = normalizeArtCom(value);
        const nextValue = normalized === '' ? '0.000' : normalized;
        const tag = ensureTag(actor, tagId);
        const currentValue = normalizeDecimalString(tag.value ?? '') || '0.000';
        if (currentValue === nextValue) return;

        const applyTagValue = (val: string) => {
          const target = ensureTag(actor, tagId);
          target.value = val;
          refreshActorsAndSave();
        };

        const change: ChangeEntry = {
          id: nextChangeId(),
          entity: toEntityRef(actor),
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
      updateActorAge(actor, age) {
        if (!actor || !isKnownActor(actor)) return;
        const currentYear = gameYear.value;
        if (typeof currentYear !== 'number') return;
        const numericAge = Number(age);
        if (!Number.isFinite(numericAge)) return;

        const clampedAge = clamp(Math.floor(numericAge), 0, 200);
        const targetYear = currentYear - clampedAge;
        const safeYear = clamp(targetYear, MIN_BIRTH_YEAR, MAX_BIRTH_YEAR);
        const previousValue = typeof actor.birthDate === 'string' ? actor.birthDate : null;
        const parts = parseBirthDateParts(previousValue ?? undefined) ?? { day: 1, month: 1, year: safeYear };
        const nextBirthDate = formatBirthDate(parts.day, parts.month, safeYear);
        if (previousValue === nextBirthDate) return;

        const applyBirthDate = (value: string | null) => {
          if (value === null) {
            delete actor.birthDate;
          } else {
            actor.birthDate = value;
          }
          refreshActorsAndSave();
        };

        const change: ChangeEntry = {
          id: nextChangeId(),
          entity: toEntityRef(actor),
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
      },
      applyActorSnapshot(actor, snapshot, label = 'Actor JSON edit') {
        if (!actor || !isKnownActor(actor)) return;
        if (!snapshot || typeof snapshot !== 'object') return;
        const previousSnapshot = deepClone(actor);
        const nextSnapshot = deepClone(snapshot);

        const mutateTo = (source: TalentData) => {
          applySnapshot(actor, source);
        };

        mutateTo(nextSnapshot);

        const change: ChangeEntry = {
          id: nextChangeId(),
          entity: toEntityRef(actor),
          label,
          path: '*',
          previous: previousSnapshot,
          next: deepClone(actor),
          timestamp: Date.now(),
          apply: () => mutateTo(deepClone(nextSnapshot)),
          revert: () => mutateTo(deepClone(previousSnapshot))
        };

        pushChange(change);
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
        filters.actors.value = defaultActorFilters();
        timeline.value = defaultTimeline();
        noteAction('reset');
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
      }
    }
  };
}
