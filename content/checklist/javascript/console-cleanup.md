---
title: Bez console.log na produkcji
priority: medium
---

Logi zaśmiecają konsolę, mogą ujawniać dane i spowalniać kod. Usuwaj je w buildzie (np. opcja minifiera) lub regułą `no-console`.

## Dlaczego to ważne

- `console.log(user)` może pokazać w konsoli e-mail, numer telefonu czy token każdemu, kto otworzy DevTools, także na cudzym komputerze.
- Logowanie dużych obiektów w pętli lub przy przewijaniu trzyma do nich referencje i spowalnia stronę, gdy DevTools są otwarte.
- Konsola pełna szumu ukrywa prawdziwe ostrzeżenia (React, CSP, deprecjacje), które należałoby zauważyć.

## Jak sprawdzić

Otwórz konsolę na produkcji podczas typowych działań (wyszukiwanie, rezerwacja); w CI `eslint --max-warnings 0` z regułą `no-console`.

## Kod

```ts title="next.config.ts"
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    // Strip console.* in production builds, keep errors and warnings
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
};
export default nextConfig;
```

```js title="eslint.config.js (fragment)"
rules: {
  "no-console": ["warn", { allow: ["warn", "error"] }],
},
```

## Częste błędy

- Usuwanie logów zamiast zastąpienia ich prawdziwym monitoringiem błędów.
