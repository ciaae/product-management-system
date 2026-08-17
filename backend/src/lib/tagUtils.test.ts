import { describe, expect, it } from 'vitest';
import { normalizeTags, isDuplicateProductName } from './tagUtils.js';

describe('product tag normalization', () => {
  it('lowercases and trims AI-generated tags', () => {
    const tags = ['Gaming', '  RGB ', 'Audio', 'Wireless'];
    expect(normalizeTags(tags)).toEqual(['gaming', 'rgb', 'audio', 'wireless']);
  });

  it('removes blank values and deduplicates case-insensitive tags', () => {
    const tags = ['Gaming', ' gaming ', '', 'RGB', 'rgb', 'Audio'];
    expect(normalizeTags(tags)).toEqual(['gaming', 'rgb', 'audio']);
  });

  it('ignores non-string values and limits output length to five', () => {
    const tags = [null, 'Gaming', 'rgb', 'RGB', 'Audio', 'Wireless', 'Mechanical', 'Gaming'];
    expect(normalizeTags(tags)).toEqual(['gaming', 'rgb', 'audio', 'wireless', 'mechanical']);
  });

  it('returns an empty array when no valid tags are present', () => {
    expect(normalizeTags(['', '   ', '  '])).toEqual([]);
  });
});

describe('duplicate name checks', () => {
  it('treats case variations as duplicates', () => {
    expect(isDuplicateProductName('Gaming Mouse', 'gaming mouse')).toBe(true);
    expect(isDuplicateProductName('GAMING MOUSE', 'GaMiNg MoUsE')).toBe(true);
    expect(isDuplicateProductName('Desk Lamp', 'Desk Chair')).toBe(false);
  });
});
