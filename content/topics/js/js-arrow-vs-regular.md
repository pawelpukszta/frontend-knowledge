---
title: Funkcja strzałkowa vs zwykła funkcja
level: mid
tags:
  - arrow function
  - function
  - this
  - arguments
  - new
summary: "Arrow function to krótsza składnia, ale też inna semantyka: nie ma własnego this, arguments ani prototype i nie można jej wywołać przez new."
sources:
  - title: "MDN: Arrow function expressions"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
  - title: "javascript.info: Arrow functions revisited"
    url: https://javascript.info/arrow-functions
  - title: "ECMAScript Language Specification: Arrow Function Definitions"
    url: https://tc39.es/ecma262/#sec-arrow-function-definitions
---

## Wyjaśnienie

| | Zwykła funkcja (`function`) | Funkcja strzałkowa (`=>`) |
|---|---|---|
| `this` | zależy od sposobu wywołania | brany leksykalnie z otoczenia, nie da się go zmienić (`call`/`bind` go nie zmienią) |
| `arguments` | tak | nie (użyj rest `...args`) |
| Konstruktor (`new`) | tak | nie, rzuca `TypeError` |
| `prototype` | tak | nie |
| Hoisting | deklaracja podnoszona w całości | zachowuje się jak zmienna (`const`), więc brak dostępu przed definicją |
| Generator (`function*`) | tak | nie |
| Niejawny `return` | nie | tak, dla jednego wyrażenia: `x => x * 2` |

Kiedy co:

- **Arrow**: callbacki (`map`, `then`, `setTimeout`), event handlery w komponentach React, krótkie funkcje pomocnicze. Rozwiązuje klasyczny problem utraty `this` w callbacku.
- **Zwykła funkcja**: metody obiektów i klas, które używają `this`, konstruktory, generatory, funkcje, które chcesz wywołać przed ich definicją.

Zwrócenie literału obiektu z arrow wymaga nawiasów: `() => ({ id: 1 })`.

## Kod

```js
const counter = {
  count: 0,
  startRegular() {
    setTimeout(function () {
      console.log(this.count); // undefined: `this` is not the counter here
    }, 0);
  },
  startArrow() {
    setTimeout(() => {
      console.log(this.count); // 0: arrow takes `this` from startArrow
    }, 0);
  },
  arrowMethod: () => this?.count, // bad: `this` comes from the module scope
};

const make = () => ({ id: 1 });   // parentheses needed to return an object
const Foo = () => {};
// new Foo();                    // TypeError: Foo is not a constructor
```

## Pytania

### Jakie są różnice między funkcją strzałkową a zwykłą? {#js-arrow-vs-regular-q1}

Arrow nie ma własnego `this` (bierze je z miejsca definicji i nie da się go zmienić przez `call`/`apply`/`bind`), nie ma `arguments` ani `prototype`, nie może być konstruktorem ani generatorem i nie jest podnoszona jak deklaracja funkcji. Ma krótszą składnię z niejawnym `return`.

### Dlaczego nie używać arrow function jako metody obiektu? {#js-arrow-vs-regular-q2}

Bo `this` w arrow nie wskazuje na obiekt, tylko na otaczający zasięg (w module: `undefined`). Metoda, która korzysta z `this`, powinna być zwykłą funkcją lub metodą w skróconej składni `method() {}`.

## Quiz

### Która cecha NIE dotyczy funkcji strzałkowej? {#js-arrow-vs-regular-z1}

- [ ] Bierze this z otaczającego zasięgu
- [ ] Ma krótszą składnię z niejawnym return
- [x] Może być wywołana jako konstruktor przez new
- [ ] Nie ma własnego obiektu arguments

Arrow function nie ma `prototype` i `new` rzuca `TypeError`.
