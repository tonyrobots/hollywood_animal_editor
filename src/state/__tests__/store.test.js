import { describe, expect, it, beforeEach } from 'vitest';
import { createAppStore } from '../../state';
function createActor(overrides = {}) {
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
function createDirector(overrides = {}) {
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
function createProducer(overrides = {}) {
    return {
        id: 301,
        firstNameId: '5',
        lastNameId: '6',
        professions: { Producer: '0.300' },
        limit: '0.300',
        Limit: '0.300',
        birthDate: '01-01-1980',
        studioId: 'PL',
        ...overrides
    };
}
describe('createAppStore actor editing', () => {
    let actor;
    let store;
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
        expect(actor.alias).toBe('Tester');
    });
    it('updates actor studio assignment', () => {
        actor.studioId = null;
        store.actions.updateActorStudio(actor, 'EM');
        expect(actor.studioId).toBe('EM');
        const entry = store.signals.timeline.value.applied.at(-1);
        expect(entry?.label).toContain('Studio');
    });
    it('updates actor custom name', () => {
        store.actions.updateActorCustomName(actor, 'New Name');
        expect(actor.customName).toBe('New Name');
    });
    it('updates actor gender', () => {
        store.actions.updateActorGender(actor, 0);
        expect(actor.gender).toBe(0);
        store.actions.updateActorGender(actor, 1);
        expect(actor.gender).toBe(1);
    });
    it('updates actor happiness/mood', () => {
        store.actions.updateActorMood(actor, 0.65);
        expect(actor.mood).toBe('0.650');
    });
    it('updates actor loyalty/attitude', () => {
        store.actions.updateActorAttitude(actor, 0.42);
        expect(actor.attitude).toBe('0.420');
    });
    it('updates actor self-esteem', () => {
        store.actions.updateActorSelfEsteem(actor, 0.33);
        expect(actor.selfEsteem).toBe('0.330');
        store.actions.updateActorSelfEsteem(actor, -1.25);
        expect(actor.selfEsteem).toBe('-1.250');
        store.actions.updateActorSelfEsteem(actor, 4.2);
        expect(actor.selfEsteem).toBe('4.200');
    });
    it('updates actor readiness for tricks', () => {
        store.actions.updateActorReadiness(actor, 2);
        expect(actor.readinessForTricks).toBe(2);
    });
});
describe('createAppStore director editing', () => {
    let director;
    let store;
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
        expect(director.nickname).toBe('Visionary');
    });
});
describe('createAppStore generic role editing', () => {
    let producer;
    let store;
    beforeEach(() => {
        producer = createProducer();
        const raw = {
            characters: [createActor(), createDirector(), producer],
            gameDate: '1995-01-01T00:00:00'
        };
        store = createAppStore();
        store.actions.loadSave(raw, { filename: 'roles.json', size: 0, loadedAt: Date.now() });
        producer = store.signals.producers.value[0];
    });
    it('updates generic role skill and keeps limit in sync', () => {
        store.actions.updateSkill('producer', producer, 0.65);
        expect(producer.professions?.Producer).toBe('0.650');
        expect(producer.limit).toBe('0.650');
        expect(producer.Limit).toBe('0.650');
    });
    it('prevents generic role limit from dropping below skill', () => {
        producer.professions = { Producer: '0.550' };
        producer.limit = '0.800';
        producer.Limit = '0.800';
        store.actions.updateLimit('producer', producer, 0.4);
        expect(producer.limit).toBe('0.550');
        expect(producer.Limit).toBe('0.550');
    });
    it('updates generic role age', () => {
        store.actions.updateAge('producer', producer, 20);
        expect(producer.birthDate).toBe('01-01-1975');
    });
    it('applies JSON snapshots via generic action', () => {
        store.actions.applySnapshot('producer', producer, { ...producer, alias: 'Fixer' });
        expect(producer.alias).toBe('Fixer');
    });
    it('updates studio via generic action', () => {
        producer.studioId = 'EM';
        store.actions.updateStudio('producer', producer, 'GB');
        expect(producer.studioId).toBe('GB');
    });
});
