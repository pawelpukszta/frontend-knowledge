---
title: Nagłówek HSTS
priority: high
sources:
  - title: "MDN: Strict-Transport-Security"
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Strict-Transport-Security
---

`Strict-Transport-Security: max-age=63072000; includeSubDomains` wymusza HTTPS w przeglądarce przy kolejnych wizytach. Opcjonalnie `preload` i zgłoszenie na hstspreload.org.

## Dlaczego to ważne

- Przekierowanie 301 nie chroni pierwszego żądania po `http://`; atakujący w publicznej sieci może je przechwycić (SSL stripping). HSTS sprawia, że przeglądarka od razu łączy się przez HTTPS.
- Przy HSTS przeglądarka nie pozwala zignorować błędu certyfikatu, więc użytkownik nie "kliknie dalej" na fałszywej stronie.
- Lista preload chroni nawet pierwszą wizytę, ale wpis jest trudny do wycofania; każda subdomena musi mieć działający HTTPS.

## Jak sprawdzić

Nagłówki odpowiedzi w DevTools lub `curl -sI https://example.pl`; securityheaders.com; w Chrome `chrome://net-internals/#hsts` pokazuje stan domeny.

## Kod

```http title="Wdrażanie stopniowe"
# Step 1: short max-age, verify all subdomains work over HTTPS
Strict-Transport-Security: max-age=86400; includeSubDomains

# Step 2: two years, ready for the preload list
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

## Częste błędy

- Dodanie `includeSubDomains` i `preload`, gdy jakaś subdomena (np. stary panel partnera) działa tylko po HTTP.
- Wysyłanie HSTS w odpowiedziach HTTP; przeglądarka uwzględnia go tylko przez HTTPS.
