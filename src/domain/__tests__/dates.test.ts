import { describe, expect, it } from 'vitest';
import fullSave from '../../../docs/sample_save.json';
import actorOnly from '../../../docs/new_format/actor_only_sample.json';
import {
  computeGameYearFromData,
  formatBirthDate,
  getAge,
  parseBirthDateParts,
  validateBirthDateString
} from '../dates';
import { extractCharacters } from '../characters';

describe('date helpers', () => {
  it('validates and parses birth dates', () => {
    expect(validateBirthDateString('01-12-1990')).toBe(true);
    expect(validateBirthDateString('1990-12-01')).toBe(false);
    const parts = parseBirthDateParts('05-03-1985');
    expect(parts).toEqual({ day: 5, month: 3, year: 1985 });
    expect(formatBirthDate(5, 3, 1985)).toBe('05-03-1985');
  });

  it('derives game year from full save', () => {
    const year = computeGameYearFromData(fullSave);
    expect(year).toBeGreaterThan(1900);
  });

  it('derives year from actor-only sample timestamps', () => {
    const year = computeGameYearFromData(actorOnly);
    expect(year).toBeGreaterThan(1900);
  });

  it('returns null when no date strings exist', () => {
    const year = computeGameYearFromData({ foo: 'bar', nested: { value: 123 } });
    expect(year).toBeNull();
  });

  it('computes age when game year present', () => {
    const actors = extractCharacters(fullSave)!;
    const first = actors[0];
    const year = computeGameYearFromData(fullSave);
    expect(typeof getAge(first, year)).toBe('number');
  });

});
