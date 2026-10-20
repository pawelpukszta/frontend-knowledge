---
title: Poprawne dane strukturalne Article
priority: high
sources:
  - title: "Google: Article structured data"
    url: https://developers.google.com/search/docs/appearance/structured-data/article
---

`Article`/`NewsArticle`/`BlogPosting` z `headline`, `image`, `datePublished`, `dateModified` i `author` pomaga Google zrozumieć artykuł i poprawnie pokazać go w wynikach i Discover. Google nie wymaga żadnej z tych właściwości, ale im pełniejsze i zgodne z treścią, tym lepiej.

## Dlaczego to ważne

- Daty w danych strukturalnych pomagają Google wyświetlić właściwą datę przy wyniku; rozjazd z datą widoczną na stronie to częsta przyczyna błędnej daty w SERP.
- Kilka wersji `image` (16:9, 4:3, 1:1) w dobrej rozdzielczości pozwala Google dobrać miniaturę do miejsca wyświetlenia, a duże obrazy (min. 1200 px szerokości) zwiększają szansę na duży podgląd w Discover.
- `author` z adresem strony autora wiąże tekst z konkretnym ekspertem, co wspiera ocenę wiarygodności treści (E-E-A-T).

## Jak sprawdzić

Rich Results Test; porównaj tytuł, daty i autora w JSON-LD z treścią widoczną na stronie.

## Kod

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Kreta we wrześniu: pogoda, ceny i najlepsze plaże",
  "image": [
    "https://example.pl/img/kreta-1x1.jpg",
    "https://example.pl/img/kreta-4x3.jpg",
    "https://example.pl/img/kreta-16x9.jpg"
  ],
  "datePublished": "2026-08-12T09:00:00+02:00",
  "dateModified": "2026-09-30T16:20:00+02:00",
  "author": [{
    "@type": "Person",
    "name": "Anna Kowalska",
    "url": "https://example.pl/autorzy/anna-kowalska"
  }]
}
</script>
```

## Częste błędy

- `dateModified` aktualizowany przy każdym wdrożeniu, a nie przy zmianie treści.
- Nazwa serwisu, "Redakcja" lub "admin" w `author` zamiast osoby.
