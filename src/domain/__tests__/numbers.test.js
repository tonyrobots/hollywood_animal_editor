import { describe, expect, it } from 'vitest';
import { normalizeDecimalString, normalizeArtCom, formatUnitToTen, formatUnitToHundred } from '../numbers';
describe('numbers helpers', () => {
    it('normalizes decimal strings to three places', () => {
        expect(normalizeDecimalString('0.7')).toBe('0.700');
        expect(normalizeDecimalString(0.4567)).toBe('0.457');
        expect(normalizeDecimalString('bad')).toBe('bad');
    });
    it('snaps art/com values to allowed increments', () => {
        expect(normalizeArtCom(0.32)).toBe('0.300');
        expect(normalizeArtCom('0.701')).toBe('0.700');
        expect(normalizeArtCom(null)).toBe('');
    });
    it('formats unit values for UI display', () => {
        expect(formatUnitToTen(0.7)).toBe('7.0');
        expect(formatUnitToHundred(0.42)).toBe('42');
    });
});
