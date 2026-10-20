---
title: Czytelny rozmiar tekstu na mobile
priority: medium
---

Tekst główny co najmniej 16 px (1rem) na telefonach; mniejszy wymusza powiększanie. Pola formularzy poniżej 16 px powodują automatyczny zoom w iOS Safari.

## Dlaczego to ważne

- Tekst 12-13 px na telefonie trzymanym w ręku jest męczący, szczególnie dla starszych użytkowników, a to duża grupa klientów biur podróży.
- iOS Safari automatycznie powiększa stronę po fokusie na polu z fontem mniejszym niż 16 px; użytkownik musi potem ręcznie oddalać widok w środku formularza.
- Odpowiednia interlinia (ok. 1,5) i długość linii (45-75 znaków) mają równie duży wpływ na czytelność jak sam rozmiar.

## Jak sprawdzić

Computed styles w DevTools w widoku mobilnym; test formularza na prawdziwym iPhonie.

## Kod

```css
html { font-size: 100%; } /* respect the user's default (usually 16px) */
body { font-size: 1rem; line-height: 1.5; }
.article { max-inline-size: 65ch; }
/* Prevent iOS focus zoom */
input, select, textarea { font-size: max(1rem, 16px); }
.legal-note { font-size: 0.875rem; } /* small print still at least 14px */
```

## Częste błędy

- Mały tekst w ważnych miejscach: warunki rezygnacji, opłaty dodatkowe, informacje o bagażu.
