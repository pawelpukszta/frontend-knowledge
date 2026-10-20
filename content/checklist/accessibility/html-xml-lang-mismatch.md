---
title: Zgodne lang i xml:lang
priority: medium
---

Jeśli element `html` ma oba atrybuty, `lang` i `xml:lang`, ich podstawowy język musi być taki sam. W zwykłym HTML (`text/html`) `xml:lang` jest zbędny i najlepiej go usunąć.

## Dlaczego to ważne

- Czytnik ekranu może wybrać syntezator na podstawie innego atrybutu niż przeglądarka; polski tekst czytany angielskim głosem jest niezrozumiały.
- To typowa pozostałość po szablonach XHTML lub kopiowanych motywach; usunięcie `xml:lang` likwiduje problem raz na zawsze.
- Dotyczy WCAG 3.1.1 Language of Page (A).

## Jak sprawdzić

axe (`html-xml-lang-mismatch`); wyszukaj `xml:lang` w szablonach.

## Kod

```html
<!-- Bad: leftover from an English XHTML template -->
<html lang="pl" xml:lang="en">

<!-- Acceptable: same primary language -->
<html lang="pl-PL" xml:lang="pl">

<!-- Best for text/html documents: lang only -->
<html lang="pl">
```

## Częste błędy

- Poprawienie tylko `lang` przy zmianie wersji językowej i pozostawienie starego `xml:lang`.
