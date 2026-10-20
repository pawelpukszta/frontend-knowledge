---
title: Dobre praktyki Flexboxa
priority: medium
---

Flexbox do układów jednowymiarowych; `gap` zamiast marginesów, `min-width: 0` dla elementów z długim tekstem, świadome `flex-wrap`.

## Dlaczego to ważne

- Element flex ma domyślnie `min-width: auto`, więc długa nazwa hotelu lub URL nie pozwala mu się skurczyć i wypycha układ poza ekran.
- `gap` daje odstępy tylko między elementami, bez sztuczek z `:last-child` i ujemnymi marginesami przy zawijaniu.
- Bez `flex-wrap` przyciski i tagi przy wąskim ekranie ściskają się do nieczytelności zamiast przejść do nowej linii.

## Jak sprawdzić

Testy przy szerokości 320 px, z długimi tekstami i powiększeniem 200%; nakładka Flexbox w DevTools pokazuje wolne miejsce i kurczenie.

## Kod

```css title="Źle"
.hotel-row { display: flex; }
.hotel-row > * + * { margin-left: 16px; }
.hotel-row__name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } /* never truncates */
```

```css title="Dobrze"
.hotel-row { display: flex; align-items: center; gap: var(--space-4); }
.hotel-row__name {
  flex: 1;
  min-inline-size: 0; /* allow shrinking below content width */
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.tags { display: flex; flex-wrap: wrap; gap: var(--space-2); }
```

## Częste błędy

- Budowanie siatek kart z `flex-basis: 33.33%` i obliczaniem marginesów zamiast Grida.
