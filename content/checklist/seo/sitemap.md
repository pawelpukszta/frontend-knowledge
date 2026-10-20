---
title: Sitemap XML zgłoszona do wyszukiwarek
priority: high
sources:
  - title: "Google: Build and submit a sitemap"
    url: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
---

Mapa witryny pomaga szybciej odkrywać nowe i zmienione strony. Podaj ją w robots.txt (`Sitemap:`) i zgłoś w Search Console oraz Bing Webmaster Tools.

## Dlaczego to ważne

- Nowe oferty i strony głęboko w strukturze (np. hotel osiągalny dopiero po kilku filtrach) zostaną znalezione szybciej niż przez samo podążanie za linkami.
- Zgłoszona sitemap daje w Search Console raport: ile adresów przesłano, ile zaindeksowano i dlaczego reszta nie.
- Dawny "ping" sitemap do Google nie działa od 2023 roku; dziś liczy się wpis w robots.txt, zgłoszenie w Search Console (lub przez API) i rzetelny `lastmod`.

## Jak sprawdzić

Otwórz `/sitemap.xml` (200, typ XML); status przetwarzania w raporcie map witryn w Search Console.

## Kod

```ts title="app/sitemap.ts"
import type { MetadataRoute } from "next";
import { getDestinations } from "@/lib/destinations";

const BASE = "https://example.pl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const destinations = await getDestinations();
  return [
    { url: BASE },
    { url: `${BASE}/last-minute` },
    ...destinations.map((d) => ({
      url: `${BASE}/wakacje/${d.slug}`,
      lastModified: d.contentUpdatedAt, // real content change date
    })),
  ];
}
```

## Częste błędy

- Sitemap dostępna, ale niezgłoszona i nieobecna w robots.txt, więc nikt nie wie o jej istnieniu.
