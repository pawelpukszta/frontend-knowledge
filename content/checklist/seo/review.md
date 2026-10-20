---
title: Schema Review i AggregateRating
priority: medium
sources:
  - title: "Google: Review snippet structured data"
    url: https://developers.google.com/search/docs/appearance/structured-data/review-snippet
---

Oceny gwiazdkowe w wynikach, tylko dla prawdziwych opinii o konkretnym produkcie lub usłudze. Opinie o własnej firmie na własnej stronie (self-serving) nie kwalifikują się do gwiazdek.

## Dlaczego to ważne

- Gwiazdki przyciągają uwagę w wynikach, ale Google pokazuje je tylko, gdy oceny są widoczne na stronie i pochodzą od użytkowników.
- Self-serving: firma oceniająca samą siebie (`Organization` lub `LocalBusiness` z opiniami z własnej strony) nie dostanie gwiazdek; oceny konkretnego hotelu czy wycieczki w ofercie już tak.
- Fikcyjne lub wybiórczo dobrane opinie łamią wytyczne Google i polskie prawo konsumenckie: od 2023 roku sprzedawca musi informować, czy i jak weryfikuje opinie.

## Jak sprawdzić

Rich Results Test; zgodność z wytycznymi review snippet.

## Kod

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Hotel Olimp 4*, Kreta",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 4.6,
    "bestRating": 5,
    "reviewCount": 318
  },
  "review": [{
    "@type": "Review",
    "author": { "@type": "Person", "name": "Marta K." },
    "datePublished": "2026-09-14",
    "reviewRating": { "@type": "Rating", "ratingValue": 5, "bestRating": 5 },
    "reviewBody": "Świetna plaża i jedzenie, polecamy rodzinom z dziećmi."
  }]
}
</script>
```

## Częste błędy

- Gwiazdki w JSON-LD bez widocznych opinii na stronie.
- Przepisywanie średniej z Map Google lub innego serwisu jako własnych ocen.
