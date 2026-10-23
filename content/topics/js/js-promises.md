---
title: "Promise: podstawy i stany"
level: mid
added: 2026-10-20
tags:
  - promise
  - async
  - then
  - catch
summary: "Promise to obiekt reprezentujący przyszły wynik operacji asynchronicznej. Ma trzy stany: pending, fulfilled, rejected."
sources:
  - title: "MDN: Promise"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
  - title: "MDN: Using promises"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
  - title: "javascript.info: Promises, async/await"
    url: https://javascript.info/async
---

## Wyjaśnienie

- **pending**: operacja trwa.
- **fulfilled**: zakończona sukcesem, ma wartość.
- **rejected**: zakończona błędem, ma powód (zwykle `Error`).

Stan `fulfilled` lub `rejected` nazywamy **settled** i nie może się już zmienić.

`.then()` zwraca **nowy Promise**, dzięki czemu można łańcuchować operacje. `.catch()` łapie błąd z dowolnego wcześniejszego kroku, `.finally()` wykonuje się zawsze.

Callbacki `then/catch` trafiają do kolejki **mikrozadań (microtasks)**, więc wykonują się po bieżącym kodzie synchronicznym, ale przed `setTimeout`.

## Kod

```js
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

fetch('/api/user')
  .then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`); // fetch does not reject on 4xx/5xx
    return res.json();
  })
  .then((user) => console.log(user))
  .catch((err) => console.error(err))
  .finally(() => console.log('done'));
```

## Częste błędy

- Zapominanie o `return` w `.then()`: kolejny krok dostaje `undefined`.
- Założenie, że `fetch` odrzuca Promise przy 404/500. Nie odrzuca: odrzuca tylko przy błędzie sieci lub przerwaniu. Sprawdzaj `res.ok`.
- Brak obsługi odrzucenia: "Unhandled promise rejection".

## Pytania

### Jakie stany ma Promise? {#js-promises-q1}

`pending`, `fulfilled` i `rejected`. Po przejściu w `fulfilled` lub `rejected` (settled) stan jest ostateczny.

### Czy fetch rzuca błąd przy statusie 404? {#js-promises-q2}

Nie. Promise z `fetch` jest spełniony przy każdej odpowiedzi HTTP. Trzeba sprawdzić `response.ok` lub `response.status`. Odrzucenie następuje tylko przy błędzie sieci, CORS lub `abort()`.
