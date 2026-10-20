// Pure text parsing of content files. No file system and no HTML here, so it is easy to test.
import { parse as parseYaml } from 'yaml';

/**
 * Tracks fenced code blocks line by line. Returns the new open fence (or null) and whether
 * the line itself is a fence line. A fence closes on a line of the same character, at least as long.
 */
function fenceStep(line: string, open: string | null): { open: string | null; isFence: boolean; info: string } {
  const m = /^(`{3,}|~{3,})(.*)$/.exec(line.trim());
  if (!m) return { open, isFence: false, info: '' };
  if (open === null) return { open: m[1], isFence: true, info: m[2].trim() };
  if (m[1][0] === open[0] && m[1].length >= open.length && m[2].trim() === '') return { open: null, isFence: true, info: '' };
  return { open, isFence: false, info: '' };
}

/** Splits `---\nyaml\n---\nbody`. Returns null frontmatter when the file has none. */
export function splitFrontmatter(text: string): { data: unknown; body: string } {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (!m) return { data: null, body: text };
  return { data: parseYaml(m[1]), body: text.slice(m[0].length) };
}

/**
 * Splits markdown on headings of the given depth, ignoring lines inside fenced code blocks.
 * Returns the text before the first heading as `intro` and one entry per heading.
 */
export function splitHeadings(md: string, depth: 2 | 3): { intro: string; parts: { heading: string; body: string }[] } {
  const marker = '#'.repeat(depth) + ' ';
  const parts: { heading: string; body: string[] }[] = [];
  const intro: string[] = [];
  let fence: string | null = null;
  for (const line of md.split(/\r?\n/)) {
    const wasOpen = fence !== null;
    fence = fenceStep(line, fence).open;
    if (!wasOpen && fence === null && line.startsWith(marker)) {
      parts.push({ heading: line.slice(marker.length).trim(), body: [] });
      continue;
    }
    (parts.at(-1)?.body ?? intro).push(line);
  }
  return { intro: intro.join('\n').trim(), parts: parts.map((p) => ({ heading: p.heading, body: p.body.join('\n').trim() })) };
}

/** `Question text {#some-id}` -> { text, id } */
export function headingId(heading: string): { text: string; id: string | null } {
  const m = /^(.*?)\s*\{#([^}\s]+)\}$/.exec(heading);
  return m ? { text: m[1].trim(), id: m[2] } : { text: heading, id: null };
}

/** Quiz body: `- [ ] option` / `- [x] option` lines, everything else is the explanation. */
export function parseQuizBody(body: string): { options: string[]; answers: number[]; explain: string } {
  const options: string[] = [];
  const answers: number[] = [];
  const rest: string[] = [];
  for (const line of body.split(/\r?\n/)) {
    const m = /^- \[( |x)\] (.+)$/.exec(line);
    if (m) {
      if (m[1] === 'x') answers.push(options.length);
      options.push(m[2].trim());
    } else rest.push(line);
  }
  return { options, answers, explain: rest.join('\n').trim() };
}

/** `title="Hello world"` -> { title: 'Hello world' } */
export function parseMeta(meta: string | null | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of (meta ?? '').matchAll(/(\w+)="([^"]*)"/g)) out[m[1]] = m[2];
  return out;
}
