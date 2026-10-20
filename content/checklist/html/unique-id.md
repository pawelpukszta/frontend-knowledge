---
title: Unikalne ID
priority: high
---

Każde `id` występuje na stronie tylko raz. Duplikaty ID psują etykiety formularzy, relacje ARIA, kotwice i skrypty.

## Dlaczego to ważne

- `label for`, `aria-labelledby` i `aria-describedby` wskazują pierwszy element o danym ID; drugie pole zostaje bez etykiety lub dostaje cudzy opis błędu.
- Kotwice (`#szczegoly`) i `getElementById` trafiają w pierwszy element, więc skrypt działa na złej karcie oferty.
- W React generuj ID przez `useId()`, bo zahardkodowane `id="email"` zdubluje się, gdy komponent pojawi się na stronie dwa razy.
- WCAG 2.2 usunęło kryterium 4.1.1 Parsing, ale zduplikowane ID nadal łamią relacje ARIA, czyli kryteria 1.3.1 i 4.1.2.

## Jak sprawdzić

Walidator HTML, axe (`duplicate-id-aria`); w konsoli skrypt wyszukujący duplikaty.

## Kod

```tsx
import { useId } from 'react';

export function TravelerField({ label }: { label: string }) {
  const id = useId(); // unique per instance, stable across SSR and hydration
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} name="traveler" aria-describedby={`${id}-hint`} />
      <p id={`${id}-hint`}>Imię i nazwisko jak w paszporcie</p>
    </div>
  );
}
```

```js title="Konsola DevTools"
const ids = [...document.querySelectorAll('[id]')].map((el) => el.id);
console.log(ids.filter((id, i) => ids.indexOf(id) !== i));
```

## Częste błędy

- Ten sam komponent modala lub formularza wyrenderowany dwukrotnie (wersja mobilna i desktopowa ukryta CSS-em).
