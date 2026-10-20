---
title: Brak niedziałających obrazów
priority: high
---

Obrazy zwracające 404 psują wygląd i zaufanie. Waliduj ścieżki w buildzie, testuj kluczowe szablony i monitoruj błędy na produkcji.

## Dlaczego to ważne

- Pusta ramka w miejscu zdjęcia hotelu wygląda jak porzucona oferta; użytkownik traci zaufanie dokładnie w momencie decyzji o zakupie.
- Każdy błędny adres to zbędne zapytanie i często przesunięcie układu, bo przeglądarka nie zna proporcji brakującego obrazu.
- Obrazy często znikają po migracji CMS, zmianie bucketu lub wygaśnięciu linków z zewnętrznego API dostawcy ofert; bez monitoringu nikt tego nie zauważy.

## Jak sprawdzić

Crawler (np. Screaming Frog) z raportem obrazów 4xx, filtr Img i kolumna Status w Network; automatycznie test end-to-end jak niżej.

## Kod

```ts title="Playwright: test braku zepsutych obrazów"
import { test, expect } from '@playwright/test';

for (const path of ['/', '/wakacje/grecja', '/hotel/aegean-blue']) {
  test(`no broken images on ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); // trigger lazy images
    await page.waitForLoadState('networkidle');
    const broken = await page.$$eval('img', (imgs) =>
      imgs
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.currentSrc || img.src),
    );
    expect(broken).toEqual([]);
  });
}
```

## Częste błędy

- Testowanie tylko strony głównej, a pomijanie szablonów ofert z obrazami z zewnętrznych API.
