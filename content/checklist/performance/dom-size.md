---
title: Mały i płytki DOM
priority: medium
---

Duży DOM (Lighthouse ostrzega od ok. 800 elementów, błąd od ok. 1400) i głębokie zagnieżdżenie spowalniają przeliczanie stylów, layout i interakcje. Pomagają wirtualizacja, paginacja, renderowanie na żądanie i `content-visibility`.

## Dlaczego to ważne

- Każda zmiana klasy czy treści może wymusić przeliczenie stylów dla tysięcy węzłów; na słabszym telefonie to dziesiątki lub setki milisekund i gorszy INP.
- Duży DOM to też więcej pamięci; na urządzeniach z małą ilością RAM przeglądarka częściej odrzuca karty w tle.
- Częste źródła: mega menu z setkami linków renderowane na każdej stronie, ukryte zakładki i modale trzymane w DOM, wrappery `div` w komponentach.

## Jak sprawdzić

Insight o rozmiarze DOM w Lighthouse 13 i panelu Performance, `document.querySelectorAll('*').length` w konsoli, czas "Recalculate style" w profilu.

## Kod

```css title="Pomijanie renderowania sekcji poza ekranem"
/* Browser skips layout and paint until the section approaches the viewport */
.offer-section {
  content-visibility: auto;
  contain-intrinsic-size: auto 600px; /* placeholder height, remembered after first render */
}
```

## Częste błędy

- Ukrywanie dużych fragmentów przez `display: none` zamiast niewyrenderowania ich wcale do czasu potrzeby.
- `content-visibility: auto` bez `contain-intrinsic-size`: pasek przewijania skacze, a CLS rośnie.
