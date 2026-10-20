---
title: Schema Organization
priority: medium
sources:
  - title: "Google: Organization structured data"
    url: https://developers.google.com/search/docs/appearance/structured-data/organization
---

`Organization` (lub bardziej szczegółowy typ, np. `TravelAgency`) z nazwą, `url`, `logo`, adresem, danymi kontaktowymi i `sameAs` pomaga Google poprawnie przedstawić markę (panel wiedzy, logo w wynikach). Wystarczy na stronie głównej lub stronie "O nas".

## Dlaczego to ważne

- Google może użyć `logo` przy wynikach i w panelu wiedzy; obraz musi być indeksowalny i mieć co najmniej 112x112 px.
- `sameAs` łączy serwis z profilami w mediach społecznościowych i bazach wiedzy, co ułatwia rozpoznanie marki jako jednego podmiotu, także przez systemy AI.
- Pola identyfikacyjne (`legalName`, `vatID`, `address`) pomagają odróżnić firmę od innych o podobnej nazwie, co ma znaczenie dla zaufania do serwisu sprzedażowego.

## Jak sprawdzić

Rich Results Test na stronie głównej.

## Kod

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "name": "Example Podróże",
  "legalName": "Example Podróże sp. z o.o.",
  "url": "https://example.pl/",
  "logo": "https://example.pl/img/logo-512.png",
  "vatID": "PL1234567890",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "ul. Wakacyjna 10",
    "postalCode": "00-001",
    "addressLocality": "Warszawa",
    "addressCountry": "PL"
  },
  "contactPoint": { "@type": "ContactPoint", "telephone": "+48-22-123-45-67", "contactType": "customer service" },
  "sameAs": ["https://www.facebook.com/examplepodroze", "https://www.instagram.com/examplepodroze"]
}
</script>
```

## Częste błędy

- Logo w białym kolorze na przezroczystym tle, niewidoczne na jasnym tle wyników.
- Ten sam blok Organization z innymi danymi na różnych podstronach.
