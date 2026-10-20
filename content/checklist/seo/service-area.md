---
title: Wartościowe strony lokalizacji
priority: medium
sources:
  - title: "Google: Spam policies (doorway abuse)"
    url: https://developers.google.com/search/docs/essentials/spam-policies
---

Każda strona miasta lub regionu ma unikalną treść z lokalnymi szczegółami (oddział, dojazd, wyloty z lokalnego lotniska, zespół), własny title, H1 i opis. Szablony różniące się tylko nazwą miasta to "doorway pages".

## Dlaczego to ważne

- Doorway abuse jest jedną z polityk spamu Google; setki stron "Wakacje z {miasto}" o tej samej treści mogą obniżyć widoczność całego serwisu.
- Realne lokalne informacje (wyloty z Pyrzowic, biuro przy dworcu, godziny otwarcia) odpowiadają na pytanie użytkownika i dobrze konwertują.
- Firma działająca bez lokalu klienta wskazuje obszar działania w Google Business Profile i w `areaServed` (schema.org), zamiast tworzyć fikcyjne oddziały.

## Jak sprawdzić

Porównaj kilka stron lokalizacji (np. raport podobnych treści w crawlerze); sprawdź `areaServed` w schema i czy każda strona ma inne title, H1 i opis.

## Kod

```html title="JSON-LD na stronie /wakacje-z-katowic"
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "name": "Example Travel Katowice",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "ul. Stawowa 5",
    "postalCode": "40-095",
    "addressLocality": "Katowice",
    "addressCountry": "PL"
  },
  "areaServed": [
    { "@type": "City", "name": "Katowice" },
    { "@type": "AdministrativeArea", "name": "województwo śląskie" }
  ]
}
</script>
```

## Częste błędy

- Fałszywe adresy oddziałów w miastach, w których firma nie ma biura.
- Automatyczna podmiana nazwy miasta w jednym tekście dla 300 lokalizacji.
