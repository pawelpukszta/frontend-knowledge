---
title: Właściwa kolejność ładowania CSS
priority: medium
---

Arkusze CSS w head przed skryptami, które od nich zależą; brak `@import` (tworzy łańcuch zapytań). Kolejność plików musi odpowiadać zamierzonej kaskadzie.

## Dlaczego to ważne

- `@import` w CSS przeglądarka odkrywa dopiero po pobraniu i sparsowaniu arkusza nadrzędnego, więc pliki ładują się sekwencyjnie, a render czeka na cały łańcuch.
- Synchroniczny skrypt umieszczony po arkuszu czeka na jego pobranie, bo może czytać style; niepotrzebnie wymieszane skrypty i arkusze opóźniają FCP.
- Przy równej specyficzności wygrywa reguła później w kodzie; zmiana kolejności plików potrafi "zepsuć" wygląd bez zmiany ani jednej linijki CSS.

## Jak sprawdzić

Sprawdź head strony i waterfall w DevTools Network: arkusze powinny startować równolegle, bez schodków wynikających z `@import`.

## Kod

```html title="Źle"
<head>
  <script src="/analytics.js"></script>
  <link rel="stylesheet" href="/main.css" /> <!-- main.css contains @import "theme.css" -->
</head>
```

```html title="Dobrze"
<head>
  <link rel="stylesheet" href="/css/reset.css" />
  <link rel="stylesheet" href="/css/main.css" />
  <link rel="stylesheet" href="/css/theme.css" />
  <script type="module" src="/app.js"></script> <!-- deferred by default -->
</head>
```

## Częste błędy

- `@import` w SCSS jest w porządku (łączony w buildzie), ale `@import` w wynikowym CSS już nie; sprawdź plik produkcyjny.
