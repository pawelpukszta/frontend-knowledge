---
title: Rozszerzanie wbudowanych obiektów i polyfille
level: senior
added: 2026-10-20
tags:
  - prototype pollution
  - monkey patching
  - polyfill
  - Array.prototype
  - SmooshGate
summary: "Dopisywanie metod do Array.prototype czy Object.prototype jest uznawane za złą praktykę: grozi konfliktami z bibliotekami i przyszłymi standardami. Jedynym akceptowanym wyjątkiem są polyfille zgodne ze specyfikacją."
sources:
  - title: "javascript.info: Native prototypes"
    url: https://javascript.info/native-prototypes
  - title: "Chrome for Developers: #SmooshGate FAQ"
    url: https://developer.chrome.com/blog/smooshgate
  - title: "MDN Glossary: Polyfill"
    url: https://developer.mozilla.org/en-US/docs/Glossary/Polyfill
  - title: "MDN: Prototype pollution"
    url: https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/Prototype_pollution
  - title: core-js
    url: https://github.com/zloirock/core-js
---

## Wyjaśnienie

**Monkey patching** wbudowanych prototypów (`Array.prototype.last = ...`) zmienia zachowanie obiektów w całej aplikacji, także w kodzie bibliotek.

Wady:

- **Konflikty**: dwie biblioteki mogą dodać metodę o tej samej nazwie z innym działaniem.
- **Kolizja z przyszłym standardem**: słynny przypadek **SmooshGate** (2018): biblioteka MooTools dodała własne `Array.prototype.flatten`, przez co TC39 musiało nazwać standardową metodę `flat`, żeby nie zepsuć istniejących stron. Podobny problem dotyczył `Array.prototype.contains` (stąd `includes`) i `groupBy` (stąd statyczne `Object.groupBy`).
- **Niespodzianki w iteracji**: wyliczalne właściwości dodane do prototypu pojawiają się w `for...in`.
- Trudniejsze debugowanie i testy.

Zalety (w wąskim zakresie):

- **Polyfill**: implementacja standardowej funkcji dla starszych środowisk, dodawana tylko wtedy, gdy jej brakuje (`if (!Array.prototype.at)`), zgodna ze specyfikacją. W praktyce używa się gotowych: `core-js`, automatycznie przez Babel (`preset-env` + `useBuiltIns`).

Bezpieczne alternatywy: funkcje pomocnicze (`last(arr)`), własna klasa dziedzicząca (`class Money extends Number`), moduły.

Pokrewne zagrożenie: **prototype pollution**, czyli podatność, w której atakujący przez dane wejściowe (np. `{"__proto__": {"isAdmin": true}}` przy naiwnym deep merge) modyfikuje `Object.prototype`. Ochrona: `Object.create(null)`, `Map`, walidacja kluczy, aktualne biblioteki.

## Kod

```js
// Bad: global modification
Array.prototype.last = function () { return this[this.length - 1]; };

// Acceptable: spec-compliant polyfill guarded by feature detection
if (!Array.prototype.at) {
  Object.defineProperty(Array.prototype, 'at', {
    value: function (i) {
      const n = Math.trunc(i) || 0;
      return this[n < 0 ? this.length + n : n];
    },
    writable: true, configurable: true, enumerable: false, // not visible in for...in
  });
}

// Better for app code: a plain helper
export const last = (arr) => arr.at(-1);
```

## Pytania

### Jakie są wady i zalety rozszerzania wbudowanych obiektów JS? {#js-extending-builtins-q1}

Wady: globalna zmiana zachowania, konflikty z bibliotekami i przyszłymi standardami (SmooshGate: `flatten` → `flat`), dodatkowe klucze w `for...in`, trudniejsze debugowanie. Zaleta: możliwość dodania polyfilla, czyli zgodnej ze specyfikacją implementacji brakującej funkcji w starszych środowiskach, zawsze po sprawdzeniu, czy jej nie ma. W kodzie aplikacji lepsze są funkcje pomocnicze.

### Czym jest polyfill i czym różni się od transpilacji? {#js-extending-builtins-q2}

Polyfill dodaje brakujące API w runtime (np. `Array.prototype.at`, `Promise.withResolvers`). Transpilacja (Babel, TypeScript, SWC) przepisuje nową składnię na starszą w czasie buildu (np. optional chaining). Składni nie da się dodać polyfillem, a API nie da się przetranspilować.

### Czym jest prototype pollution? {#js-extending-builtins-q3}

Podatnością, w której niezaufane dane zmieniają `Object.prototype` (np. klucz `__proto__` w naiwnym łączeniu obiektów), przez co wszystkie obiekty dziedziczą wstrzyknięte właściwości. Chronią przed nią walidacja kluczy, `Object.create(null)` lub `Map` oraz aktualne biblioteki.

## Quiz

### Główny powód, dla którego nie dopisuje się metod do `Array.prototype`: {#js-extending-builtins-z1}

- [ ] Jest to niemożliwe w strict mode
- [x] Konflikty z bibliotekami i przyszłymi standardami (np. SmooshGate)
- [ ] Spowalnia każdą tablicę 10 razy
- [ ] TypeScript tego nie kompiluje

MooTools i `flatten` wymusiły zmianę nazwy standardowej metody na `flat`.
