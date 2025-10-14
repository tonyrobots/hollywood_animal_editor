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

export interface CollectionFilters {
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
  gameYear: number | null;
}

export interface StoreSnapshot {
  save: LoadedSave | null;
  actors: TalentData[];
  directors: TalentData[];
  filters: {
    actors: CollectionFilters;
    directors: CollectionFilters;
  };
  timeline: TimelineState;
  names: string[] | null;
  gameYear: number | null;
}

export type StoreAction = 'loadSave' | 'applyChange' | 'undo' | 'redo' | 'reset';

export interface DerivedSnapshot {
  filteredActors: TalentData[];
  filteredDirectors: TalentData[];
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
    directors: Signal<TalentData[]>;
    filters: {
      actors: Signal<CollectionFilters>;
      directors: Signal<CollectionFilters>;
    };
    timeline: Signal<TimelineState>;
    names: Signal<string[] | null>;
    gameYear: Signal<number | null>;
    lastAction: Signal<AppStoreSnapshot['lastAction']>;
  };
  derived: {
    filteredActors: Signal<TalentData[]>;
    filteredDirectors: Signal<TalentData[]>;
    hasChanges: Signal<boolean>;
  };
  actions: {
    loadSave: (raw: unknown, meta: SaveMeta, names?: string[] | null) => void;
    setNameMap: (names: string[] | null) => void;
    updateCollectionFilters: (kind: EntityKind, partial: Partial<CollectionFilters>) => void;
    updateActorFilters: (partial: Partial<CollectionFilters>) => void;
    updateDirectorFilters: (partial: Partial<CollectionFilters>) => void;
    recordChange: (entry: ChangeEntry) => void;
    updateActorSkill: (actor: TalentData, value: number | string) => void;
    updateActorLimit: (actor: TalentData, value: number | string) => void;
    updateActorTag: (actor: TalentData, tagId: 'ART' | 'COM', value: number | string) => void;
    updateActorAge: (actor: TalentData, age: number) => void;
    updateDirectorSkill: (actor: TalentData, value: number | string) => void;
    updateDirectorLimit: (actor: TalentData, value: number | string) => void;
    updateDirectorAge: (actor: TalentData, age: number) => void;
    applyDirectorSnapshot: (actor: TalentData, snapshot: TalentData, label?: string) => void;
    applyActorSnapshot: (actor: TalentData, snapshot: TalentData, label?: string) => void;
    undo: () => void;
    redo: () => void;
    reset: () => void;
  };
}
