---
title: "Sesja i tokeny: gdzie je trzymać (JWT, cookies)"
level: senior
tags:
  - JWT
  - cookies
  - localStorage
  - auth
  - refresh token
summary: Najbezpieczniej trzymać sesję w cookie HttpOnly, Secure, SameSite. Tokeny w localStorage są wygodne, ale każdy skrypt na stronie (także z XSS) może je odczytać.
sources:
  - title: "OWASP: Session Management Cheat Sheet"
    url: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
  - title: "MDN: Using HTTP cookies (security)"
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies
  - title: "jwt.io: Introduction to JSON Web Tokens"
    url: https://www.jwt.io/introduction
---

## Wyjaśnienie

| | Cookie HttpOnly | localStorage / sessionStorage | Pamięć JS |
|---|---|---|---|
| Kradzież przez XSS | trudna (JS nie odczyta) | łatwa | możliwa w trakcie sesji |
| CSRF | trzeba chronić (SameSite, token) | brak ryzyka | brak ryzyka |
| Przeżywa odświeżenie | tak | tak | nie |
| Wysyłane automatycznie | tak | nie (ręczny nagłówek) | nie |

- **JWT** to podpisany (nie zaszyfrowany!) token z danymi (claims). Każdy może go zdekodować, ale nie zmienić bez klucza. Nie wkładaj do niego danych wrażliwych. Trudno go unieważnić przed wygaśnięciem, dlatego krótki czas życia + refresh token.
- Typowy wzorzec: krótki access token + refresh token w cookie `HttpOnly`, rotacja refresh tokenów.
- **BFF**: serwer (np. Next.js) trzyma tokeny, a przeglądarka ma tylko cookie sesyjne. Najbezpieczniejsze dla SPA.

## Pytania

### Gdzie trzymać JWT w aplikacji przeglądarkowej? {#sec-auth-storage-q1}

Preferowane jest cookie `HttpOnly; Secure; SameSite=Lax/Strict` (odporne na odczyt przez XSS) z ochroną CSRF, najlepiej w architekturze BFF. `localStorage` jest prostsze, ale każdy wstrzyknięty skrypt odczyta token. Konsekwencje: cookies wymagają konfiguracji CORS z credentials i ochrony CSRF; localStorage zwiększa skutki ewentualnego XSS.

### Czy JWT jest zaszyfrowany? {#sec-auth-storage-q2}

Standardowy JWT (JWS) jest tylko podpisany i zakodowany w base64url. Treść może odczytać każdy, podpis gwarantuje jedynie integralność. Do poufności służy JWE lub po prostu nieumieszczanie wrażliwych danych.

## Quiz

### Czy treść standardowego JWT jest zaszyfrowana? {#sec-auth-storage-z1}

- [ ] Tak, zawsze
- [x] Nie, jest tylko podpisana i zakodowana base64url
- [ ] Tylko w HTTPS
- [ ] Tylko claim "sub"

Każdy może odczytać payload; podpis gwarantuje integralność, nie poufność.
