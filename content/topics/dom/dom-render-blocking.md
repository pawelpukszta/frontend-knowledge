---
title: "Zasoby blokujące: script, async, defer, type=module"
level: mid
added: 2026-10-20
tags:
  - async
  - defer
  - script
  - render-blocking
  - parser-blocking
summary: Zwykły script zatrzymuje parsowanie HTML. async pobiera w tle i wykonuje od razu po pobraniu, defer pobiera w tle i wykonuje po sparsowaniu dokumentu w kolejności.
sources:
  - title: "MDN: The script element"
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script
  - title: "web.dev: Render-blocking resources (Lighthouse)"
    url: https://developer.chrome.com/docs/lighthouse/performance/render-blocking-resources
  - title: "javascript.info: Scripts: async, defer"
    url: https://javascript.info/script-async-defer
---

## Wyjaśnienie

| Atrybut | Pobieranie | Wykonanie | Kolejność | Kiedy |
|---|---|---|---|---|
| brak | blokuje parser | od razu | tak | unikaj w `<head>` |
| `async` | równolegle | zaraz po pobraniu (przerywa parser) | nie | niezależne skrypty: analityka, reklamy |
| `defer` | równolegle | po sparsowaniu HTML, przed `DOMContentLoaded` | tak | skrypty aplikacji |
| `type="module"` | równolegle | jak `defer` (domyślnie) | tak | nowoczesne ES modules |

CSS: `<link rel="stylesheet">` blokuje render. Style niekrytyczne można ładować z `media="print"` i przełączać albo przez preload. `@import` w CSS tworzy łańcuch zależności (wolniej).

Czcionki: `font-display: swap` pokazuje tekst od razu fontem zastępczym.

## Kod

```html
<head>
  <link rel="preconnect" href="https://cdn.example.com" />
  <link rel="stylesheet" href="/critical.css" />
  <script src="/analytics.js" async></script>
  <script src="/app.js" defer></script>
  <script type="module" src="/main.js"></script>
</head>
```

## Pytania

### Różnica między async a defer? {#dom-render-blocking-q1}

Oba pobierają skrypt równolegle z parsowaniem. `async` wykonuje go natychmiast po pobraniu (przerywając parser, bez gwarancji kolejności). `defer` wykonuje po sparsowaniu całego dokumentu, w kolejności w HTML, przed `DOMContentLoaded`.

### Dlaczego kiedyś umieszczano skrypty na końcu body? {#dom-render-blocking-q2}

Żeby nie blokowały parsowania i pierwszego renderu treści. Dziś ten sam efekt, z wcześniejszym rozpoczęciem pobierania, daje `defer` w `<head>`.

## Quiz

### Który atrybut script gwarantuje wykonanie po sparsowaniu HTML i w kolejności? {#dom-render-blocking-z1}

- [ ] async
- [x] defer
- [ ] nomodule
- [ ] crossorigin

`defer` zachowuje kolejność i czeka na koniec parsowania.
