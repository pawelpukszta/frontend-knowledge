// One-off migration of the proof-of-concept content (tag poc-v0: content/*.txt, checklist/*.txt) to the
// Markdown format in content/. To re-run: `git worktree add ../poc poc-v0`, then
// `node scripts/migrate-poc.ts ../poc <out-dir> [category-file-regex]`. Prints a count report: numbers
// parsed from the PoC files vs. numbers loaded back through the validator.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { stringify } from 'yaml';
import { buildContent, readContentDir } from '../tools/content/load.ts';

interface Link { title: string; url: string }
interface PocTopic {
  id: string; title: string; level: string; tags: string[]; summary: string;
  body?: string; flow?: string[]; analogy?: string; pitfalls?: string;
  code: { lang: string; title: string; src: string }[];
  qa: { q: string; a: string }[]; sources: Link[];
  quiz: { q: string; options: string[]; answer: number; explain: string }[];
}
interface PocCategory { id: string; name: string; short: string; hue: string; desc: string; topics: PocTopic[] }
interface PocRule {
  id: string; priority: string; title: string; desc: string; verify: string;
  why: string[]; pitfalls: string[]; sources: Link[]; code: { lang: string; title: string; src: string }[];
}
interface PocClCategory { id: string; name: string; desc: string; sources: Link[]; groups: { name: string; sources: Link[]; rules: PocRule[] }[] }

// Category hues of the checklist were hard-coded in the PoC template.
const CL_HUE: Record<string, string> = {
  accessibility: 'rendering', seo: 'loading', performance: 'scripting', css: 'painting', javascript: 'scripting',
  html: 'idle', images: 'painting', security: 'idle', testing: 'system', privacy: 'system', i18n: 'loading',
};

const links = (value: string): Link[] => value.split(' ; ').map((p) => p.trim()).filter(Boolean).map((p) => {
  const i = p.lastIndexOf('|');
  return { title: p.slice(0, i).trim(), url: p.slice(i + 1).trim() };
});

export function parsePocTopics(text: string): PocCategory {
  const blocks = text.split(/^@(category|topic|quiz)\b/m);
  let cat: PocCategory | undefined;
  for (let i = 1; i < blocks.length; i += 2) {
    const kind = blocks[i];
    const body = blocks[i + 1];
    const nl = body.indexOf('\n');
    const first = body.slice(0, nl).trim();
    const rest = body.slice(nl + 1);
    if (kind === 'category') {
      const meta = Object.fromEntries(rest.trim().split('\n').map((l) => [l.slice(0, l.indexOf(':')).trim(), l.slice(l.indexOf(':') + 1).trim()]));
      cat = { id: first, name: meta.name, short: meta.short, hue: meta.hue, desc: meta.desc, topics: [] };
    } else if (kind === 'topic') {
      cat!.topics.push(parsePocTopic(first, rest));
    } else {
      for (const chunk of rest.trim().split(/\n\s*\n/)) {
        const q = { q: '', options: [] as string[], answer: -1, explain: '', topic: '' };
        for (const line of chunk.split('\n')) {
          if (line.startsWith('Q: ')) q.q = line.slice(3).trim();
          else if (line.startsWith('+ ')) { q.answer = q.options.length; q.options.push(line.slice(2).trim()); }
          else if (line.startsWith('- ')) q.options.push(line.slice(2).trim());
          else if (line.startsWith('E: ')) q.explain = line.slice(3).trim();
          else if (line.startsWith('T: ')) q.topic = line.slice(3).trim();
        }
        if (!q.q) continue;
        const t = cat!.topics.find((x) => x.id === q.topic);
        if (!t) throw new Error(`quiz "${q.q}" links unknown topic ${q.topic}`);
        t.quiz.push(q);
      }
    }
  }
  return cat!;
}

