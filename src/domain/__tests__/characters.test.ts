import { describe, expect, it } from 'vitest';
import actorSample from '../../../docs/new_format/actor_only_sample.json';
import { extractCharacters, isActorEntry, isRoleEntry, isExecutiveEntry } from '../characters';

describe('characters domain helpers', () => {
  it('extracts characters array from sample save', () => {
    const list = extractCharacters(actorSample);
    expect(list).toBeTruthy();
    expect(Array.isArray(list)).toBe(true);
    expect(list?.length).toBeGreaterThan(0);
  });

  it('identifies actor entries', () => {
    const list = extractCharacters(actorSample);
    const first = list?.find((entity) => isActorEntry(entity));
    expect(first).toBeDefined();
  });

  it('detects other roles and executives', () => {
    const list = extractCharacters(actorSample);
    const rolePredicate = isRoleEntry('Director');
    expect(list?.some((entity) => rolePredicate(entity))).toBeTypeOf('boolean');
    expect(list?.some((entity) => isExecutiveEntry(entity))).toBeTypeOf('boolean');
  });
});
