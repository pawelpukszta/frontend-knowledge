// Content schema: what authors write (frontmatter and _category.yaml) and what the app receives.
import { z } from 'zod';

export const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const HUES = ['scripting', 'rendering', 'painting', 'loading', 'system', 'idle'] as const;
export const LEVELS = ['mid', 'senior'] as const;
export const PRIORITIES = ['critical', 'high', 'medium', 'low'] as const;

/** Code fence languages allowed in content, with the Shiki grammar that highlights each one. */
export const CODE_LANGS = {
  html: 'html', css: 'css', scss: 'scss', js: 'javascript', ts: 'typescript', tsx: 'tsx', jsx: 'jsx',
  json: 'json', http: 'http', bash: 'bash', yaml: 'yaml', xml: 'xml', md: 'markdown', txt: 'text', graphql: 'graphql',
} as const;
export type CodeLang = keyof typeof CODE_LANGS;

const text = z.string().trim().min(1);
const source = z.object({ title: text, url: z.url({ protocol: /^https?$/ }) }).strict();
const sources = z.array(source);

export const categoryFile = z.object({
  order: z.number().int(),
  name: text,
  short: text,
  hue: z.enum(HUES),
  desc: text,
  topics: z.array(z.string().regex(SLUG)).min(1),
}).strict();

export const topicFrontmatter = z.object({
  title: text,
  level: z.enum(LEVELS),
  tags: z.array(text).default([]),
  summary: text,
  flow: z.array(text).optional(),
  sources: sources.min(1, 'temat musi mieć co najmniej jedno źródło'),
}).strict();

export const clCategoryFile = z.object({
  order: z.number().int(),
  name: text,
  desc: text,
  hue: z.enum(HUES),
  sources: sources.default([]),
  groups: z.array(z.object({
    name: text,
    sources: sources.default([]),
    rules: z.array(z.string().regex(SLUG)).min(1),
  }).strict()).min(1),
}).strict();

export const ruleFrontmatter = z.object({
  title: text,
  priority: z.enum(PRIORITIES),
  sources: sources.default([]),
}).strict();

export type Source = z.infer<typeof source>;
export type Level = (typeof LEVELS)[number];
export type Hue = (typeof HUES)[number];
export type Priority = (typeof PRIORITIES)[number];

// ---------- Output consumed by the app. Markdown fields (summary, body, q, a, ...) arrive as trusted HTML rendered at build time. ----------

export interface Category { id: string; order: number; name: string; short: string; hue: Hue; desc: string; topics: string[] }

export interface QaItem { id: string; topic: string; q: string; a: string }

export interface QuizItem { id: string; topic: string; q: string; options: string[]; answer: number; explain: string }

export interface Topic {
  id: string;
  category: string;
  title: string;
  level: Level;
  tags: string[];
  summary: string;
  flow?: string[];
  body?: string;
  analogy?: string;
  code?: string;
  pitfalls?: string;
  qa: QaItem[];
  quiz: QuizItem[];
  sources: Source[];
}

export interface ClGroup { name: string; sources: Source[]; rules: string[] }
export interface ClCategory { id: string; order: number; name: string; desc: string; hue: Hue; sources: Source[]; groups: ClGroup[] }

export interface ClRule {
  /** Unique across the checklist: `${category}/${id}`. */
  key: string;
  id: string;
  category: string;
  group: string;
  title: string;
  priority: Priority;
  desc: string;
  why?: string;
  verify?: string;
  code?: string;
  pitfalls?: string;
  sources: Source[];
  /** The original rule on frontendchecklist.io. */
  url: string;
}

export interface ContentData {
  categories: Category[];
  topics: Topic[];
  clCategories: ClCategory[];
  clRules: ClRule[];
}
