---
title: Teksty przyjazne tłumaczeniom
priority: medium
---

Używaj formatów komunikatów (ICU MessageFormat) z parametrami zamiast sklejania zdań z kawałków; kolejność słów różni się między językami.

## Dlaczego to ważne

- Polski ma kilka form liczby mnogiej (1 oferta, 2 oferty, 5 ofert, 22 oferty); warunek `count === 1 ? 'oferta' : 'oferty'` daje błędy już dla 5 i 12.
- Sklejanie `"Znaleziono " + n + " ofert w " + city` uniemożliwia tłumaczowi zmianę szyku zdania, a w wielu językach jest on inny.
- `Intl.NumberFormat`, `Intl.DateTimeFormat` i `Intl.PluralRules` są wbudowane w przeglądarkę i poprawnie formatują ceny w PLN, daty i liczebniki.

## Jak sprawdzić

Wyszukaj konkatenację tekstów UI (`+` lub szablony z tekstem) w kodzie; przetestuj liczby 0, 1, 2, 5, 12, 22 i 1,5.

## Kod

```json title="messages/pl.json"
{
  "results": "{count, plural, one {Znaleziono # ofertę} few {Znaleziono # oferty} many {Znaleziono # ofert} other {Znaleziono # oferty}} w {city}"
}
```

```ts
// Built-in formatting, no manual string building
const price = new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(12999);
// "12 999,00 zł" (with a non-breaking space as the group separator)
const date = new Intl.DateTimeFormat("pl-PL", { dateStyle: "long" }).format(new Date("2026-07-14"));
// "14 lipca 2026"
new Intl.PluralRules("pl-PL").select(5); // "many"
```

## Częste błędy

- Tłumaczenie fragmentów zdań osobno ("Znaleziono", "ofert", "w") i składanie ich w kodzie.
