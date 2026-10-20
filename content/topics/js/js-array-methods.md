---
title: "Metody tablic: map, filter, reduce i niemutujące wersje"
level: mid
tags:
  - array
  - map
  - filter
  - reduce
  - toSorted
  - groupBy
summary: Metody funkcyjne tablic to podstawa pracy z danymi w React. Nowe metody toSorted, toReversed, toSpliced i with nie mutują oryginału.
sources:
  - title: "MDN: Array"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
  - title: "MDN: Array.prototype.toSorted()"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted
  - title: "MDN: Object.groupBy()"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy
---

## Wyjaśnienie

- **Nie mutują**: `map`, `filter`, `reduce`, `slice`, `concat`, `flat`, `flatMap`, `find`, `findLast`, `some`, `every`, `at`.
- **Mutują**: `push`, `pop`, `splice`, `sort`, `reverse`, `fill`. Uważaj w stanie React.
- **ES2023, bezpieczne dla stanu**: `toSorted()`, `toReversed()`, `toSpliced()`, `with(index, value)` zwracają nową tablicę.
- **ES2024**: `Object.groupBy(items, fn)` i `Map.groupBy` grupują elementy.

## Kod

```js
const offers = [
  { city: 'Rzym', price: 2400 },
  { city: 'Ateny', price: 1900 },
  { city: 'Rzym', price: 3100 },
];

const cheapFirst = offers.toSorted((a, b) => a.price - b.price); // original untouched
const total = offers.reduce((sum, o) => sum + o.price, 0);
const byCity = Object.groupBy(offers, (o) => o.city);
// { Rzym: [...], Ateny: [...] }

const updated = offers.with(1, { ...offers[1], price: 1799 });
```

## Częste błędy

- `arr.sort()` na tablicy ze stanu: mutuje stan. Użyj `toSorted()` lub `[...arr].sort()`.
- `sort()` bez komparatora sortuje leksykograficznie: `[10, 9, 1].sort()` daje `[1, 10, 9]`.

## Pytania

### Które metody tablic mutują oryginał? {#js-array-methods-q1}

M.in. `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`, `copyWithin`. Odpowiedniki niemutujące: `toSorted`, `toReversed`, `toSpliced`, `with`.

### Do czego służy reduce? {#js-array-methods-q2}

Do "zwinięcia" tablicy do jednej wartości: sumy, obiektu, mapy. Przyjmuje akumulator i wartość początkową. Przy prostych przypadkach często czytelniejsze są `map`/`filter` lub `Object.groupBy`.

### Jak wyczyścić tablicę? {#js-array-methods-q3}

`arr.length = 0` lub `arr.splice(0)` czyści tablicę **w miejscu**, więc zmiana jest widoczna we wszystkich referencjach do niej. `arr = []` tworzy **nową** tablicę i podmienia tylko tę zmienną (wymaga `let`); inne referencje nadal wskazują starą zawartość. W stanie React zawsze ustawiasz nową tablicę: `setItems([])`, bo mutacja nie zostanie wykryta.

## Quiz

### Które wywołanie NIE mutuje tablicy? {#js-array-methods-z1}

- [ ] arr.sort()
- [ ] arr.reverse()
- [x] arr.toSorted()
- [ ] arr.splice(0, 1)

`toSorted` (ES2023) zwraca nową, posortowaną tablicę.
