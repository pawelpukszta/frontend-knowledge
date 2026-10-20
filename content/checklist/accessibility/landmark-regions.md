---
title: Treść w landmarkach
priority: medium
sources:
  - title: "W3C APG: Landmark Regions"
    url: https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/
---

Cała treść znajduje się w `header`, `nav`, `main`, `aside` lub `footer` (lub innym landmarku). Dzięki temu użytkownik może przeskakiwać między regionami.

## Dlaczego to ważne

- Użytkownicy czytników skaczą między regionami (D w NVDA, rotor w VoiceOver); treść poza landmarkami da się znaleźć tylko, czytając wszystko po kolei.
- Kilka `nav` lub `aside` wymaga unikalnych etykiet (`aria-label`), inaczej lista regionów pokazuje "nawigacja, nawigacja, nawigacja".
- `section` staje się landmarkiem (region) dopiero z nazwą dostępną, a `header`/`footer` wewnątrz `article` czy `main` nie są landmarkami strony.

## Jak sprawdzić

axe (`region`), rozszerzenie Landmarks lub lista landmarków w czytniku ekranu.

## Kod

```html
<header>
  <a href="/"><img src="/logo.svg" alt="Strona główna"></a>
  <nav aria-label="Główna">...</nav>
</header>
<main>
  <section aria-labelledby="deals-h">
    <h2 id="deals-h">Last minute</h2>
    ...
  </section>
  <aside aria-label="Filtry wyszukiwania">...</aside>
</main>
<footer>
  <nav aria-label="Stopka">...</nav>
</footer>
```

## Częste błędy

- Baner cookies lub pasek promocji dodany jako ostatnie dziecko `body`, poza regionami (jeśli nie jest to `dialog`).
