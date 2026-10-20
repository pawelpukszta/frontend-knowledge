---
title: Schema Product
priority: medium
sources:
  - title: "Google: Product structured data"
    url: https://developers.google.com/search/docs/appearance/structured-data/product
---

Dla e-commerce: `Product` z `name`, `image`, `description` i `offers` (`Offer` z `price`, `priceCurrency`, `availability`), opcjonalnie oceny. Umożliwia wyniki produktowe z ceną, dostępnością i gwiazdkami.

## Dlaczego to ważne

- Cena i dostępność widoczne już w wynikach przyciągają osoby gotowe do zakupu, a odsiewają te, dla których oferta jest za droga; ruch z wyników lepiej konwertuje.
- Google porównuje cenę z JSON-LD z ceną na stronie (i w Merchant Center); rozbieżności blokują rich result i generują ostrzeżenia.
- Dla ofert terminowych (wycieczki, noclegi) `priceValidUntil` i aktualna `availability` chronią przed pokazywaniem nieaktualnej ceny.

## Jak sprawdzić

Rich Results Test, raport Merchant listings w Search Console.

## Kod

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Kreta, Hotel Olimp 4*, 7 nocy all inclusive",
  "image": ["https://example.pl/img/olimp-16x9.jpg", "https://example.pl/img/olimp-1x1.jpg"],
  "description": "Tydzień all inclusive w hotelu przy plaży w Chanii, wylot z Katowic.",
  "sku": "KRE-OLIMP-7AI",
  "brand": { "@type": "Brand", "name": "Example Podróże" },
  "offers": {
    "@type": "Offer",
    "url": "https://example.pl/oferty/kreta-hotel-olimp",
    "price": 3499.00,
    "priceCurrency": "PLN",
    "priceValidUntil": "2026-10-31",
    "availability": "https://schema.org/InStock"
  }
}
</script>
```

## Częste błędy

- Cena z walutą lub spacjami w `price` ("3 499 zł") zamiast liczby.
- Cena "od" w JSON-LD, a na stronie inna po wybraniu terminu.
