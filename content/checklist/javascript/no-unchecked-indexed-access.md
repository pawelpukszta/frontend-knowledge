---
title: noUncheckedIndexedAccess
priority: medium
sources:
  - title: "TSConfig: noUncheckedIndexedAccess"
    url: https://www.typescriptlang.org/tsconfig/#noUncheckedIndexedAccess
---

Dostęp `arr[i]` i `record[key]` ma typ `T | undefined`, co wymusza obsłużenie braku wartości.

## Dlaczego to ważne

- Bez tej flagi `prices[code]` ma typ `number`, nawet gdy klucza nie ma; błąd ujawnia się dopiero jako `NaN` na stronie.
- Flaga nie jest częścią `strict`, więc trzeba ją włączyć osobno.
- Wymusza świadome decyzje: wartość domyślna, wczesny return albo komunikat o braku danych.

## Jak sprawdzić

Sprawdź `tsconfig.json`; po włączeniu przejrzyj nowe błędy, bo wskazują realne miejsca potencjalnego `undefined`.

## Kod

```ts
// tsconfig: "noUncheckedIndexedAccess": true
const surcharges: Record<string, number> = { SGL: 450, SEA: 120 };

function surchargeFor(code: string): number {
  const value = surcharges[code]; // number | undefined
  return value ?? 0;
}

const [firstOffer] = offers; // Offer | undefined
if (!firstOffer) return <EmptyState />;
```

## Częste błędy

- Masowe dodawanie `!` (non-null assertion) po włączeniu flagi, co niweczy jej sens.
