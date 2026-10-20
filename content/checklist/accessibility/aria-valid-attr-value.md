---
title: Poprawne wartości atrybutów ARIA
priority: medium
---

Np. `aria-expanded` przyjmuje `true` lub `false`, `aria-current` jedną z wartości `page`, `step`, `location`, `date`, `time`, `true`, `false`, a `aria-controls` musi wskazywać istniejące ID. Nieprawidłowa wartość jest ignorowana.

## Dlaczego to ważne

- `aria-hidden="hidden"` niczego nie ukrywa, a `aria-expanded="yes"` nie ogłasza stanu, bo poprawne są tylko `true` i `false`.
- W JS bez typów łatwo przekazać zły typ, np. `aria-invalid={errorMessage}` (treść błędu zamiast `true`); TypeScript z typami React wychwyci część takich pomyłek.
- axe przypisuje regułę do WCAG 4.1.2 (A).

## Jak sprawdzić

axe (`aria-valid-attr-value`) oraz eslint-plugin-jsx-a11y (reguła `aria-proptypes`).

## Kod

```html title="Źle"
<button aria-expanded="yes" aria-controls="filters-panel">Filtry</button>
<a href="/koszyk" aria-current="current">Koszyk</a>
<div id="filtry-panel">...</div> <!-- aria-controls points to a missing ID -->
```

```html title="Dobrze"
<button aria-expanded="false" aria-controls="filters-panel">Filtry</button>
<a href="/koszyk" aria-current="page">Koszyk</a>
<div id="filters-panel" hidden>...</div>
```

## Częste błędy

- Zmiana ID panelu przy refaktoryzacji bez aktualizacji `aria-controls` w przycisku.
