---
title: Optymalne ładowanie fontów
priority: high
sources:
  - title: "web.dev: Optimize web fonts"
    url: https://web.dev/learn/performance/optimize-web-fonts
---

Fonty w WOFF2, z subsettingiem (np. tylko latin i latin-ext), z `font-display: swap` lub `optional`, z preloadem najważniejszego kroju i dopasowaniem metryk fontu zastępczego (`size-adjust`, `ascent-override`), żeby uniknąć CLS.

## Dlaczego to ważne

- Bez `font-display` przeglądarka może ukrywać tekst do 3 s (FOIT); użytkownik widzi stronę bez nagłówków i cen.
- Zamiana fontu zastępczego na docelowy o innych metrykach przesuwa tekst i całe bloki, co liczy się do CLS.
- Pełny font ze wszystkimi alfabetami waży kilkaset KB; subset z polskimi znakami to zwykle kilkadziesiąt KB.

## Jak sprawdzić

Network (filtr Font), ścieżka Layout shifts w Performance, insight o wyświetlaniu fontów w Lighthouse; test z throttlingiem, czy tekst jest widoczny od razu.

## Kod

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-latin-ext.woff2') format('woff2');
  font-weight: 100 900;          /* variable font: one file for all weights */
  font-display: swap;
  unicode-range: U+0000-00FF, U+0100-017F; /* Latin + Latin Extended-A (Polish letters) */
}

/* Fallback tuned to Inter metrics to avoid layout shift on swap */
@font-face {
  font-family: 'Inter Fallback';
  src: local('Arial');
  size-adjust: 107%;
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}

body { font-family: 'Inter', 'Inter Fallback', system-ui, sans-serif; }
```

## Częste błędy

- Ładowanie 6 grubości i kursyw "na zapas", gdy w projekcie używane są dwie.
- Fonty z Google Fonts przez `@import` w CSS (łańcuch zapytań i dodatkowe domeny) zamiast samodzielnego hostowania lub `next/font`.
