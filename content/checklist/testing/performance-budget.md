---
title: Budżety wydajności w CI
priority: medium
sources:
  - title: "GitHub: Lighthouse CI"
    url: https://github.com/GoogleChrome/lighthouse-ci
---

Limity (rozmiar JS, LCP, CLS, liczba zapytań) sprawdzane automatycznie w każdym PR (Lighthouse CI, size-limit); przekroczenie blokuje merge.

## Dlaczego to ważne

- Wydajność psuje się po trochu: każda biblioteka dodaje kilkadziesiąt KB i nikt nie czuje się odpowiedzialny; budżet zamienia to w jawną decyzję w PR.
- Rozmiar JS bezpośrednio wpływa na czas parsowania i wykonania na słabych telefonach, a więc na INP i LCP.
- Lighthouse w CI daje dane laboratoryjne; budżety warto ustawić z zapasem względem progów Core Web Vitals (LCP 2,5 s, CLS 0,1) i potwierdzać danymi od prawdziwych użytkowników (RUM).

## Jak sprawdzić

Konfiguracja budżetów w repozytorium i wynik jako wymagany status check w PR; przed dodaniem zależności uruchom `npx size-limit` lokalnie.

## Kod

```yaml title=".github/workflows/perf-budget.yml"
name: Performance budget
on: pull_request
jobs:
  budget:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with: { node-version: 24, cache: npm }
      - run: npm ci && npm run build
      # Fails when bundles exceed the limits in .size-limit.json
      - run: npx size-limit
      # Runs Lighthouse on the URLs and checks assertions from lighthouserc.json
      - run: npx @lhci/cli autorun
```

```json title="lighthouserc.json"
{
  "ci": {
    "collect": {
      "startServerCommand": "npm run start",
      "url": ["http://localhost:3000/", "http://localhost:3000/wakacje/grecja"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-blocking-time": ["warn", { "maxNumericValue": 200 }]
      }
    }
  }
}
```

## Częste błędy

- Jednorazowy przebieg Lighthouse jako twardy próg; wyniki wahają się między uruchomieniami, więc potrzebne są co najmniej 3 przebiegi.
