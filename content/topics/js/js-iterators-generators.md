---
title: Iteratory i generatory
level: senior
tags:
  - iterator
  - generator
  - for...of
  - lazy
summary: Iterator to obiekt z metodą next(). Generator (function*) to najprostszy sposób, żeby taki iterator stworzyć i generować wartości leniwie.
sources:
  - title: "javascript.info: Generators"
    url: https://javascript.info/generators
  - title: "MDN: Iteration protocols"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
---

## Wyjaśnienie

- **Protokół iteracji**: obiekt jest iterowalny, jeśli ma metodę `[Symbol.iterator]()`, zwracającą iterator z `next()` → `{ value, done }`. Z tego korzystają `for...of`, spread, destrukturyzacja, `Array.from`.
- **Generator** `function*` może się "zatrzymać" na `yield` i wznowić przy następnym `next()`. Wartości liczone są **leniwie**, więc da się opisać nawet nieskończone sekwencje.
- **Async generators** (`async function*` + `for await...of`) świetnie nadają się do stronicowanego API i strumieni.
- **Iterator helpers (ES2025)**: `iterator.map()`, `.filter()`, `.take()`, `.drop()`, `.toArray()` działają leniwie na iteratorach.

## Kod

```js
function* ids() {
  let id = 1;
  while (true) yield id++; // infinite, but lazy
}
const gen = ids();
gen.next().value; // 1
gen.next().value; // 2

// Paginated API as an async generator
async function* fetchAllPages(url) {
  while (url) {
    const res = await fetch(url).then((r) => r.json());
    yield* res.items;
    url = res.nextPage;
  }
}
for await (const item of fetchAllPages('/api/offers')) console.log(item);
```

## Pytania

### Co sprawia, że obiekt jest iterowalny? {#js-iterators-generators-q1}

Metoda `[Symbol.iterator]`, która zwraca iterator, czyli obiekt z metodą `next()` zwracającą `{ value, done }`. Tablice, stringi, `Map` i `Set` mają ją wbudowaną.

### Gdzie w praktyce użyjesz generatora? {#js-iterators-generators-q2}

Leniwe sekwencje, stronicowane API (async generator), sagi w redux-saga, własne struktury danych iterowalne przez `for...of`.
