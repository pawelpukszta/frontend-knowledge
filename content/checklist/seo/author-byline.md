---
title: Widoczny autor treści
priority: medium
sources:
  - title: "Google: Article structured data"
    url: https://developers.google.com/search/docs/appearance/structured-data/article
---

Imię i nazwisko autora widoczne przy treści, z linkiem do jego profilu w serwisie, oraz zgodny z tym `author` w danych strukturalnych.

## Dlaczego to ważne

- Czytelnik i oceniający jakość muszą wiedzieć, kto odpowiada za tekst; anonimowy poradnik o ubezpieczeniu podróżnym budzi mniejsze zaufanie.
- Google używa `author.url` lub `sameAs`, by odróżniać autorów o tym samym nazwisku i łączyć ich teksty.
- Profil autora z listą artykułów to dodatkowa wartościowa strona i ścieżka linkowania wewnętrznego.

## Jak sprawdzić

Sprawdź szablony artykułów i poradników: widoczny podpis, link do profilu i zgodność z `author` w JSON-LD (Rich Results Test).

## Kod

```html
<p class="byline">
  Tekst: <a href="/autorzy/anna-nowak" rel="author">Anna Nowak</a>, pilotka wycieczek po Grecji
</p>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Kreta z dziećmi: 7 plaż z łagodnym zejściem do wody",
  "author": [{
    "@type": "Person",
    "name": "Anna Nowak",
    "url": "https://example.pl/autorzy/anna-nowak"
  }]
}
</script>
```

## Częste błędy

- W `author.name` wpisane "Redakcja Example Travel, pilotka Anna Nowak"; Google zaleca samo imię i nazwisko, a stanowisko w `jobTitle`.
- Kilku autorów połączonych w jednym polu `name` zamiast osobnych obiektów `Person`.
