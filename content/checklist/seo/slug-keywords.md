---
title: Opisowe słowa w slugach
priority: medium
sources:
  - title: "Google: URL structure best practices"
    url: https://developers.google.com/search/docs/crawling-indexing/url-structure
---

`/wakacje/grecja/kreta` mówi więcej niż `/p?id=123`. Opisowy adres pomaga użytkownikom i wyszukiwarkom.

## Dlaczego to ważne

- Słowa w adresie pokazują w wynikach i przy udostępnianiu, dokąd prowadzi link; `/p?id=123` nic nie mówi.
- Hierarchiczna ścieżka pozwala crawlerom, analityce i raportom Search Console grupować strony według sekcji (np. wszystkie `/wakacje/grecja/`).
- Slug generuj raz z tytułu i nie zmieniaj go przy każdej edycji nazwy; stabilny adres jest ważniejszy niż idealne słowa.

## Jak sprawdzić

Przegląd struktury URL.

## Kod

```txt
Źle:    https://example.pl/p?id=48213
Źle:    https://example.pl/oferta/48213
Dobrze: https://example.pl/wakacje/grecja/kreta
Dobrze: https://example.pl/oferty/kreta-hotel-olimp-48213
```

## Częste błędy

- Upychanie słów kluczowych w slugu (`/tanie-wakacje-grecja-tanie-loty-grecja`).
