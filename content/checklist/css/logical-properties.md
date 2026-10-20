---
title: Właściwości logiczne dla RTL i i18n
priority: medium
sources:
  - title: "MDN: CSS logical properties and values"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values
---

`margin-inline-start`, `padding-block`, `inset-inline-end` zamiast left/right. Układ automatycznie odwraca się dla języków pisanych od prawej do lewej.

## Dlaczego to ważne

- Wersja arabska lub hebrajska serwisu (np. dla rynków na Bliskim Wschodzie) działa po ustawieniu `dir="rtl"`, bez osobnego arkusza z odwróconymi stronami.
- Właściwości logiczne dopasowują się też do pionowych trybów pisma (`writing-mode`), co bywa potrzebne w japońskich czy chińskich treściach.
- Skróty `margin-inline`, `padding-block`, `inset` są krótsze i czytelniej wyrażają intencję ("odstęp w osi tekstu").

## Jak sprawdzić

Ustaw `dir="rtl"` na `<html>` w DevTools i sprawdź ikony, strzałki, odstępy i pozycjonowane elementy.

## Kod

```css title="Źle"
.price-tag { margin-left: 8px; padding-right: 12px; text-align: left; }
.badge { position: absolute; top: 0; right: 0; }
```

```css title="Dobrze"
.price-tag { margin-inline-start: 0.5rem; padding-inline-end: 0.75rem; text-align: start; }
.badge { position: absolute; inset-block-start: 0; inset-inline-end: 0; }
/* Directional icons should mirror in RTL */
[dir="rtl"] .icon-arrow { transform: scaleX(-1); }
```

## Częste błędy

- Zamiana właściwości na logiczne, ale pozostawienie `text-align: left` i `float: left`.
