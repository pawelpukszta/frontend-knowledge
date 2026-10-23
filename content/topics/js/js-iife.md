---
title: IIFE i wzorzec modułu
level: mid
added: 2026-10-20
tags:
  - IIFE
  - module pattern
  - scope
  - historia
summary: IIFE (Immediately Invoked Function Expression) to funkcja wywołana od razu po zdefiniowaniu. Tworzyła prywatny zasięg w czasach przed let/const i modułami ES; dziś spotkasz ją głównie w starszym kodzie i bundlach.
sources:
  - title: "MDN Glossary: IIFE"
    url: https://developer.mozilla.org/en-US/docs/Glossary/IIFE
  - title: "Ben Alman: Immediately-Invoked Function Expression (IIFE)"
    url: https://benalman.com/news/2010/11/immediately-invoked-function-expression/
  - title: 'javascript.info: The old "var" (IIFE)'
    url: https://javascript.info/var
---

## Wyjaśnienie

Składnia: funkcja w nawiasach (żeby parser potraktował ją jako wyrażenie, a nie deklarację) i od razu wywołana `()`.

Po co była potrzebna:

- `var` ma zasięg funkcji, a kod ze wszystkich skryptów trafiał do jednego globalnego zasięgu. IIFE izolowało zmienne i zapobiegało kolizjom.
- **Module pattern**: IIFE zwraca obiekt z publicznym API, a reszta zostaje prywatna w domknięciu (jQuery, stare biblioteki).
- Naprawa pętli `var` z callbackami (każda iteracja w osobnym zasięgu).

Dziś to samo dają **moduły ES** (każdy plik ma własny zasięg), **`let`/`const`** (zasięg bloku) i klasy z polami `#private`. IIFE nadal widać w: wynikach bundlerów (format `iife` w Rollup/esbuild), snippetach analityki, skryptach wklejanych na strony oraz jako **async IIFE** do użycia `await` tam, gdzie nie ma top-level await.

## Kod

```js
(function () {
  var secret = 42;      // not visible outside
  console.log(secret);
})();

// Module pattern: private state + public API
const cart = (function () {
  const items = [];
  return {
    add: (item) => items.push(item),
    count: () => items.length,
  };
})();
cart.add({ id: 1 });
cart.count(); // 1
// cart.items -> undefined

// Async IIFE (e.g. in a CommonJS script without top-level await)
(async () => {
  const res = await fetch('/api/offers');
  console.log(await res.json());
})();
```

## Pytania

### Czym jest IIFE i do czego służy? {#js-iife-q1}

Immediately Invoked Function Expression: wyrażenie funkcyjne wywołane od razu po definicji, np. `(function () { ... })()`. Tworzy prywatny zasięg, dzięki czemu zmienne nie trafiają do globalnego zasięgu. Było podstawą wzorca modułu przed ES Modules; dziś służy głównie do async IIFE i w kodzie generowanym przez bundlery.

### Dlaczego funkcję w IIFE owija się w nawiasy? {#js-iife-q2}

`function () {}()` na początku instrukcji parser traktuje jako deklarację funkcji (która wymaga nazwy), więc wywołanie jest błędem składni. Nawiasy zamieniają ją w wyrażenie, które można od razu wywołać.
