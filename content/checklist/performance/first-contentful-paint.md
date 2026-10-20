---
title: FCP poniżej 1,8 s
priority: high
sources:
  - title: "web.dev: First Contentful Paint"
    url: https://web.dev/articles/fcp
---

Pierwszy tekst lub obraz pojawia się w ciągu 1,8 s, co daje użytkownikowi sygnał, że strona działa. FCP zależy głównie od TTFB i zasobów blokujących renderowanie (CSS, synchroniczne skrypty, fonty).

## Dlaczego to ważne

- Biały ekran jest dla użytkownika nieodróżnialny od awarii; po kilku sekundach bez reakcji wielu wciska Wstecz, zanim cokolwiek zobaczy.
- FCP to dolna granica LCP: dopóki nic się nie wyrenderowało, największy element też nie może się pojawić.
- Na wolnej sieci komórkowej każdy blokujący plik w `<head>` to dodatkowy round-trip, często kilkaset milisekund.

## Jak sprawdzić

Lighthouse, PageSpeed Insights (field i lab), filmstrip w WebPageTest lub panelu Performance: pierwsza klatka z treścią.

## Kod

```html title="Kolejność w head przyspieszająca FCP"
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Last minute Grecja | Example</title>
  <!-- Small critical CSS inline: header, hero, search form -->
  <style>header{height:64px}.hero{aspect-ratio:16/9;background:#e8eef5}</style>
  <link rel="preload" href="/fonts/inter-latin-ext.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/css/main.4f9a1c.css">
  <!-- Scripts never block parsing -->
  <script src="/js/app.8d21e0.js" type="module"></script>
</head>
```

## Częste błędy

- Strona renderowana wyłącznie po stronie klienta: do czasu pobrania i wykonania bundla użytkownik widzi pusty `<div id="root">`.
