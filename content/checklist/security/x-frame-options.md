---
title: Ochrona przed clickjackingiem
priority: high
sources:
  - title: "OWASP: Clickjacking Defense Cheat Sheet"
    url: https://cheatsheetseries.owasp.org/cheatsheets/Clickjacking_Defense_Cheat_Sheet.html
---

`Content-Security-Policy: frame-ancestors 'none'` (lub lista dozwolonych domen) blokuje osadzanie strony w obcych ramkach; `X-Frame-Options: DENY` jako uzupełnienie dla starszych klientów.

## Dlaczego to ważne

- Atakujący osadza Twoją stronę w przezroczystej ramce i nakłania użytkownika do kliknięcia "Zapłać" lub "Usuń konto" na stronie, którą ten widzi jako grę lub konkurs.
- `frame-ancestors` pozwala wskazać kilka zaufanych domen (np. portal partnera), czego `X-Frame-Options` nie umie; przy obu nagłówkach przeglądarki stosują `frame-ancestors`.
- Oba mechanizmy działają tylko jako nagłówek HTTP; wersja w `<meta>` jest ignorowana.

## Jak sprawdzić

Nagłówki odpowiedzi; próba osadzenia strony w `<iframe>` na innej domenie (konsola pokaże zablokowanie przez `frame-ancestors`).

## Kod

```http title="Nagłówki odpowiedzi"
# Default: no framing at all
Content-Security-Policy: frame-ancestors 'none'
X-Frame-Options: DENY

# Booking widget page that a trusted partner may embed
Content-Security-Policy: frame-ancestors 'self' https://partner.example.com
```

## Częste błędy

- `X-Frame-Options: ALLOW-FROM`, którego współczesne przeglądarki nie obsługują, więc strona zostaje bez ochrony.
- Skrypty "frame busting" w JavaScripcie zamiast nagłówka.
