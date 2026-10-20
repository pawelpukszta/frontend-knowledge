---
title: Poprawna struktura HTML
priority: medium
---

Niezamknięte lub źle zagnieżdżone tagi mogą sprawić, że przeglądarka i Googlebot zinterpretują stronę inaczej, niż zamierzałeś, np. element niedozwolony w `<head>` zamyka go przedwcześnie i dalsze meta tagi lądują w `<body>`.

## Dlaczego to ważne

- Parser HTML po napotkaniu np. `<div>` lub `<iframe>` w `<head>` niejawnie otwiera `<body>`; canonical i hreflang umieszczone dalej Google pomija, bo obsługuje je tylko w `<head>`.
- Niezamknięty tag (np. `<a>` bez `</a>` albo brakujący cudzysłów w atrybucie) potrafi zamienić pół strony w jeden link lub ukryć treść.
- Częstym źródłem są skrypty wstrzykiwane przez tag managera i wtyczki; problem widać dopiero w wyrenderowanym DOM, nie w szablonie.

## Jak sprawdzić

W3C Validator (validator.w3.org/nu); w DevTools Elements sprawdź, czy meta tagi faktycznie są w `<head>`; Inspekcja adresu URL w Search Console pokazuje wyrenderowany HTML.

## Kod

```html title="Źle"
<head>
  <title>Wakacje w Grecji 2026</title>
  <!-- <div> is not allowed in head: the parser starts <body> here -->
  <div id="consent-banner"></div>
  <!-- ...so these end up in body and the canonical is ignored -->
  <link rel="canonical" href="https://example.pl/wakacje/grecja" />
  <link rel="alternate" hreflang="en" href="https://example.pl/en/holidays/greece" />
</head>
```

```html title="Dobrze"
<head>
  <title>Wakacje w Grecji 2026</title>
  <link rel="canonical" href="https://example.pl/wakacje/grecja" />
  <link rel="alternate" hreflang="en" href="https://example.pl/en/holidays/greece" />
</head>
<body>
  <div id="consent-banner"></div>
</body>
```

## Częste błędy

- Uznanie strony za poprawną, bo "wygląda dobrze"; przeglądarka po cichu naprawia błędy, ale nie zawsze tak, jak zakładasz.
