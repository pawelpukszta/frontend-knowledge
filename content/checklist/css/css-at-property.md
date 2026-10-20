---
title: "@property dla typowanych custom properties"
priority: low
sources:
  - title: "MDN: @property"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/@property
---

Rejestracja zmiennej z typem (`syntax: '<color>'`) pozwala ją animować i daje wartość początkową oraz walidację.

## Dlaczego to ważne

- Zwykła custom property jest dla przeglądarki ciągiem znaków, więc `transition` przeskakuje skokowo; zarejestrowana z typem `<angle>` czy `<color>` interpoluje się płynnie, np. w gradientach.
- `inherits: false` zatrzymuje dziedziczenie zmiennej w głąb drzewa, co upraszcza komponenty i ogranicza przeliczanie stylów.
- Niepoprawna wartość wraca do `initial-value` zamiast unieważniać całą deklarację; `@property` jest Baseline od 2024.

## Jak sprawdzić

Przegląd animowanych zmiennych CSS; w DevTools Styles zarejestrowane właściwości mają podgląd definicji `@property`.

## Kod

```css
@property --promo-angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}
.promo-badge {
  background: conic-gradient(from var(--promo-angle), #ff7a00, #ffd000, #ff7a00);
  animation: spin 4s linear infinite;
}
@keyframes spin { to { --promo-angle: 360deg; } }
@media (prefers-reduced-motion: reduce) { .promo-badge { animation: none; } }
```

## Częste błędy

- Rejestrowanie każdej zmiennej "na zapas"; potrzebne głównie przy animacjach i tam, gdzie liczy się typ.
