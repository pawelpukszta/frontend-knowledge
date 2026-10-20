---
title: Meta tagi tylko w head
priority: high
sources:
  - title: "Google: Use valid page metadata"
    url: https://developers.google.com/search/docs/crawling-indexing/valid-page-metadata
---

`<title>`, `<meta>` i `<link rel="canonical">` muszą znaleźć się w `<head>`; w `<body>` wyszukiwarki je ignorują. Head bywa zamykany za wcześnie przez niedozwolony element (np. `<img>`, `<iframe>`, `<div>`) albo tagi trafiają do body przez skrypt.

## Dlaczego to ważne

- Parser HTML na pierwszym niedozwolonym elemencie niejawnie zamyka `<head>`; wszystko dalej, łącznie z canonical i robots, ląduje w `<body>`.
- Google wprost zapowiada, że po nieprawidłowym elemencie w head ignoruje wszystkie kolejne elementy head (dozwolone są tylko `title`, `meta`, `link`, `script`, `style`, `base`, `noscript`, `template`).
- Błąd jest niewidoczny dla użytkownika i często pojawia się po dodaniu piksela marketingowego przez menedżer tagów.

## Jak sprawdzić

Porównaj źródło strony z wyrenderowanym DOM (DevTools, panel Elements): czy canonical, robots i hreflang są w head; walidator HTML (validator.w3.org) wskaże niedozwolone elementy.

## Kod

```html title="Źle"
<head>
  <title>Wakacje w Grecji | Example Travel</title>
  <img src="https://tracker.example.com/px.gif" alt=""> <!-- implicitly closes <head> -->
  <link rel="canonical" href="https://example.pl/wakacje/grecja"> <!-- now in <body>, ignored -->
</head>
```

```html title="Dobrze"
<head>
  <title>Wakacje w Grecji | Example Travel</title>
  <link rel="canonical" href="https://example.pl/wakacje/grecja">
</head>
<body>
  <noscript><img src="https://tracker.example.com/px.gif" alt=""></noscript>
```

## Częste błędy

- Wstawianie meta tagów skryptem do `body`; w Next.js używaj Metadata API, a w React 19 `<title>` i `<meta>` renderowane w komponencie są automatycznie przenoszone do head.
