---
title: Daty publikacji i aktualizacji
priority: medium
sources:
  - title: "Google: Influence your byline dates"
    url: https://developers.google.com/search/docs/appearance/publication-dates
---

Widoczna data publikacji i ostatniej aktualizacji, oznaczona elementem `<time datetime>`, oraz te same daty w `datePublished` i `dateModified` w danych strukturalnych (ISO 8601 ze strefą czasową).

## Dlaczego to ważne

- Data pomaga ocenić aktualność: ktoś szukający "warunki wjazdu do Turcji" od razu odrzuci tekst sprzed trzech lat.
- Bez strefy czasowej Google przyjmuje strefę Googlebota, więc data może przesunąć się o dzień.
- Rozbieżność między datą widoczną a znacznikami utrudnia Google wybór właściwej daty; Google zaleca też usunąć inne daty, które mogą mylić.

## Jak sprawdzić

Sprawdź szablon artykułu: widoczne daty z etykietą ("Opublikowano", "Zaktualizowano"), atrybut `datetime` i zgodny JSON-LD (Rich Results Test).

## Kod

```html
<p class="meta">
  Opublikowano <time datetime="2025-03-12T09:00:00+01:00">12 marca 2025</time>,
  zaktualizowano <time datetime="2026-09-30T14:20:00+02:00">30 września 2026</time>
</p>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Warunki wjazdu do Turcji w 2026 roku",
  "datePublished": "2025-03-12T09:00:00+01:00",
  "dateModified": "2026-09-30T14:20:00+02:00"
}
</script>
```

## Częste błędy

- Data wydarzenia (np. termin wylotu) w `datePublished` zamiast daty publikacji strony.
- Daty z przyszłości, np. ustawione z wyprzedzeniem dla zaplanowanych publikacji.
