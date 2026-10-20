---
title: Bez przekierowań meta refresh
priority: medium
---

`<meta http-equiv="refresh">` z opóźnieniem przeładowuje lub przenosi stronę bez kontroli użytkownika. Przekierowania rób po stronie serwera (301/308), a odświeżanie danych przez JS, z możliwością wyłączenia.

## Dlaczego to ważne

- Czytnik ekranu zaczyna czytać od początku po każdym przeładowaniu; użytkownik traci miejsce i nie zdąży doczytać treści. WCAG 2.2.1 Timing Adjustable (A).
- Automatyczne przeładowanie w trakcie wypełniania formularza kasuje wpisane dane podróżnych.
- Google zaleca przekierowania serwerowe, a meta refresh traktuje jako rozwiązanie awaryjne; to też dodatkowe pobranie strony dla użytkownika.

## Jak sprawdzić

Wyszukaj `http-equiv="refresh"` w HTML; axe (`meta-refresh`).

## Kod

```html title="Źle"
<!-- Reloads the offer list every 60 s, resetting the reader's position -->
<meta http-equiv="refresh" content="60">
<!-- Delayed redirect after a promotion ends -->
<meta http-equiv="refresh" content="5; url=/promocje">
```

```ts title="next.config.ts (Dobrze)"
import type { NextConfig } from 'next';

const config: NextConfig = {
  async redirects() {
    return [
      // 308 permanent redirect handled on the server
      { source: '/last-minute-2025', destination: '/promocje', permanent: true },
    ];
  },
};

export default config;
```

## Częste błędy

- Odświeżanie listy cen co minutę bez przycisku "Wstrzymaj aktualizacje".
