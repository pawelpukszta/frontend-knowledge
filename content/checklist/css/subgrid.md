---
title: subgrid do wyrównania zagnieżdżonych elementów
priority: low
---

`grid-template-rows: subgrid` pozwala np. wyrównać tytuły, opisy i ceny w kartach ofert niezależnie od długości treści.

## Dlaczego to ważne

- Bez subgrid cena w karcie z dwulinijkowym tytułem jest niżej niż w sąsiedniej; porównywanie ofert w rzędzie staje się trudniejsze.
- Wcześniejsze obejścia (stałe wysokości, JS mierzący elementy) psują się przy innej długości tekstu lub tłumaczeniu na inny język.
- `subgrid` jest Baseline od 2023 i działa we wszystkich współczesnych przeglądarkach.

## Jak sprawdzić

Przegląd list kart o różnej długości treści; nakładka Grid w DevTools pokazuje linie dziedziczone przez subgrid.

## Kod

```css
.offers {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr));
  gap: var(--space-4);
}
.offer-card {
  display: grid;
  grid-row: span 4; /* image, title, description, price */
  grid-template-rows: subgrid;
  row-gap: var(--space-2);
}
```

## Częste błędy

- Zapomnienie o `grid-row: span N` na karcie; subgrid nie ma wtedy wierszy do odziedziczenia.
