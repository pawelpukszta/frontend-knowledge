---
title: Walidacja danych zewnętrznych w runtime
priority: high
sources:
  - title: Zod
    url: https://zod.dev/
---

Typy TS znikają po kompilacji, więc odpowiedzi API, formularze, localStorage i parametry URL waliduj schematem (Zod, Valibot) i z niego wyprowadzaj typy.

## Dlaczego to ważne

- `await res.json() as Offer[]` to tylko obietnica; gdy backend zmieni `price` na string, błąd wybuchnie daleko od źródła, np. przy formatowaniu ceny.
- Jeden schemat daje walidację i typ (`z.infer`), więc typ nie rozjedzie się z rzeczywistą kontrolą.
- Walidacja na granicy systemu chroni też przed złośliwymi danymi z URL czy `postMessage`; po stronie serwera jest obowiązkowa niezależnie od walidacji w przeglądarce.

## Jak sprawdzić

Przegląd granic systemu: czy dane z `fetch`, `JSON.parse`, `FormData` i `URLSearchParams` przechodzą przez `parse`/`safeParse`.

## Kod

```ts
import { z } from "zod";

export const OfferSchema = z.object({
  id: z.string(),
  hotel: z.string().min(1),
  price: z.number().positive(),
  departure: z.iso.date(),
  board: z.enum(["BB", "HB", "AI"]),
});
export type Offer = z.infer<typeof OfferSchema>;

const SearchSchema = z.object({ adults: z.coerce.number().int().min(1).max(9) });
const result = SearchSchema.safeParse(Object.fromEntries(new URLSearchParams(location.search)));
const adults = result.success ? result.data.adults : 2; // safe default
```

## Częste błędy

- Rzutowanie `as` na danych z sieci zamiast parsowania.
