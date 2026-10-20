---
title: Testy end-to-end
priority: high
---

Playwright (lub Cypress) sprawdza krytyczne ścieżki użytkownika (wyszukiwanie, rezerwacja, płatność) w prawdziwej przeglądarce, na środowisku zbliżonym do produkcji, w CI przed każdym wdrożeniem.

## Dlaczego to ważne

- Tylko E2E sprawdza całość naraz: routing, SSR i hydrację, cookies, przekierowania oraz integrację z bramką płatności w trybie testowym.
- Awaria ścieżki rezerwacji to bezpośrednio utracony przychód; kilkanaście dobrze dobranych scenariuszy daje wiarygodny sygnał "można wdrażać".
- E2E są wolne i podatne na niestabilność, dlatego warto mieć ich niewiele, na najważniejszych ścieżkach, z lokatorami opartymi na rolach i bez sztywnych `waitForTimeout`.

## Jak sprawdzić

Raport HTML Playwright i trace z nieudanych testów jako artefakty pipeline'u; wdrożenie wymaga zielonego zestawu E2E.

## Kod

```ts title="e2e/booking.spec.ts"
import { test, expect } from '@playwright/test';

test('guest can book an offer and reach the payment step', async ({ page }) => {
  await page.goto('/wakacje/grecja');
  await page.getByRole('link', { name: /Hotel Lindos Bay/ }).click();

  await page.getByLabel('Data wyjazdu').fill('2026-07-15');
  await page.getByRole('button', { name: 'Rezerwuj' }).click();

  await page.getByLabel('Imię i nazwisko').fill('Anna Nowak');
  await page.getByLabel('E-mail').fill('anna.nowak@example.com');
  await page.getByRole('button', { name: 'Przejdź do płatności' }).click();

  // Web-first assertions retry automatically, no manual sleeps needed
  await expect(page).toHaveURL(/\/platnosc/);
  await expect(page.getByRole('heading', { name: 'Płatność' })).toBeVisible();
});
```

## Częste błędy

- Lokatory CSS typu `.btn-primary > span:nth-child(2)`, które psują się przy każdej zmianie stylów.
- Testy zależne od siebie nawzajem lub od danych produkcyjnych; każdy test powinien sam przygotować swoje dane.
