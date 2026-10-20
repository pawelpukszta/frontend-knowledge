---
title: Tree shaking i efekty uboczne
level: senior
tags:
  - tree shaking
  - bundler
  - sideEffects
  - dead code
summary: Tree shaking usuwa z bundla nieużywane eksporty. Działa na ESM i wymaga, by moduły nie miały ukrytych efektów ubocznych.
sources:
  - title: "MDN Glossary: Tree shaking"
    url: https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking
  - title: "webpack: Tree Shaking"
    url: https://webpack.js.org/guides/tree-shaking/
---

## Wyjaśnienie

Bundler buduje graf importów ESM i oznacza, które eksporty są faktycznie używane. Resztę usuwa minifier (dead code elimination).

Co go psuje:

- **CommonJS** w zależnościach.
- **Efekty uboczne** na poziomie modułu (np. modyfikacja `window`, rejestracja globalnych rzeczy): bundler nie może usunąć takiego modułu, bo nie wie, czy jest bezpieczny.
- Import całej biblioteki: `import _ from 'lodash'` zamiast `import debounce from 'lodash-es/debounce'`.

Pole `"sideEffects": false` (lub lista plików, np. CSS) w `package.json` informuje bundler, że moduły są "czyste" i nieużywane można pominąć w całości.

## Kod

```json
{
  "name": "@acme/ui",
  "type": "module",
  "sideEffects": ["*.css"],
  "exports": { ".": "./dist/index.js" }
}
```

## Pytania

### Czym jest tree shaking i co jest do niego potrzebne? {#mod-tree-shaking-q1}

Eliminacja nieużywanego kodu na podstawie statycznego grafu importów. Potrzebne są moduły ESM, brak efektów ubocznych na poziomie modułów (lub poprawne pole `sideEffects`) i importy tylko tego, czego używasz.

### Co oznacza "sideEffects": false w package.json? {#mod-tree-shaking-q2}

Deklarację, że import modułu nie robi nic poza udostępnieniem eksportów. Bundler może wtedy całkowicie pominąć moduł, którego eksporty nie są używane.
