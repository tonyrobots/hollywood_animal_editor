import { describe, expect, it } from 'vitest';
import names from '../../../data/CHARACTER_NAMES.json';
import { fullName, getNameById } from '../names';
describe('name helpers', () => {
    const locStrings = names.locStrings ?? [];
    it('looks up names by id', () => {
        if (!locStrings.length) {
            expect(locStrings.length).toBe(0);
            return;
        }
        expect(getNameById(locStrings, 0)).toBeTypeOf('string');
    });
    it('builds full name with fallbacks', () => {
        const result = fullName(locStrings, { firstId: 0, lastId: 1, customName: '' });
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });
});
