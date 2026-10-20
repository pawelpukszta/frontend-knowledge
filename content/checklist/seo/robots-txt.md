---
title: Plik robots.txt
priority: high
---

Plik w katalogu głównym domeny z poprawnymi regułami i adresem sitemap. Steruje tylko pobieraniem: nie służy do ukrywania stron przed indeksem (do tego jest noindex) ani do ochrony danych.

## Dlaczego to ważne

- Pozwala nie marnować budżetu crawl na niekończące się przestrzenie URL: koszyk, konto, kombinacje sortowania i filtrów.
- Plik jest publiczny: wpis `Disallow: /panel-admina-2026/` wręcz podpowiada atakującym, gdzie szukać; ochroną jest uwierzytelnianie.
- Jeden błąd (`Disallow: /` skopiowany ze stagingu) zatrzymuje crawl całego serwisu; Google zwykle buforuje plik do 24 godzin, więc poprawka też działa z opóźnieniem.

## Jak sprawdzić

Otwórz `/robots.txt` (musi zwracać 200 i `text/plain`); raport robots.txt w Search Console pokazuje pobraną wersję i błędy parsowania.

## Kod

```txt title="robots.txt"
User-agent: *
Disallow: /koszyk
Disallow: /konto/
Disallow: /api/
# Sorting variants add no unique content
Disallow: /*?*sort=

Sitemap: https://example.pl/sitemap.xml
```

```ts title="app/robots.ts"
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.VERCEL_ENV === "production";
  return {
    // Staging blocks everything (plus basic auth); production only private areas
    rules: isProd
      ? { userAgent: "*", disallow: ["/koszyk", "/konto/", "/api/"] }
      : { userAgent: "*", disallow: "/" },
    sitemap: "https://example.pl/sitemap.xml",
  };
}
```

## Częste błędy

- Blokowanie plików CSS i JS; Google nie wyrenderuje strony tak jak użytkownik.
- robots.txt ze stagingu (`Disallow: /`) wdrożony na produkcję.
