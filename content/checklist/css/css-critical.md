---
title: Krytyczny CSS inline
priority: high
sources:
  - title: "web.dev: Extract critical CSS"
    url: https://web.dev/articles/extract-critical-css
---

Style potrzebne do wyrenderowania treści nad zgięciem wstawione w `<style>` w head, reszta ładowana asynchronicznie. Skraca FCP i LCP.

## Dlaczego to ważne

- Zewnętrzny arkusz blokuje renderowanie: na wolnym mobilnym łączu każdy dodatkowy round trip po CSS to setki milisekund pustego ekranu.
- Krytyczny CSS mieszczący się razem z HTML w pierwszych ok. 14 kB odpowiedzi pozwala narysować pierwszy widok już po pierwszym pakiecie danych.
- Szybszy LCP (próg dobrego wyniku 2,5 s) to lepsza ocena Core Web Vitals i mniej porzuceń strony wyników wyszukiwania.

## Jak sprawdzić

Lighthouse i panel Performance (insight dotyczący zasobów blokujących renderowanie), test z ograniczeniem sieci "Slow 4G".

## Kod

```html
<head>
  <style>
    /* Critical: generated at build time (e.g. Critters/Beasties), above-the-fold only */
    :root { --bg: #fff; --text: #1c1f24; }
    body { margin: 0; font-family: system-ui, sans-serif; color: var(--text); }
    .hero { min-block-size: 60vh; display: grid; place-items: center; }
  </style>
  <link rel="preload" href="/css/main.css" as="style" />
  <link rel="stylesheet" href="/css/main.css" media="print" onload="this.media='all'" />
  <noscript><link rel="stylesheet" href="/css/main.css" /></noscript>
</head>
```

## Częste błędy

- Wstawienie inline całego arkusza (setki kB), co spowalnia HTML i wyłącza cache CSS.
- Atrybut `onload` jest inline handlerem; przy restrykcyjnym CSP potrzebny jest skrypt z nonce lub hash.
