---
title: Bez niejawnej konwersji typów
priority: medium
---

`===` zamiast `==`, jawne `Number()`, `String()`, `Boolean()`. Niejawna koercja prowadzi do błędów typu `'5' + 1 === '51'`.

## Dlaczego to ważne

- Wartości z pól formularza i parametrów URL są stringami; `guests + 1` dla `"2"` daje `"21"` gości.
- Reguły `==` są nieintuicyjne: `0 == ''`, `'0' == false` i `null == undefined` są prawdziwe, co psuje warunki walidacji.
- Jawna konwersja wymaga decyzji o błędnych danych: `Number('')` to `0`, a `Number('abc')` to `NaN`; trzeba je obsłużyć świadomie.

## Jak sprawdzić

ESLint (`eqeqeq`, ewentualnie z opcją `{ null: "ignore" }`) i TypeScript, który zgłasza dodawanie liczby do stringa w wielu przypadkach.

## Kod

```js title="Źle"
const guests = form.guests.value + 1;        // "21"
if (searchParams.get("page") == 0) { /* true for "" and "0" */ }
```

```js title="Dobrze"
const guests = Number.parseInt(form.guests.value, 10);
if (!Number.isInteger(guests) || guests < 1) throw new RangeError("Invalid guests count");

const page = Number(searchParams.get("page") ?? "1");
if (page === 1) { /* strict comparison */ }
const label = String(price); // explicit conversion
```

## Częste błędy

- Sprawdzanie `if (value)` dla liczb, gdzie `0` jest poprawną wartością (np. 0 zł dopłaty).