function parsePocTopic(id: string, text: string): PocTopic {
  const [header, ...sections] = text.split(/^::: /m);
  const t: PocTopic = { id, title: '', level: '', tags: [], summary: '', code: [], qa: [], sources: [], quiz: [] };
  for (const line of header.trim().split('\n')) {
    const k = line.slice(0, line.indexOf(':')).trim();
    const v = line.slice(line.indexOf(':') + 1).trim();
    if (k === 'tags') t.tags = v.split(',').map((s) => s.trim()).filter(Boolean);
    else if (k === 'title' || k === 'level' || k === 'summary') t[k] = v;
  }
  for (const section of sections) {
    const nl = section.indexOf('\n');
    const [kind, lang = 'js', ...title] = section.slice(0, nl).trim().split(' ');
    const body = section.slice(nl + 1).trimEnd();
    if (kind === 'body' || kind === 'analogy' || kind === 'pitfalls') t[kind] = body.trim();
    else if (kind === 'flow') t.flow = body.trim().split(' > ').map((s) => s.trim());
    else if (kind === 'code') t.code.push({ lang, title: title.join(' '), src: body.replace(/^\n+|\n+$/g, '') });
    else if (kind === 'sources') t.sources = body.split('\n').filter((l) => l.trim().startsWith('- ')).flatMap((l) => links(l.trim().slice(2)));
    else if (kind === 'qa') {
      let cur: { q: string; a: string } | undefined;
      for (const line of body.split('\n')) {
        if (line.startsWith('Q: ')) { cur = { q: line.slice(3).trim(), a: '' }; t.qa.push(cur); }
        else if (cur && (line.startsWith('A: ') || line.trim() === 'A:')) cur.a += line.slice(3) + '\n';
        else if (cur) cur.a += line + '\n';
      }
      t.qa.forEach((x) => (x.a = x.a.trim()));
    } else throw new Error(`unknown section ${kind} in ${id}`);
  }
  return t;
}

export function parsePocChecklist(text: string): PocClCategory[] {
  const cats: PocClCategory[] = [];
  let cat: PocClCategory | undefined;
  let group: PocClCategory['groups'][number] | undefined;
  let rule: PocRule | undefined;
  let code: { lang: string; title: string; lines: string[] } | undefined;
  for (const raw of text.split('\n')) {
    const line = raw.trimEnd();
    if (code) {
      if (line.trim() === '```') { rule!.code.push({ lang: code.lang, title: code.title, src: code.lines.join('\n').replace(/^\n+|\n+$/g, '') }); code = undefined; }
      else code.lines.push(raw);
      continue;
    }
    if (!line) continue;
    if (line.startsWith('```')) {
      const [lang, ...title] = line.slice(3).trim().split(' ');
      code = { lang, title: title.join(' ').trim(), lines: [] };
    } else if (line.startsWith('@cl-category ')) {
      cat = { id: line.split(' ')[1].trim(), name: '', desc: '', sources: [], groups: [] };
      cats.push(cat); group = undefined; rule = undefined;
    } else if (line.startsWith('@cl-group ')) {
      group = { name: line.slice('@cl-group '.length).trim(), sources: [], rules: [] };
      cat!.groups.push(group); rule = undefined;
    } else if (line.startsWith('[')) {
      const m = /^\[([a-z0-9-]+)\] (critical|high|medium|low)$/.exec(line);
      if (!m) throw new Error(`bad rule header: ${line}`);
      rule = { id: m[1], priority: m[2], title: '', desc: '', verify: '', why: [], pitfalls: [], sources: [], code: [] };
      group!.rules.push(rule);
    } else if (rule && /^[TDVSWX]: /.test(line)) {
      const v = line.slice(3).trim();
      if (line[0] === 'T') rule.title = v;
      else if (line[0] === 'D') rule.desc = v;
      else if (line[0] === 'V') rule.verify = v;
      else if (line[0] === 'W') rule.why.push(v.replace(/^- /, ''));
      else if (line[0] === 'X') rule.pitfalls.push(v.replace(/^- /, ''));
      else rule.sources.push(...links(v));
    } else if (!rule && line.includes(':')) {
      const k = line.slice(0, line.indexOf(':')).trim();
      const v = line.slice(line.indexOf(':') + 1).trim();
      const target = group ?? cat!;
      if (k === 'sources') target.sources = links(v);
      else if (k === 'name' || k === 'desc') (cat as unknown as Record<string, string>)[k] = v;
    } else throw new Error(`unparsed checklist line: ${line}`);
  }
  return cats;
}

