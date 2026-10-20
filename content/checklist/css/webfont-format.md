---
title: Fonty w formacie WOFF2
priority: medium
---

WOFF2 ma najlepszą kompresję i jest wspierany przez wszystkie współczesne przeglądarki; starsze formaty (TTF, EOT, SVG) są zbędne. Do tego fallbackowy stos fontów systemowych.

## Dlaczego to ważne

- WOFF2 (kompresja Brotli) jest zwykle o ok. 30% mniejszy niż WOFF i wielokrotnie mniejszy niż TTF; fonty często ważą więcej niż cały CSS.
- Subsetting (`unicode-range`) ogranicza pobieranie do potrzebnych znaków; dla polskiego wystarczy Basic Latin, Latin-1 i Latin Extended-A (ą, ę, ł, ś, ż...).
- `font-display: swap` z dopasowanym fontem zapasowym (`size-adjust`) pokazuje tekst od razu i ogranicza przesunięcie układu przy podmianie fontu.

## Jak sprawdzić

DevTools Network z filtrem Font: tylko pliki `.woff2`, rozsądna liczba wag; w Performance sprawdź, czy tekst nie jest niewidoczny podczas ładowania.

## Kod

```css
@font-face {
  font-family: "Brand Sans";
  src: url("/fonts/brand-sans-latin-ext.woff2") format("woff2");
  font-weight: 400 700; /* variable font: one file for all weights */
  font-display: swap;
  unicode-range: U+0000-00FF, U+0100-017F, U+2000-206F, U+20AC;
}
@font-face {
  font-family: "Brand Sans Fallback";
  src: local("Arial");
  size-adjust: 104%; /* match metrics to reduce CLS on swap */
}
body { font-family: "Brand Sans", "Brand Sans Fallback", system-ui, sans-serif; }
```

## Częste błędy

- Ładowanie 6 osobnych wag zamiast jednego fontu zmiennego.
