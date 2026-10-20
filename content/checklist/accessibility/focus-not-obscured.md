---
title: Element z focusem nie jest zasłonięty
priority: high
sources:
  - title: "W3C Understanding 2.4.11: Focus Not Obscured (Minimum)"
    url: https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html
---

Przyklejony nagłówek, stopka czy baner cookies nie może całkowicie zakryć elementu z focusem. Pomaga `scroll-padding-top`. WCAG 2.2 SC 2.4.11 (AA); 2.4.12 (AAA) wymaga, by nie był zakryty nawet częściowo.

## Dlaczego to ważne

- Użytkownik klawiatury nie widzi, gdzie jest; przy przechodzeniu Tabem w górę strony przeglądarka przewija element dokładnie pod sticky header.
- Baner cookies przyklejony do dołu ekranu na telefonie potrafi zasłonić przycisk "Rezerwuję", który właśnie ma focus.
- To nowe kryterium WCAG 2.2 (AA), więc obowiązuje przy zgodności z EAA.

## Jak sprawdzić

Przechodź Tabem (także Shift+Tab) przez długą stronę z widocznymi elementami sticky i banerem cookies, również w wąskim oknie.

## Kod

```css title="Dobrze"
:root { --header-h: 4.5rem; --cookie-bar-h: 5rem; }

html {
  /* Browsers respect scroll padding when scrolling a focused element into view */
  scroll-padding-top: calc(var(--header-h) + 1rem);
  scroll-padding-bottom: calc(var(--cookie-bar-h) + 1rem);
}

.site-header { position: sticky; top: 0; height: var(--header-h); }
```

## Częste błędy

- Pamiętanie o nagłówku, a zapomnienie o przyklejonym pasku "Cena: 3499 zł, Rezerwuję" na dole ekranu.
