---
title: Middleware w Next.js (proxy.ts)
level: senior
added: 2026-10-20
tags:
  - Next.js
  - middleware
  - proxy
  - edge
  - redirect
  - auth
summary: "Next.js pozwala uruchomić kod przed obsłużeniem requestu: przekierowania, rewrite, nagłówki, proste sprawdzenia auth. Od Next.js 16 plik middleware.ts nazywa się proxy.ts."
sources:
  - title: "Next.js: proxy.js file convention"
    url: https://nextjs.org/docs/app/api-reference/file-conventions/proxy
  - title: Next.js 16 release notes
    url: https://nextjs.org/blog/next-16
---

## Wyjaśnienie

- Plik w katalogu głównym projektu (`proxy.ts`, dawniej `middleware.ts`) eksportuje funkcję, która dostaje `NextRequest` i zwraca `NextResponse` (next, redirect, rewrite, z nagłówkami lub cookies).
- `config.matcher` ogranicza, dla jakich ścieżek się uruchamia.
- Zastosowania: przekierowania (np. stare URL-e, język), A/B testy przez rewrite, nagłówki bezpieczeństwa, optymistyczne sprawdzenie sesji (cookie) i przekierowanie do logowania.
- **Nie** traktuj go jako jedynego zabezpieczenia: autoryzację weryfikuj też tam, gdzie pobierasz dane (Server Components, Route Handlers, Server Actions). Kod powinien być szybki, bo działa przed każdym pasującym requestem.

## Kod

```ts
// proxy.ts (Next.js 16+; middleware.ts in older versions)
import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const session = request.cookies.get('session');
  if (!session && request.nextUrl.pathname.startsWith('/moje-rezerwacje')) {
    return NextResponse.redirect(new URL('/logowanie', request.url));
  }
  const response = NextResponse.next();
  response.headers.set('x-request-id', crypto.randomUUID());
  return response;
}

export const config = { matcher: ['/moje-rezerwacje/:path*'] };
```

## Pytania

### Do czego służy middleware (proxy) w Next.js? {#node-nextjs-proxy-q1}

Do uruchomienia logiki przed renderowaniem trasy: przekierowania, rewrite, modyfikacja nagłówków i cookies, szybkie sprawdzenie sesji. Działa dla ścieżek pasujących do `matcher`.

### Czy middleware w Next.js wystarczy do zabezpieczenia danych? {#node-nextjs-proxy-q2}

Nie. To dobra pierwsza linia (przekierowanie niezalogowanych), ale autoryzację trzeba sprawdzać także przy dostępie do danych, bo np. Server Actions i Route Handlers mogą być wywołane bezpośrednio, a konfiguracja matchera może pominąć ścieżki.
