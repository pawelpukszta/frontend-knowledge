---
title: Testy regresji wizualnej
priority: medium
sources:
  - title: "Playwright: Visual comparisons"
    url: https://playwright.dev/docs/test-snapshots
---

Zrzuty ekranu porównywane z zatwierdzonymi wzorcami (Playwright `toHaveScreenshot`, Chromatic, Percy) wychwytują niezamierzone zmiany wyglądu, których nie zauważą testy funkcjonalne.

## Dlaczego to ważne

- Zmiana jednego tokenu lub globalnego stylu potrafi rozjechać kilkadziesiąt ekranów; test funkcjonalny przejdzie, bo przycisk nadal istnieje, choć jest przykryty albo niewidoczny.
- Recenzent w PR widzi różnicę obraz w obraz, zamiast domyślać się skutków zmiany w CSS.
- Zrzuty zależą od systemu, fontów i przeglądarki, dlatego wzorce generuje się w tym samym środowisku co CI (np. w oficjalnym obrazie Dockera Playwright).

## Jak sprawdzić

Raport różnic w PR (raport HTML Playwright lub Chromatic); wzorce aktualizuje się świadomie przez `npx playwright test --update-snapshots`, a zmiany obrazów przechodzą review.

## Kod

```ts title="e2e/visual.spec.ts"
import { test, expect } from '@playwright/test';

test('offer grid looks unchanged', async ({ page }) => {
  await page.goto('/wakacje/grecja');
  await expect(page).toHaveScreenshot('offers-grid.png', {
    fullPage: true,
    animations: 'disabled',
    // Hide content that changes on every run
    mask: [page.getByTestId('live-price'), page.getByTestId('promo-countdown')],
    maxDiffPixelRatio: 0.01,
  });
});
```

## Częste błędy

- Wzorce generowane na macOS programisty, a porównywane w CI na Linuksie.
- Automatyczne akceptowanie wszystkich różnic, bo "to pewnie antyaliasing".
