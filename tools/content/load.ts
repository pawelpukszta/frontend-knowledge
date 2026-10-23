// Reads content/ from disk, validates it and renders markdown. Invalid content throws ContentError
// listing every problem with its file, so a broken build says exactly what to fix.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse as parseYaml } from 'yaml';
import type { z } from 'zod';
import { headingId, parseQuizBody, splitFrontmatter, splitHeadings } from './parse.ts';
import { createRenderer, type Renderer } from './render.ts';
import {
  categoryFile, clCategoryFile, ruleFrontmatter, SLUG, topicFrontmatter,
  type Category, type ClCategory, type ClRule, type ContentData, type QaItem, type QuizItem, type Topic,
} from './schema.ts';

export class ContentError extends Error {
  readonly problems: string[];
  constructor(problems: string[]) {
    super(`Niepoprawna treść (${problems.length}):\n${problems.map((p) => `  - ${p}`).join('\n')}`);
    this.problems = problems;
  }
}

const TOPIC_SECTIONS: Record<string, 'body' | 'analogy' | 'code' | 'pitfalls' | 'qa' | 'quiz'> = {
  'Wyjaśnienie': 'body', 'Analogia': 'analogy', 'Kod': 'code', 'Częste błędy': 'pitfalls', 'Pytania': 'qa', 'Quiz': 'quiz',
};
const RULE_SECTIONS: Record<string, 'why' | 'verify' | 'code' | 'pitfalls'> = {
  'Dlaczego to ważne': 'why', 'Jak sprawdzić': 'verify', 'Kod': 'code', 'Częste błędy': 'pitfalls',
};
const DASHES = /[\u2013\u2014]/;

/** In-memory content tree: path (relative to the content root, forward slashes) -> file text. */
export type ContentFiles = Map<string, string>;

export function readContentDir(root: string): ContentFiles {
  const files: ContentFiles = new Map();
  const walk = (dir: string) => {
    for (const name of readdirSync(dir).sort()) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.(md|ya?ml)$/.test(name)) files.set(relative(root, full).split('\\').join('/'), readFileSync(full, 'utf8'));
    }
  };
  walk(root);
  return files;
}

export async function loadContent(root: string): Promise<ContentData> {
  return buildContent(readContentDir(root));
}

