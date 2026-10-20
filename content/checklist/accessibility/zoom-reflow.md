---
title: Reflow przy powiększeniu 400%
priority: critical
sources:
  - title: "W3C Understanding 1.4.10: Reflow"
    url: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
---

Przy szerokości 320 CSS px (odpowiednik 1280 px przy 400%) treść układa się w jedną kolumnę bez przewijania w poziomie i bez utraty informacji. Wyjątek: mapy, tabele danych, wykresy. WCAG 1.4.10 (AA).

## Dlaczego to ważne

- Osoby słabowidzące powiększają stronę do 200-400%; jeśli każdy wiersz trzeba przewijać w poziomie, czytanie dłuższego tekstu staje się praktycznie niemożliwe.
- 320 px to także szerokość najmniejszych telefonów, więc dobry responsywny layout spełnia kryterium niemal za darmo.
- WCAG 1.4.10 (AA) jest częścią wymagań European Accessibility Act.

## Jak sprawdzić

Ustaw okno na 1280 px i zoom 400% (lub viewport 320 px w DevTools) i przejdź całą stronę: dozwolone jest tylko przewijanie pionowe, a przyklejone nagłówki nie mogą zasłaniać treści.

## Kod

```css title="Źle"
.offer-card { width: 480px; }                 /* forces horizontal scroll at 320 px */
.search-bar { display: flex; flex-wrap: nowrap; }
body { overflow-x: hidden; }                  /* hides clipped content instead of reflowing */
```

```css title="Dobrze"
.offers {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
  gap: 1rem;
}
.search-bar { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.offer-card h3 { overflow-wrap: anywhere; }   /* long hotel names do not overflow */
.price-table-wrap { overflow-x: auto; }       /* data tables may scroll on their own */
```

## Częste błędy

- Przyklejony nagłówek i baner cookies, które przy 400% zajmują większość wysokości ekranu.
- Testowanie tylko na emulatorze telefonu, bez zoomu w przeglądarce desktopowej.
