---
title: Poprawny składniowo JSON-LD
priority: medium
sources:
  - title: "Schema.org: Schema Markup Validator"
    url: https://validator.schema.org/
---

Błąd składni (np. przecinek na końcu) unieważnia cały blok. Wartości muszą odpowiadać typom schema.org i treści widocznej na stronie.

## Dlaczego to ważne

- Jeden przecinek za ostatnim elementem albo nieescapowany cudzysłów w nazwie hotelu unieważnia cały blok, a z nim wszystkie rich results strony.
- Poprawna składnia to nie wszystko: cena jako `"od 2 499 zł"` zamiast `2499` czy data `12.08.2026` zamiast ISO 8601 nie zostaną poprawnie zinterpretowane.
- Generowanie przez `JSON.stringify` z obiektów (zamiast sklejania stringów w szablonie) eliminuje większość błędów składni.

## Jak sprawdzić

Schema Markup Validator, Rich Results Test, test w CI parsujący każdy blok `application/ld+json`.

## Kod

```json title="Źle"
{
  "@type": "Offer",
  "price": "od 2 499 zł",
  "priceCurrency": "PLN",
  "validFrom": "12.08.2026",
}
```

```ts title="Dobrze: test w CI (Playwright)"
import { test, expect } from "@playwright/test";

test("offer page has parseable JSON-LD with numeric price", async ({ page }) => {
  await page.goto("/oferty/kreta-hotel-olimp");
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(blocks.length).toBeGreaterThan(0);
  for (const raw of blocks) {
    const data = JSON.parse(raw); // throws on syntax errors
    if (data["@type"] === "Product") {
      expect(String(data.offers.price)).toMatch(/^\d+(\.\d{1,2})?$/);
    }
  }
});
```

## Częste błędy

- Ręcznie edytowany JSON-LD w polu CMS bez walidacji.