export async function buildContent(files: ContentFiles, renderer?: Renderer): Promise<ContentData> {
  const md = renderer ?? (await createRenderer());
  const problems: string[] = [];
  const report = (file: string, msg: string) => problems.push(`${file}: ${msg}`);

  /** Runs a step and records its error instead of stopping, so one build reports every problem. */
  const attempt = <T>(file: string, fn: () => T): T | undefined => {
    try { return fn(); } catch (e) { report(file, (e as Error).message); return undefined; }
  };
  const check = <S extends z.ZodType>(file: string, schema: S, data: unknown): z.infer<S> | undefined => {
    const r = schema.safeParse(data);
    if (r.success) return r.data;
    for (const i of r.error.issues) report(file, `${i.path.join('.') || '(plik)'}: ${i.message}`);
    return undefined;
  };

  for (const [file, text] of files) {
    const line = text.split('\n').findIndex((l) => DASHES.test(l));
    if (line >= 0) report(file, `linia ${line + 1}: znak półpauzy lub pauzy (U+2013/U+2014); użyj dwukropka, średnika lub łącznika`);
  }

  const dirs = (prefix: string) => [...new Set([...files.keys()].filter((f) => f.startsWith(prefix)).map((f) => f.split('/')[1]))];
  const ids = new Map<string, string>(); // global id -> file, for duplicate detection
  const claim = (id: string, file: string, kind: string) => {
    const prev = ids.get(`${kind}:${id}`);
    if (prev) report(file, `zduplikowane id ${kind} "${id}" (już w ${prev})`);
    else ids.set(`${kind}:${id}`, file);
  };

  // ---------- Topics ----------
  const categories: Category[] = [];
  const topics: Topic[] = [];
  for (const dir of dirs('topics/')) {
    const metaFile = `topics/${dir}/_category.yaml`;
    if (!SLUG.test(dir)) report(metaFile, `nazwa katalogu "${dir}" nie jest poprawnym id`);
    if (!files.has(metaFile)) { report(metaFile, 'brak pliku kategorii'); continue; }
    const meta = check(metaFile, categoryFile, attempt(metaFile, () => parseYaml(files.get(metaFile)!)));
    if (!meta) continue;
    claim(dir, metaFile, 'kategorii');
    categories.push({ id: dir, ...meta });

    const onDisk = [...files.keys()].filter((f) => f.startsWith(`topics/${dir}/`) && f.endsWith('.md')).map((f) => f.slice(`topics/${dir}/`.length, -3));
    for (const id of onDisk.filter((t) => !meta.topics.includes(t))) report(`topics/${dir}/${id}.md`, `temat nie jest wymieniony w ${metaFile}`);
    for (const id of meta.topics) {
      const file = `topics/${dir}/${id}.md`;
      if (!files.has(file)) { report(metaFile, `brak pliku tematu ${id}.md`); continue; }
      claim(id, file, 'tematu');
      const topic = attempt(file, () => parseTopic(file, id, dir, files.get(file)!, md, report, check));
      if (topic) topics.push(topic);
    }
  }
  for (const t of topics) for (const item of [...t.qa, ...t.quiz]) claim(item.id, `topics/${t.category}/${t.id}.md`, 'pytania');

  // ---------- Checklist ----------
  const clCategories: ClCategory[] = [];
  const clRules: ClRule[] = [];
  for (const dir of dirs('checklist/')) {
    const metaFile = `checklist/${dir}/_category.yaml`;
    if (!files.has(metaFile)) { report(metaFile, 'brak pliku kategorii checklisty'); continue; }
    const meta = check(metaFile, clCategoryFile, attempt(metaFile, () => parseYaml(files.get(metaFile)!)));
    if (!meta) continue;
    clCategories.push({ id: dir, ...meta });
    const listed = meta.groups.flatMap((g) => g.rules);
    const onDisk = [...files.keys()].filter((f) => f.startsWith(`checklist/${dir}/`) && f.endsWith('.md')).map((f) => f.slice(`checklist/${dir}/`.length, -3));
    for (const id of onDisk.filter((r) => !listed.includes(r))) report(`checklist/${dir}/${id}.md`, `reguła nie jest wymieniona w ${metaFile}`);
    for (const g of meta.groups) {
      for (const id of g.rules) {
        const file = `checklist/${dir}/${id}.md`;
        if (!files.has(file)) { report(metaFile, `brak pliku reguły ${id}.md`); continue; }
        claim(`${dir}/${id}`, file, 'reguły');
        const rule = attempt(file, () => parseRule(file, id, dir, g.name, files.get(file)!, md, report, check));
        if (rule) clRules.push(rule);
      }
    }
  }

  if (problems.length) throw new ContentError(problems);
  const byOrder = (a: { order: number; id: string }, b: { order: number; id: string }) => a.order - b.order || a.id.localeCompare(b.id);
  categories.sort(byOrder);
  clCategories.sort(byOrder);
  const catIndex = new Map(categories.map((c, i) => [c.id, i]));
  topics.sort((a, b) => catIndex.get(a.category)! - catIndex.get(b.category)!);
  const clIndex = new Map(clCategories.map((c, i) => [c.id, i]));
  clRules.sort((a, b) => clIndex.get(a.category)! - clIndex.get(b.category)!);
  return { categories, topics, clCategories, clRules };
}

type Report = (file: string, msg: string) => void;
type Check = <S extends z.ZodType>(file: string, schema: S, data: unknown) => z.infer<S> | undefined;

