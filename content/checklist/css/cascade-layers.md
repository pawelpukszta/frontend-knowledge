---
title: "@layer do kontroli kaskady"
priority: low
sources:
  - title: "MDN: @layer"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/@layer
---

Warstwy (reset, base, components, utilities) ustalają kolejność ważności bez podbijania specyficzności. Ułatwiają integrację bibliotek.

## Dlaczego to ważne

- Reguła z późniejszej warstwy wygrywa niezależnie od specyficzności, więc pojedyncza klasa utility pokona rozbudowany selektor z biblioteki komponentów.
- Style zewnętrznej biblioteki zamknięte w niskiej warstwie (`@import url(lib.css) layer(vendor)`) przestają wymagać `!important` przy nadpisywaniu.
- Style poza warstwami mają wyższy priorytet niż wszystkie warstwy, co pozwala stopniowo migrować stary kod.

## Jak sprawdzić

Przegląd struktury arkuszy; DevTools Styles grupuje reguły według warstw i pokazuje ich kolejność.

## Kod

```css
/* Order declared once; later layers win */
@layer reset, vendor, base, components, utilities;

@import url("date-picker.css") layer(vendor);

@layer components {
  .card .card__title { margin-block-end: 1rem; }
}
@layer utilities {
  .mb-0 { margin-block-end: 0; } /* wins despite lower specificity */
}
```

## Częste błędy

- `!important` wewnątrz warstw działa odwrotnie: ważniejsze jest w warstwie wcześniejszej; nie mieszaj tych mechanizmów.
