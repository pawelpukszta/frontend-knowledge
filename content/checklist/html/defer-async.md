---
title: Skrypty z defer, async lub type=module
priority: high
---

Zwykły `<script>` w head blokuje parsowanie HTML. `defer` lub `type="module"` (kolejność zachowana) dla skryptów aplikacji, `async` dla niezależnych, np. analityki.

## Dlaczego to ważne

- Parser zatrzymuje się na każdym klasycznym skrypcie, pobiera go i wykonuje; na wolnym łączu mobilnym to sekundy białego ekranu i gorsze FCP oraz LCP.
- `defer` wykonuje skrypty w kolejności po sparsowaniu dokumentu, przed `DOMContentLoaded`; `async` uruchamia skrypt zaraz po pobraniu, w dowolnej kolejności, więc nie nadaje się do skryptów zależnych.
- Skrypty `type="module"` są odroczone domyślnie; dodanie do nich `async` uruchamia je od razu po pobraniu.

## Jak sprawdzić

Head strony, Lighthouse (zasoby blokujące renderowanie), panel Performance w DevTools.

## Kod

```html
<head>
  <!-- Bad: blocks HTML parsing -->
  <script src="/js/vendor.js"></script>

  <!-- Good: app code, runs in order after parsing -->
  <script defer src="/js/vendor.js"></script>
  <script defer src="/js/app.js"></script>

  <!-- Good: ES module, deferred by default -->
  <script type="module" src="/js/booking.js"></script>

  <!-- Good: independent third-party script -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
</head>
```

## Częste błędy

- `async` dla skryptu, który zależy od innego (np. wtyczka ładowana przed biblioteką).
- `defer` na skrypcie inline: atrybut działa tylko ze `src`.