function parseTopic(file: string, id: string, category: string, text: string, md: Renderer, report: Report, check: Check): Topic | undefined {
  const { data, body } = splitFrontmatter(text);
  const fm = check(file, topicFrontmatter, data);
  const { intro, parts } = splitHeadings(body, 2);
  if (intro) report(file, 'tekst przed pierwszą sekcją "## ..."');
  const sec: Partial<Record<(typeof TOPIC_SECTIONS)[string], string>> = {};
  for (const p of parts) {
    const key = TOPIC_SECTIONS[p.heading];
    if (!key) report(file, `nieznana sekcja "## ${p.heading}" (dozwolone: ${Object.keys(TOPIC_SECTIONS).join(', ')})`);
    else if (sec[key] !== undefined) report(file, `sekcja "## ${p.heading}" występuje dwa razy`);
    else sec[key] = p.body;
  }
  if (!fm) return undefined;

  const qa: QaItem[] = [];
  const qaParts = splitHeadings(sec.qa ?? '', 3);
  if (qaParts.intro) report(file, 'w sekcji Pytania tekst przed pierwszym "### pytanie {#id}"');
  for (const p of qaParts.parts) {
    const h = headingId(p.heading);
    if (!h.id || !SLUG.test(h.id)) { report(file, `pytanie "${h.text}" nie ma poprawnego id {#id}`); continue; }
    if (!p.body) report(file, `pytanie ${h.id} nie ma odpowiedzi`);
    qa.push({ id: h.id, topic: id, q: md.inline(h.text), a: md.block(p.body) });
  }

  const quiz: QuizItem[] = [];
  const quizParts = splitHeadings(sec.quiz ?? '', 3);
  if (quizParts.intro) report(file, 'w sekcji Quiz tekst przed pierwszym "### pytanie {#id}"');
  for (const p of quizParts.parts) {
    const h = headingId(p.heading);
    if (!h.id || !SLUG.test(h.id)) { report(file, `pytanie quizu "${h.text}" nie ma poprawnego id {#id}`); continue; }
    const { options, answers, explain } = parseQuizBody(p.body);
    if (options.length < 2) report(file, `quiz ${h.id}: potrzeba co najmniej dwóch opcji "- [ ]"`);
    if (answers.length !== 1) report(file, `quiz ${h.id}: dokładnie jedna opcja musi być poprawna "- [x]" (jest ${answers.length})`);
    quiz.push({ id: h.id, topic: id, q: md.inline(h.text), options: options.map(md.inline), answer: answers[0] ?? 0, explain: explain ? md.inline(explain) : '' });
  }

  const html = (s: string | undefined) => (s ? md.block(s) : undefined);
  return {
    id, category, title: fm.title, level: fm.level, added: fm.added, tags: fm.tags, summary: md.inline(fm.summary), flow: fm.flow,
    body: html(sec.body), analogy: html(sec.analogy), code: html(sec.code), pitfalls: html(sec.pitfalls),
    qa, quiz, sources: fm.sources,
  };
}

function parseRule(file: string, id: string, category: string, group: string, text: string, md: Renderer, report: Report, check: Check): ClRule | undefined {
  const { data, body } = splitFrontmatter(text);
  const fm = check(file, ruleFrontmatter, data);
  const { intro, parts } = splitHeadings(body, 2);
  if (!intro) report(file, 'brak opisu reguły przed pierwszą sekcją');
  const sec: Partial<Record<(typeof RULE_SECTIONS)[string], string>> = {};
  for (const p of parts) {
    const key = RULE_SECTIONS[p.heading];
    if (!key) report(file, `nieznana sekcja "## ${p.heading}" (dozwolone: ${Object.keys(RULE_SECTIONS).join(', ')})`);
    else sec[key] = p.body;
  }
  if (!sec.verify) report(file, 'brak sekcji "## Jak sprawdzić"');
  if (!fm) return undefined;
  const html = (s: string | undefined) => (s ? md.block(s) : undefined);
  return {
    key: `${category}/${id}`, id, category, group, title: md.inline(fm.title), priority: fm.priority,
    desc: md.block(intro), why: html(sec.why), verify: html(sec.verify), code: html(sec.code), pitfalls: html(sec.pitfalls),
    sources: fm.sources, url: `https://frontendchecklist.io/rules/${category}/${id}`,
  };
}
