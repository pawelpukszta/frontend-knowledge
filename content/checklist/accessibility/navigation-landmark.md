---
title: Nawigacja w landmarku nav
priority: high
---

Główne menu, menu stopki i breadcrumbs są w `<nav>`; kilka nawigacji rozróżnia `aria-label` ("Główna", "Stopka", "Ścieżka").

## Dlaczego to ważne

- Czytniki ekranu pozwalają skoczyć prosto do landmarku (NVDA: klawisz D, VoiceOver: rotor), zamiast przechodzić przez całą stronę.
- Bez etykiet użytkownik słyszy trzy razy "nawigacja" i nie wie, która jest którą.
- Landmarki (`header`, `nav`, `main`, `footer`) to też mechanizm pomijania bloków z WCAG 2.4.1.

## Jak sprawdzić

Lista landmarków w czytniku ekranu lub rozszerzenie Landmarks; każdy `nav` powinien mieć unikalną nazwę, gdy jest ich więcej niż jeden.

## Kod

```html title="Dobrze"
<header>
  <nav aria-label="Główna">
    <ul><li><a href="/last-minute">Last minute</a></li><li><a href="/kierunki">Kierunki</a></li></ul>
  </nav>
</header>
<nav aria-label="Ścieżka">
  <ol><li><a href="/">Start</a></li><li><a href="/grecja">Grecja</a></li><li aria-current="page">Kreta</li></ol>
</nav>
<main id="main">...</main>
<footer>
  <nav aria-label="Stopka">...</nav>
</footer>
```

## Częste błędy

- `aria-label="Nawigacja główna"`; czytnik powie "Nawigacja główna, nawigacja", bo rolę dodaje sam.
- Owijanie w `<nav>` każdej grupy linków, np. tagów pod artykułem; landmarków ma być kilka, nie kilkanaście.
