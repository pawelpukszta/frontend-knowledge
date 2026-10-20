---
title: CSRF (Cross-Site Request Forgery)
level: mid
tags:
  - CSRF
  - SameSite
  - cookies
  - token
summary: Złośliwa strona sprawia, że przeglądarka zalogowanego użytkownika wysyła żądanie do Twojego serwisu razem z jego cookies. Serwer myśli, że to prawdziwa akcja użytkownika.
sources:
  - title: "MDN: Cross-site request forgery (CSRF)"
    url: https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/CSRF
  - title: "OWASP: CSRF Prevention Cheat Sheet"
    url: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
---

## Wyjaśnienie

Warunki ataku: uwierzytelnienie przez cookies (dołączane automatycznie) i akcja zmieniająca stan (np. `POST /transfer`), którą da się wywołać z innej strony (formularz, obrazek).

Obrona:

- **`SameSite=Lax`** (domyślne w nowoczesnych przeglądarkach) lub `Strict` dla cookies sesyjnych: cookie nie jest wysyłane przy żądaniach cross-site (Lax dopuszcza nawigację GET).
- **Tokeny CSRF** (synchronizer token, double submit cookie) dla formularzy.
- Sprawdzanie nagłówków `Origin` / `Sec-Fetch-Site`.
- `GET` nigdy nie zmienia stanu.
- Tokeny w nagłówku `Authorization` (zamiast cookies) nie są podatne na CSRF, ale jeśli trzymasz je w `localStorage`, stają się podatne na kradzież przez XSS.

CORS **nie chroni** przed CSRF: blokuje odczyt odpowiedzi, ale żądanie i tak może dotrzeć do serwera.

## Pytania

### Czym jest CSRF i jak mu zapobiec? {#sec-csrf-q1}

Atakiem, w którym obca strona wysyła żądanie do Twojego serwisu z cookies zalogowanego użytkownika. Zapobiegamy przez `SameSite` na cookies, tokeny CSRF, weryfikację `Origin`, nieużywanie GET do zmian stanu.

### XSS vs CSRF? {#sec-csrf-q2}

XSS wykonuje kod atakującego w Twojej stronie (może zrobić wszystko, co użytkownik). CSRF nie wykonuje kodu w Twojej stronie; wykorzystuje automatyczne wysyłanie cookies, żeby wywołać akcję z zewnątrz. XSS zwykle omija zabezpieczenia CSRF.

## Quiz

### Które ustawienie cookie chroni przed CSRF? {#sec-csrf-z1}

- [ ] HttpOnly
- [x] SameSite=Lax/Strict
- [ ] Secure
- [ ] Max-Age

SameSite ogranicza wysyłanie cookies przy żądaniach cross-site. HttpOnly chroni przed odczytem przez JS.
