// Built-in content (validated and rendered at build time) plus lookup maps used by every view.
import data from 'virtual:content';
import type { CSSProperties } from 'react';
import type { Category, Hue, Level, QaItem, QuizItem, Topic } from '../tools/content/schema.ts';

export type { Category, ClCategory, ClRule, Hue, Level, Priority, QaItem, QuizItem, Source, Topic } from '../tools/content/schema.ts';

export const CATEGORIES = data.categories;
export const CATEGORY: Record<string, Category> = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
export const TOPICS = data.topics;
export const TOPIC: Record<string, Topic> = Object.fromEntries(TOPICS.map((t) => [t.id, t]));

/** Interview questions with the context views need for filtering. */
export type Qa = QaItem & { category: string; level: Level };
export const QA: Qa[] = TOPICS.flatMap((t) => t.qa.map((q) => ({ ...q, category: t.category, level: t.level })));
export type Quiz = QuizItem & { category: string };
export const QUIZ: Quiz[] = TOPICS.flatMap((t) => t.quiz.map((q) => ({ ...q, category: t.category })));

export const CL_CATEGORIES = data.clCategories;
export const CL_CATEGORY = Object.fromEntries(CL_CATEGORIES.map((c) => [c.id, c]));
export const CL_RULES = data.clRules;

/** CSS color of a category hue. */
export const hueVar = (hue: Hue | undefined) => `var(--hue-${hue ?? 'system'})`;
/** Text color readable on a hue fill: only purple needs light text. */
export const hueOn = (hue: Hue | undefined) => (hue === 'rendering' ? 'var(--on-purple)' : 'var(--on-fill)');
/** Inline style that gives a subtree its category color (`--hue`, `--hue-on`). */
export const catStyle = (catId: string) => ({ '--hue': hueVar(CATEGORY[catId]?.hue), '--hue-on': hueOn(CATEGORY[catId]?.hue) }) as CSSProperties;
