---
title: Brak przewijania w poziomie
priority: medium
---

Strona mieści się w szerokości ekranu od 320 px. Typowe przyczyny: stałe szerokości, długie słowa i URL-e, tabele, obrazy bez `max-width: 100%`.

## Dlaczego to ważne

- WCAG 1.4.10 (Reflow) wymaga, żeby treść działała przy szerokości 320 CSS px bez przewijania w dwóch kierunkach; to też odpowiednik powiększenia 400% na desktopie.
- Poziomy scroll na telefonie powoduje "pływanie" strony przy przewijaniu i przypadkowe ukrycie części treści, np. ceny.
- `overflow-x: hidden` na `body` tylko ukrywa objaw i potrafi zepsuć `position: sticky`; trzeba znaleźć element, który wystaje.

## Jak sprawdzić

Viewport 320-375 px w DevTools; w konsoli `document.documentElement.scrollWidth > innerWidth` oraz skrypt wskazujący winowajcę.

## Kod

```css
img, video, iframe { max-inline-size: 100%; block-size: auto; }
.content { overflow-wrap: anywhere; } /* long URLs and booking codes */
.table-wrapper { overflow-x: auto; } /* scroll only the table, not the page */
.full-bleed { inline-size: 100%; } /* not 100vw, which includes the scrollbar */
```

```js title="Znajdź wystający element (konsola)"
const vw = document.documentElement.clientWidth;
document.querySelectorAll("body *").forEach((el) => {
  if (el.getBoundingClientRect().right > vw) console.log(el);
});
```

## Częste błędy

- `width: 100vw` na elementach pełnej szerokości; na desktopie z widocznym paskiem przewijania jest szersze niż strona.
