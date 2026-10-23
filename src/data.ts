// Built-in content (validated and rendered at build time) plus lookup maps used by every view.
// The tables are filled once by setContent before the app renders (main.tsx, the test setup).
import type { CSSProperties } from 'react';
import { joinContent, type ContentIndex, type ContentPart } from '../tools/content/parts.ts';
import type { Category, ClCategory, ClRule, ContentData, Hue, Level, QaItem, QuizItem, Topic } from '../tools/content/schema.ts';

export type { Category, ClCategory, ClRule, Hue, Level, Priority, QaItem, QuizItem, Source, Topic } from '../tools/content/schema.ts';

/** Interview questions with the context views need for filtering. */
export type Qa = QaItem & { category: string; level: Level };
export type Quiz = QuizItem & { category: string };

export let CATEGORIES: Category[] = [];
export let CATEGORY: Record<string, Category> = {};
export let TOPICS: Topic[] = [];
export let TOPIC: Record<string, Topic> = {};
export let QA: Qa[] = [];
export let QUIZ: Quiz[] = [];
export let CL_CATEGORIES: ClCategory[] = [];
export let CL_CATEGORY: Record<string, ClCategory> = {};
export let CL_RULES: ClRule[] = [];

export function setContent(data: ContentData) {
  CATEGORIES = data.categories;
  CATEGORY = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
  TOPICS = data.topics;
  TOPIC = Object.fromEntries(TOPICS.map((t) => [t.id, t]));
  QA = TOPICS.flatMap((t) => t.qa.map((q) => ({ ...q, category: t.category, level: t.level })));
  QUIZ = TOPICS.flatMap((t) => t.quiz.map((q) => ({ ...q, category: t.category })));
  CL_CATEGORIES = data.clCategories;
  CL_CATEGORY = Object.fromEntries(CL_CATEGORIES.map((c) => [c.id, c]));
  CL_RULES = data.clRules;
}

/** Loads the content parts listed in index.html (see tools/content/vite-plugin.ts). */
export async function fetchContent(): Promise<ContentData> {
  const index = JSON.parse(document.getElementById('kb-content')!.textContent!) as ContentIndex;
  const parts = await Promise.all(index.parts.map(async (url) =>
    ((await import(/* @vite-ignore */ new URL(url, document.baseURI).href)) as { default: ContentPart }).default));
  return joinContent(index, parts);
}

/** CSS color of a category hue. */
export const hueVar = (hue: Hue | undefined) => `var(--hue-${hue ?? 'system'})`;
/** Text color readable on a hue fill: only purple needs light text. */
export const hueOn = (hue: Hue | undefined) => (hue === 'rendering' ? 'var(--on-purple)' : 'var(--on-fill)');
/** Inline style that gives a subtree its category color (`--hue`, `--hue-on`). */
export const catStyle = (catId: string) => ({ '--hue': hueVar(CATEGORY[catId]?.hue), '--hue-on': hueOn(CATEGORY[catId]?.hue) }) as CSSProperties;
