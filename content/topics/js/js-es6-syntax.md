---
title: "Nowoczesna składnia: destrukturyzacja, spread/rest, ?. i ??"
level: mid
added: 2026-10-20
tags:
  - ES6
  - destructuring
  - spread
  - rest
  - optional chaining
  - nullish
summary: "Zestaw składni, który na co dzień skraca kod: rozpakowywanie obiektów, kopiowanie przez spread, bezpieczny dostęp ?. i domyślne wartości ??."
sources:
  - title: "MDN: Destructuring"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring
  - title: "MDN: Optional chaining (?.)"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
  - title: "MDN: Nullish coalescing operator (??)"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing
  - title: "MDN: Template literals"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
  - title: "TC39: Finished Proposals"
    url: https://github.com/tc39/proposals/blob/main/finished-proposals.md
  - title: "GeeksforGeeks: JavaScript Interview Questions"
    url: https://www.geeksforgeeks.org/javascript/javascript-interview-questions/
---

## Wyjaśnienie

- **Destrukturyzacja**: `const { name, age = 18 } = user;`, `const [first, ...rest] = arr;`. Działa też w parametrach funkcji (typowe dla props w React).
- **Spread `...`**: rozkłada tablicę/obiekt (kopie, łączenie). **Rest `...`**: zbiera pozostałe elementy w parametrach lub destrukturyzacji.
- **Optional chaining `?.`**: `user?.address?.city` zwraca `undefined` zamiast rzucać błąd. Działa też dla wywołań `fn?.()` i indeksów `arr?.[0]`.
- **Nullish coalescing `??`**: wartość domyślna tylko dla `null`/`undefined`. W odróżnieniu od `||` nie nadpisuje `0`, `''` ani `false`.
- **Operatory przypisania logicznego**: `a ??= b`, `a ||= b`, `a &&= b`.
- **Template literals**, **shorthand properties** `{ name }`, **computed keys** `{ [key]: value }`, **default parameters**.

## Kod

```js
function Price({ amount = 0, currency = 'PLN', ...rest }) {
  return `${amount} ${currency}`;
}

const discount = offer.discount || 10; // 0 becomes 10 - bug!
const safe = offer.discount ?? 10;     // 0 stays 0

const city = user?.address?.city ?? 'Brak miasta';
settings.theme ??= 'light';
```

## Pytania

### Czym różni się ?? od ||? {#js-es6-syntax-q1}

`||` zwraca prawą stronę dla każdej wartości falsy (`0`, `''`, `false`, `NaN`, `null`, `undefined`). `??` tylko dla `null` i `undefined`. Dla liczb i pustych stringów `??` jest zwykle poprawnym wyborem.

### Spread vs rest? {#js-es6-syntax-q2}

Ta sama składnia `...`, odwrotne działanie. Spread rozkłada kolekcję na elementy (np. w wywołaniu lub literale), rest zbiera elementy w tablicę/obiekt (w parametrach lub destrukturyzacji). Rest musi być ostatni i może wystąpić tylko raz: `function f(...items, last)` to błąd składni.

### Czym są template literals i tagged templates? {#js-es6-syntax-q3}

Template literal to string w backtickach. Pozwala wstawiać wyrażenia przez `${...}` i pisać tekst w wielu liniach bez `\n`. Tagged template to wywołanie funkcji z szablonem: funkcja (tag) dostaje tablicę stałych fragmentów tekstu i osobno wartości wyrażeń, a zwrócić może cokolwiek. Tak działają `styled-components`, `gql` w GraphQL i `html` w Lit. Wbudowany tag `String.raw` zwraca tekst bez interpretowania sekwencji ucieczki.

```js
const nights = 7;
const msg = `Pobyt: ${nights} nocy,
cena od ${nights * 300} zł`; // interpolation and a real line break

function money(strings, ...values) {
  return strings.reduce(
    (out, str, i) => out + str + (i < values.length ? `${values[i].toFixed(2)} zł` : ''),
    '',
  );
}
money`Razem: ${2100}`; // 'Razem: 2100.00 zł'
String.raw`C:\new`;    // the backslash and 'n' are kept as two characters
```

Tag może też bezpiecznie escapować wartości, np. przed wstawieniem ich do HTML lub zapytania SQL.

### Co nowego w ostatnich wersjach ECMAScript? {#js-es6-syntax-q4}

Od 2015 roku standard wychodzi co roku w czerwcu i zawiera propozycje, które doszły do etapu 4 w TC39. Najbardziej przydatne na froncie:

- **ES2023**: `findLast` i `findLastIndex`, metody tablic bez mutacji (`toSorted`, `toReversed`, `toSpliced`, `with`).
- **ES2024**: `Object.groupBy` i `Map.groupBy`, `Promise.withResolvers`, flaga `v` w wyrażeniach regularnych.
- **ES2025**: metody zbiorów (`union`, `intersection`, `difference`), helpery iteratorów (`map`, `filter`, `take` wprost na iteratorze), `Promise.try`, `RegExp.escape`, import plików JSON (`with { type: 'json' }`).
- **ES2026**: `Error.isError`, `Array.fromAsync`, `Math.sumPrecise`, konwersja `Uint8Array` do i z Base64, `Map.prototype.getOrInsert`.

Ukończone są już też `Temporal` (nowe API dat) i `using` do automatycznego zwalniania zasobów; trafią do ES2027. Przed użyciem w produkcji sprawdź wsparcie przeglądarek na MDN (Baseline).

## Quiz

### Wynik `0 ?? 5` to: {#js-es6-syntax-z1}

- [x] 0
- [ ] 5
- [ ] null
- [ ] undefined

`??` podstawia wartość domyślną tylko dla `null` i `undefined`. `0 || 5` dałoby 5.
