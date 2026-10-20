---
title: Progi pokrycia testami
priority: medium
sources:
  - title: "Vitest: Coverage config"
    url: https://vitest.dev/config/coverage
---

Minimalne pokrycie (np. 70-80% linii dla logiki domenowej) egzekwowane w CI zapobiega cichemu spadkowi jakości. Pokrycie to wskaźnik pomocniczy, a nie cel sam w sobie.

## Dlaczego to ważne

- Bez progu pokrycie spada niezauważenie, bo nowy kod trafia do repozytorium bez testów "tylko na chwilę".
- Raport pokazuje nieprzetestowane gałęzie, np. obsługę odrzuconej płatności, czyli konkretne miejsca do uzupełnienia.
- 100% pokrycia nie oznacza dobrych testów: linia wykonana bez żadnej asercji też się liczy, dlatego progi warto łączyć z testami mutacyjnymi.

## Jak sprawdzić

`npx vitest run --coverage` kończy się błędem poniżej progu; raport (np. komentarz w PR) pokazuje pokrycie zmienionych plików.

## Kod

```ts title="vitest.config.ts"
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      // Without include, files never imported by tests do not lower the score
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.stories.tsx', 'src/**/*.d.ts'],
      reporter: ['text', 'html', 'json-summary'],
      thresholds: {
        lines: 80, functions: 80, branches: 70, statements: 80,
        // Stricter gate for money-related logic
        'src/pricing/**': { lines: 95, branches: 90 },
      },
    },
  },
});
```

## Częste błędy

- Pisanie testów bez asercji tylko po to, by podbić procent.
- Jeden globalny próg 90% dla całego projektu, łącznie z kodem UI bez logiki; zespół zaczyna wykluczać pliki, żeby przejść CI.
