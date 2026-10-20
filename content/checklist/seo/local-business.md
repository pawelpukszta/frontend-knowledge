---
title: Schema LocalBusiness
priority: medium
---

Dane strukturalne LocalBusiness (w najbardziej szczegółowym podtypie, np. `TravelAgency`) z nazwą, pełnym adresem, telefonem, godzinami otwarcia i współrzędnymi, zgodne z treścią strony.

## Dlaczego to ważne

- Google wymaga tylko `name` i `address`, ale telefon z kodem kraju, godziny i `geo` (min. 5 miejsc po przecinku) pomagają poprawnie powiązać stronę z konkretną lokalizacją.
- `openingHoursSpecification` obsługuje sezonowość (`validFrom`, `validThrough`), co ma znaczenie dla biur w kurortach czynnych tylko latem.
- Każdy oddział powinien mieć własną stronę z własnym blokiem LocalBusiness; jeden wspólny blok dla 30 salonów nic nie mówi o żadnym z nich.

## Jak sprawdzić

Rich Results Test i Schema Markup Validator; porównaj dane w JSON-LD z widoczną treścią i z Google Business Profile.

## Kod

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "name": "Example Travel Warszawa Centrum",
  "url": "https://example.pl/biura/warszawa-centrum",
  "telephone": "+48221234567",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "ul. Marszałkowska 100",
    "postalCode": "00-026",
    "addressLocality": "Warszawa",
    "addressCountry": "PL"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 52.22977, "longitude": 21.01178 },
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "opens": "09:00", "closes": "19:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "10:00", "closes": "15:00" }
  ]
}
</script>
```

## Częste błędy

- Godziny w JSON-LD inne niż na stronie i w Google Business Profile, bo każde miejsce aktualizuje inna osoba.
- `aggregateRating` z opiniami o własnej firmie; Google przewiduje to pole dla serwisów zbierających opinie o innych firmach.
