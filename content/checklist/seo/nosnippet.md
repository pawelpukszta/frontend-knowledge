---
title: Bez nosnippet na ważnych stronach
priority: medium
sources:
  - title: "Google: Robots meta tag specifications"
    url: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
---

`nosnippet` (meta robots lub `X-Robots-Tag`) blokuje opis strony w wynikach i jej użycie jako bezpośredniego źródła w AI Overviews i AI Mode. Do ukrycia fragmentu służy `data-nosnippet` na `span`, `div` lub `section`, a do skrócenia opisu `max-snippet`.

## Dlaczego to ważne

- Wynik bez opisu wygląda na niepełny i zwykle ma wyraźnie niższy CTR niż sąsiednie wyniki.
- `nosnippet` wyklucza stronę także z cytowania w odpowiedziach AI w wyszukiwarce, co dla treści poradnikowych oznacza utratę widoczności.
- Zmiana dyrektyw podglądu działa dopiero po ponownym przetworzeniu strony, co według Google może trwać od dni do miesięcy; przypadkowy `nosnippet` szkodzi długo.

## Jak sprawdzić

Wyszukaj `nosnippet` w HTML, szablonach i nagłówkach `X-Robots-Tag`; sprawdź wygląd wyniku w wyszukiwarce.

## Kod

```html
<!-- Bad: whole offer page without a snippet -->
<meta name="robots" content="nosnippet">

<!-- Good: hide only a fragment (e.g. a subscriber promo code), keep the page snippet -->
<p>Kreta, 7 nocy all inclusive od 2499 zł/os.</p>
<div data-nosnippet>Kod rabatowy dla subskrybentów: LATO27</div>
```

## Częste błędy

- `data-nosnippet` na `<p>` lub `<li>`; Google obsługuje go tylko na `span`, `div` i `section`.
