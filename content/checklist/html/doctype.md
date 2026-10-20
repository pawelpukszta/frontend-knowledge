---
title: Doctype HTML5
priority: critical
---

`<!doctype html>` jako pierwsza linia dokumentu. Bez niego przeglądarka włącza tryb quirks z historycznymi błędami renderowania.

## Dlaczego to ważne

- W trybie quirks inaczej liczona jest m.in. wysokość procentowa, wysokość linii przy obrazach inline i dziedziczenie fontów w tabelach; layout wygląda dobrze w jednym miejscu i rozjeżdża się w innym.
- Krótka forma `<!doctype html>` wystarcza; stare DTD, np. XHTML 1.0 Transitional, potrafi włączyć tryb "almost standards" z innym renderowaniem obrazów w komórkach tabel.
- Frameworki (Next.js, Astro) dodają doctype same, ale ręcznie pisane szablony, strony z CMS-ów i szablony e-maili często go gubią.

## Jak sprawdzić

Źródło strony; w konsoli `document.compatMode === 'CSS1Compat'` (tryb quirks to `BackCompat`); Chrome zgłasza też tryb quirks w panelu Issues.

## Kod

```html
<!doctype html>
<html lang="pl">
  <head>
    <meta charset="utf-8">
    <title>Wakacje w Grecji 2027</title>
  </head>
  <body>...</body>
</html>
```

```js title="Konsola DevTools"
document.compatMode; // "CSS1Compat" = standards mode, "BackCompat" = quirks mode
```

## Częste błędy

- Komentarz licencyjny lub dołączony fragment szablonu wygenerowany przed doctype.
