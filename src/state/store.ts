import { computed, signal } from '@preact/signals';
import { extractCharacters, isActorEntry, isPlayerStudioEntity, fullName } from '../domain';
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
  const names = signal(initial?.save?.names ?? null);
  const filters = {
    actors: signal(initial?.filters?.actors ?? defaultActorFilters())
  };
  const timeline = signal<TimelineState>(initial?.timeline ?? defaultTimeline());
  const lastAction = signal<AppStoreSnapshot['lastAction']>(initial?.lastAction ?? null);

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
    derived: {
      filteredActors: filteredActors.value,
      hasChanges: hasChanges.value
    },
    lastAction: lastAction.value
  }));

  function noteAction(type: StoreAction, payload?: unknown) {
    lastAction.value = { type, payload };
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
        names.value = nameOverride;
        save.value = {
          raw,
          meta,
          characters,
          names: nameOverride
        };
        actors.value = actorEntities;
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
        timeline.value = {
          applied: [...timeline.value.applied, entry],
          undone: []
        };
        noteAction('applyChange', entry);
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
