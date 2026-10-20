import { describe, expect, it } from 'vitest';
import { codeFigure, getHighlighter } from './render.ts';
import { CODE_LANGS } from './schema.ts';

const SAMPLE: Record<string, string> = {
  html: '<a href="x">hi</a>', css: '.a { color: red; }', scss: '$c: red; .a { color: $c; }', js: 'const a = 1;',
  ts: 'const a: number = 1;', tsx: 'const a = <B x={1} />;', jsx: 'const a = <B x={1} />;', json: '{ "a": 1 }',
  http: 'GET /api HTTP/1.1', bash: 'npm install', yaml: 'a: 1', xml: '<a b="c"/>', md: 'Use `npm`', graphql: 'query { a }',
};

describe('code highlighting', () => {
  it.each(Object.keys(SAMPLE))('highlights %s offline into token classes', async (lang) => {
    const html = codeFigure(await getHighlighter(), lang, null, SAMPLE[lang]);
    expect(html).toMatch(/<span class="t-[a-z]">/);
  });

  it('covers every allowed language', () => {
    expect(Object.keys(CODE_LANGS).sort()).toEqual([...Object.keys(SAMPLE), 'txt'].sort());
  });

  it('escapes plain text and keeps the title', async () => {
    const html = codeFigure(await getHighlighter(), 'txt', 'title="Plik <x>"', '<b>');
    expect(html).toContain('&lt;b&gt;');
    expect(html).toContain('<b>Plik &lt;x&gt;</b>');
  });
});
