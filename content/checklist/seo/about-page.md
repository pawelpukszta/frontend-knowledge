---
title: Strona "O nas"
priority: medium
sources:
  - title: "Google: Organization structured data"
    url: https://developers.google.com/search/docs/appearance/structured-data/organization
---

Strona z konkretami: kim jesteście, od kiedy działacie, kto stoi za firmą, dane rejestrowe i osiągnięcia. Podlinkowana z każdej strony, zwykle w stopce.

## Dlaczego to ważne

- Wytyczne dla oceniających jakość każą sprawdzać, kto odpowiada za witrynę; brak takiej informacji to sygnał niskiego zaufania, szczególnie przy sprzedaży wycieczek.
- Klient przed pierwszą rezerwacją u mniej znanego biura szuka dowodów, że firma istnieje naprawdę: zdjęć zespołu, roku założenia, numeru w rejestrze.
- Google zaleca umieszczenie danych strukturalnych Organization na stronie głównej albo właśnie na stronie "O nas".

## Jak sprawdzić

Sprawdź, czy strona istnieje, jest podlinkowana w stopce, zawiera konkretne dane (nie same hasła marketingowe) i ma JSON-LD zgodny z treścią (Rich Results Test).

## Kod

```html title="JSON-LD na stronie /o-nas"
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "url": "https://example.pl/o-nas",
  "mainEntity": {
    "@type": "TravelAgency",
    "@id": "https://example.pl/#organization",
    "name": "Example Travel",
    "legalName": "Example Travel sp. z o.o.",
    "foundingDate": "2009",
    "numberOfEmployees": { "@type": "QuantitativeValue", "value": 85 },
    "vatID": "PL1234567890",
    "url": "https://example.pl"
  }
}
</script>
```

## Częste błędy

- Ogólniki ("jesteśmy pasjonatami podróży") bez nazwisk, dat i danych firmy.
