---
title: Rozmiar bundla i koszt JavaScriptu
level: senior
tags:
  - bundle size
  - code splitting
  - bundle analyzer
  - third-party
summary: "JavaScript to najdroższy zasób: trzeba go pobrać, sparsować, skompilować i wykonać. Mniejszy bundle poprawia LCP, INP i TBT, zwłaszcza na słabszych telefonach."
sources:
  - title: "V8: The cost of JavaScript in 2019"
    url: https://v8.dev/blog/cost-of-javascript-2019
  - title: "web.dev: Performance budgets 101"
    url: https://web.dev/articles/performance-budgets-101
  - title: "Chrome DevTools: Coverage"
    url: https://developer.chrome.com/docs/devtools/coverage
---

## Wyjaśnienie

Jak diagnozować:

- **Bundle analyzer** (`rollup-plugin-visualizer` dla Vite, `@next/bundle-analyzer`, `webpack-bundle-analyzer`): co zajmuje miejsce.
- **DevTools Coverage** (Ctrl+Shift+P → "Coverage"): ile pobranego JS i CSS nie zostało użyte.
- **bundlephobia / pkg-size**: koszt biblioteki przed instalacją.

Jak zmniejszać:

- Code splitting na trasach i ciężkich komponentach.
- Tree shaking: importy nazwane, biblioteki ESM, `sideEffects`.
- Zamiana ciężkich bibliotek (moment.js → date-fns / `Intl`, lodash → natywne metody).
- Server Components i przeniesienie logiki na serwer.
- Kontrola skryptów **third-party** (tag managery, czaty, A/B testy): często ważą więcej niż cała aplikacja. `async`, ładowanie po interakcji, Partytown.
- Nowoczesny target (bez niepotrzebnych polyfilli dla starych przeglądarek).
- **Performance budget** w CI (np. limit KB JS na trasę).

## Pytania

### Jak zmniejszyłbyś bundle aplikacji React? {#perf-bundle-q1}

Najpierw pomiar (bundle analyzer, Coverage). Potem code splitting tras i ciężkich komponentów, wymiana lub importy selektywne dużych bibliotek, sprawdzenie tree shakingu, przeniesienie części UI do Server Components, audyt skryptów third-party i budżet w CI, żeby problem nie wrócił.

### Dlaczego 200 KB JS jest "droższe" niż 200 KB obrazu? {#perf-bundle-q2}

Obraz trzeba pobrać i zdekodować. JavaScript trzeba pobrać, sparsować, skompilować i wykonać na wątku głównym, co blokuje interakcje. Na słabszych telefonach różnica jest wielokrotna.
