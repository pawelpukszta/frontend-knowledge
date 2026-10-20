---
title: Testy jednostkowe
priority: high
---

Logika domenowa, funkcje pomocnicze, hooki i reducery mają szybkie, izolowane testy (Vitest, Jest) uruchamiane lokalnie w trybie watch i w CI przy każdym pushu.

## Dlaczego to ważne

- Błąd w wyliczaniu ceny, rabatu czy liczby nocy kosztuje realne pieniądze i zaufanie klientów; test jednostkowy łapie go w milisekundach, zanim kod trafi do code review.
- Testy dokumentują przypadki brzegowe (zmiana czasu, rok przestępny, dziecko za pół ceny) lepiej niż komentarz i chronią logikę przy refaktoryzacji.
- To najtańsze i najszybsze testy: tysiące przypadków w kilka sekund, więc programiści naprawdę je uruchamiają.

## Jak sprawdzić

`npx vitest run` lokalnie i jako wymagany krok CI; czerwony wynik blokuje merge (branch protection).

## Kod

```ts title="src/pricing/calculate-total.test.ts"
import { describe, expect, test } from 'vitest';
import { calculateTotal } from './calculate-total';

describe('calculateTotal', () => {
  test.each([
    // adults, children, nights, expected total in PLN (350 PLN per person per night)
    [2, 0, 7, 4900],
    [2, 1, 7, 6125], // a child pays 50%
    [1, 0, 0, 0],    // zero nights means no charge
  ])('%i adults, %i children, %i nights -> %i PLN', (adults, children, nights, expected) => {
    expect(calculateTotal({ adults, children, nights, pricePerNight: 350 })).toBe(expected);
  });

  test('rejects a negative number of guests', () => {
    expect(() => calculateTotal({ adults: -1, children: 0, nights: 3, pricePerNight: 350 })).toThrow(RangeError);
  });
});
```

## Częste błędy

- Testowanie szczegółów implementacji (prywatnych funkcji, liczby wywołań `setState`) zamiast wyniku.
- Testy zależne od bieżącej daty lub strefy czasowej maszyny zamiast `vi.setSystemTime` i jawnej strefy.
