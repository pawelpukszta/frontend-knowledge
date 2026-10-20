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
  - title: "GeeksforGeeks: JavaScript Interview Questions"
    url: https://www.geeksforgeeks.org/javascript/javascript-interview-questions/
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

### Czym różni się map od forEach? {#js-array-methods-q4}

`map` tworzy nową tablicę z wynikami callbacku i nie zmienia oryginału. `forEach` tylko wywołuje callback dla każdego elementu i zwraca `undefined`. Używaj `map`, gdy przekształcasz dane (np. listę ofert w listę komponentów w JSX), a `forEach` lub `for...of`, gdy wykonujesz efekt uboczny (logowanie, wysyłka). `map`, którego wynik nie jest nigdzie użyty, to sygnał, że chodziło o `forEach`.

```js
const prices = [100, 200];
const gross = prices.map((p) => p * 1.23);    // [123, 246]
const nothing = prices.forEach((p) => p * 2); // undefined
```

### Czym różni się slice od splice? {#js-array-methods-q5}

`slice(start, end)` zwraca kopię fragmentu (bez elementu na pozycji `end`) i nie zmienia tablicy. `splice(start, deleteCount, ...items)` mutuje tablicę: usuwa elementy, opcjonalnie wstawia w to miejsce nowe i zwraca usunięte. W stanie React zamiast `splice` używaj `toSpliced`, który przyjmuje te same argumenty, ale zwraca nową tablicę.

```js
const days = ['pn', 'wt', 'śr', 'cz'];
days.slice(1, 3);        // ['wt', 'śr'], days unchanged
days.splice(1, 2, 'XX'); // returns ['wt', 'śr']
days;                    // ['pn', 'XX', 'cz']: mutated
```

### Czym różni się find od filter? {#js-array-methods-q6}

`find` zwraca pierwszy element spełniający warunek (lub `undefined`) i przestaje szukać po trafieniu. `filter` zawsze przechodzi całą tablicę i zwraca nową tablicę wszystkich pasujących elementów (może być pusta). `findIndex` zwraca indeks zamiast elementu, a `findLast` i `findLastIndex` szukają od końca, np. ostatniej zmiany w historii. `indexOf` i `includes` szukają konkretnej wartości, a nie warunku.

```js
const offers = [{ id: 1, hot: true }, { id: 2, hot: true }, { id: 3 }];
offers.find((o) => o.hot);     // { id: 1, hot: true }
offers.filter((o) => o.hot);   // a new array with offers 1 and 2
offers.findLast((o) => o.hot); // { id: 2, hot: true }
```

### Jak posortować tablicę liczb lub obiektów? {#js-array-methods-q7}

`sort()` bez argumentu zamienia elementy na stringi i porównuje je znak po znaku, dlatego `[10, 9, 1].sort()` daje `[1, 10, 9]`. Trzeba podać funkcję porównującą, która zwraca liczbę ujemną (a przed b), dodatnią (b przed a) lub `0`. Dla liczb wystarczy odejmowanie, dla tekstu `localeCompare`, który zna polskie znaki. `sort` mutuje tablicę, a `toSorted` zwraca nową.

```js
[10, 9, 1].toSorted((a, b) => a - b); // [1, 9, 10]
[10, 9, 1].toSorted((a, b) => b - a); // [10, 9, 1]: descending

const hotels = [{ name: 'Żagiel', price: 300 }, { name: 'Albatros', price: 450 }];
hotels.toSorted((a, b) => a.price - b.price);                  // by price
hotels.toSorted((a, b) => a.name.localeCompare(b.name, 'pl')); // by name, Polish order
```

## Quiz

### Które wywołanie NIE mutuje tablicy? {#js-array-methods-z1}

- [ ] arr.sort()
- [ ] arr.reverse()
- [x] arr.toSorted()
- [ ] arr.splice(0, 1)

`toSorted` (ES2023) zwraca nową, posortowaną tablicę.
