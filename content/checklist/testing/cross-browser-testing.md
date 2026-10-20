---
title: Testy we wszystkich głównych przeglądarkach
priority: high
---

Chrome, Firefox, Safari (także na iOS, gdzie w praktyce wszystkie przeglądarki używają silnika WebKit) i Edge. Playwright uruchamia te same testy w Chromium, Firefox i WebKit; prawdziwe Safari i nietypowe konfiguracje sprawdza się w chmurze urządzeń.

## Dlaczego to ważne

- Silniki różnią się w szczegółach: obsługa nowszych API CSS i JS, pól formularzy, przewijania i fokusu; błąd widoczny tylko w Safari dotyka wszystkich użytkowników iPhone'ów.
- Baseline (web.dev) mówi, które funkcje działają we wszystkich głównych silnikach; funkcje spoza Baseline wymagają testu i fallbacku.
- WebKit w Playwright to nie jest dokładnie Safari, ale tanim kosztem, w każdym PR, łapie większość różnic silnika.

## Jak sprawdzić

Macierz przeglądarek jako projekty Playwright w CI; przed wydaniem przegląd w prawdziwym Safari na macOS i iOS lub w BrowserStack albo Sauce Labs.

## Kod

```ts title="playwright.config.ts"
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  retries: process.env.CI ? 2 : 0,
  use: { baseURL: 'http://localhost:3000', trace: 'on-first-retry' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'edge', use: { ...devices['Desktop Edge'], channel: 'msedge' } },
    // Mobile viewport, touch and user agent emulation on the real engines
    { name: 'mobile-safari', use: { ...devices['iPhone 15'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
  ],
  webServer: { command: 'npm run start', url: 'http://localhost:3000', reuseExistingServer: !process.env.CI },
});
```

## Częste błędy

- Testowanie wyłącznie w Chrome, bo "wszyscy go używają".
- Używanie nowej funkcji CSS lub JS bez sprawdzenia jej statusu Baseline i bez `@supports` lub fallbacku.
