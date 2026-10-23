---
title: Dane lab vs field (RUM)
level: senior
added: 2026-10-20
tags:
  - lab data
  - field data
  - RUM
  - CrUX
  - PageSpeed Insights
summary: Lab (Lighthouse, DevTools) to test w kontrolowanych warunkach, dobry do debugowania. Field (CrUX, RUM) to dane od prawdziwych użytkowników, które decydują o ocenie CWV.
sources:
  - title: "web.dev: Why lab and field data can be different"
    url: https://web.dev/articles/lab-and-field-data-differences
  - title: "Chrome: CrUX (Chrome UX Report)"
    url: https://developer.chrome.com/docs/crux
  - title: PageSpeed Insights
    url: https://pagespeed.web.dev/
---

## Wyjaśnienie

| | Lab | Field |
|---|---|---|
| Źródło | Lighthouse, DevTools, WebPageTest | CrUX, własny RUM (`web-vitals`, Sentry, Datadog) |
| Warunki | jedno urządzenie, symulowana sieć i CPU | prawdziwe urządzenia, sieci, zachowania |
| Zalety | powtarzalne, szybka pętla feedbacku, CI | prawda o UX, podstawa oceny Google |
| Wady | nie mierzy INP (brak interakcji), nie widzi cache i personalizacji | opóźnione (CrUX: 28 dni), trudniejsze debugowanie |

Dlaczego wyniki się różnią: inne urządzenia, stan cache, zalogowani użytkownicy, bannery zgód, reklamy, interakcje, bfcache.

Praca w praktyce: **field** mówi, *czy* masz problem i gdzie (które strony, urządzenia). **Lab** pomaga znaleźć *przyczynę* i zweryfikować poprawkę. W CI warto mieć Lighthouse CI z budżetami wydajności.

## Pytania

### Czym różnią się dane lab i field? {#perf-lab-field-q1}

Lab to syntetyczny test w kontrolowanych warunkach (Lighthouse), powtarzalny i dobry do debugowania. Field to dane od prawdziwych użytkowników (CrUX, RUM), które pokazują realne doświadczenie i są podstawą oceny Core Web Vitals.

### Lighthouse daje 95, a Search Console pokazuje słaby LCP. Dlaczego? {#perf-lab-field-q2}

Lighthouse testuje jedno uruchomienie na symulowanym urządzeniu, zwykle bez bannerów zgód, personalizacji i z inną siecią. Użytkownicy mogą mieć słabsze telefony, wolne sieci, inne wejścia na stronę. Decydują dane field, więc trzeba wdrożyć RUM z atrybucją i szukać przyczyny w rzeczywistych warunkach.

## Quiz

### Które dane decydują o ocenie Core Web Vitals w Google? {#perf-lab-field-z1}

- [ ] Wynik Lighthouse
- [x] Dane field z CrUX (75. percentyl)
- [ ] Wynik z DevTools na moim komputerze
- [ ] Średnia z WebPageTest

Ocena opiera się na danych od prawdziwych użytkowników Chrome.
