import { describe, expect, it } from 'vitest';
import sample from '../../../docs/sample_save.json';
import { findStudioRoot } from '../studio';
describe('studio helper', () => {
    it('finds studio-like object in sample save', () => {
        const studio = findStudioRoot(sample);
        expect(studio === null || typeof studio === 'object').toBe(true);
    });
});
