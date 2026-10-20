---
title: Niekrytyczny CSS nie blokuje renderowania
priority: high
---

Style dla innych mediów (`media="print"`) i niekrytyczne arkusze ładuj asynchronicznie (preload + zmiana `rel`, podział na trasy).

## Dlaczego to ważne

- Każdy `<link rel="stylesheet">` bez atrybutu `media` (lub z pasującym) blokuje pierwsze malowanie, nawet jeśli dotyczy stopki czy modala, którego nikt nie otworzy.
- Arkusz z niepasującym `media` (np. `print`) przeglądarka pobiera z niskim priorytetem i nie czeka na niego z renderowaniem.
- Podział CSS na trasy w bundlerze sprawia, że strona listy ofert nie pobiera stylów panelu rezerwacji.

## Jak sprawdzić

Lighthouse i Insights w DevTools Performance (zasoby blokujące renderowanie); w Network sprawdź priorytety arkuszy.

## Kod

```html
<!-- Only applies when printing: does not block rendering -->
<link rel="stylesheet" href="/css/print.css" media="print" />
<!-- Wide-screen extras: non-blocking on phones -->
<link rel="stylesheet" href="/css/desktop.css" media="(width >= 64rem)" />
<!-- Non-critical styles loaded after first paint -->
<link rel="preload" href="/css/widgets.css" as="style"
      onload="this.onload=null; this.rel='stylesheet'" />
<noscript><link rel="stylesheet" href="/css/widgets.css" /></noscript>
```

## Częste błędy

- Asynchroniczne ładowanie stylów widocznych od razu, co daje mignięcie niewystylowanej treści (FOUC) i przesunięcia układu (CLS).
