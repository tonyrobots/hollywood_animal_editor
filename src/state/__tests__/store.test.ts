import { describe, expect, it, beforeEach } from 'vitest';
import { createAppStore } from '../../state';
import type { TalentData } from '../../types/save';

function createActor(overrides: Partial<TalentData> = {}): TalentData {
  return {
    id: 101,
    firstNameId: '1',
    lastNameId: '2',
    professions: { Actor: '0.500' },
    limit: '0.500',
    Limit: '0.500',
    birthDate: '01-01-1970',
    whiteTagsNEW: {},
    studioId: 'PL',
    ...overrides
  };
}

function createDirector(overrides: Partial<TalentData> = {}): TalentData {
  return {
    id: 201,
    firstNameId: '3',
    lastNameId: '4',
    professions: { Director: '0.400' },
    limit: '0.400',
    Limit: '0.400',
    birthDate: '01-01-1975',
    studioId: 'PL',
    ...overrides
  };
}

describe('createAppStore actor editing', () => {
  let actor: TalentData;
  let store: ReturnType<typeof createAppStore>;

  beforeEach(() => {
    actor = createActor();
    const director = createDirector();
    const raw = {
      characters: [actor, director],
      gameDate: '1990-06-01T00:00:00'
    };
    store = createAppStore();
    store.actions.loadSave(raw, { filename: 'test.json', size: 0, loadedAt: Date.now() });
    actor = store.signals.actors.value[0];
  });

  it('updates actor skill and keeps limit in sync', () => {
    store.actions.updateActorSkill(actor, 0.8);
    expect(actor.professions?.Actor).toBe('0.800');
    expect(actor.limit).toBe('0.800');
    expect(actor.Limit).toBe('0.800');
    const entry = store.signals.timeline.value.applied.at(-1);
    expect(entry?.label).toContain('Acting Skill');
  });

  it('clamps limit slider to current skill', () => {
    actor.professions = { Actor: '0.700' };
    actor.limit = '0.900';
    actor.Limit = '0.900';
    store.actions.updateActorLimit(actor, 0.5);
    expect(actor.limit).toBe('0.700');
    expect(actor.Limit).toBe('0.700');
  });

  it('creates and edits ART/COM tags', () => {
    expect(actor.whiteTagsNEW?.ART).toBeUndefined();
    store.actions.updateActorTag(actor, 'ART', 0.7);
    expect(actor.whiteTagsNEW?.ART?.value).toBeDefined();
    expect(store.signals.timeline.value.applied.length).toBe(1);
  });

  it('updates birthDate when changing age', () => {
    store.actions.updateActorAge(actor, 25);
    expect(actor.birthDate).toBe('01-01-1965');
  });

  it('applies JSON snapshot edits', () => {
    store.actions.applyActorSnapshot(actor, { ...actor, limit: '0.900', Limit: '0.900', alias: 'Tester' });
    expect(actor.limit).toBe('0.900');
    expect((actor as Record<string, unknown>).alias).toBe('Tester');
  });
});

describe('createAppStore director editing', () => {
  let director: TalentData;
  let store: ReturnType<typeof createAppStore>;

  beforeEach(() => {
    director = createDirector();
    const raw = {
      characters: [createActor(), director],
      gameDate: '1992-01-01T00:00:00'
    };
    store = createAppStore();
    store.actions.loadSave(raw, { filename: 'directors.json', size: 0, loadedAt: Date.now() });
    director = store.signals.directors.value[0];
  });

  it('updates director skill and keeps limit in sync', () => {
    store.actions.updateDirectorSkill(director, 0.75);
    expect(director.professions?.Director).toBe('0.750');
    expect(director.limit).toBe('0.750');
    expect(director.Limit).toBe('0.750');
  });

  it('prevents limit from dropping below skill', () => {
    director.professions = { Director: '0.650' };
    director.limit = '0.800';
    director.Limit = '0.800';
    store.actions.updateDirectorLimit(director, 0.4);
    expect(director.limit).toBe('0.650');
    expect(director.Limit).toBe('0.650');
  });

  it('updates director age when game year available', () => {
    store.actions.updateDirectorAge(director, 30);
    expect(director.birthDate).toBe('01-01-1962');
  });

  it('applies JSON snapshots for directors', () => {
    store.actions.applyDirectorSnapshot(director, { ...director, nickname: 'Visionary' });
    expect((director as Record<string, unknown>).nickname).toBe('Visionary');
  });
});
