---
title: Lighthouse
level: mid
tags:
  - Lighthouse
  - audyt
  - PageSpeed
  - Lighthouse CI
summary: "Automatyczny audyt strony w warunkach laboratoryjnych: Performance, Accessibility, Best Practices, SEO. Daje wynik 0-100 i listę konkretnych rekomendacji."
sources:
  - title: "Chrome: Lighthouse overview"
    url: https://developer.chrome.com/docs/lighthouse/overview
  - title: "GitHub: Lighthouse CI"
    url: https://github.com/GoogleChrome/lighthouse-ci
---

## Wyjaśnienie

- Dostępny w DevTools (zakładka **Lighthouse**), w **PageSpeed Insights** (lab + field), jako CLI i **Lighthouse CI**.
- Tryby: **Navigation** (ładowanie strony), **Timespan** (okres z interakcjami), **Snapshot** (stan strony w danej chwili).
- Wynik Performance to ważona suma metryk lab: TBT, LCP, CLS, FCP, Speed Index.
- Sekcje **Diagnostics** i **Opportunities/Insights** wskazują konkretne problemy (render-blocking, nieużywany JS, obrazy, cache).

Dobre praktyki:

- Testuj w oknie incognito (rozszerzenia wpływają na wynik), kilka razy (wyniki się wahają).
- Traktuj wynik jako **narzędzie diagnostyczne**, nie cel sam w sobie. O sukcesie decydują dane field.
- W CI ustaw **budżety** (np. rozmiar JS, LCP), żeby regresje nie trafiały na produkcję.

## Pytania

### Do czego używasz Lighthouse, a do czego nie? {#perf-lighthouse-q1}

Do szybkiej diagnozy i wykrywania regresji (lokalnie i w CI z budżetami), audytu dostępności i SEO. Nie traktuję go jako miary realnego UX: nie mierzy INP ani warunków prawdziwych użytkowników. Do tego służą dane field (CrUX, RUM).

### Dlaczego wynik Lighthouse się zmienia między uruchomieniami? {#perf-lighthouse-q2}

Zmienność sieci, obciążenie CPU komputera, rozszerzenia przeglądarki, A/B testy, reklamy, cache serwera. Dlatego uruchamia się kilka pomiarów i porównuje medianę.
