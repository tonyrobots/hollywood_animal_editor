import { describe, expect, it } from 'vitest';
import sample from '../../../docs/sample_save.json';
import { computeMovieArtCom, extractMovies, getMovieTotalIncome } from '../movies';

describe('movie helpers', () => {
  const movies = extractMovies(sample);

  it('extracts movies from sample save', () => {
    expect(Array.isArray(movies)).toBe(true);
  });

  it('computes art/com metrics safely', () => {
    if (!movies.length) {
      expect(movies.length).toBe(0);
      return;
    }
    const ac = computeMovieArtCom(movies[0]);
    expect(ac).toHaveProperty('art');
    expect(ac).toHaveProperty('com');
    expect(Number.isFinite(ac.art)).toBe(true);
  });

  it('reads total income', () => {
    if (!movies.length) {
      expect(movies.length).toBe(0);
      return;
    }
    const val = getMovieTotalIncome(movies[0]);
    expect(Number.isFinite(val)).toBe(true);
  });
});
