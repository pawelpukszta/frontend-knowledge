---
title: Testy mutacyjne krytycznej logiki
priority: medium
sources:
  - title: Stryker Mutator
    url: https://stryker-mutator.io/
---

Stryker wprowadza drobne zmiany w kodzie (mutanty, np. `>` na `>=` albo usunięcie warunku) i sprawdza, czy testy je wykryją. Pokazuje, czy testy naprawdę sprawdzają zachowanie, a nie tylko wykonują linie.

## Dlaczego to ważne

- Wysokie pokrycie bywa złudne: test, który wywołuje `calculateDiscount` bez sensownej asercji, daje 100% linii i zero ochrony; wynik mutacyjny (mutation score) to ujawnia.
- Mutanty, które przeżyły, wskazują konkretny brakujący przypadek, np. brak testu dla granicy "rabat od 4 osób".
- Pełny przebieg jest kosztowny (testy uruchamiane setki razy), dlatego zawęża się go do krytycznych modułów i używa trybu przyrostowego.

## Jak sprawdzić

Raport HTML Strykera z mutation score dla wybranych modułów (np. wyliczania cen); próg `break` przerywa nocny job CI.

## Kod

```json title="stryker.config.json"
{
  "$schema": "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
  "testRunner": "vitest",
  "plugins": ["@stryker-mutator/vitest-runner", "@stryker-mutator/typescript-checker"],
  "checkers": ["typescript"],
  "tsconfigFile": "tsconfig.json",
  "mutate": ["src/pricing/**/*.ts", "!src/pricing/**/*.test.ts"],
  "incremental": true,
  "reporters": ["html", "clear-text", "progress"],
  "thresholds": { "high": 85, "low": 70, "break": 60 }
}
```

## Częste błędy

- Uruchamianie Strykera na całym monorepo w każdym PR; przebieg trwa godzinami i szybko zostaje wyłączony.
