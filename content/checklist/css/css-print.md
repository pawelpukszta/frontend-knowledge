---
title: Style do druku
priority: medium
---

`@media print`: ukryj nawigację i reklamy, czarny tekst na białym tle, adresy linków po treści. Ważne dla potwierdzeń rezerwacji, biletów, faktur.

## Dlaczego to ważne

- Klienci biur podróży nadal drukują vouchery, potwierdzenia rezerwacji i bilety; bez stylów druku dostają kilka stron menu, banerów i stopki.
- Tła i ciemne motywy marnują toner, a jasny tekst na białym papierze bywa nieczytelny.
- Na wydruku link nie jest klikalny, więc bez adresu po treści informacja (np. regulamin) ginie.

## Jak sprawdzić

Podgląd wydruku (Ctrl+P) lub emulacja `print` w DevTools: Rendering, Emulate CSS media type.

## Kod

```css
@media print {
  .site-header, .site-footer, .newsletter, .ads, .chat-widget { display: none; }
  body { color: #000; background: #fff; font-size: 12pt; }
  a[href^="http"]::after { content: " (" attr(href) ")"; font-size: 0.9em; }
  .booking-summary, table, figure { break-inside: avoid; }
  h2, h3 { break-after: avoid; }
  @page { margin: 15mm; }
}
```

## Częste błędy

- Ukrycie w druku numeru rezerwacji lub kodu QR razem z "dekoracjami".
