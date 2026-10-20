---
title: Grupowanie odczytów i zapisów DOM
priority: high
---

Przeplatanie odczytów geometrii (`offsetHeight`) i zapisów stylów wymusza wielokrotny layout (layout thrashing). Najpierw odczyty, potem zapisy, najlepiej w `requestAnimationFrame`.

## Dlaczego to ważne

- Każdy odczyt geometrii po zmianie stylu zmusza przeglądarkę do natychmiastowego przeliczenia layoutu; w pętli po 200 kartach to 200 pełnych layoutów zamiast jednego.
- Wymuszone layouty wydłużają zadania na głównym wątku, przez co kliknięcia czekają, a INP rośnie.
- Często lepiej w ogóle unikać odczytów w JS: CSS Grid, container queries lub `ResizeObserver` dostarczają tej samej informacji bez wymuszonego layoutu.

## Jak sprawdzić

DevTools Performance: fioletowe bloki Layout z ostrzeżeniem "Forced reflow" i wskazaniem linii kodu.

## Kod

```js title="Źle"
cards.forEach((card) => {
  const h = card.offsetHeight;          // read (forces layout)
  card.style.height = `${h + 20}px`;    // write (invalidates layout)
});
```

```js title="Dobrze"
const heights = cards.map((card) => card.offsetHeight); // all reads first
requestAnimationFrame(() => {
  cards.forEach((card, i) => {
    card.style.height = `${heights[i] + 20}px`;          // then all writes
  });
});
```

## Częste błędy

- Wywoływanie `getBoundingClientRect()` w handlerze `scroll` dla wielu elementów; użyj `IntersectionObserver`.
