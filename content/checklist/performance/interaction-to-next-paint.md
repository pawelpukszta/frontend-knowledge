---
title: INP poniżej 200 ms
priority: high
sources:
  - title: "web.dev: Optimize INP"
    url: https://web.dev/articles/optimize-inp
---

Strona reaguje na kliknięcia, dotyk i klawiaturę bez opóźnień: od interakcji do następnej klatki mija maksymalnie 200 ms na 75. percentylu. Wysoki INP to niemal zawsze długie zadania JS na wątku głównym lub zbyt drogie renderowanie po interakcji.

## Dlaczego to ważne

- INP zastąpił FID jako Core Web Vital w marcu 2024 i mierzy wszystkie interakcje w trakcie wizyty, a nie tylko pierwszą, więc ujawnia problemy w filtrach, formularzach i koszykach.
- Brak natychmiastowej reakcji powoduje wielokrotne klikanie, np. podwójne dodanie do koszyka lub podwójne wysłanie rezerwacji.
- Telefony ze średniej i niskiej półki mają kilkukrotnie słabsze CPU niż laptop dewelopera; zadanie trwające 50 ms lokalnie może u nich trwać 300 ms.

## Jak sprawdzić

Dane field (CrUX w PageSpeed Insights, RUM z `onINP` z `web-vitals/attribution`: `interactionTarget`, `inputDelay`, `processingDuration`, `presentationDelay`); lokalnie nagranie interakcji w DevTools Performance z throttlingiem CPU 4x lub 6x.

## Kod

```js title="Oddanie wątku głównego w długim handlerze"
// Yield to the main thread so the browser can paint feedback first
function yieldToMain() {
  if (globalThis.scheduler?.yield) return scheduler.yield();
  return new Promise((resolve) => setTimeout(resolve, 0));
}

filterForm.addEventListener('change', async (event) => {
  showSpinner();                 // cheap visual feedback, painted right away
  await yieldToMain();
  const offers = applyFilters(allOffers, new FormData(filterForm)); // heavy work
  await yieldToMain();
  renderOfferList(offers);
  sendAnalytics('filter_change'); // non-critical, could also go to requestIdleCallback
});
```

## Częste błędy

- Synchroniczne wysyłanie analityki, walidacja całego formularza i ponowne renderowanie całej listy w jednym handlerze.
- Testowanie INP tylko w Lighthouse: lab nie wykonuje interakcji, pokazuje co najwyżej TBT jako przybliżenie.
