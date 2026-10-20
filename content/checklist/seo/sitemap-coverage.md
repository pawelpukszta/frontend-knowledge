---
title: Wszystkie indeksowalne strony w sitemap
priority: medium
---

Sitemap powinna zawierać każdą stronę kanoniczną, którą chcesz mieć w wynikach.

## Dlaczego to ważne

- Sitemap to dla Google lista adresów, które uważasz za kanoniczne; strony spoza niej mogą być odkrywane wolniej, zwłaszcza głęboko w strukturze.
- Raport map witryn w Search Console pozwala porównać przesłane adresy z zaindeksowanymi tylko dla tego, co jest w sitemap; brakujące strony wypadają z tej kontroli.
- Ręcznie utrzymywana sitemap szybko się rozjeżdża; generowana z tej samej bazy co routing obejmuje każdą nową stronę automatycznie.

## Jak sprawdzić

Porównaj crawl z zawartością sitemap.

## Kod

```ts title="app/oferty/sitemap.ts"
import type { MetadataRoute } from "next";
import { countIndexableOffers, getIndexableOffers } from "@/lib/offers";

const PER_FILE = 45_000; // below the 50 000 URL limit per file

export async function generateSitemaps() {
  const total = await countIndexableOffers();
  return Array.from({ length: Math.ceil(total / PER_FILE) }, (_, id) => ({ id }));
}

export default async function sitemap({ id }: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const page = Number(await id);
  const offers = await getIndexableOffers({ offset: page * PER_FILE, limit: PER_FILE });
  return offers.map((o) => ({ url: `https://example.pl/oferty/${o.slug}`, lastModified: o.updatedAt }));
}
```

## Częste błędy

- Sitemap tylko z artykułami bloga, bez kategorii i ofert, które przynoszą przychód.
