import type { Signal } from '@preact/signals';
import type { TalentData } from '../types/save';

export type EntityKind =
  | 'actor'
  | 'director'
  | 'producer'
  | 'writer'
  | 'editor'
  | 'composer'
  | 'cinematographer'
  | 'agent'
  | 'executive';

export interface EntityRef {
  kind: EntityKind;
  id: number;
}

export interface ChangeEntry {
  id: string;
  entity: EntityRef | null;
  label: string;
  path: string;
  previous: unknown;
  next: unknown;
  timestamp: number;
  apply?: () => void;
  revert?: () => void;
}

export interface TimelineState {
  applied: ChangeEntry[];
  undone: ChangeEntry[];
}

export interface ActorFilters {
  search: string;
  playerStudioOnly: boolean;
}

export interface SaveMeta {
  filename: string;
  size: number;
  loadedAt: number;
}

export interface LoadedSave {
  meta: SaveMeta;
  raw: unknown;
  characters: TalentData[];
  names: string[] | null;
}

export interface StoreSnapshot {
  save: LoadedSave | null;
  actors: TalentData[];
  filters: {
    actors: ActorFilters;
  };
  timeline: TimelineState;
  names: string[] | null;
}

export type StoreAction = 'loadSave' | 'applyChange' | 'undo' | 'redo' | 'reset';

export interface DerivedSnapshot {
  filteredActors: TalentData[];
  hasChanges: boolean;
}

export interface AppStoreSnapshot extends StoreSnapshot {
  derived: DerivedSnapshot;
  lastAction: { type: StoreAction; payload?: unknown } | null;
}

export interface AppStore {
  state: {
    snapshot: () => AppStoreSnapshot;
  };
  signals: {
    save: Signal<LoadedSave | null>;
    actors: Signal<TalentData[]>;
    filters: {
      actors: Signal<ActorFilters>;
    };
    timeline: Signal<TimelineState>;
    names: Signal<string[] | null>;
    lastAction: Signal<AppStoreSnapshot['lastAction']>;
  };
  derived: {
    filteredActors: Signal<TalentData[]>;
    hasChanges: Signal<boolean>;
  };
  actions: {
    loadSave: (raw: unknown, meta: SaveMeta, names?: string[] | null) => void;
    setNameMap: (names: string[] | null) => void;
    updateActorFilters: (partial: Partial<ActorFilters>) => void;
    recordChange: (entry: ChangeEntry) => void;
    undo: () => void;
    redo: () => void;
    reset: () => void;
  };
}
