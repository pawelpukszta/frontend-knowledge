---
title: Liczba mnoga przez Intl.PluralRules lub ICU
priority: medium
sources:
  - title: "MDN: Intl.PluralRules"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules
---

Polski ma kilka form (1 oferta, 2 oferty, 5 ofert, 22 oferty, 1,5 oferty), więc `n === 1 ? ... : ...` nie wystarczy. `Intl.PluralRules` lub komunikaty ICU MessageFormat wybierają właściwą kategorię CLDR: `one`, `few`, `many` albo `other`.

## Dlaczego to ważne

- Angielski ma dwie formy, polski cztery kategorie, arabski sześć; logika pisana pod angielski psuje się przy każdym kolejnym języku.
- Reguła nie brzmi "2-4": 12-14 to `many` (12 ofert), a 22-24 znów `few` (22 oferty); ręczne warunki prawie zawsze mają błąd na tych granicach.
- Formy zapisane w plikach tłumaczeń (ICU) pozwalają tłumaczom poprawić tekst bez zmian w kodzie.

## Jak sprawdzić

Sprawdź komunikaty z liczbami 0, 1, 2, 5, 12, 22, 25 i 1,5; najlepiej w teście jednostkowym.

## Kod

```ts title="src/lib/plural.ts"
const rules = new Intl.PluralRules('pl-PL');
const forms = { one: 'oferta', few: 'oferty', many: 'ofert', other: 'oferty' } as const;
const num = new Intl.NumberFormat('pl-PL');

export const offersLabel = (n: number) =>
  `${num.format(n)} ${forms[rules.select(n) as keyof typeof forms]}`;

offersLabel(1);   // "1 oferta"   (one)
offersLabel(3);   // "3 oferty"   (few)
offersLabel(12);  // "12 ofert"   (many)
offersLabel(22);  // "22 oferty"  (few)
offersLabel(0);   // "0 ofert"    (many)
offersLabel(1.5); // "1,5 oferty" (other)
```

```json title="messages/pl.json"
{
  "search.results": "{count, plural, =0 {Nie znaleźliśmy ofert} one {Znaleźliśmy # ofertę} few {Znaleźliśmy # oferty} many {Znaleźliśmy # ofert} other {Znaleźliśmy # oferty}}"
}
```

## Częste błędy

- Klucze tłumaczeń w stylu `offers_one` i `offers_other` przeniesione z angielskiego, bez form `few` i `many`.
- Sklejanie zdań z kawałków (`'Znaleźliśmy ' + n + ' ' + word`), których tłumacz nie może przestawić.
