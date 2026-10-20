---
title: Dostępne breadcrumbs
priority: medium
sources:
  - title: "W3C APG: Breadcrumb Pattern"
    url: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
---

`<nav aria-label="Ścieżka">` z listą `<ol>`, ostatni element z `aria-current="page"`. Plus BreadcrumbList w danych strukturalnych.

## Dlaczego to ważne

- Breadcrumbs pokazują, gdzie użytkownik jest w hierarchii (Grecja, Kreta, hotel), i pozwalają jednym kliknięciem wrócić do listy ofert.
- `nav` z etykietą tworzy landmark, `ol` ogłasza liczbę poziomów, a `aria-current="page"` informuje, że to bieżąca strona.
- BreadcrumbList pomaga Google zrozumieć strukturę serwisu i może zastąpić surowy adres URL ścieżką w wynikach wyszukiwania.

## Jak sprawdzić

Odczyt czytnikiem ekranu, Rich Results Test.

## Kod

```html
<nav aria-label="Ścieżka">
  <ol class="breadcrumbs">
    <li><a href="/">Strona główna</a></li>
    <li><a href="/wakacje/grecja">Grecja</a></li>
    <li><a href="/wakacje/grecja/kreta">Kreta</a></li>
    <li><a href="/hotel/aegean-blue" aria-current="page">Hotel Aegean Blue</a></li>
  </ol>
</nav>
```

```json title="JSON-LD"
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Grecja", "item": "https://example.pl/wakacje/grecja" },
    { "@type": "ListItem", "position": 2, "name": "Kreta", "item": "https://example.pl/wakacje/grecja/kreta" },
    { "@type": "ListItem", "position": 3, "name": "Hotel Aegean Blue" }
  ]
}
```

## Częste błędy

- Separatory ">" lub "/" jako tekst w HTML: czytnik je odczytuje; narysuj je w CSS (np. obrócone obramowanie) lub użyj ikony SVG z `aria-hidden="true"`.
