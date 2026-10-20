// Markdown -> HTML at build time. Code blocks are highlighted with Shiki into short token classes
// (`t-k`, `t-s`, ...) that the app colors with CSS variables, so both themes share one markup.
import type { Element, Root as HastRoot, RootContent as HastNode } from 'hast';
import type { Root as MdRoot, RootContent as MdNode } from 'mdast';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { createCssVariablesTheme, createHighlighter, type Highlighter } from 'shiki';
import { unified } from 'unified';
import { iconSvg } from '../../src/lib/icons.ts';
import { CODE_LANGS, type CodeLang } from './schema.ts';
import { parseMeta } from './parse.ts';

export const LANG_LABEL: Record<CodeLang, string> = {
  js: 'JavaScript', ts: 'TypeScript', tsx: 'TSX', jsx: 'JSX', html: 'HTML', css: 'CSS', json: 'JSON', http: 'HTTP',
  graphql: 'GraphQL', md: 'Markdown', scss: 'SCSS', bash: 'Shell', yaml: 'YAML', xml: 'XML', txt: 'Tekst',
};

const THEME = createCssVariablesTheme({ name: 'kb', variablePrefix: '--shiki-' });
const TOKEN_CLASS: Record<string, string> = {
  'var(--shiki-token-comment)': 't-c',
  'var(--shiki-token-keyword)': 't-k',
  'var(--shiki-token-string)': 't-s',
  'var(--shiki-token-string-expression)': 't-s',
  'var(--shiki-token-constant)': 't-n',
  'var(--shiki-token-function)': 't-f',
  'var(--shiki-token-parameter)': 't-p',
  'var(--shiki-token-punctuation)': 't-u',
  'var(--shiki-token-link)': 't-l',
};

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

let highlighter: Promise<Highlighter> | undefined;
export const getHighlighter = () =>
  (highlighter ??= createHighlighter({ themes: [THEME], langs: Object.values(CODE_LANGS).filter((l) => l !== 'text') }));

export function codeFigure(hl: Highlighter, lang: string | null | undefined, meta: string | null | undefined, src: string): string {
  if (!lang || !(lang in CODE_LANGS)) {
    throw new Error(`niedozwolony język bloku kodu: "${lang ?? ''}" (dozwolone: ${Object.keys(CODE_LANGS).join(', ')})`);
  }
  const l = lang as CodeLang;
  const tokens = l === 'txt'
    ? src.split('\n').map((line) => [{ content: line, color: '' }])
    : hl.codeToTokensBase(src, { lang: CODE_LANGS[l], theme: THEME });
  const code = tokens.map((line) => line.map((t) => {
    const cls = TOKEN_CLASS[t.color ?? ''];
    return cls ? `<span class="${cls}">${esc(t.content)}</span>` : esc(t.content);
  }).join('')).join('\n');
  const title = parseMeta(meta).title;
  const label = `<span class="code-lang">${LANG_LABEL[l]}</span>`;
  return `<figure class="code"><figcaption class="code-head"><span>${title ? `<b>${esc(title)}</b> ${label}` : label}</span>`
    + `<button class="copy" type="button" data-act="copy">${iconSvg('copy')}<span>Kopiuj</span></button></figcaption>`
    + `<pre><code>${code}</code></pre></figure>`;
}

const ALLOWED_HTML = /^<\/?(kbd|br)\s*\/?>$/;

/** Replaces mdast code nodes with highlighted HTML figures and rejects raw HTML in the text. */
function remarkCode(hl: Highlighter) {
  return (tree: MdRoot) => {
    const walk = (nodes: MdNode[]) => nodes.forEach((n, i) => {
      if (n.type === 'html' && !ALLOWED_HTML.test(n.value.trim())) {
        throw new Error(`surowy HTML "${n.value.trim().slice(0, 40)}" (tagi w tekście zapisz jako \`kod\`; dozwolone tylko <kbd>, <br>)`);
      }
      if (n.type === 'code') nodes[i] = { type: 'html', value: codeFigure(hl, n.lang, n.meta, n.value) };
      else if ('children' in n) walk(n.children as MdNode[]);
    });
    walk(tree.children);
  };
}

/** Wraps tables for horizontal scrolling and opens external links in a new tab. */
function rehypeEnhance() {
  return (tree: HastRoot) => {
    const walk = (nodes: HastNode[]) => nodes.forEach((n, i) => {
      if (n.type !== 'element') return;
      if (n.tagName === 'table') {
        nodes[i] = { type: 'element', tagName: 'div', properties: { className: ['table-wrap'] }, children: [n] } satisfies Element;
      }
      if (n.tagName === 'a' && /^https?:/.test(String(n.properties.href))) {
        n.properties.target = '_blank';
        n.properties.rel = ['noopener', 'noreferrer'];
      }
      walk(n.children as HastNode[]);
    });
    walk(tree.children);
  };
}

export async function createRenderer() {
  const hl = await getHighlighter();
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkCode, hl)
    // Built-in content is trusted and may contain inline HTML such as <kbd>.
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeEnhance)
    .use(rehypeStringify, { allowDangerousHtml: true });

  const block = (md: string) => String(processor.processSync(md)).trim();
  /** Inline markdown: a single wrapping paragraph is removed. */
  const inline = (md: string) => {
    const html = block(md);
    const m = /^<p>([\s\S]*)<\/p>$/.exec(html);
    return m && !m[1].includes('<p>') ? m[1] : html;
  };
  return { block, inline };
}
export type Renderer = Awaited<ReturnType<typeof createRenderer>>;
