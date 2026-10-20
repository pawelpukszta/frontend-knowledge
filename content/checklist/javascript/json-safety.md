---
title: Bezpieczne parsowanie JSON
priority: medium
---

`JSON.parse` rzuca wyjątek przy niepoprawnych danych; opakuj go w `try/catch` i zwaliduj strukturę wyniku (np. schematem).

## Dlaczego to ważne

- Uszkodzony wpis w localStorage (np. po zmianie formatu w nowej wersji) z nieobsłużonym wyjątkiem potrafi zablokować start całej aplikacji.
- Poprawny składniowo JSON nie znaczy poprawnych danych: `JSON.parse('null')` czy obiekt bez pola `price` przejdą parsowanie i wywrócą kod dalej.
- Dane z `postMessage`, URL czy API są kontrolowane z zewnątrz; walidacja struktury ogranicza ryzyko m.in. prototype pollution przy późniejszym scalaniu obiektów.

## Jak sprawdzić

Przegląd miejsc z `JSON.parse` (localStorage, wiadomości, API); test z uszkodzonym wpisem w DevTools Application.

## Kod

```ts
import { z } from "zod";

export function safeJsonParse<T>(text: string | null, schema: z.ZodType<T>): T | null {
  if (text == null) return null;
  try {
    const result = schema.safeParse(JSON.parse(text));
    return result.success ? result.data : null;
  } catch {
    return null; // malformed JSON
  }
}

const recent = safeJsonParse(localStorage.getItem("recentSearches"), z.array(z.string()).max(10)) ?? [];
```

## Częste błędy

- `res.json()` bez obsługi błędu, gdy serwer przy awarii zwraca stronę HTML.
