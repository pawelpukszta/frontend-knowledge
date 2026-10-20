---
title: Powiększenie tekstu do 200%
priority: high
sources:
  - title: "W3C Understanding 1.4.4: Resize Text"
    url: https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html
---

Po powiększeniu tekstu do 200% nic nie ginie, nie jest ucinane i nie nachodzi na siebie. Pomaga używanie `rem`/`em` i unikanie stałych wysokości kontenerów z tekstem. WCAG 1.4.4 (AA).

## Dlaczego to ważne

- Osoby słabowidzące powiększają tekst zoomem lub domyślnym rozmiarem czcionki w przeglądarce; stałe wysokości w `px` powodują ucinanie etykiet, cen i przycisków.
- Ustawienie rozmiaru czcionki w przeglądarce zmienia tylko wartość bazową dla `rem`; `html { font-size: 14px }` po prostu je ignoruje.
- Blokada zoomu w meta viewport (`user-scalable=no`, `maximum-scale=1`) też łamie to kryterium.

## Jak sprawdzić

Zoom 200% w przeglądarce oraz zmiana domyślnego rozmiaru czcionki w ustawieniach (np. Chrome: Wygląd, Rozmiar czcionki); żaden tekst nie może być ucięty ani nachodzić na inne elementy.

## Kod

```css title="Źle"
html { font-size: 14px; }                    /* overrides the user's font size setting */
.badge { height: 20px; overflow: hidden; }   /* clips the label at 200% */
h1 { font-size: 4vw; }                       /* viewport units ignore zoom */
```

```css title="Dobrze"
html { font-size: 100%; }                    /* respect the user's setting */
body { font-size: 1rem; line-height: 1.5; }
.badge { min-height: 1.25rem; padding: 0.125rem 0.5rem; }
h1 { font-size: clamp(1.75rem, 1.2rem + 2vw, 2.5rem); } /* rem part keeps zoom working */
```

## Częste błędy

- Tekst w samych jednostkach `vw`: nie rośnie przy powiększeniu.
