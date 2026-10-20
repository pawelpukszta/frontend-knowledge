---
title: Promise.all, allSettled, race, any
level: mid
tags:
  - promise
  - all
  - allSettled
  - race
  - any
  - równoległość
summary: Cztery kombinatory do równoległych operacji. Różnią się tym, kiedy kończą i jak traktują błędy.
sources:
  - title: "MDN: Promise.allSettled()"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
  - title: "MDN: Promise.all()"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
  - title: "MDN: Promise.any()"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any
  - title: "MDN: Promise.race()"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race
  - title: "javascript.info: Promise API"
    url: https://javascript.info/promise-api
---

## Wyjaśnienie

| Metoda | Kończy się, gdy | Błąd |
|---|---|---|
| `Promise.all` | wszystkie się spełnią | odrzuca przy **pierwszym** błędzie (fail-fast) |
| `Promise.allSettled` | wszystkie się zakończą (sukces lub błąd) | nigdy nie odrzuca, zwraca statusy |
| `Promise.race` | **pierwszy** się zakończy (sukces lub błąd) | przejmuje wynik pierwszego |
| `Promise.any` | **pierwszy** się spełni | odrzuca `AggregateError`, gdy wszystkie zawiodą |

Kiedy co:

- **`all`**: dane są zależne od siebie, bez jednego nie ma sensu renderować (np. użytkownik + uprawnienia).
- **`allSettled`**: niezależne widgety na dashboardzie; pokaż to, co się udało, a dla reszty błąd.
- **`race`**: timeout dla requestu.
- **`any`**: najszybsze z kilku lustrzanych źródeł (CDN fallback).

Nowsze: `Promise.withResolvers()` (ES2024) zwraca `{ promise, resolve, reject }`; `Promise.try()` (ES2025) opakowuje funkcję sync lub async w Promise.

## Kod

```js
const results = await Promise.allSettled([
  fetch('/api/offers'),
  fetch('/api/weather'),
]);
results.forEach((r) => {
  if (r.status === 'fulfilled') console.log(r.value);
  else console.warn(r.reason);
});

// Timeout with race
const timeout = (ms) =>
  new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms));
const data = await Promise.race([fetch('/api/slow'), timeout(3000)]);
```

## Częste błędy

- `await` w pętli `for` dla niezależnych requestów: wykonują się po kolei zamiast równolegle. Użyj `Promise.all`.
- `Promise.race` z timeoutem nie anuluje oryginalnego requestu. Do anulowania użyj `AbortController` lub `AbortSignal.timeout(ms)`.

## Pytania

### Czym różni się Promise.all od Promise.allSettled? {#js-promise-methods-q1}

`all` odrzuca od razu przy pierwszym błędzie i zwraca tablicę wartości. `allSettled` zawsze czeka na wszystkie i zwraca obiekty `{ status: 'fulfilled', value }` lub `{ status: 'rejected', reason }`. Pierwszy dla zależnych danych, drugi gdy częściowy sukces jest akceptowalny.

### Różnica między race i any? {#js-promise-methods-q2}

`race` kończy się na pierwszym **zakończonym** Promise, także odrzuconym. `any` czeka na pierwszy **spełniony** i ignoruje błędy, dopóki wszystkie nie zawiodą (wtedy `AggregateError`).

### Jak równolegle pobrać 3 niezależne zasoby? {#js-promise-methods-q3}

Wystartować wszystkie od razu i poczekać przez `Promise.all([a(), b(), c()])` (lub `allSettled`), zamiast trzech kolejnych `await`.

## Quiz

### Która metoda Promise nigdy nie odrzuca i zwraca status każdej operacji? {#js-promise-methods-z1}

- [ ] Promise.all
- [x] Promise.allSettled
- [ ] Promise.any
- [ ] Promise.race

`allSettled` czeka na wszystkie i zwraca tablicę obiektów `{status, value | reason}`.
