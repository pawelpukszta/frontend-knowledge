---
title: Automatyczne testy dostępności
priority: high
sources:
  - title: "Playwright: Accessibility testing"
    url: https://playwright.dev/docs/accessibility-testing
---

axe-core w testach komponentów i E2E (`@axe-core/playwright`, vitest-axe lub jest-axe) oraz lint `eslint-plugin-jsx-a11y` wyłapują część błędów automatycznie. To uzupełnienie, a nie zastępstwo testów ręcznych z klawiaturą i czytnikiem ekranu.

## Dlaczego to ważne

- Automaty wykrywają typowe błędy (brak etykiet, za niski kontrast, błędne atrybuty ARIA, brak `alt`) w każdym PR, zanim trafią na produkcję i do audytu.
- Narzędzia wykrywają tylko część problemów WCAG; kolejności fokusu, sensu tekstów alternatywnych i działania z czytnikiem ekranu nie sprawdzą.
- European Accessibility Act obowiązuje od 28 czerwca 2025 r.; regresja dostępności w sklepie lub systemie rezerwacji to ryzyko prawne, a nie tylko gorszy UX.

## Jak sprawdzić

Krok a11y w CI (axe w Playwright na kluczowych stronach i stanach, np. z otwartym modalem); okresowo ręczny test klawiaturą oraz z NVDA lub VoiceOver.

## Kod

```ts title="e2e/a11y.spec.ts"
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const path of ['/', '/wakacje/grecja', '/rezerwacja/123']) {
  test(`no detectable WCAG A/AA violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .exclude('#third-party-chat') // widget outside our control, tracked separately
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
```

## Częste błędy

- Skanowanie tylko stanu początkowego strony, bez otwartych menu, modali i komunikatów błędów walidacji.
- Masowe wyłączanie reguł axe, żeby CI było zielone.
