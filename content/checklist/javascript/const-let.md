---
title: const i let zamiast var
priority: high
---

Zasięg blokowy i TDZ eliminują błędy wynikające z hoistingu `var`. Domyślnie `const`, `let` tylko dla zmiennych zmieniających wartość.

## Dlaczego to ważne

- `var` ma zasięg funkcji, więc zmienna z pętli jest jedna dla wszystkich iteracji; klasyczny błąd to kilka handlerów, które widzą tylko ostatnią wartość.
- Odczyt `let`/`const` przed deklaracją rzuca `ReferenceError` (TDZ), zamiast po cichu zwracać `undefined` jak `var`.
- `const` sygnalizuje czytelnikowi, że referencja się nie zmieni, co ułatwia analizę kodu (choć zawartość obiektu nadal można mutować).

## Jak sprawdzić

ESLint (`no-var`, `prefer-const`), obie reguły z automatyczną poprawką `--fix`.

## Kod

```js title="Źle"
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", () => select(i)); // always the last i
}
console.log(total); // undefined, no error
var total = 100;
```

```js title="Dobrze"
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", () => select(i)); // i per iteration
}
const total = 100;
let remaining = total;
remaining -= 20;
```

## Częste błędy

- `const` dla obiektu w przekonaniu, że jest niemutowalny; do tego służy `Object.freeze` lub `as const` w TypeScript.
