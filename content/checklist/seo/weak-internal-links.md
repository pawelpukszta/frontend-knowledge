---
title: Strony ze zbyt małą liczbą linków wewnętrznych
priority: medium
---

Strony z jednym lub dwoma linkami przychodzącymi są słabo widoczne dla robotów. Dodaj linki z treści i nawigacji.

## Dlaczego to ważne

- Strona z jednym linkiem przychodzącym (np. tylko z 14. strony paginacji) jest rzadko odwiedzana przez robota i dostaje mało sygnałów ważności.
- Bloki "podobne oferty", "popularne w regionie" i linki kontekstowe w artykułach to skalowalny sposób na wzmocnienie wielu stron naraz.
- Analiza linków przychodzących pokazuje też odwrotny problem: setki linków z mega menu do mało ważnych stron rozmywają przekaz.

## Jak sprawdzić

Crawler: rozkład liczby inlinks.

## Kod

```tsx title="components/RelatedOffers.tsx"
import Link from "next/link";
import { getRelatedOffers } from "@/lib/offers";

// Server component: plain <a href> links in the HTML, crawlable without JS
export async function RelatedOffers({ region, excludeSlug }: { region: string; excludeSlug: string }) {
  const offers = await getRelatedOffers({ region, excludeSlug, limit: 6 });
  return (
    <section aria-labelledby="related-title">
      <h2 id="related-title">Podobne oferty w regionie</h2>
      <ul>
        {offers.map((o) => (
          <li key={o.slug}>
            <Link href={`/oferty/${o.slug}`}>{o.title}, od {o.priceFrom} zł</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

## Częste błędy

- Linki "podobne" ładowane dopiero po przewinięciu, przez JS bez SSR.
