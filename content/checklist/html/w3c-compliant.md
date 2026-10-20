---
title: Poprawny HTML
priority: high
sources:
  - title: "W3C: Markup Validation Service"
    url: https://validator.w3.org/
---

Walidacja wyłapuje niezamknięte tagi, błędne zagnieżdżenia i nieistniejące atrybuty, które przeglądarki "naprawiają" na różne sposoby.

## Dlaczego to ważne

- Parser HTML poprawia błędy według własnego algorytmu: `div` wewnątrz `p` zamyka akapit, a zagnieżdżony `form` jest ignorowany, więc DOM różni się od tego, co napisano.
- Błędna struktura psuje drzewo dostępności (np. `li` poza listą) i powoduje błędy hydracji w React, gdy serwer i przeglądarka zbudują inny DOM.
- Walidator wyłapuje literówki w atrybutach (`scr`, `aria-lable`), których przeglądarka nie zgłosi.

## Jak sprawdzić

W3C Markup Validation Service (Nu Html Checker) lub html-validate w CI na zbudowanych stronach.

## Kod

```html title="Źle"
<p>Cena zawiera: <div>przelot, transfer, ubezpieczenie</div></p> <!-- p auto-closes before div -->
<ul><div><li>All inclusive</li></div></ul>                          <!-- div is not allowed in ul -->
<img scr="/img/hotel.avif" alt="Hotel Aegean Blue">                 <!-- typo, image never loads -->
```

```bash title="CI"
# Validate the generated HTML in CI
npx html-validate "dist/**/*.html"
```

```json title=".htmlvalidate.json"
{
  "extends": ["html-validate:recommended"],
  "rules": {
    "no-inline-style": "off"
  }
}
```

## Częste błędy

- Walidowanie tylko szablonów źródłowych zamiast HTML wygenerowanego po SSR.
