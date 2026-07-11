import { describe, it, expect } from 'vitest';
import { ALL_WORDS, ALL_CATS } from './words.js';

describe('word database', () => {
  it('has 99 word pairs', () => {
    expect(ALL_WORDS.length).toBe(99);
  });

  it('every entry has a category and exactly two distinct words', () => {
    for (const entry of ALL_WORDS) {
      expect(typeof entry.cat).toBe('string');
      expect(entry.w).toHaveLength(2);
      expect(entry.w[0]).not.toBe(entry.w[1]);
    }
  });

  it('derives the 7 expected categories with no duplicates', () => {
    expect(new Set(ALL_CATS).size).toBe(ALL_CATS.length);
    expect(ALL_CATS.sort()).toEqual(
      ['Animal', 'Clothing', 'Food', 'Nature', 'Object', 'Place', 'Vehicle'].sort()
    );
  });
});
