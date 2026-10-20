---
title: :has() do stylowania rodzica
priority: low
---

Styl zależny od zawartości (np. karta z zaznaczonym checkboxem, formularz z błędem) bez dodatkowych klas ustawianych w JS.

## Dlaczego to ważne

- Mniej JS tylko do przełączania klas oznacza mniej kodu do pobrania i mniej błędów rozjechania stanu DOM i stylów.
- `:has()` jest Baseline od grudnia 2023, więc działa we wszystkich współczesnych przeglądarkach.
- Stan pochodzi z natywnych pseudoklas (`:checked`, `:user-invalid`, `:focus-visible`), więc pozostaje spójny z tym, co widzi technologia asystująca.

## Jak sprawdzić

Przegląd miejsc, gdzie JS przełącza klasy tylko dla stylów; sprawdź działanie w DevTools, zmieniając stan kontrolek.

## Kod

```css
/* Highlight the selected room option */
.room-option:has(input:checked) {
  border-color: var(--color-brand);
  background: var(--color-brand-subtle);
}
/* Mark the whole field when the user leaves it invalid */
.field:has(input:user-invalid) .field__label { color: var(--color-danger); }

/* Card layout depends on whether an image exists */
.offer-card:has(> img) { grid-template-columns: 12rem 1fr; }
```

## Częste błędy

- Bardzo szerokie selektory typu `body:has(.x)` przeliczane przy każdej zmianie DOM; zawężaj zakres do komponentu.
