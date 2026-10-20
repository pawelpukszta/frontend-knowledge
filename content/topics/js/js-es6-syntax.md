---
title: "Nowoczesna składnia: destrukturyzacja, spread/rest, ?. i ??"
level: mid
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

Ta sama składnia `...`, odwrotne działanie. Spread rozkłada kolekcję na elementy (np. w wywołaniu lub literale), rest zbiera elementy w tablicę/obiekt (w parametrach lub destrukturyzacji).

## Quiz

### Wynik `0 ?? 5` to: {#js-es6-syntax-z1}

- [x] 0
- [ ] 5
- [ ] null
- [ ] undefined

`??` podstawia wartość domyślną tylko dla `null` i `undefined`. `0 || 5` dałoby 5.
