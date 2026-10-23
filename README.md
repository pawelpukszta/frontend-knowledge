# Baza wiedzy FE

Front-end interview prep app (mid / senior), in Polish: a topic library, interview questions with model answers, a quiz, flashcards and a front-end checklist. Every topic links to its sources.

Built with React 19, TypeScript and Vite. Content lives in this repo as Markdown files and is validated at build time. The app runs in the browser as an installable PWA that works offline, and on the desktop as a [tinyjs](https://tinyjs.app/) app.

**Open the app:** https://pawelpukszta.github.io/frontend-knowledge/app/ (on Android: Chrome menu, "Install app"; on iOS: Safari, Share, "Add to Home Screen"). Desktop downloads and install steps: https://pawelpukszta.github.io/frontend-knowledge/

> The original single-file proof of concept is kept as the [`poc-v0`](../../tree/poc-v0) tag.

## Run it

Requires Node.js 22.18 or newer (the content tools run TypeScript directly with Node) and pnpm. The pnpm version is pinned in `packageManager` in `package.json`; a globally installed pnpm switches to it automatically.

```bash
pnpm install
pnpm dev      # dev server with hot reload; editing content reloads the page
pnpm build    # production build in dist/ (fails on invalid content)
pnpm preview  # serve the production build
```

Checks (all run in CI on every pull request):

```bash
pnpm typecheck
pnpm lint
pnpm content:check   # validate content/ without building the app
pnpm test
```

### Desktop app (tinyjs)

The desktop app wraps the same build in a native window with [tinyjs](https://tinyjs.app/) (Windows 10/11 with WebView2, macOS 15+, Linux). Install the tinyjs CLI ([instructions](https://tinyjs.app/docs/install)), then:

```bash
tinyjs dev     # native window over the Vite dev server, with hot reload
tinyjs build   # the app for the current OS in dist/ (replaces the web build there)
```

On the desktop, progress is saved to `store.json` in the app's data folder (for example `%APPDATA%\io.github.pawelpukszta.frontend-knowledge\` on Windows); in the browser it is saved to IndexedDB. CI builds the desktop app on Windows and macOS for every pull request (the `desktop` job, not required to merge).

**Desktop releases** are built from version tags: see [RELEASING.md](RELEASING.md) for the step-by-step checklist (version bump, tag, checks, fixing a failed release). The web app does not need a release; it deploys on every merge to `main`.

### PWA and deployment

Every merge to `main` deploys to GitHub Pages (`.github/workflows/pages.yml`): the app goes to `/app/`, and `site/index.html` at the root links to it and to the desktop downloads, with install steps for every platform (a placeholder for the landing page). The service worker (`vite-plugin-pwa`) precaches the app, all content and the Latin font files; after a deploy the app shows "Jest nowa wersja aplikacji" with a reload button. It is not registered in the desktop app (`file://`).

The build keeps updates small: each topic category and each checklist category is a separate content file (`dist/data/<category>.<hash>.js`), and `index.html` lists them. A content change rebuilds one of those files plus `index.html`; the app code and the other categories stay cached on the reader's device.

Not in CI yet:

```bash
pnpm knip            # unused files, exports and dependencies
```

## Project structure

```
content/
  topics/<category>/_category.yaml   category name, color, description, topic order
  topics/<category>/<topic-id>.md    one topic with its interview questions and quiz questions
  checklist/<category>/_category.yaml  checklist category, groups and rule order
  checklist/<category>/<rule-id>.md    one checklist rule
tools/content/   content schema (Zod), parser, Markdown renderer (Shiki), the Vite plugin and the per-category split
src/             the app: views, components, styles
public/          favicon and PWA icons
site/            the page at the root of GitHub Pages
scripts/         one-off migration of the proof-of-concept content to Markdown
tinyjs.json      desktop app config (name, id, version, window); backend/ is its txiki.js backend, assets/icon.png its icon
```

The file name is the id: `content/topics/js/js-this.md` is the topic `js-this`, shown at `#/t/js-this`. Ids must be unique, lowercase and use hyphens.

## Writing content

### Category: `content/topics/<category>/_category.yaml`

```yaml
order: 1                 # position in the app
name: Core JavaScript
short: JS                # short label for tight spaces
hue: scripting           # color: scripting | rendering | painting | loading | system | idle
desc: One sentence about the category.
topics:                  # every topic file of the folder, in display order
  - js-this
```

### Topic: `content/topics/<category>/<topic-id>.md`

````md
---
title: this, arrow functions, call/apply/bind
level: mid               # mid | senior
added: 2026-10-20        # date the topic joined the knowledge base, shown on the topic page
tags: [this, bind]
summary: One or two sentences shown as the TL;DR (inline Markdown).
flow: [Step one, Step two]   # optional pipeline of steps
sources:                 # at least one
  - title: "MDN: this"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
---

## Wyjaśnienie

Markdown: lists, tables, `code`, **bold**, code blocks.

## Analogia

Optional everyday analogy.

## Kod

```ts title="Optional title"
const x = 1;
```

## Częste błędy

- Common mistake

## Pytania

### Interview question? {#js-this-q1}

Model answer in Markdown.

## Quiz

### Quiz question? {#js-this-z1}

- [ ] wrong option
- [x] the only correct option
- [ ] wrong option

Short explanation shown after answering.
````

All sections are optional and must use exactly these headings. Every question needs a unique, stable id in `{#...}`: progress is stored against it, so do not change ids of existing questions.

### Checklist rule: `content/checklist/<category>/<rule-id>.md`

````md
---
title: Rule title (inline Markdown)
priority: high           # critical | high | medium | low
sources:                 # optional extra sources
  - title: WCAG 2.2
    url: https://www.w3.org/TR/WCAG22/
---

What the rule requires.

## Dlaczego to ważne

- One reason per bullet

## Jak sprawdzić

How to verify it (required).

## Kod

```html title="Dobrze"
<html lang="pl">
```

## Częste błędy

- Common mistake
````

The checklist category folder name must match the category slug on frontendchecklist.io: the app links every rule to `https://frontendchecklist.io/rules/<category>/<rule-id>`.

### Rules enforced by the build

- Every topic has at least one source; every quiz question has exactly one correct option.
- Ids are unique: categories, topics, questions and checklist rules.
- Code blocks declare a language: `html css scss js ts tsx jsx json http bash yaml xml md txt graphql`.
- No en dash (U+2013) or em dash (U+2014) anywhere; use a colon, semicolon or hyphen.
- No raw HTML in the text (only `<kbd>` and `<br>`); write tags as code: `` `<button>` ``.
- Every file in a category folder is listed in its `_category.yaml`, and every listed id has a file.

## Credits

The checklist is based on the [Front-End Checklist](https://frontendchecklist.io/) by David Dias ([MIT license](https://github.com/thedaviddias/Front-End-Checklist)), translated to Polish and extended with code examples and links to standards. Icons: [Phosphor Icons](https://phosphoricons.com/) (MIT). Fonts: IBM Plex Sans and JetBrains Mono (SIL Open Font License).
