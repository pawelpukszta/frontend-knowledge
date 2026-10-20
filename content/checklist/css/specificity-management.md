---
title: Niska i płaska specyficzność
priority: high
sources:
  - title: "MDN: Specificity"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Specificity
---

Proste selektory (pojedyncze klasy), `:where()` dla stylów bazowych, `@layer` dla kolejności. Wyścig specyficzności kończy się `!important` i kruchym kodem.

## Dlaczego to ważne

- Selektor `#header .nav ul li a` ma specyficzność (1,1,3); każda zmiana stylu linku wymaga jeszcze mocniejszego selektora albo `!important`.
- Gdy wszystkie selektory mają podobną wagę (0,1,0), o wyniku decyduje kolejność w kodzie, co jest przewidywalne i łatwe do zrozumienia w code review.
- `:where()` ma zerową specyficzność, więc style bazowe biblioteki lub resetu można nadpisać jedną klasą.

## Jak sprawdzić

Stylelint (`selector-max-specificity`, `selector-max-id`, `declaration-no-important`); w DevTools najechanie na selektor w panelu Styles pokazuje jego specyficzność.

## Kod

```css title="Źle"
#booking-form .form-row input[type="text"].field { border-color: gray; } /* (1,3,1) */
.field--error { border-color: red !important; } /* forced to win */
```

```css title="Dobrze"
@layer base, components;
@layer base {
  :where(input, select, textarea) { border: 1px solid var(--color-border); }
}
@layer components {
  .field { border-color: var(--color-border); }        /* (0,1,0) */
  .field[aria-invalid="true"] { border-color: var(--color-danger); } /* (0,2,0) */
}
```

## Częste błędy

- Używanie identyfikatorów (`#id`) w selektorach stylów.
- Głębokie zagnieżdżanie w SCSS, które odwzorowuje strukturę DOM i podbija specyficzność.
