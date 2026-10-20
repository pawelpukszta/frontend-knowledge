---
title: Linki wewnętrzne do kluczowych stron
priority: medium
sources:
  - title: "Google: Link best practices"
    url: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
---

Ważne strony (kategorie, bestsellery) powinny dostawać wiele linków z nawigacji i treści. To główny sposób przekazywania im "mocy" i kontekstu.

## Dlaczego to ważne

- Liczba i jakość linków wewnętrznych to dla Google sygnał, które strony uważasz za najważniejsze; strona dostępna tylko z sitemap dostaje go niewiele.
- Tekst linku daje kontekst: "wakacje na Krecie" mówi więcej niż "kliknij tutaj" lub "więcej".
- Krótka ścieżka (2-3 kliknięcia od strony głównej) przyspiesza odkrywanie i odświeżanie kluczowych stron przez robota.

## Jak sprawdzić

Crawler: liczba linków przychodzących (inlinks) dla kluczowych stron i ich głębokość kliknięć.

## Kod

```html title="Źle"
<p>Szukasz słońca we wrześniu? <a href="/wakacje/grecja/kreta">Kliknij tutaj</a>.</p>
<!-- Not a link for crawlers: no <a href> -->
<div class="tile" onclick="location.href='/last-minute'">Last minute</div>
```

```html title="Dobrze"
<p>Szukasz słońca we wrześniu? Sprawdź
  <a href="/wakacje/grecja/kreta">wakacje na Krecie</a>
  albo <a href="/last-minute">oferty last minute</a>.</p>
```

## Częste błędy

- Kluczowe kategorie dostępne tylko z wyszukiwarki wewnętrznej lub filtrów.
