---
title: Mały rozmiar CSS
priority: medium
---

CSS blokuje renderowanie, więc każdy kilobajt opóźnia FCP. Cel: do ok. 50 KB po kompresji dla stylów potrzebnych na starcie; minifikacja, usuwanie nieużywanych reguł, podział na trasy i media.

## Dlaczego to ważne

- Przeglądarka nie wyrenderuje niczego, dopóki nie pobierze i nie przetworzy całego CSS z `<head>`, nawet reguł dla stron, których użytkownik nie odwiedzi.
- Duże arkusze to też dłuższe przeliczanie stylów przy każdej zmianie DOM, co pogarsza INP na słabszych telefonach.
- Typowy dług: style starych kampanii, nieużywanych komponentów i całe frameworki CSS dołączone dla kilku klas.

## Jak sprawdzić

Zakładka Coverage w DevTools (procent nieużywanych bajtów CSS na danej stronie), rozmiar plików CSS po kompresji w Network.

## Kod

```html title="Podział CSS według mediów i tras"
<!-- Critical styles for this route only -->
<link rel="stylesheet" href="/css/base.2c1f.css">
<link rel="stylesheet" href="/css/offer-page.9ab4.css">

<!-- Non-matching media: downloaded with low priority, does not block rendering -->
<link rel="stylesheet" href="/css/print.71d0.css" media="print">
<link rel="stylesheet" href="/css/desktop-gallery.e3a9.css" media="(min-width: 64em)">
```

## Częste błędy

- Import całej biblioteki komponentów (np. pełnego Bootstrapa) dla siatki i kilku przycisków.
