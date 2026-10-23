// Content ships as one part per category, so a change re-downloads only the part it touched.
// The plugin splits at build time; the app joins the parts back before it renders.
import type { Category, ClCategory, ClRule, ContentData, Topic } from './schema.ts';

export interface ContentIndex {
  categories: Category[];
  clCategories: ClCategory[];
  /** Part module URLs relative to the page, topic categories first, each group in display order. */
  parts: string[];
}

export interface ContentPart {
  topics?: Topic[];
  clRules?: ClRule[];
}

/** Part name (unique, file-name safe) -> part, in display order. */
export function splitContent(data: ContentData): [string, ContentPart][] {
  return [
    ...data.categories.map((c): [string, ContentPart] => [c.id, { topics: data.topics.filter((t) => t.category === c.id) }]),
    ...data.clCategories.map((c): [string, ContentPart] => [`checklist-${c.id}`, { clRules: data.clRules.filter((r) => r.category === c.id) }]),
  ];
}

export function joinContent(index: ContentIndex, parts: ContentPart[]): ContentData {
  return {
    categories: index.categories,
    topics: parts.flatMap((p) => p.topics ?? []),
    clCategories: index.clCategories,
    clRules: parts.flatMap((p) => p.clRules ?? []),
  };
}
