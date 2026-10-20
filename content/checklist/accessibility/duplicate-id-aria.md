---
title: Unikalne ID wskazywane przez atrybuty ARIA
priority: high
---

`aria-labelledby`, `aria-describedby`, `aria-controls` i `<label for>` odwołują się do ID. Duplikat sprawia, że przeglądarka bierze pierwszy pasujący element, często niewłaściwy.

## Dlaczego to ważne

- Gdy dwa pola mają podpowiedź z `id="hint"`, przy drugim polu czytnik odczyta podpowiedź pierwszego, np. format PESEL przy numerze telefonu.
- Duplikaty powstają zwykle przy powtarzanych komponentach: karta oferty na liście, kilka formularzy na stronie, ten sam filtr w panelu bocznym i w szufladzie mobilnej.
- axe przypisuje regułę do WCAG 4.1.2 (A); klik w etykietę z duplikatem ID też przenosi focus do złego pola.

## Jak sprawdzić

axe (`duplicate-id-aria`); w React używaj `useId()` zamiast ręcznych ID.

## Kod

```tsx title="Źle"
function PriceFilter() {
  return (
    <>
      <label htmlFor="price">Cena maks.</label>
      <input id="price" aria-describedby="price-hint" />
      <p id="price-hint">Cena za osobę w PLN</p>
    </>
  );
}
// Rendered twice (sidebar + mobile drawer): duplicated IDs
```

```tsx title="Dobrze"
import { useId } from "react";

function PriceFilter() {
  const id = useId(); // stable on server and client, unique per instance
  return (
    <>
      <label htmlFor={`${id}-price`}>Cena maks.</label>
      <input id={`${id}-price`} aria-describedby={`${id}-hint`} />
      <p id={`${id}-hint`}>Cena za osobę w PLN</p>
    </>
  );
}
```

## Częste błędy

- Generowanie ID przez `Math.random()`: inne wartości na serwerze i w przeglądarce psują hydrację.
