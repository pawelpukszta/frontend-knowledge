---
title: Grid do układów dwuwymiarowych
priority: medium
---

Układ strony, siatki kart i galerii w CSS Grid (`repeat(auto-fill, minmax())`, obszary nazwane) zamiast zagnieżdżonych flexboksów i marginesów.

## Dlaczego to ważne

- Jedna reguła `repeat(auto-fill, minmax(...))` tworzy responsywną siatkę ofert bez żadnego media query.
- Grid kontroluje wiersze i kolumny jednocześnie, więc karty w rzędzie mają równą wysokość, a odstępy zapewnia `gap` bez ujemnych marginesów.
- Nazwane obszary (`grid-template-areas`) czytelnie opisują layout i pozwalają przebudować go w media query bez zmiany HTML.

## Jak sprawdzić

Przegląd głównych layoutów; DevTools Elements ma nakładkę Grid z liniami, numerami i nazwami obszarów.

## Kod

```css
.offers {
  display: grid;
  /* min() prevents overflow on screens narrower than 18rem */
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
  gap: var(--space-4);
}
.page {
  display: grid;
  grid-template-areas: "header" "filters" "results";
}
@media (width >= 64rem) {
  .page { grid-template-columns: 18rem 1fr; grid-template-areas: "header header" "filters results"; }
}
.page__filters { grid-area: filters; }
```

## Częste błędy

- Zmiana kolejności wizualnej przez `order` lub obszary tak, że różni się od kolejności w DOM i nawigacji klawiaturą.
