---
title: Schema BreadcrumbList
priority: medium
sources:
  - title: "Google: Breadcrumb structured data"
    url: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
---

Dane `BreadcrumbList` opisują położenie strony w hierarchii serwisu; Google może pokazać tę ścieżkę w wyniku zamiast surowego URL (obecnie w wynikach na komputerach).

## Dlaczego to ważne

- Ścieżka "example.pl > Wakacje > Grecja > Kreta" mówi użytkownikowi więcej niż długi adres i zachęca do kliknięcia.
- Pomaga Google zrozumieć strukturę serwisu także wtedy, gdy URL jest płaski (np. `/p/48213`).
- Wymagane są co najmniej 2 elementy `ListItem` z `position`, `name` i `item`; ostatni element może nie mieć `item`, wtedy Google użyje adresu bieżącej strony.

## Jak sprawdzić

Rich Results Test; ścieżka w JSON-LD odpowiada okruszkom widocznym na stronie.

## Kod

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Wakacje", "item": "https://example.pl/wakacje" },
    { "@type": "ListItem", "position": 2, "name": "Grecja", "item": "https://example.pl/wakacje/grecja" },
    { "@type": "ListItem", "position": 3, "name": "Kreta" }
  ]
}
</script>
```

## Częste błędy

- Okruszki w JSON-LD niezgodne z widoczną nawigacją.
- Ścieżka odwzorowująca strukturę URL zamiast typowej drogi użytkownika.
