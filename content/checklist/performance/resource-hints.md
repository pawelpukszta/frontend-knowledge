---
title: Resource hints
priority: high
sources:
  - title: "web.dev: Preload critical assets"
    url: https://web.dev/articles/preload-critical-assets
---

`preload` dla zasobów bieżącej strony odkrywanych późno, `preconnect` do kluczowych domen, `dns-prefetch` jako tańszy wariant dla pozostałych, `prefetch` dla zasobów następnej nawigacji. Nadmiar hintów szkodzi, bo konkurują o łącze.

## Dlaczego to ważne

- Dobrze dobrany `preload` obrazu LCP lub fontu potrafi skrócić LCP o kilkaset milisekund, bo zasób startuje razem z HTML zamiast po CSS lub JS.
- Hinty są tylko wskazówkami: zbędny `preload` zabiera pasmo krytycznym zasobom, a przeglądarka ostrzega w konsoli o zasobach preloadowanych i nieużytych.
- Te same hinty można wysłać nagłówkiem `Link` lub w odpowiedzi 103 Early Hints, zanim serwer wygeneruje HTML.

## Jak sprawdzić

Head strony i kolejność w waterfall; ostrzeżenia w konsoli ("preloaded but not used within a few seconds"); insight o drzewie zależności sieciowych w Lighthouse.

## Kod

```html
<!-- Current page: late-discovered resources -->
<link rel="preload" href="/img/hero-santorini-1200.avif" as="image" fetchpriority="high"
      imagesrcset="/img/hero-santorini-800.avif 800w, /img/hero-santorini-1200.avif 1200w"
      imagesizes="100vw">
<!-- Connections needed right away -->
<link rel="preconnect" href="https://img.example-cdn.pl">
<link rel="dns-prefetch" href="https://maps.example.com">
<!-- Likely next navigation: low priority, idle time -->
<link rel="prefetch" href="/js/checkout.5e1a.js" as="script">
```

```http title="Te same wskazówki jako 103 Early Hints"
HTTP/1.1 103 Early Hints
link: </css/main.4c2e.css>; rel=preload; as=style
link: <https://img.example-cdn.pl>; rel=preconnect
```

## Częste błędy

- Preload fontu bez atrybutu `crossorigin`: font zostanie pobrany dwukrotnie.
