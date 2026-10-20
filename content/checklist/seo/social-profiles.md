---
title: Linki do aktywnych profili społecznościowych
priority: low
sources:
  - title: "Google: Organization structured data"
    url: https://developers.google.com/search/docs/appearance/structured-data/organization
---

Linki do aktywnych profili marki w stopce oraz w `sameAs` w danych strukturalnych Organization wiążą stronę z tożsamością firmy.

## Dlaczego to ważne

- `sameAs` pomaga Google powiązać serwis z profilami marki i zbudować spójny obraz organizacji.
- Aktywny profil z odpowiedziami na pytania klientów to dodatkowy dowód, że firma działa; porzucony profil sprzed lat działa odwrotnie.
- Ikony bez etykiety tekstowej są nieczytelne dla czytników ekranu; każdy link potrzebuje dostępnej nazwy.

## Jak sprawdzić

Sprawdź stopkę (linki działają, profile są aktywne) i JSON-LD Organization na stronie głównej w Rich Results Test.

## Kod

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://example.pl/#organization",
  "name": "Example Travel",
  "url": "https://example.pl",
  "logo": "https://example.pl/img/logo-512.png",
  "sameAs": [
    "https://www.facebook.com/exampletravel",
    "https://www.instagram.com/exampletravel",
    "https://www.youtube.com/@exampletravel",
    "https://www.linkedin.com/company/example-travel"
  ]
}
</script>
```

## Częste błędy

- Profile w `sameAs`, które nie należą do firmy (np. strona partnera lub hotelu).
