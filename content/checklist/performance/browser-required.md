---
title: Audyty w prawdziwej przeglądarce
priority: medium
---

Metryki takie jak LCP, CLS i INP wymagają wykonania JS i renderowania, więc narzędzia analizujące sam HTML ich nie zmierzą. Testuj w prawdziwej przeglądarce z throttlingiem CPU i sieci, zaczynając od widoku mobilnego.

## Dlaczego to ważne

- Aplikacje React, Next.js czy Vue dociągają treść i układ w JS; statyczna analiza HTML nie zobaczy obrazu LCP, przesunięć układu ani długich zadań.
- Większość ruchu w e-commerce i turystyce pochodzi z telefonów, a Google ocenia strony głównie na podstawie wersji mobilnej (mobile-first indexing).
- Laptop dewelopera bez throttlingu ukrywa problemy, które użytkownik z tańszym telefonem odczuwa jako kilkusekundowe opóźnienia.

## Jak sprawdzić

Lighthouse (domyślnie emuluje telefon z throttlingiem), PageSpeed Insights, panel Performance w DevTools z ustawieniem CPU 4x/6x i sieci "Slow 4G".

## Kod

```bash title="Lighthouse z CLI: mobilny profil, kilka przebiegów"
# Default config emulates a mid-tier phone with simulated throttling
npx lighthouse https://example.pl/wakacje/grecja \
  --only-categories=performance \
  --output=html --output-path=./reports/grecja-mobile.html

# Desktop run for comparison
npx lighthouse https://example.pl/wakacje/grecja \
  --preset=desktop --only-categories=performance \
  --output=json --output-path=./reports/grecja-desktop.json
```

## Częste błędy

- Jeden przebieg Lighthouse traktowany jako wyrocznia; wyniki lab wahają się, uruchamiaj kilka razy i patrz na medianę.