/** A fence longer than any backtick run at the start of a line in the code. */
function fence(lang: string, title: string, src: string): string {
  const longest = Math.max(2, ...[...src.matchAll(/^\s*(`{3,})/gm)].map((m) => m[1].length));
  const f = '`'.repeat(longest + 1);
  return `${f}${lang}${title ? ` title="${title.replace(/"/g, '\'')}"` : ''}\n${src}\n${f}`;
}

const frontmatter = (data: object) => `---\n${stringify(data, { lineWidth: 0 }).trimEnd()}\n---\n`;
const section = (title: string, body: string | undefined) => (body ? `\n## ${title}\n\n${body}\n` : '');

export function topicToMd(t: PocTopic): string {
  const fm: Record<string, unknown> = { title: t.title, level: t.level, tags: t.tags, summary: t.summary };
  if (t.flow) fm.flow = t.flow;
  fm.sources = t.sources;
  return frontmatter(fm)
    + section('Wyjaśnienie', t.body)
    + section('Analogia', t.analogy)
    + section('Kod', t.code.map((c) => fence(c.lang, c.title, c.src)).join('\n\n'))
    + section('Częste błędy', t.pitfalls)
    + section('Pytania', t.qa.map((q, i) => `### ${q.q} {#${t.id}-q${i + 1}}\n\n${q.a}`).join('\n\n'))
    + section('Quiz', t.quiz.map((q, i) => `### ${q.q} {#${t.id}-z${i + 1}}\n\n`
      + q.options.map((o, n) => `- [${n === q.answer ? 'x' : ' '}] ${o}`).join('\n') + (q.explain ? `\n\n${q.explain}` : '')).join('\n\n'));
}

export function ruleToMd(r: PocRule): string {
  return frontmatter({ title: r.title, priority: r.priority, ...(r.sources.length ? { sources: r.sources } : {}) })
    + `\n${r.desc}\n`
    + section('Dlaczego to ważne', r.why.map((w) => `- ${w}`).join('\n'))
    + section('Jak sprawdzić', r.verify)
    + section('Kod', r.code.map((c) => fence(c.lang, c.title, c.src)).join('\n\n'))
    + section('Częste błędy', r.pitfalls.map((x) => `- ${x}`).join('\n'));
}

export function migrate(pocDir: string, outDir: string, only?: RegExp) {
  const counts = { categories: 0, topics: 0, qa: 0, quiz: 0, clCategories: 0, clRules: 0 };
  const topicFiles = readdirSync(join(pocDir, 'content')).filter((f) => f.endsWith('.txt') && (!only || only.test(f))).sort();
  topicFiles.forEach((file, i) => {
    const c = parsePocTopics(readFileSync(join(pocDir, 'content', file), 'utf8'));
    const dir = join(outDir, 'topics', c.id);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, '_category.yaml'), stringify({ order: i + 1, name: c.name, short: c.short, hue: c.hue, desc: c.desc, topics: c.topics.map((t) => t.id) }, { lineWidth: 0 }));
    for (const t of c.topics) writeFileSync(join(dir, `${t.id}.md`), topicToMd(t));
    counts.categories++;
    counts.topics += c.topics.length;
    counts.qa += c.topics.reduce((n, t) => n + t.qa.length, 0);
    counts.quiz += c.topics.reduce((n, t) => n + t.quiz.length, 0);
  });
  if (!only) {
    const clFiles = readdirSync(join(pocDir, 'checklist')).filter((f) => f.endsWith('.txt')).sort();
    let order = 0;
    for (const file of clFiles) {
      for (const c of parsePocChecklist(readFileSync(join(pocDir, 'checklist', file), 'utf8'))) {
        const dir = join(outDir, 'checklist', c.id);
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, '_category.yaml'), stringify({
          order: ++order, name: c.name, desc: c.desc, hue: CL_HUE[c.id] ?? 'system', sources: c.sources,
          groups: c.groups.map((g) => ({ name: g.name, sources: g.sources, rules: g.rules.map((r) => r.id) })),
        }, { lineWidth: 0 }));
        for (const g of c.groups) for (const r of g.rules) writeFileSync(join(dir, `${r.id}.md`), ruleToMd(r));
        counts.clCategories++;
        counts.clRules += c.groups.reduce((n, g) => n + g.rules.length, 0);
      }
    }
  }
  return counts;
}

export async function countLoaded(outDir: string) {
  const d = await buildContent(readContentDir(outDir));
  return {
    categories: d.categories.length, topics: d.topics.length,
    qa: d.topics.reduce((n, t) => n + t.qa.length, 0), quiz: d.topics.reduce((n, t) => n + t.quiz.length, 0),
    clCategories: d.clCategories.length, clRules: d.clRules.length,
  };
}

if (import.meta.main) {
  const [pocDir, outDir, only] = process.argv.slice(2);
  const before = migrate(pocDir, outDir, only ? new RegExp(only) : undefined);
  const after = await countLoaded(outDir);
  console.table(Object.fromEntries(Object.keys(before).map((k) => [k, { poc: before[k as keyof typeof before], migrated: after[k as keyof typeof after] }])));
  if (JSON.stringify(before) !== JSON.stringify(after)) { console.error('Count mismatch'); process.exit(1); }
}
