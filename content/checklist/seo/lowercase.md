---
title: Małe litery w adresach URL
priority: medium
---

Ścieżki URL rozróżniają wielkość liter, więc `/Oferta` i `/oferta` to dwa różne adresy (duplikaty). Używaj tylko małych liter i przekierowuj warianty.

## Dlaczego to ważne

- Większość serwerów i CDN traktuje `/Oferta` i `/oferta` jako różne zasoby: kończy się to albo 404, albo duplikatem treści.
- Wielkie litery pojawiają się z kampanii (ręcznie wpisane adresy), z CMS (tytuł zamieniony w slug bez normalizacji) i z linków od partnerów.
- Przekierowanie 301/308 na wersję z małymi literami scala sygnały z wariantów w jeden adres.

## Jak sprawdzić

Crawler: adresy z wielkimi literami; `curl -sI https://example.pl/Wakacje/Grecja` powinien zwrócić przekierowanie.

## Kod

```ts title="proxy.ts (Next.js 16)"
import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname !== pathname.toLowerCase()) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.toLowerCase(); // query string is preserved
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

// Skip static assets and API routes
export const config = { matcher: ["/((?!_next|api|.*\\..*).*)"] };
```

## Częste błędy

- Obniżanie wielkości liter także w parametrach zapytania, które mogą być wrażliwe (np. tokeny).
