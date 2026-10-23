---
title: Landmarki i hierarchia nagłówków
level: mid
added: 2026-10-20
tags:
  - landmarks
  - headings
  - h1
  - nawigacja
  - skip link
summary: Landmarki (header, nav, main, footer) i logiczna hierarchia nagłówków h1-h6 to "spis treści" strony dla czytników ekranu. Użytkownicy nawigują po nich skrótami.
sources:
  - title: "W3C WAI-ARIA APG: Landmark Regions"
    url: https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/
  - title: "W3C WAI: Headings tutorial"
    url: https://www.w3.org/WAI/tutorials/page-structure/headings/
---

## Wyjaśnienie

- Użytkownicy czytników ekranu często **skaczą po nagłówkach** i **landmarkach**, zamiast czytać stronę od początku.
- Jeden `<main>` na stronę. Kilka `<nav>` rozróżniaj przez `aria-label` ("Główna", "Stopka").
- Nagłówki odzwierciedlają strukturę treści, nie rozmiar czcionki: `h1` → `h2` → `h3`, bez przeskakiwania poziomów. Wygląd zmieniasz w CSS.
- **Skip link** "Przejdź do treści" jako pierwszy fokusowalny element pozwala pominąć nawigację.

## Kod

```html
<a class="skip-link" href="#main">Przejdź do treści</a>
<header>
  <nav aria-label="Główna">...</nav>
</header>
<main id="main">
  <h1>Wakacje w Grecji</h1>
  <section aria-labelledby="crete">
    <h2 id="crete">Kreta</h2>
    <h3>Hotele przy plaży</h3>
  </section>
</main>
<footer><nav aria-label="Stopka">...</nav></footer>
```

## Pytania

### Po co landmarki i poprawne nagłówki? {#a11y-landmarks-headings-q1}

Tworzą strukturę, po której użytkownicy technologii asystujących nawigują skrótami (lista nagłówków, skok do main). Poprawna hierarchia pozwala zrozumieć stronę bez czytania całości, a przy okazji pomaga SEO.
