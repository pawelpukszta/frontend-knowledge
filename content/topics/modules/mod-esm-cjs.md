---
title: ES Modules vs CommonJS
level: mid
tags:
  - ESM
  - CommonJS
  - require
  - Node.js
summary: ESM (import/export) to standard języka, analizowany statycznie. CommonJS (require/module.exports) to starszy, dynamiczny system z Node.js.
sources:
  - title: "Node.js: ECMAScript modules"
    url: https://nodejs.org/api/esm.html
  - title: "Node.js: Modules: Packages (type field)"
    url: https://nodejs.org/api/packages.html
  - title: "MDN: JavaScript modules"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
---

## Wyjaśnienie

| | ES Modules | CommonJS |
|---|---|---|
| Składnia | `import` / `export` | `require()` / `module.exports` |
| Ładowanie | statyczne, analizowane przed wykonaniem, asynchroniczne | dynamiczne, synchroniczne w trakcie wykonania |
| Tree shaking | tak | praktycznie nie |
| Top-level await | tak | nie |
| Wiązania | "live bindings" (widzisz aktualną wartość) | kopia wartości w chwili require |
| Środowisko | przeglądarki, Node, bundlery | głównie Node.js |

W Node.js o formacie decyduje rozszerzenie (`.mjs` / `.cjs`) lub pole `"type": "module"` w `package.json`. Nowsze wersje Node pozwalają też `require()` modułu ESM (bez top-level await). Nowe projekty i biblioteki piszemy w ESM.

## Kod

```js
// CommonJS
const { readFile } = require('node:fs/promises');
module.exports = { parse };

// ESM
import { readFile } from 'node:fs/promises';
export function parse() {}
```

## Pytania

### Dlaczego ESM umożliwia tree shaking, a CommonJS nie? {#mod-esm-cjs-q1}

Importy ESM są statyczne: bundler zna graf zależności i użyte eksporty bez wykonywania kodu. `require()` może być wywołany warunkowo, z dynamiczną ścieżką, a `module.exports` może być modyfikowany w runtime, więc narzędzie nie może bezpiecznie usunąć kodu.

### Jak Node.js decyduje, czy plik to ESM? {#mod-esm-cjs-q2}

`.mjs` to zawsze ESM, `.cjs` to zawsze CommonJS, a `.js` zależy od pola `"type"` w najbliższym `package.json` (`"module"` lub domyślnie `"commonjs"`).

## Quiz

### Dlaczego tree shaking działa z ESM, a słabo z CommonJS? {#mod-esm-cjs-z1}

- [ ] ESM jest szybszy w runtime
- [x] Importy ESM są statyczne i analizowalne bez wykonania kodu
- [ ] CommonJS nie obsługuje funkcji
- [ ] ESM nie ma efektów ubocznych

Statyczna struktura `import/export` pozwala zbudować graf zależności w czasie budowania.
