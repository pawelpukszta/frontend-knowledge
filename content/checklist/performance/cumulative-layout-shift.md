---
title: CLS poniżej 0,1
priority: high
sources:
  - title: "web.dev: Optimize CLS"
    url: https://web.dev/articles/optimize-cls
---

Strona nie "skacze" podczas ładowania ani używania: obrazy i wideo mają wymiary, reklamy, banery i embedy mają zarezerwowane miejsce, a fonty nie zmieniają układu. Próg: 0,1 na 75. percentylu.

## Dlaczego to ważne

- Przesunięcie układu w chwili kliknięcia powoduje przypadkowe akcje, np. tapnięcie w baner zamiast w "Zarezerwuj", co frustruje i podważa zaufanie do serwisu.
- Czytający traci miejsce w tekście, gdy treść nagle zjeżdża w dół; najbardziej odczuwają to użytkownicy telefonów i czytników ekranu z powiększeniem.
- Yahoo! JAPAN News po obniżeniu CLS o 0,2 odnotowało ok. 15% więcej odsłon na sesję (case study na web.dev).

## Jak sprawdzić

PageSpeed Insights (field), ścieżka Layout shifts w DevTools Performance oraz insight o przyczynach przesunięć (layout shift culprits) w Lighthouse; w RUM `onCLS` z `web-vitals/attribution` podaje `largestShiftTarget`.

## Kod

```html title="Źle"
<img src="/img/hotel-santorini.avif" alt="Hotel na Santorini">
<div id="promo-banner"></div> <!-- banner injected later pushes content down -->
```

```css title="Dobrze"
/* HTML: <img src="..." alt="..." width="1200" height="800"> */
img, video { max-width: 100%; height: auto; } /* keeps the aspect ratio from width/height */
.promo-banner { min-height: 96px; }         /* reserve space before the banner loads */
.ad-slot--mpu { width: 300px; aspect-ratio: 300 / 250; }
.map-embed { aspect-ratio: 16 / 9; }
```

## Częste błędy

- Wstawianie banerów cookies, promocji lub "pobierz aplikację" nad treścią zamiast jako nakładki lub w zarezerwowanym miejscu.
- Animowanie `top`, `height` lub `margin` zamiast `transform`.
