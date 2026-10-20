---
title: Bezpieczne przechowywanie tokenów
priority: high
sources:
  - title: "OWASP: HTML5 Security Cheat Sheet"
    url: https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html
---

Tokeny sesji i odświeżania trzymaj w cookie `HttpOnly` (najlepiej z architekturą BFF), a nie w `localStorage` czy `sessionStorage`, gdzie każdy wstrzyknięty skrypt może je odczytać.

## Dlaczego to ważne

- Jeden błąd XSS lub złośliwa wersja zależności npm wystarczy, by wysłać zawartość `localStorage` na serwer atakującego; token działa potem z dowolnego komputera.
- OWASP wprost odradza przechowywanie identyfikatorów sesji w Web Storage, bo jest zawsze dostępny dla JavaScriptu.
- W modelu BFF przeglądarka nie widzi tokenu OAuth wcale; serwer Next.js trzyma go po swojej stronie i dołącza do żądań do API.

## Jak sprawdzić

Application, Local Storage, Session Storage i IndexedDB po zalogowaniu: nie powinno tam być tokenów ani JWT; sprawdź też, czy token nie trafia do adresów URL.

## Kod

```ts title="Źle"
// Any injected script can read and exfiltrate this
const { accessToken } = await login(email, password);
localStorage.setItem('accessToken', accessToken);
```

```ts title="Dobrze: app/api/login/route.ts (BFF)"
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const { sessionId } = await authService.login(email, password); // tokens stay server-side
  (await cookies()).set('__Host-session', sessionId, {
    httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8,
  });
  return Response.json({ ok: true });
}
```

## Częste błędy

- Przechowywanie w `localStorage` "tylko" refresh tokenu; to on daje najdłuższy dostęp.
