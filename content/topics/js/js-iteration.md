---
title: "Iterowanie: for, for...of, for...in, forEach, Object.entries"
level: mid
tags:
  - for...of
  - for...in
  - forEach
  - Object.keys
  - Object.entries
  - pętle
summary: for...of iteruje po wartościach obiektów iterowalnych (tablice, stringi, Map, Set). for...in iteruje po kluczach obiektu, także odziedziczonych. Dla obiektów najczytelniej użyć Object.entries z for...of.
sources:
  - title: "MDN: Loops and iteration"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration
  - title: "MDN: for...of"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
  - title: "MDN: for...in"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in
  - title: "javascript.info: Object.keys, values, entries"
    url: https://javascript.info/keys-values-entries
  - title: "MDN: Array.from()"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
  - title: "GeeksforGeeks: JavaScript Interview Questions"
    url: https://www.geeksforgeeks.org/javascript/javascript-interview-questions/
---

## Wyjaśnienie

| Konstrukcja | Po czym iteruje | break / continue | Uwagi |
|---|---|---|---|
| `for (let i = 0; ...)` | indeksy | tak | pełna kontrola, najszybsza w gorących pętlach |
| `for...of` | **wartości** iterowalnych: Array, String, Map, Set, NodeList, generatory | tak | działa z `await` (`for await...of`) |
| `for...in` | **klucze** (stringi) wyliczalnych właściwości, także z łańcucha prototypów | tak | do tablic się nie nadaje (kolejność, klucze jako stringi, dodatkowe właściwości) |
| `arr.forEach(fn)` | elementy tablicy | **nie** (tylko przez wyjątek) | nie czeka na `async` callbacki, zwraca `undefined` |
| `map` / `filter` / `reduce` | elementy tablicy | nie | zwracają nową wartość, preferowane do transformacji |
| `Object.keys / values / entries` | własne, wyliczalne właściwości obiektu | (w połączeniu z `for...of`) | bez dziedziczonych kluczy |

Praktyczne zasady:

- Tablica: `for...of` (gdy potrzebujesz `break` lub `await`), `map`/`filter`/`reduce` (gdy tworzysz nową wartość), `forEach` dla prostych efektów ubocznych.
- Obiekt: `for (const [key, value] of Object.entries(obj))`.
- Indeks razem z wartością: `for (const [i, v] of arr.entries())`.
- Map: `for (const [k, v] of map)`.

## Kod

```js
const offer = { city: 'Rzym', nights: 7 };

for (const [key, value] of Object.entries(offer)) {
  console.log(key, value);            // city Rzym, nights 7
}

const prices = [1900, 2400, 3100];
for (const [i, price] of prices.entries()) {
  if (price > 3000) break;            // break works in for...of
  console.log(i, price);
}

for (const i in prices) console.log(typeof i); // 'string' - keys, not numbers

// forEach does not wait for async callbacks
prices.forEach(async (p) => { await save(p); }); // fire-and-forget
for (const p of prices) await save(p);           // sequential, awaited
```

## Częste błędy

- `for...in` na tablicy: klucze są stringami, mogą pojawić się dodatkowe właściwości (np. dodane do `Array.prototype`).
- `forEach` z `async`: pętla nie czeka na zakończenie operacji.
- Modyfikowanie tablicy w trakcie iteracji po niej.

## Pytania

### Jakie konstrukcje służą do iteracji po tablicach i obiektach? {#js-iteration-q1}

Po tablicach: klasyczne `for`, `for...of`, `forEach` oraz `map`/`filter`/`reduce`. Po obiektach: `for...in` (także klucze dziedziczone, zwykle z `hasOwn`) albo lepiej `Object.keys`/`values`/`entries` w połączeniu z `for...of`, które zwracają tylko własne, wyliczalne właściwości.

### Czym różni się for...of od for...in? {#js-iteration-q2}

`for...of` iteruje po wartościach obiektu iterowalnego (tablica, string, Map, Set). `for...in` iteruje po nazwach wyliczalnych właściwości obiektu (jako stringi), łącznie z odziedziczonymi. Do tablic używaj `for...of`, do obiektów `Object.entries`.

### Czy można przerwać forEach? {#js-iteration-q3}

Nie przez `break` ani `return` (return kończy tylko bieżący callback). Trzeba użyć `for...of`, `some`/`every` albo rzucić wyjątek, co jest złą praktyką.

### Czym są obiekty tablicopodobne i jak zamienić je na tablicę? {#js-iteration-q4}

Obiekt tablicopodobny (array-like) ma właściwość `length` i elementy pod indeksami `0`, `1`, `2` itd., ale nie jest tablicą, więc nie ma `map` ani `filter`. Przykłady: `arguments`, `NodeList` z `querySelectorAll`, `HTMLCollection`, string. `Array.from(obj)` zamieni na tablicę każdy taki obiekt, a drugim argumentem od razu go przekształci. Spread `[...obj]` działa tylko dla obiektów iterowalnych (np. `NodeList`, `arguments`), a dla zwykłego `{ length: 2 }` rzuca `TypeError`.

```js
const fake = { 0: 'a', 1: 'b', length: 2 };
Array.from(fake); // ['a', 'b']
// [...fake];     // TypeError: fake is not iterable

const links = document.querySelectorAll('a'); // NodeList
const hrefs = [...links].map((a) => a.href);

Array.from({ length: 3 }, (_, i) => i * 10); // [0, 10, 20]
```

## Quiz

### Po czym iteruje `for...in` na obiekcie? {#js-iteration-z1}

- [ ] Po wartościach
- [x] Po kluczach wyliczalnych właściwości, także odziedziczonych
- [ ] Tylko po własnych kluczach
- [ ] Po parach [klucz, wartość]

Dla własnych kluczy i par użyj `Object.keys` / `Object.entries`.
