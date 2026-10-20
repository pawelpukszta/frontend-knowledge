---
title: Nagłówek Referrer-Policy
priority: medium
sources:
  - title: "MDN: Referrer-Policy"
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy
---

`strict-origin-when-cross-origin` (domyślne w przeglądarkach) lub bardziej restrykcyjne, ustawione jawnie, żeby pełne adresy z parametrami nie wyciekały do innych serwisów.

## Dlaczego to ważne

- Adresy bywają wrażliwe: `/rezerwacja/48213?email=jan@example.pl&token=...` w nagłówku `Referer` trafiłby do każdego zewnętrznego skryptu, obrazka czy linku.
- Przy `strict-origin-when-cross-origin` inne domeny widzą tylko origin (`https://example.pl/`), a Twoja analityka w obrębie serwisu nadal dostaje pełne ścieżki.
- Jawny nagłówek nie zależy od domyślnych ustawień przeglądarek i klientów osadzonych (webview), które mogą się różnić.

## Jak sprawdzić

Nagłówki odpowiedzi; w Network sprawdź nagłówek `Referer` w żądaniach do zewnętrznych domen.

## Kod

```http title="Cały serwis"
# Same-origin: full URL; cross-origin HTTPS: origin only; HTTPS to HTTP: nothing
Referrer-Policy: strict-origin-when-cross-origin

# Example: a link from https://example.pl/rezerwacja/48213?email=... to another site
# sends only "Referer: https://example.pl/"
```

```html title="Wyjątek dla wrażliwej podstrony lub linku"
<!-- Booking confirmation page: send no referrer at all -->
<meta name="referrer" content="no-referrer" />

<a href="https://partner.example.com/transfer" referrerpolicy="no-referrer">Zamów transfer z lotniska</a>
```

## Częste błędy

- `unsafe-url` ustawione dla wygody analityki partnerów; wysyła pełny adres nawet na HTTP.
- Dane osobowe lub tokeny w parametrach URL; Referrer-Policy łagodzi skutki, ale nie usuwa problemu.
