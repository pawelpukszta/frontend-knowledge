---
title: Myślniki w adresach URL
priority: medium
sources:
  - title: "Google: URL structure best practices"
    url: https://developers.google.com/search/docs/crawling-indexing/url-structure
---

Słowa w URL oddzielaj myślnikami (`/wakacje-w-grecji`), nie podkreśleniami ani spacjami. Google zaleca myślnik jako separator słów.

## Dlaczego to ważne

- Podkreślenie nie jest dla wyszukiwarek tak jednoznacznym separatorem, więc `wakacje_w_grecji` bywa traktowane jak jedno długie słowo.
- Spacje w URL zamieniają się w `%20` i psują się przy kopiowaniu do komunikatorów, maili i SMS-ów.
- Słowa sklejone bez separatora (`wakacjewgrecji`) są nieczytelne dla ludzi w wynikach i przy udostępnianiu.

## Jak sprawdzić

Przegląd struktury URL; crawler: adresy zawierające `_` lub `%20`.

## Kod

```txt
Źle:    https://example.pl/wakacje_w_grecji
Źle:    https://example.pl/wakacje%20w%20grecji
Źle:    https://example.pl/wakacjewgrecji
Dobrze: https://example.pl/wakacje-w-grecji
```

## Częste błędy

- Zmiana separatorów w istniejących adresach bez przekierowań 301.
