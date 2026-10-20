// Migration test on verbatim excerpts of the PoC sources (tag poc-v0): migrate, load back through
// the validator, compare with the original fields.
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildContent, readContentDir } from '../tools/content/load.ts';
import { countLoaded, migrate } from './migrate-poc.ts';

const POC_TOPICS = `@category js
name: Core JavaScript
short: JS
hue: scripting
desc: Fundamenty języka i ES6+.

@topic js-this
title: this, arrow functions, call/apply/bind
level: mid
tags: this, arrow function, bind
summary: Wartość this zależy od sposobu wywołania funkcji. Arrow function nie ma własnego this: bierze je z otaczającego zasięgu.

::: body
Reguły dla zwykłej funkcji (od najwyższego priorytetu):

1. \`new Fn()\`: \`this\` to nowy obiekt.
2. Samo \`fn()\`: \`undefined\` w strict mode.

::: code js
const bound = user.regular.bind(user);
bound();              // 'Ala'

::: qa
Q: Od czego zależy wartość this?
A: Od sposobu wywołania: \`new\`, jawne \`call/apply/bind\`, wywołanie jako metoda obiektu albo samodzielne wywołanie.
Q: Co wypisze ten kod?
A:
\`\`\`js
(function () { console.log(this); })();
\`\`\`
\`undefined\` w strict mode.

::: sources
- MDN: this | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this

@topic js-flow
title: Event loop
level: senior
tags: event loop
summary: Kolejki zadań.

::: flow
Call stack > Microtasks > Render

::: analogy
Kelner w restauracji.

::: pitfalls
- Blokowanie wątku.

::: sources
- MDN: Event loop | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop

@quiz
Q: Co zwraca \`typeof null\`?
- "null"
+ "object"
- "undefined"
E: Historyczny błąd języka.
T: js-this
`;

const POC_CHECKLIST = `@cl-category html
name: HTML
desc: Poprawny, semantyczny HTML.
sources: HTML Living Standard | https://html.spec.whatwg.org/

@cl-group Podstawy dokumentu
sources: MDN: Document | https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html

[doctype] critical
T: Deklaracja \`<!DOCTYPE html>\`
D: Pierwsza linia dokumentu to \`<!DOCTYPE html>\`.
W: Bez niej przeglądarka włącza quirks mode.
W: Layout różni się między przeglądarkami.
V: DevTools: \`document.compatMode\` zwraca \`"CSS1Compat"\`.
\`\`\`html Dobrze
<!DOCTYPE html>
\`\`\`
X: Komentarz przed doctype.
S: MDN: Doctype | https://developer.mozilla.org/en-US/docs/Glossary/Doctype

[charset] high
T: Kodowanie znaków
D: \`<meta charset="utf-8">\` w pierwszych 1024 bajtach.
V: Sprawdź źródło strony.
`;

function pocFixture(): string {
  const dir = mkdtempSync(join(tmpdir(), 'kb-poc-'));
  mkdirSync(join(dir, 'content'));
  mkdirSync(join(dir, 'checklist'));
  writeFileSync(join(dir, 'content', '01-js.txt'), POC_TOPICS);
  writeFileSync(join(dir, 'checklist', '01-html.txt'), POC_CHECKLIST);
  return dir;
}

describe('PoC migration', () => {
  it('keeps every count and the fields of sample topics and rules', async () => {
    const out = mkdtempSync(join(tmpdir(), 'kb-out-'));
    const before = migrate(pocFixture(), out);
    expect(before).toEqual({ categories: 1, topics: 2, qa: 2, quiz: 1, clCategories: 1, clRules: 2 });
    expect(await countLoaded(out)).toEqual(before);

    const data = await buildContent(readContentDir(out));
    const t = data.topics.find((x) => x.id === 'js-this')!;
    expect(t).toMatchObject({ title: 'this, arrow functions, call/apply/bind', level: 'mid', tags: ['this', 'arrow function', 'bind'] });
    expect(t.sources).toEqual([{ title: 'MDN: this', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this' }]);
    expect(t.body).toContain('<ol>');
    expect(t.code).toContain('<span class="t-k">');
    expect(t.qa.map((q) => q.id)).toEqual(['js-this-q1', 'js-this-q2']);
    expect(t.qa[1].a).toContain('<figure class="code">');
    expect(t.quiz).toEqual([{ id: 'js-this-z1', topic: 'js-this', q: 'Co zwraca <code>typeof null</code>?', options: ['"null"', '"object"', '"undefined"'], answer: 1, explain: 'Historyczny błąd języka.' }]);

    const flow = data.topics.find((x) => x.id === 'js-flow')!;
    expect(flow.flow).toEqual(['Call stack', 'Microtasks', 'Render']);
    expect(flow.analogy).toBe('<p>Kelner w restauracji.</p>');

    const rule = data.clRules.find((r) => r.id === 'doctype')!;
    expect(rule).toMatchObject({ key: 'html/doctype', priority: 'critical', group: 'Podstawy dokumentu', url: 'https://frontendchecklist.io/rules/html/doctype' });
    expect(rule.why).toBe('<ul>\n<li>Bez niej przeglądarka włącza quirks mode.</li>\n<li>Layout różni się między przeglądarkami.</li>\n</ul>');
    expect(rule.code).toContain('<b>Dobrze</b>');
    expect(rule.sources).toEqual([{ title: 'MDN: Doctype', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Doctype' }]);
    expect(data.clCategories[0]).toMatchObject({ id: 'html', hue: 'idle', groups: [{ name: 'Podstawy dokumentu', rules: ['doctype', 'charset'] }] });
  });
});
