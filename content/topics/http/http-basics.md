---
title: "HTTP: request, response, nagłówki"
level: mid
tags:
  - HTTP
  - request
  - response
  - headers
  - HTTP/2
  - HTTP/3
summary: HTTP to bezstanowy protokół zapytanie-odpowiedź. Klient wysyła metodę, ścieżkę, nagłówki i opcjonalne body; serwer odpowiada statusem, nagłówkami i body.
sources:
  - title: "MDN: An overview of HTTP"
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview
  - title: "MDN: HTTP headers"
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers
---

## Wyjaśnienie

**Request**: metoda (`GET`), URL, wersja, nagłówki (`Accept`, `Authorization`, `Content-Type`, `Cookie`), opcjonalne body.

**Response**: kod statusu (`200 OK`), nagłówki (`Content-Type`, `Cache-Control`, `Set-Cookie`), body.

- **Bezstanowość**: serwer nie pamięta poprzednich zapytań. Stan (sesję) przenoszą cookies lub tokeny.
- **HTTPS** = HTTP + TLS (szyfrowanie, integralność, uwierzytelnienie serwera).
- **HTTP/2**: wiele zapytań równolegle w jednym połączeniu (multiplexing), kompresja nagłówków. Łączenie plików w jeden bundle ma mniejsze znaczenie niż za czasów HTTP/1.1.
- **HTTP/3**: działa na QUIC (UDP), szybsze nawiązywanie połączenia i brak blokowania całego połączenia przez zgubiony pakiet.

## Kod

```http
GET /api/offers?city=rzym HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer eyJhbGciOi...

HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=60

[{ "id": 1, "city": "Rzym", "price": 2400 }]
```

## Pytania

### Co to znaczy, że HTTP jest bezstanowy? {#http-basics-q1}

Każde zapytanie jest niezależne; serwer nie przechowuje kontekstu między nimi z samego protokołu. Sesję przenosi się w każdym zapytaniu, np. przez cookie lub nagłówek `Authorization`.

### Co daje HTTP/2 w porównaniu z HTTP/1.1? {#http-basics-q2}

Multiplexing wielu zapytań w jednym połączeniu TCP, kompresję nagłówków (HPACK) i binarny format ramek. W efekcie mniej kosztowne są liczne małe pliki, a techniki typu domain sharding tracą sens.
