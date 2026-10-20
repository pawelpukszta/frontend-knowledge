---
title: oklch() dla spójnych palet
priority: low
sources:
  - title: "MDN: oklch()"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch
---

Przestrzeń OKLCH ma percepcyjnie równą jasność, więc odcienie z tej samej palety wyglądają równo jasno, a generowanie wariantów (hover, odcienie) jest przewidywalne.

## Dlaczego to ważne

- W HSL żółty i niebieski o tej samej jasności `50%` wyglądają zupełnie inaczej; w OKLCH parametr L odpowiada temu, co widzi oko, więc łatwiej utrzymać kontrast.
- Wariant hover to zmiana jednego parametru (np. L o 8 punktów) bez ręcznego dobierania heksów.
- OKLCH obejmuje szerszy gamut (Display P3), więc na nowoczesnych ekranach kolory marki mogą być żywsze; `oklch()` jest Baseline od 2023.

## Jak sprawdzić

Przegląd definicji kolorów w tokenach; picker w DevTools pokazuje wartości OKLCH i granicę gamutu sRGB.

## Kod

```css
:root {
  --brand-h: 255;
  --brand: oklch(55% 0.2 var(--brand-h));
  --brand-hover: oklch(from var(--brand) calc(l - 0.08) c h);
  --brand-subtle: oklch(95% 0.03 var(--brand-h));
  /* Same lightness, different hues: visually balanced status colors */
  --success: oklch(60% 0.15 145);
  --warning: oklch(60% 0.15 75);
}
.btn:hover { background: var(--brand-hover); }
```

## Częste błędy

- Ustawianie bardzo wysokiej chromy bez sprawdzenia, jak kolor jest przycinany na ekranach sRGB.
