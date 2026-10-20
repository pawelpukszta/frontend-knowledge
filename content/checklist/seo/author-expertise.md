---
title: Pokaż kwalifikacje autora
priority: medium
sources:
  - title: "Google: Profile page structured data"
    url: https://developers.google.com/search/docs/appearance/structured-data/profile-page
---

Profil autora z bio, doświadczeniem i kwalifikacjami (np. "pilotka wycieczek od 10 lat, licencja przewodnika") oraz linkami do zewnętrznych profili wzmacnia sygnały E-E-A-T.

## Dlaczego to ważne

- Doświadczenie (pierwsze "E" w E-E-A-T, dodane w grudniu 2022 r.) oceniane jest m.in. po tym, czy autor faktycznie robił to, o czym pisze.
- Linki `sameAs` do LinkedIn, publikacji czy wystąpień pozwalają powiązać autora z jego reputacją poza serwisem.
- W tematach YMYL wytyczne dla oceniających oczekują kwalifikacji autora lub recenzenta (lekarz medycyny podróży, radca prawny).

## Jak sprawdzić

Sprawdź strony autorów: bio, zdjęcie, kwalifikacje, lista tekstów, dane ProfilePage (Rich Results Test) i link z każdego artykułu.

## Kod

```html title="Strona /autorzy/anna-nowak"
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "dateModified": "2026-09-14T10:00:00+02:00",
  "mainEntity": {
    "@type": "Person",
    "name": "Anna Nowak",
    "jobTitle": "Pilotka wycieczek",
    "description": "Od 2016 r. prowadzi wycieczki objazdowe po Grecji i Cyprze.",
    "image": "https://example.pl/img/autorzy/anna-nowak.jpg",
    "knowsAbout": ["Kreta", "Rodos", "turystyka rodzinna"],
    "sameAs": ["https://www.linkedin.com/in/anna-nowak-example"]
  }
}
</script>
```

## Częste błędy

- Bio z szablonu ("ekspertka od podróży z pasją") bez faktów, które da się sprawdzić.
