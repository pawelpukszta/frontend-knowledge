---
title: Dokładnie jeden landmark main
priority: medium
---

Strona ma jeden widoczny `<main>`, który zawiera treść główną i jest celem skip linku.

## Dlaczego to ważne

- Skip link i skróty czytników (D w NVDA, rotor w VoiceOver) prowadzą prosto do treści głównej z pominięciem nagłówka i menu.
- Brak `main` albo kilka widocznych `main` dezorientuje: nie wiadomo, gdzie zaczyna się właściwa treść.
- Według WHATWG `main` nie może być wewnątrz `article`, `aside`, `header`, `footer` ani `nav`, a dodatkowe `main` są dozwolone tylko z atrybutem `hidden`.

## Jak sprawdzić

axe (`landmark-one-main`, `landmark-no-duplicate-main`); rozszerzenie Landmarks lub lista landmarków w czytniku.

## Kod

```html
<body>
  <a class="skip-link" href="#main">Przejdź do treści</a>
  <header>...</header>
  <nav aria-label="Główna">...</nav>
  <main id="main">
    <h1>Wakacje w Grecji 2027</h1>
    ...
  </main>
  <footer>...</footer>
</body>
```

## Częste błędy

- `<div id="main">` bez elementu `main` ani `role="main"`.
- `main` w każdym komponencie SPA, np. w modalu lub w osadzonym widżecie.
