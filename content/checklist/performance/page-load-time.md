---
title: Czas ładowania poniżej 3 s
priority: high
---

Strona jest używalna (główna treść widoczna, kluczowe elementy działają) w mniej niż 3 s na typowym telefonie i sieci komórkowej. Mierz na reprezentatywnym urządzeniu i sieci, a nie na laptopie dewelopera z szybkim Wi-Fi.

## Dlaczego to ważne

- Wg danych Google z 2016 r. ponad połowa (53%) wizyt mobilnych jest porzucana, gdy strona ładuje się dłużej niż 3 s; szczegóły się zmieniają, ale zależność "wolniej, więcej porzuceń" jest stała.
- Użytkownik szukający oferty porównuje kilka serwisów równolegle; wolniejsza karta przegrywa, zanim pokaże cenę.
- "Czas ładowania" jest pojęciem mglistym; rozbij go na mierzalne metryki (TTFB, FCP, LCP) i ustal dla nich budżety.

## Jak sprawdzić

WebPageTest z kilku lokalizacji na profilu mobilnym, Lighthouse z throttlingiem, RUM (Navigation Timing i Core Web Vitals) z podziałem na urządzenia i typ połączenia.

## Kod

```js title="RUM: kluczowe momenty ładowania z Navigation Timing"
addEventListener('load', () => {
  // Wait one task so loadEventEnd is filled in
  setTimeout(() => {
    const [nav] = performance.getEntriesByType('navigation');
    navigator.sendBeacon('/api/rum', JSON.stringify({
      page: location.pathname,
      ttfb: Math.round(nav.responseStart),
      domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
      load: Math.round(nav.loadEventEnd),
      connection: navigator.connection?.effectiveType ?? 'unknown', // Chromium only
    }));
  }, 0);
});
```

## Częste błędy

- Raportowanie średniej zamiast percentyli (p75, p95): średnia ukrywa najwolniejszych użytkowników.
