---
title: Preconnect do krytycznych domen zewnętrznych
priority: medium
---

`<link rel="preconnect">` do 1-3 domen, z których zasoby są potrzebne od razu (CDN obrazów, API, fonty), oszczędza DNS, TCP i TLS. Dla domen mniej pilnych wystarczy `dns-prefetch`.

## Dlaczego to ważne

- Nawiązanie bezpiecznego połączenia z nową domeną to zwykle 2-3 round-tripy; na sieci mobilnej łatwo przekroczyć 300 ms, zanim pobierze się pierwszy bajt obrazu.
- Każde otwarte połączenie kosztuje CPU (szczególnie TLS) i jest zamykane po kilku sekundach bez użycia, więc preconnect do kilkunastu domen więcej szkodzi niż pomaga.
- Dla fontów i zasobów pobieranych w trybie CORS potrzebny jest atrybut `crossorigin`, bo przeglądarka używa wtedy osobnego połączenia.

## Jak sprawdzić

Insight o drzewie zależności sieciowych w Lighthouse i DevTools (sugestie preconnect oraz ostrzeżenia o nieużytych połączeniach), faza "Initial connection" w waterfall.

## Kod

```html
<!-- Images from CDN needed for the hero: regular connection -->
<link rel="preconnect" href="https://img.example-cdn.pl">
<!-- Fonts are fetched in CORS mode: crossorigin is required -->
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<!-- Needed later (map on scroll): DNS only -->
<link rel="dns-prefetch" href="https://tiles.example-maps.com">
```

## Częste błędy

- Preconnect do domen analityki i reklam, które i tak powinny ładować się później.
