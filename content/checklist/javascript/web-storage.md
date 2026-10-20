---
title: Bezpieczne korzystanie z Web Storage
priority: medium
---

Odczyty i zapisy w `try/catch` (tryb prywatny, przekroczony limit), brak tokenów i danych wrażliwych, walidacja odczytanych danych.

## Dlaczego to ważne

- Dostęp do `localStorage` może rzucić `SecurityError` (zablokowane dane witryn, iframe), a zapis `QuotaExceededError` po przekroczeniu limitu, zwykle ok. 5 MB na origin.
- Każdy skrypt na stronie, także wstrzyknięty przez XSS lub skompromitowaną bibliotekę, czyta localStorage; tokeny sesji powinny być w ciasteczkach `HttpOnly`, `Secure`, `SameSite`.
- `localStorage` jest synchroniczny i blokuje główny wątek; duże dane lepiej trzymać w IndexedDB.

## Jak sprawdzić

Przegląd użycia `localStorage` i `sessionStorage`; DevTools Application: Storage, test z zablokowanymi danymi witryn i z uszkodzonym wpisem.

## Kod

```ts
import { z } from "zod";
export const storage = {
  get<T>(key: string, schema: z.ZodType<T>): T | null {
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw === null ? null : schema.safeParse(JSON.parse(raw));
      return parsed?.success ? parsed.data : null;
    } catch {
      return null; // storage blocked or malformed JSON
    }
  },
  set(key: string, value: unknown): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false; // QuotaExceededError or SecurityError
    }
  },
};
```

## Częste błędy

- Trzymanie w localStorage tokenu JWT lub danych osobowych z formularza rezerwacji (PESEL, numer paszportu).
