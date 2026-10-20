---
title: Content Security Policy
priority: high
sources:
  - title: "web.dev: Mitigate XSS with a strict CSP"
    url: https://web.dev/articles/strict-csp
  - title: "OWASP: Content Security Policy Cheat Sheet"
    url: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
  - title: "Next.js: Content Security Policy"
    url: https://nextjs.org/docs/app/guides/content-security-policy
---

CSP ogranicza źródła skryptów, stylów, obrazów i połączeń, więc wstrzyknięty skrypt się nie wykona. Najskuteczniejsza jest strict CSP oparta na nonce i `'strict-dynamic'`; wdrażaj ją, zaczynając od trybu Report-Only.

## Dlaczego to ważne

- XSS jest jedną z najczęstszych podatności aplikacji webowych; CSP to druga linia obrony, gdy błąd w escapowaniu już się zdarzył.
- Listy dozwolonych domen (allowlist) łatwo obejść przez hostowane na nich biblioteki i endpointy JSONP; nonce z `'strict-dynamic'` jest odporny na ten problem.
- Nonce musi być losowy i nowy przy każdym żądaniu; w Next.js oznacza to dynamiczne renderowanie stron, co ma koszt wydajnościowy i wyklucza cache CDN dla HTML.
- Tryb Report-Only pozwala zebrać naruszenia z produkcji (skrypty marketingowe, rozszerzenia) bez psucia strony.

## Jak sprawdzić

Nagłówek odpowiedzi w DevTools, CSP Evaluator, konsola (naruszenia); po wdrożeniu monitoruj raporty z endpointu `report-to`.

## Kod

```ts title="proxy.ts (Next.js 16)"
import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const csp = [
    "default-src 'self'",
    `script-src 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' blob: data: https://res.cloudinary.com",
    "object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
  ].join('; ');
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce); // read in Server Components via headers()
  requestHeaders.set('Content-Security-Policy', csp); // Next.js applies the nonce to its scripts
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', csp);
  return response;
}
```

```http title="Najpierw tryb raportowania"
# Violations are reported, nothing is blocked yet
Reporting-Endpoints: csp="https://example.pl/api/csp-reports"
Content-Security-Policy-Report-Only: script-src 'nonce-r4nd0m' 'strict-dynamic';
  object-src 'none'; base-uri 'none'; report-to csp
# The nonce is generated per response; switch to the enforcing header once reports are clean
```

## Częste błędy

- `'unsafe-inline'` w `script-src` bez nonce; polityka wtedy praktycznie nie chroni przed XSS.
- Stały nonce zapisany w konfiguracji lub cache'owany razem ze stroną.
