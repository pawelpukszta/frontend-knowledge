---
title: LCP poniżej 2,5 s
priority: critical
sources:
  - title: "web.dev: Optimize LCP"
    url: https://web.dev/articles/optimize-lcp
---

Największy element treści widoczny w viewporcie (zwykle zdjęcie hero lub nagłówek) renderuje się w ciągu 2,5 s na 75. percentylu wizyt. Najczęstsze przyczyny słabego LCP: wolny TTFB, późno odkryty lub lazy-loadowany obraz, blokujący CSS/JS.

## Dlaczego to ważne

- LCP to moment, w którym użytkownik widzi, że strona ma to, czego szukał (np. zdjęcie hotelu i cenę); im później, tym większa szansa, że wróci do wyników wyszukiwania.
- LCP jest jednym z trzech Core Web Vitals, które Google uwzględnia w sygnałach page experience; ocena liczy się na danych z prawdziwych wizyt (CrUX), nie z Lighthouse.
- Wg raportu Deloitte "Milliseconds Make Millions" przyspieszenie strony mobilnej o 0,1 s zwiększyło konwersję w branży turystycznej o ok. 10%.

## Jak sprawdzić

PageSpeed Insights (dane field z CrUX) oraz panel Performance w DevTools, który rozbija LCP na fazy: TTFB, opóźnienie i czas ładowania zasobu, opóźnienie renderowania. W produkcji zbieraj LCP z atrybucją przez bibliotekę `web-vitals`.

## Kod

```js title="RUM: LCP z atrybucją (web-vitals v5)"
import { onLCP } from 'web-vitals/attribution';

onLCP(({ name, value, rating, attribution }) => {
  const payload = {
    name,                       // "LCP"
    value: Math.round(value),   // ms
    rating,                     // "good" | "needs-improvement" | "poor"
    element: attribution.target,           // CSS selector of the LCP element
    ttfb: attribution.timeToFirstByte,
    loadDelay: attribution.resourceLoadDelay,  // high value = image discovered late
    loadDuration: attribution.resourceLoadDuration,
    renderDelay: attribution.elementRenderDelay,
    page: location.pathname,
  };
  navigator.sendBeacon('/api/vitals', JSON.stringify(payload));
});
```

## Częste błędy

- Optymalizowanie wyniku Lighthouse z szybkiego laptopa zamiast danych field z telefonów użytkowników.
- Obraz LCP ustawiony jako `background-image` w CSS albo wstawiany przez JS: przeglądarka odkrywa go dopiero po pobraniu stylów lub skryptu.
