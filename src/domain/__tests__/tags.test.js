import { describe, expect, it } from 'vitest';
import { extractCharacters } from '../characters';
import sample from '../../../docs/new_format/actor_only_sample.json';
import { ensureTag, getTagValue } from '../tags';
describe('tag helpers', () => {
    it('creates missing tags with defaults', () => {
        const [first] = extractCharacters(sample);
        const tag = ensureTag(first, 'ART');
        expect(tag.id).toBe('ART');
        expect(tag.value).toMatch(/^\d+\.\d{3}$/);
    });
    it('reads tag values with normalization', () => {
        const [first] = extractCharacters(sample);
        const value = getTagValue(first, 'COM');
        expect(value).toMatch(/^\d\.\d{3}$/);
    });
});
