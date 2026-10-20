---
title: Funkcje wyższego rzędu, currying i kompozycja
level: mid
tags:
  - higher-order function
  - currying
  - partial application
  - kompozycja
  - first-class functions
summary: Funkcja wyższego rzędu przyjmuje funkcję jako argument lub zwraca funkcję (np. map, filter, debounce). Currying zamienia f(a, b, c) na f(a)(b)(c), co ułatwia częściowe zastosowanie i kompozycję.
sources:
  - title: "Eloquent JavaScript: Higher-Order Functions"
    url: https://eloquentjavascript.net/05_higher_order.html
  - title: "javascript.info: Currying"
    url: https://javascript.info/currying-partials
  - title: "MDN Glossary: First-class Function"
    url: https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function
  - title: "React (legacy docs): Higher-Order Components"
    url: https://legacy.reactjs.org/docs/higher-order-components.html
---

## Wyjaśnienie

W JS funkcje są **first-class citizens**: można je przypisać do zmiennej, przekazać jako argument i zwrócić z innej funkcji. Na tym opierają się funkcje wyższego rzędu (**HOF, higher-order functions**).

Przykłady HOF, których używasz codziennie:

- `map`, `filter`, `reduce`, `sort(compareFn)`, `addEventListener(type, handler)`, `setTimeout(fn)`, `Promise.then(fn)`.
- Fabryki funkcji: `debounce(fn, ms)`, `memoize(fn)`.
- W React: **Higher-Order Components** (`withAuth(Component)`) to ten sam pomysł na poziomie komponentów; dziś częściej zastępują je custom hooki.

**Currying**: przekształcenie funkcji wieloargumentowej w łańcuch funkcji jednoargumentowych: `add(1, 2)` → `add(1)(2)`. Działa dzięki domknięciom.

**Częściowe zastosowanie (partial application)**: "przyklejenie" części argumentów, by dostać wyspecjalizowaną funkcję, np. `const addVat = multiply(1.23)`. Currying to jeden ze sposobów, `fn.bind(null, a)` to drugi.

Kiedy się przydaje: konfigurowalne funkcje pomocnicze i walidatory, handlery z parametrem (`onClick={select(id)}`), selektory, kompozycja funkcji (`pipe(trim, toLower, slugify)`) w stylu funkcyjnym (Ramda, lodash/fp).

Nie przesadzaj: w typowym kodzie aplikacji głęboki currying pogarsza czytelność i stack trace. Stosuj tam, gdzie realnie tworzysz wyspecjalizowane funkcje.

## Kod

```js
// Higher-order function: takes a function and returns a new one
function withLogging(fn) {
  return (...args) => {
    console.log('call', fn.name, args);
    return fn(...args);
  };
}
const loggedSum = withLogging((a, b) => a + b);

// Currying
const multiply = (a) => (b) => a * b;
const addVat = multiply(1.23);      // partial application
addVat(100);                        // 123

// Generic curry helper
const curry = (fn) =>
  function curried(...args) {
    return args.length >= fn.length ? fn(...args) : (...more) => curried(...args, ...more);
  };
const price = curry((base, nights, people) => base * nights * people);
price(200)(7)(2); // 2800
price(200, 7)(2); // 2800

// Composition
const pipe = (...fns) => (x) => fns.reduce((acc, f) => f(acc), x);
const slug = pipe((s) => s.trim(), (s) => s.toLowerCase(), (s) => s.replace(/\s+/g, '-'));
slug('  Wakacje na Krecie '); // 'wakacje-na-krecie'
```

## Pytania

### Czym jest funkcja wyższego rzędu? {#js-hof-currying-q1}

Funkcją, która przyjmuje inną funkcję jako argument lub zwraca funkcję. Przykłady: `map`, `filter`, `reduce`, `addEventListener`, `debounce`, HOC w React. Są możliwe, bo w JS funkcje są wartościami (first-class functions).

### Czym jest currying i kiedy się go używa? {#js-hof-currying-q2}

Przekształceniem `f(a, b, c)` w `f(a)(b)(c)`: każda funkcja przyjmuje jeden argument i zwraca kolejną, aż zbierze wszystkie. Ułatwia częściowe zastosowanie (tworzenie wyspecjalizowanych funkcji, np. `addVat = multiply(1.23)`) i kompozycję funkcji. Opiera się na domknięciach.

### Czym różni się currying od partial application? {#js-hof-currying-q3}

Currying zawsze rozbija funkcję na łańcuch funkcji jednoargumentowych. Partial application to ustalenie części argumentów, by otrzymać funkcję o mniejszej liczbie parametrów (np. przez `bind` lub curried function). Currying jest jednym ze sposobów realizacji partial application.

## Quiz

### `const add = (a) => (b) => a + b; add(2)(3)` to przykład: {#js-hof-currying-z1}

- [ ] IIFE
- [x] Curryingu
- [ ] Rekurencji
- [ ] Hoistingu

Funkcja wieloargumentowa rozbita na łańcuch funkcji jednoargumentowych.
