---
title: Tagi Open Graph
priority: medium
---

Minimum `og:title`, `og:description`, `og:image`, `og:url` i `og:type`, a dodatkowo `og:site_name` i `og:locale`. Kontrolują wygląd linku udostępnionego w mediach społecznościowych i komunikatorach (Messenger, WhatsApp, Slack, Teams).

## Dlaczego to ważne

- Bez tagów platforma zgaduje: bierze pierwszy obrazek ze strony (często logo lub baner cookies) i przypadkowy fragment tekstu.
- Udostępnienia w komunikatorach to ważny kanał w turystyce: znajomi i rodzina wysyłają sobie oferty przed wspólną rezerwacją.
- `og:title` może być krótszy i bardziej "społecznościowy" niż `<title>`, bez nazwy marki i fraz pod wyszukiwarkę.

## Jak sprawdzić

Facebook Sharing Debugger, LinkedIn Post Inspector; po zmianie tagów wymuś ponowne pobranie (np. "Scrape Again"), bo platformy długo cache'ują podgląd.

## Kod

```html
<meta property="og:type" content="website">
<meta property="og:site_name" content="Example Travel">
<meta property="og:locale" content="pl_PL">
<meta property="og:title" content="Kreta all inclusive od 2499 zł: wyloty z 9 miast">
<meta property="og:description" content="214 hoteli, pokoje rodzinne i transfer w cenie. Terminy do października.">
<meta property="og:url" content="https://example.pl/wakacje/grecja/kreta">
<meta property="og:image" content="https://example.pl/og/kreta-2027.jpg">
```

## Częste błędy

- Tagi OG dodawane w SPA dopiero po stronie klienta; crawlery platform nie uruchamiają JavaScriptu.
- Ten sam `og:image` (logo) na wszystkich stronach ofert.
