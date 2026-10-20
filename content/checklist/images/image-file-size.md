---
title: Rozmiary plików w limitach
priority: high
---

Orientacyjnie: zdjęcia w treści do ok. 200 KB, obraz hero do ok. 400 KB, miniatury do ok. 30 KB, grafiki i ikony do ok. 50 KB. To cele, nie sztywne limity; ważne, by przekroczenia były świadome.

## Dlaczego to ważne

- Bez liczbowego limitu waga strony rośnie niezauważenie z każdym wdrożeniem i nowym banerem.
- Limit w CI zatrzymuje regresję przed produkcją, zamiast wykrywać ją po spadku Core Web Vitals w Search Console po 28 dniach.
- Na łączu 4 Mb/s obraz 2 MB to ok. 4 s samego transferu, czyli więcej niż cały budżet LCP.

## Jak sprawdzić

Network posortowany po rozmiarze; budżet sprawdzany w CI skryptem jak poniżej.

## Kod

```js title="scripts/check-image-budget.mjs"
import { glob, stat } from 'node:fs/promises';

const LIMITS_KB = { hero: 400, thumb: 30, icon: 50, default: 200 };
const failures = [];

for await (const file of glob('public/img/**/*.{avif,webp,jpg,png,svg}')) {
  const kind = Object.keys(LIMITS_KB).find((k) => file.includes(`/${k}`)) ?? 'default';
  const kb = (await stat(file)).size / 1024;
  if (kb > LIMITS_KB[kind]) failures.push(`${file}: ${kb.toFixed(0)} KB > ${LIMITS_KB[kind]} KB`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
```

## Częste błędy

- Limit tylko dla obrazów w repozytorium, podczas gdy największe pliki przychodzą z CMS.
