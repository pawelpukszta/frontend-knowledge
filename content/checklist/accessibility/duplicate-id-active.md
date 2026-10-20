---
title: Unikalne ID elementów aktywnych
priority: high
---

Fokusowalne elementy z powtórzonym ID psują powiązania z etykietami i skrypty. W komponentach generuj ID (`useId`), zamiast wpisywać je na sztywno.

## Dlaczego to ważne

- `<label for>`, `aria-labelledby` i `aria-describedby` biorą pierwszy element o danym ID; drugie pole dostaje cudzą etykietę lub żadną.
- Komponent z na sztywno wpisanym `id="email"` wyrenderowany dwa razy (np. formularz w stopce i w modalu) to najczęstsze źródło duplikatów.
- WCAG 2.2 uznało kryterium 4.1.1 Parsing za przestarzałe, ale skutki duplikatów nadal łamią 1.3.1 i 4.1.2, a `getElementById` zwraca nie ten element.

## Jak sprawdzić

axe (`duplicate-id-aria`), Nu Html Checker lub w konsoli: `[...document.querySelectorAll('[id]')].map(e => e.id).filter((id, i, a) => a.indexOf(id) !== i)`.

## Kod

```tsx title="Dobrze"
import { useId } from "react";

export function EmailField({ error }: { error?: string }) {
  const id = useId(); // unique per component instance, stable across SSR and hydration
  return (
    <>
      <label htmlFor={`${id}-email`}>E-mail</label>
      <input id={`${id}-email`} type="email" aria-describedby={error ? `${id}-err` : undefined} />
      {error && <p id={`${id}-err`}>{error}</p>}
    </>
  );
}
```

## Częste błędy

- Generowanie ID przez `Math.random()`; ID różni się między serwerem a klientem i psuje hydrację.
