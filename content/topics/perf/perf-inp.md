---
title: "INP: Interaction to Next Paint"
level: mid
tags:
  - INP
  - long tasks
  - main thread
  - responsywność
summary: Mierzy czas od interakcji (klik, tap, klawisz) do wyrenderowania następnej klatki. Wysoki INP to niemal zawsze za dużo pracy JavaScriptu na wątku głównym.
sources:
  - title: "web.dev: Interaction to Next Paint (INP)"
    url: https://web.dev/articles/inp
  - title: "web.dev: Optimize INP"
    url: https://web.dev/articles/optimize-inp
  - title: "web.dev: Optimize long tasks"
    url: https://web.dev/articles/optimize-long-tasks
---

## Wyjaśnienie

Każda interakcja składa się z trzech faz:

1. **Input delay**: czekanie, aż wątek główny będzie wolny (bo trwa inne zadanie).
2. **Processing duration**: wykonanie event handlerów.
3. **Presentation delay**: przeliczenie stylów, layout, paint następnej klatki.

INP to (w przybliżeniu) **najgorsza** interakcja w trakcie wizyty (dla stron z wieloma interakcjami pomijane są pojedyncze skrajne wartości). Scroll i hover się nie liczą.

Optymalizacje:

- **Dziel długie zadania**: oddaj kontrolę przeglądarce (`await scheduler.yield()`, `setTimeout`), zanim wykonasz niepilną pracę.
- Najpierw aktualizacja widoczna dla użytkownika, potem reszta (analityka, zapis).
- **React**: `useTransition` dla kosztownych aktualizacji, mniej re-renderów (memo, colocation), wirtualizacja list, mniejsze drzewa komponentów.
- Mniej JS: code splitting, usunięcie zbędnych skryptów third-party, Server Components.
- Mniejszy i płytszy DOM (tańszy layout); `content-visibility`.
- Ciężkie obliczenia w Web Workerze.

## Kod

```js
async function onFilterClick(filter) {
  setActiveFilter(filter);          // 1. cheap, visible update first
  await scheduler.yield();          // 2. let the browser paint
  const results = heavyFilter(filter); // 3. expensive work afterwards
  renderResults(results);
  queueMicrotask(() => track('filter', filter)); // non-critical
}
```

## Pytania

### Co mierzy INP i z czego się składa? {#perf-inp-q1}

Opóźnienie od interakcji użytkownika do wyrenderowania następnej klatki. Składa się z input delay (zajęty wątek główny), processing duration (czas handlerów) i presentation delay (render klatki). Raportowana jest jedna z najgorszych interakcji wizyty.

### Jak poprawić INP w aplikacji React? {#perf-inp-q2}

Znaleźć wolne interakcje (DevTools Performance, RUM z atrybucją), ograniczyć re-rendery (colocation stanu, memo), oznaczyć kosztowne aktualizacje przez `useTransition`, wirtualizować listy, zmniejszyć ilość JS i hydration, dzielić długie zadania.

### Czym jest TBT i jak ma się do INP? {#perf-inp-q3}

Total Blocking Time to metryka laboratoryjna: suma czasu powyżej 50 ms wszystkich long tasks między FCP a TTI. Nie wymaga interakcji, więc służy jako przybliżenie INP w Lighthouse.

## Quiz

### Najczęstsza przyczyna wysokiego INP: {#perf-inp-z1}

- [ ] Duże obrazy
- [x] Długie zadania JavaScript na wątku głównym
- [ ] Brak HTTP/2
- [ ] Słaby TTFB

Zajęty wątek główny opóźnia obsługę i render odpowiedzi na interakcję.
