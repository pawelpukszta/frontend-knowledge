---
title: Spójne końcowe ukośniki
priority: medium
---

Wybierz jedną wersję (`/oferty` albo `/oferty/`) i przekierowuj drugą 301. Inaczej powstają duplikaty.

## Dlaczego to ważne

- `/oferty` i `/oferty/` to dla Google dwa różne adresy; obie wersje zwracające 200 to duplikat treści.
- Niespójne linkowanie (raz z ukośnikiem, raz bez) w połączeniu z przekierowaniem daje dodatkowy skok przy każdym kliknięciu.
- Wybór jest dowolny, liczy się konsekwencja w routingu, linkach, canonicalach i sitemap; późniejsza zmiana wymaga przekierowania całego serwisu.

## Jak sprawdzić

Otwórz obie wersje kilku adresów lub użyj `curl -sI` (oczekiwane 301 lub 308 na wersję kanoniczną).

## Kod

```ts title="next.config.ts"
import type { NextConfig } from "next";

const config: NextConfig = {
  // false (default): /oferty/ redirects with 308 to /oferty; true does the opposite
  trailingSlash: false,
};

export default config;
```

```bash
curl -sI https://example.pl/oferty/ | grep -iE '^(HTTP|location)'
# HTTP/2 308
# location: /oferty
```

## Częste błędy

- Canonical z ukośnikiem, a linki i sitemap bez niego.
