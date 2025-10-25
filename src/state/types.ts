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

export type TalentRole =
  | 'actor'
  | 'director'
  | 'producer'
  | 'writer'
  | 'editor'
  | 'composer'
  | 'cinematographer'
  | 'agent';

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
  producers: TalentData[];
  writers: TalentData[];
  editors: TalentData[];
  composers: TalentData[];
  cinematographers: TalentData[];
  agents: TalentData[];
  filters: {
    actors: CollectionFilters;
    directors: CollectionFilters;
    producers: CollectionFilters;
    writers: CollectionFilters;
    editors: CollectionFilters;
    composers: CollectionFilters;
    cinematographers: CollectionFilters;
    agents: CollectionFilters;
  };
  timeline: TimelineState;
  names: string[] | null;
  gameYear: number | null;
}

export type StoreAction = 'loadSave' | 'applyChange' | 'undo' | 'redo' | 'reset';

export interface DerivedSnapshot {
  filteredActors: TalentData[];
  filteredDirectors: TalentData[];
  filteredProducers: TalentData[];
  filteredWriters: TalentData[];
  filteredEditors: TalentData[];
  filteredComposers: TalentData[];
  filteredCinematographers: TalentData[];
  filteredAgents: TalentData[];
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
    producers: Signal<TalentData[]>;
    writers: Signal<TalentData[]>;
    editors: Signal<TalentData[]>;
    composers: Signal<TalentData[]>;
    cinematographers: Signal<TalentData[]>;
    agents: Signal<TalentData[]>;
    filters: {
      actors: Signal<CollectionFilters>;
      directors: Signal<CollectionFilters>;
      producers: Signal<CollectionFilters>;
      writers: Signal<CollectionFilters>;
      editors: Signal<CollectionFilters>;
      composers: Signal<CollectionFilters>;
      cinematographers: Signal<CollectionFilters>;
      agents: Signal<CollectionFilters>;
    };
    timeline: Signal<TimelineState>;
    names: Signal<string[] | null>;
    gameYear: Signal<number | null>;
    lastAction: Signal<AppStoreSnapshot['lastAction']>;
  };
  derived: {
    filteredActors: Signal<TalentData[]>;
    filteredDirectors: Signal<TalentData[]>;
    filteredProducers: Signal<TalentData[]>;
    filteredWriters: Signal<TalentData[]>;
    filteredEditors: Signal<TalentData[]>;
    filteredComposers: Signal<TalentData[]>;
    filteredCinematographers: Signal<TalentData[]>;
    filteredAgents: Signal<TalentData[]>;
    hasChanges: Signal<boolean>;
  };
  actions: {
    loadSave: (raw: unknown, meta: SaveMeta, names?: string[] | null) => void;
    setNameMap: (names: string[] | null) => void;
    updateCollectionFilters: (kind: EntityKind, partial: Partial<CollectionFilters>) => void;
    updateActorFilters: (partial: Partial<CollectionFilters>) => void;
    updateDirectorFilters: (partial: Partial<CollectionFilters>) => void;
    recordChange: (entry: ChangeEntry) => void;
    updateCustomName: (kind: TalentRole, entity: TalentData, customName: string | null) => void;
    updateGender: (kind: TalentRole, entity: TalentData, gender: number) => void;
    updateMood: (kind: TalentRole, entity: TalentData, value: number) => void;
    updateAttitude: (kind: TalentRole, entity: TalentData, value: number) => void;
    updateSelfEsteem: (kind: TalentRole, entity: TalentData, value: number) => void;
    updateReadiness: (kind: TalentRole, entity: TalentData, readiness: number) => void;
    updateStudio: (kind: TalentRole, entity: TalentData, studioId: string | null) => void;
    updateSkill: (kind: TalentRole, entity: TalentData, value: number | string) => void;
    updateLimit: (kind: TalentRole, entity: TalentData, value: number | string) => void;
    updateAge: (kind: TalentRole, entity: TalentData, age: number) => void;
    applySnapshot: (kind: TalentRole, entity: TalentData, snapshot: TalentData, label?: string) => void;
    updateActorSkill: (actor: TalentData, value: number | string) => void;
    updateActorLimit: (actor: TalentData, value: number | string) => void;
    updateActorTag: (actor: TalentData, tagId: 'ART' | 'COM', value: number | string) => void;
    updateActorAge: (actor: TalentData, age: number) => void;
    updateActorCustomName: (actor: TalentData, customName: string | null) => void;
    updateActorGender: (actor: TalentData, gender: number) => void;
    updateActorMood: (actor: TalentData, value: number) => void;
    updateActorAttitude: (actor: TalentData, value: number) => void;
    updateActorSelfEsteem: (actor: TalentData, value: number) => void;
    updateActorReadiness: (actor: TalentData, readiness: number) => void;
    updateActorStudio: (actor: TalentData, studioId: string | null) => void;
    updateDirectorSkill: (actor: TalentData, value: number | string) => void;
    updateDirectorLimit: (actor: TalentData, value: number | string) => void;
    updateDirectorAge: (actor: TalentData, age: number) => void;
    updateDirectorCustomName: (director: TalentData, customName: string | null) => void;
    updateDirectorGender: (director: TalentData, gender: number) => void;
    updateDirectorStudio: (director: TalentData, studioId: string | null) => void;
    applyDirectorSnapshot: (actor: TalentData, snapshot: TalentData, label?: string) => void;
    applyActorSnapshot: (actor: TalentData, snapshot: TalentData, label?: string) => void;
    undo: () => void;
    redo: () => void;
    reset: () => void;
  };
}
