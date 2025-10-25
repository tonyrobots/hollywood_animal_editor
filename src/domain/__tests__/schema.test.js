import { describe, expect, it } from 'vitest';
import sample from '../../../docs/new_format/actor_only_sample.json';
import { extractCharacters } from '../characters';
import { validateSaveSchema, validateTalentEntry, syncLimitPair } from '../schema';
describe('schema helpers', () => {
    it('validates talent entries', () => {
        const [first] = extractCharacters(sample);
        const result = validateTalentEntry(first);
        expect(Array.isArray(result)).toBe(true);
    });
    it('runs schema validation', () => {
        const result = validateSaveSchema(sample);
        expect(result).toHaveProperty('warnings');
    });
    it('keeps limit pair in sync', () => {
        const [first] = extractCharacters(sample);
        syncLimitPair(first, '0.555');
        expect(first.limit).toBe('0.555');
        expect(first.Limit).toBe('0.555');
    });
});
