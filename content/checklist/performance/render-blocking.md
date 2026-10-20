---
title: Bez zasobów blokujących renderowanie
priority: medium
---

Skrypty bez `defer`/`async` i duże arkusze CSS w `<head>` opóźniają FCP. Krytyczne CSS inline lub w małym pliku, reszta asynchronicznie, skrypty z `defer` lub `type="module"`.

## Dlaczego to ważne

- Synchroniczny `<script>` w `<head>` zatrzymuje parser HTML do czasu pobrania i wykonania pliku; jeśli serwer skryptu jest wolny, użytkownik patrzy na biały ekran.
- Skrypt firmy trzeciej w `<head>` bez `async` uzależnia działanie całej strony od dostępności cudzego serwera (single point of failure).
- `defer` zachowuje kolejność wykonania i uruchamia skrypty po sparsowaniu HTML, więc zwykle jest bezpiecznym zamiennikiem.

## Jak sprawdzić

Insight o zapytaniach blokujących renderowanie w Lighthouse i DevTools Performance, oznaczenie "Render blocking" w szczegółach zapytania w panelu Performance.

## Kod

```html title="Źle"
<head>
  <script src="/js/vendor.js"></script>
  <script src="/js/app.js"></script>
  <link rel="stylesheet" href="/css/all.css"> <!-- 180 KB, incl. admin and print -->
</head>
```

```html title="Dobrze"
<head>
  <style>/* critical above-the-fold CSS, a few KB */</style>
  <link rel="stylesheet" href="/css/main.4c2e.css">
  <link rel="stylesheet" href="/css/print.71d0.css" media="print">
  <script src="/js/app.8d21.js" type="module"></script> <!-- deferred by default -->
  <script src="https://analytics.example.com/a.js" async></script>
</head>
```

## Częste błędy

- Wzorzec `media="print" onload="this.media='all'"` dla głównego CSS bez krytycznych stylów inline: strona najpierw renderuje się bez stylów, potem przeskakuje (FOUC i CLS).
