---
title: Bez danych strukturalnych na stronach noindex
priority: high
---

Dane strukturalne na stronach wykluczonych z indeksu są bezużyteczne i zwykle oznaczają błąd konfiguracji, np. noindex na kopii strony produktowej albo schema wklejana globalnie w layout.

## Dlaczego to ważne

- Rich results pojawiają się tylko dla zaindeksowanych stron, więc `Product` na stronie z noindex nigdy nie da ceny ani gwiazdek w wynikach.
- To zwykle sygnał większego problemu: noindex trafił przypadkiem na szablon ofert albo JSON-LD produktu renderuje się też w koszyku i podglądzie wydruku.
- Zbędny JSON-LD to dodatkowe kilobajty HTML na każdej takiej stronie.

## Jak sprawdzić

Crawler z ekstrakcją JSON-LD i dyrektyw robots: przefiltruj strony, które mają jednocześnie noindex i dane strukturalne.

## Kod

```tsx title="app/oferty/[slug]/page.tsx"
export default async function OfferPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const offer = await getOffer(slug);
  return (
    <>
      {/* Emit Product schema only for pages we actually want indexed */}
      {offer.isIndexable && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(toProductSchema(offer)).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <OfferDetails offer={offer} />
    </>
  );
}
```

## Częste błędy

- Rozbudowany JSON-LD na stronach wyników wyszukiwania wewnętrznego, które mają noindex.
