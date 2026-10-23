import { beforeAll, describe, expect, it } from 'vitest';
import { buildContent, ContentError, type ContentFiles } from './load.ts';
import { createRenderer, type Renderer } from './render.ts';

let md: Renderer;
beforeAll(async () => { md = await createRenderer(); });

const category = (topics: string[]) => `order: 1\nname: Core JavaScript\nshort: JS\nhue: scripting\ndesc: Opis.\ntopics: [${topics.join(', ')}]\n`;
const topic = ({ sources = '\n  - title: MDN\n    url: https://developer.mozilla.org/', body = 'Treść.', extra = '', added = '2026-10-20' } = {}) =>
  `---\ntitle: Domknięcia\nlevel: mid\nadded: ${added}\nsummary: Krótko.\nsources:${sources}\n---\n\n## Wyjaśnienie\n\n${body}\n${extra}`;

function files(entries: Record<string, string>): ContentFiles {
  return new Map(Object.entries(entries));
}

async function problems(entries: Record<string, string>): Promise<string[]> {
  try {
    await buildContent(files(entries), md);
    return [];
  } catch (e) {
    if (e instanceof ContentError) return e.problems;
    throw e;
  }
}

describe('content validation', () => {
  it('accepts a valid topic with Q&A, quiz and highlighted code', async () => {
    const data = await buildContent(files({
      'topics/js/_category.yaml': category(['closures']),
      'topics/js/closures.md': topic({
        body: 'Tekst z `kodem`.\n\n```js title="Licznik"\nconst a = 1;\n```',
        extra: '\n## Pytania\n\n### Czym jest *domknięcie*? {#closures-q1}\n\nFunkcja z dostępem do zasięgu.\n\n'
          + '## Quiz\n\n### Co wypisze kod? {#closures-z1}\n\n- [ ] 1\n- [x] 2\n\nBo tak.\n',
      }),
    }), md);
    const t = data.topics[0];
    expect(t.id).toBe('closures');
    expect(t.category).toBe('js');
    expect(t.added).toBe('2026-10-20');
    expect(t.body).toContain('<span class="t-k">const</span>');
    expect(t.body).toContain('<b>Licznik</b>');
    expect(t.qa).toEqual([{ id: 'closures-q1', topic: 'closures', q: 'Czym jest <em>domknięcie</em>?', a: '<p>Funkcja z dostępem do zasięgu.</p>' }]);
    expect(t.quiz[0]).toMatchObject({ id: 'closures-z1', options: ['1', '2'], answer: 1, explain: 'Bo tak.' });
  });

  it('rejects a topic without sources', async () => {
    const p = await problems({ 'topics/js/_category.yaml': category(['a']), 'topics/js/a.md': topic({ sources: ' []' }) });
    expect(p.join('\n')).toMatch(/topics\/js\/a\.md: sources: temat musi mieć co najmniej jedno źródło/);
  });

  it('rejects a topic without a valid added date', async () => {
    const p = await problems({ 'topics/js/_category.yaml': category(['a']), 'topics/js/a.md': topic({ added: '2026-13-01' }) });
    expect(p.join('\n')).toMatch(/topics\/js\/a\.md: added: data dodania tematu w formacie RRRR-MM-DD/);
    const missing = await problems({ 'topics/js/_category.yaml': category(['a']), 'topics/js/a.md': topic().replace(/^added: .*\n/m, '') });
    expect(missing.join('\n')).toMatch(/topics\/js\/a\.md: added: data dodania tematu/);
  });

  it('rejects duplicate topic ids across categories', async () => {
    const p = await problems({
      'topics/js/_category.yaml': category(['a']), 'topics/js/a.md': topic(),
      'topics/ts/_category.yaml': category(['a']), 'topics/ts/a.md': topic(),
    });
    expect(p.join('\n')).toMatch(/topics\/ts\/a\.md: zduplikowane id tematu "a"/);
  });

  it('rejects duplicate question ids', async () => {
    const qa = '\n## Pytania\n\n### P1? {#same}\n\nA.\n\n### P2? {#same}\n\nB.\n';
    const p = await problems({ 'topics/js/_category.yaml': category(['a']), 'topics/js/a.md': topic({ extra: qa }) });
    expect(p.join('\n')).toMatch(/zduplikowane id pytania "same"/);
  });

  it('rejects a code block in a language that is not allowed', async () => {
    const p = await problems({ 'topics/js/_category.yaml': category(['a']), 'topics/js/a.md': topic({ body: '```python\nprint(1)\n```' }) });
    expect(p.join('\n')).toMatch(/niedozwolony język bloku kodu: "python"/);
  });

  it('rejects raw HTML tags in text but allows <kbd>', async () => {
    const p = await problems({ 'topics/js/_category.yaml': category(['a']), 'topics/js/a.md': topic({ body: 'Klawisz <kbd>Tab</kbd>, potem <button> i <script>x</script>.' }) });
    expect(p.join('\n')).toMatch(/surowy HTML "<button>"/);
    expect(p).toHaveLength(1);
  });

  it('rejects a code block without a language', async () => {
    const p = await problems({ 'topics/js/_category.yaml': category(['a']), 'topics/js/a.md': topic({ body: '```\nx\n```' }) });
    expect(p.join('\n')).toMatch(/niedozwolony język bloku kodu: ""/);
  });

  it.each([['en dash', '–'], ['em dash', '—']])('rejects an %s', async (_name, dash) => {
    const p = await problems({ 'topics/js/_category.yaml': category(['a']), 'topics/js/a.md': topic({ body: `A ${dash} B` }) });
    expect(p.join('\n')).toMatch(/topics\/js\/a\.md: linia \d+: znak półpauzy lub pauzy/);
  });

  it('rejects a quiz question without exactly one correct answer', async () => {
    const quiz = '\n## Quiz\n\n### Pytanie? {#a-z1}\n\n- [x] 1\n- [x] 2\n';
    const p = await problems({ 'topics/js/_category.yaml': category(['a']), 'topics/js/a.md': topic({ extra: quiz }) });
    expect(p.join('\n')).toMatch(/dokładnie jedna opcja musi być poprawna/);
  });

  it('rejects unknown sections and topics missing from the category file', async () => {
    const p = await problems({
      'topics/js/_category.yaml': category(['a']),
      'topics/js/a.md': topic({ extra: '\n## Ciekawostki\n\nx\n' }),
      'topics/js/b.md': topic(),
    });
    expect(p.join('\n')).toMatch(/nieznana sekcja "## Ciekawostki"/);
    expect(p.join('\n')).toMatch(/topics\/js\/b\.md: temat nie jest wymieniony/);
  });

  it('ignores headings inside code blocks when splitting sections', async () => {
    const data = await buildContent(files({
      'topics/js/_category.yaml': category(['a']),
      'topics/js/a.md': topic({ body: '```md\n## Status\n### Not a question\n```' }),
    }), md);
    expect(data.topics[0].body).toContain('## Status');
  });

  it('builds checklist rules with a link to the original rule', async () => {
    const data = await buildContent(files({
      'checklist/html/_category.yaml': 'order: 1\nname: HTML\ndesc: Opis.\nhue: idle\ngroups:\n  - name: Podstawy\n    rules: [doctype]\n',
      'checklist/html/doctype.md': '---\ntitle: Deklaracja `<!doctype html>`\npriority: high\n---\n\nOpis.\n\n## Dlaczego to ważne\n\n- Tryb standardów.\n\n## Jak sprawdzić\n\nW DevTools.\n',
    }), md);
    expect(data.clRules[0]).toMatchObject({ key: 'html/doctype', group: 'Podstawy', url: 'https://frontendchecklist.io/rules/html/doctype' });
    expect(data.clRules[0].title).toBe('Deklaracja <code>&#x3C;!doctype html></code>');
  });
});
