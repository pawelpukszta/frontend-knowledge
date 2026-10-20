---
title: Jak testować dostępność
level: mid
tags:
  - axe
  - Lighthouse
  - screen reader
  - Testing Library
  - testy
summary: Automaty (axe, Lighthouse) wykrywają tylko część problemów. Resztę znajdziesz testem klawiaturą, czytnikiem ekranu i przeglądem kodu.
sources:
  - title: "Deque: axe-core"
    url: https://github.com/dequelabs/axe-core
  - title: "Testing Library: ByRole"
    url: https://testing-library.com/docs/queries/byrole/
  - title: "Chrome DevTools: Accessibility features reference"
    url: https://developer.chrome.com/docs/devtools/accessibility/reference
---

## Wyjaśnienie

1. **Automatyczne narzędzia**: axe DevTools, Lighthouse Accessibility, eslint-plugin-jsx-a11y, `@axe-core/playwright` w testach E2E. Wykrywają brak alt, labeli, słaby kontrast, złe ARIA. Szacunkowo około 30-40% problemów.
2. **Test klawiaturą**: przejdź całą ścieżkę (np. wyszukiwanie → oferta → rezerwacja) tylko Tab, Shift+Tab, Enter, Spacja, strzałki, Escape. Czy focus jest widoczny i logiczny? Czy nic nie "łapie" focusu?
3. **Czytnik ekranu**: VoiceOver (macOS/iOS), NVDA (Windows, darmowy), TalkBack (Android).
4. **DevTools**: panel Accessibility (drzewo dostępności, nazwy, role), emulacja wad wzroku, sprawdzanie kontrastu.
5. **Powiększenie** do 200-400% i szerokość 320 px.
6. **Testy komponentów**: Testing Library z zapytaniami `getByRole('button', { name: 'Rezerwuj' })` wymusza dostępne nazwy.

## Kod

```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('offer page has no detectable a11y violations', async ({ page }) => {
  await page.goto('/oferty/kreta');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations).toEqual([]);
});
```

## Pytania

### Jak testujesz dostępność w projekcie? {#a11y-testing-q1}

Automatycznie (eslint-plugin-jsx-a11y, axe w testach E2E, Lighthouse w CI) oraz ręcznie: przejście kluczowych ścieżek klawiaturą, test czytnikiem ekranu (NVDA, VoiceOver), powiększenie i kontrast. W testach komponentów używam zapytań po rolach i nazwach.

### Czy wynik 100 w Lighthouse Accessibility oznacza dostępną stronę? {#a11y-testing-q2}

Nie. Automaty sprawdzają tylko część kryteriów, które da się zweryfikować maszynowo. Nie ocenią sensowności tekstów alternatywnych, logiki focusu, zrozumiałości ani działania złożonych widgetów.
