---
title: Waga strony poniżej 1500 KB
priority: high
---

Łączny transfer przy pierwszym wejściu (HTML, CSS, JS, obrazy, fonty) maksymalnie 1500 KB, cel poniżej 500 KB dla kluczowych stron. Ustal budżet i pilnuj go automatycznie.

## Dlaczego to ważne

- Każdy kilobajt kosztuje czas na wolnych sieciach; na 4G z dużym opóźnieniem lub w zasięgu jednej kreski różnica 1 MB to kilka sekund.
- Użytkownik płaci za transfer: na roamingu poza UE (np. Egipt, Turcja, Tunezja) 1 MB potrafi kosztować kilka złotych, a to typowa sytuacja klienta biura podróży sprawdzającego rezerwację na miejscu.
- Bez budżetu waga rośnie niezauważalnie z każdą funkcją; mediana wagi strony mobilnej w HTTP Archive przekracza już 2 MB.

## Jak sprawdzić

Network z wyłączonym cache, posortowany po rozmiarze (kolumna Transferred), Lighthouse (łączny rozmiar sieci), budżet sprawdzany w CI.

## Kod

```ts title="Test budżetu wagi w Playwright"
import { test, expect } from '@playwright/test';

test('offer page stays under the 1500 KB budget', async ({ page }) => {
  await page.goto('/wakacje/grecja/hotel-santorini-view', { waitUntil: 'networkidle' });
  const bytes = await page.evaluate(() =>
    performance.getEntriesByType('resource')
      .concat(performance.getEntriesByType('navigation'))
      .reduce((sum, e) => sum + (e as PerformanceResourceTiming).transferSize, 0),
  );
  console.log(`Transferred: ${Math.round(bytes / 1024)} KB`);
  expect(bytes).toBeLessThan(1500 * 1024);
});
```

## Częste błędy

- Budżet liczony tylko dla JS, a pominięcie obrazów i fontów, które zwykle stanowią większość wagi.
- `transferSize` równe 0 dla zasobów z innych domen bez nagłówka `Timing-Allow-Origin`; budżet trzeba wtedy liczyć np. w Lighthouse lub WebPageTest.
