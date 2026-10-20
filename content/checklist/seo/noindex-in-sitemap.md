---
title: Bez stron noindex w sitemap
priority: high
---

Sitemap zawiera tylko strony, które chcesz mieć w indeksie. Adres z `noindex` (w meta tagu lub nagłówku `X-Robots-Tag`) umieszczony w sitemapie to sprzeczny sygnał.

## Dlaczego to ważne

- Sitemap mówi Google "ta strona jest ważna, zaindeksuj ją", a noindex mówi "nie indeksuj"; Search Console zgłasza takie adresy jako błąd w raporcie stron.
- Robot marnuje zapytania na strony, które i tak nie trafią do wyników, zamiast pobierać nowe oferty.
- Zwykle to objaw błędu w architekturze: generator sitemap nie zna reguł indeksowania stosowanych przez szablon strony.

## Jak sprawdzić

Porównaj listę URL z sitemap z dyrektywami robots (crawler w trybie listy); w Search Console sprawdź raport map witryn i stron wykluczonych przez noindex.

## Kod

```ts title="app/sitemap.ts"
import type { MetadataRoute } from "next";
import { getOffers } from "@/lib/offers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const offers = await getOffers();
  return offers
    // Same predicate the page uses for its robots meta: one source of truth
    .filter((offer) => offer.isIndexable && !offer.isArchived)
    .map((offer) => ({
      url: `https://example.pl/oferty/${offer.slug}`,
      lastModified: offer.contentUpdatedAt,
    }));
}
```

## Częste błędy

- Sitemap generowana z całej tabeli w bazie, łącznie z ofertami archiwalnymi oznaczonymi noindex.
- noindex dodany w CDN (nagłówek), o którym generator sitemap nic nie wie.
