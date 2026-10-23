---
title: CORS
level: mid
added: 2026-10-20
tags:
  - CORS
  - same-origin
  - preflight
  - bezpieczeństwo
summary: Przeglądarka domyślnie blokuje odczyt odpowiedzi z innego originu (same-origin policy). CORS to mechanizm nagłówków, którymi serwer zezwala na takie zapytania.
sources:
  - title: "MDN: Cross-Origin Resource Sharing (CORS)"
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS
  - title: "MDN: Same-origin policy"
    url: https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy
---

## Wyjaśnienie

- **Origin** = protokół + domena + port. `https://app.pl` i `https://api.app.pl` to różne originy.
- **Same-origin policy**: skrypt może wysłać zapytanie cross-origin, ale **nie odczyta odpowiedzi**, jeśli serwer na to nie pozwoli.
- Serwer pozwala nagłówkiem `Access-Control-Allow-Origin: https://app.pl`.
- **Preflight**: dla "niestandardowych" zapytań (np. `PUT`, `DELETE`, `Content-Type: application/json`, własne nagłówki) przeglądarka najpierw wysyła `OPTIONS`, pytając o zgodę.
- Cookies cross-origin wymagają `credentials: 'include'` po stronie klienta i `Access-Control-Allow-Credentials: true` (bez `*` w Allow-Origin) po stronie serwera.

**CORS konfiguruje się na serwerze.** Na froncie nie da się go "naprawić"; w dev można użyć proxy (Vite `server.proxy`), żeby zapytania były same-origin.

## Kod

```http
OPTIONS /api/offers HTTP/1.1
Origin: https://app.example.pl
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: content-type

HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.example.pl
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: content-type
Access-Control-Max-Age: 600
```

## Pytania

### Czym jest CORS i kto go wymusza? {#http-cors-q1}

Cross-Origin Resource Sharing: mechanizm, w którym serwer nagłówkami `Access-Control-*` zezwala stronom z innych originów na odczyt odpowiedzi. Wymusza go przeglądarka; curl czy serwer-serwer nie podlegają CORS.

### Czym jest preflight request? {#http-cors-q2}

Automatyczne zapytanie `OPTIONS` wysyłane przed "niestandardowym" zapytaniem cross-origin (inne metody niż GET/POST/HEAD, niestandardowe nagłówki, JSON), aby sprawdzić, czy serwer na nie pozwala.

### Czy CORS chroni serwer przed atakami? {#http-cors-q3}

Nie jest to ochrona serwera. CORS chroni użytkownika, blokując złośliwej stronie odczyt danych z innego originu. Serwer i tak musi mieć autoryzację oraz ochronę przed CSRF.

## Quiz

### Gdzie naprawia się błąd CORS? {#http-cors-z1}

- [ ] W kodzie fetch po stronie frontu
- [x] W konfiguracji serwera (nagłówki Access-Control-*)
- [ ] W ustawieniach przeglądarki użytkownika
- [ ] W pliku tsconfig

To serwer decyduje, jakie originy mogą czytać odpowiedzi.
