import { describe, it, expect } from 'vitest';
import { rnd, shuffle } from './utils.js';

describe('rnd', () => {
  it('returns an integer in [0, n)', () => {
    for (let i = 0; i < 200; i++) {
      const v = rnd(7);
      expect(Number.isInteger(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(7);
    }
  });
});

describe('shuffle', () => {
  it('returns an array with the same elements, possibly reordered', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle([...input]);
    expect(result.slice().sort()).toEqual(input.slice().sort());
  });

  it('mutates and returns the same array reference', () => {
    const input = [1, 2, 3];
    const result = shuffle(input);
    expect(result).toBe(input);
  });
});
