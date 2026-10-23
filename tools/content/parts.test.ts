import { describe, expect, inject, it } from 'vitest';
import { joinContent, splitContent } from './parts.ts';

describe('content parts', () => {
  it('splits per category and joins back to the same content', () => {
    const data = inject('content'); // the real content/, loaded once by src/test-global-setup.ts
    const parts = splitContent(data);
    expect(parts.map(([name]) => name)).toEqual([...data.categories.map((c) => c.id), ...data.clCategories.map((c) => `checklist-${c.id}`)]);
    expect(joinContent({ categories: data.categories, clCategories: data.clCategories, parts: [] }, parts.map(([, p]) => p))).toEqual(data);
  });
});
