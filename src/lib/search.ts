import { QA, TOPIC, TOPICS, type Qa, type Topic } from '../data';
import { norm, stripHtml } from './text';

interface Entry { id: string; title: string; meta: string; body: string }
let index: Entry[] | undefined;

// Built on first search: title weighs most, then tags and summary, then body, Q&A and code.
const getIndex = () => (index ??= TOPICS.map((t) => ({
  id: t.id,
  title: norm(t.title),
  meta: norm(`${t.tags.join(' ')} ${stripHtml(t.summary)}`),
  body: norm([t.body, t.analogy, t.code, t.pitfalls, ...t.qa.flatMap((q) => [q.q, q.a])].map((h) => stripHtml(h ?? '')).join(' ')),
})));

const terms = (q: string) => norm(q).split(/\s+/).filter(Boolean);

/** Topics where every term matches somewhere, best first. */
export function searchTopics(q: string): Topic[] {
  const ts = terms(q);
  if (!ts.length) return [];
  return getIndex().map((ix) => {
    let score = 0;
    for (const term of ts) {
      const s = (ix.title.includes(term) ? 10 : 0) + (ix.meta.includes(term) ? 4 : 0) + (ix.body.includes(term) ? 1 : 0);
      if (!s) return null;
      score += s;
    }
    return { t: TOPIC[ix.id], score };
  }).filter((r) => r !== null).sort((a, b) => b.score - a.score).map((r) => r.t);
}

/** Interview questions whose text contains every term. */
export function searchQuestions(q: string): Qa[] {
  const ts = terms(q);
  if (!ts.length) return [];
  return QA.filter((item) => {
    const text = norm(stripHtml(item.q));
    return ts.every((t) => text.includes(t));
  });
}

const escRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Wraps search terms in <mark>, only in text outside tags. Input must be HTML (escape plain text first). */
export function highlight(html: string, q: string): string {
  const ts = q.split(/\s+/).filter((t) => t.length > 1).map(escRe);
  if (!ts.length) return html;
  const re = new RegExp(`(${ts.join('|')})`, 'gi');
  return html.split(/(<[^>]+>)/).map((part) => (part.startsWith('<') ? part : part.replace(re, '<mark>$1</mark>'))).join('');
}

export const escapeHtml = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
