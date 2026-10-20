---
title: Unikalne wartości accesskey
priority: medium
---

Zduplikowane skróty `accesskey` kolidują ze sobą i ze skrótami przeglądarki oraz czytników. Najlepiej w ogóle ich unikać; jeśli są potrzebne, każda wartość jest unikalna i opisana na stronie.

## Dlaczego to ważne

- Każda przeglądarka i system łączy je z innymi modyfikatorami (np. Alt w Chrome na Windows, Alt+Shift w Firefoksie, Ctrl+Option na macOS), więc użytkownik zwykle nie wie, jak ich użyć.
- Skrót strony może przejąć polecenie czytnika ekranu lub przeglądarki, na którym ktoś polega na co dzień.
- Przy duplikatach przeglądarki zachowują się niespójnie: aktywują pierwszy element albo przełączają focus między nimi.

## Jak sprawdzić

axe (`accesskeys`); w konsoli DevTools skrypt wypisujący zduplikowane wartości.

## Kod

```html title="Źle"
<a href="/oferty" accesskey="s">Szukaj ofert</a>
<a href="/koszyk" accesskey="s">Koszyk</a>  <!-- duplicate key -->
<a href="/pomoc" accesskey="d">Pomoc</a>    <!-- Alt+D already focuses the address bar -->
```

```js title="Konsola DevTools"
// List duplicated accesskey values on the current page
const keys = [...document.querySelectorAll('[accesskey]')]
  .map((el) => el.accessKey.toLowerCase());
console.table(keys.filter((k, i) => keys.indexOf(k) !== i));
```

## Częste błędy

- Dodawanie `accesskey` zamiast skip linku, poprawnych nagłówków i landmarków.
