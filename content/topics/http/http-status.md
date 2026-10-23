---
title: Kody statusu HTTP
level: mid
added: 2026-10-20
tags:
  - status
  - "200"
  - "404"
  - "500"
  - "401"
  - "403"
summary: "Trzycyfrowy kod mówi, jak zakończyło się zapytanie. Pierwsza cyfra to klasa: 2xx sukces, 3xx przekierowanie, 4xx błąd klienta, 5xx błąd serwera."
sources:
  - title: "MDN: HTTP response status codes"
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status
  - title: HTTP Cats (zapamiętywanie kodów)
    url: https://http.cat/
---

## Wyjaśnienie

| Kod | Znaczenie | Kiedy |
|---|---|---|
| `200 OK` | sukces | GET, PUT, PATCH z body |
| `201 Created` | utworzono | POST, z nagłówkiem `Location` |
| `204 No Content` | sukces bez body | DELETE, PUT bez odpowiedzi |
| `301` / `308` | trwałe przekierowanie | zmiana URL (SEO) |
| `302` / `307` | tymczasowe przekierowanie | `307`/`308` zachowują metodę |
| `304 Not Modified` | użyj wersji z cache | odpowiedź na `If-None-Match` |
| `400 Bad Request` | błędne zapytanie | zły format danych |
| `401 Unauthorized` | **brak uwierzytelnienia** | brak lub zły token: "kim jesteś?" |
| `403 Forbidden` | **brak uprawnień** | wiemy, kim jesteś, ale nie wolno |
| `404 Not Found` | brak zasobu | |
| `409 Conflict` | konflikt stanu | np. edycja nieaktualnej wersji |
| `422 Unprocessable Content` | walidacja nie przeszła | poprawny JSON, złe wartości |
| `429 Too Many Requests` | rate limiting | z nagłówkiem `Retry-After` |
| `500 Internal Server Error` | błąd serwera | |
| `502` / `503` / `504` | problem z bramą / niedostępność / timeout | infrastruktura |

Na froncie: 4xx zwykle pokazujesz użytkownikowi (np. błędy walidacji), 5xx i błędy sieci obsługujesz ogólnym komunikatem i ewentualnym ponowieniem. `401` często wyzwala odświeżenie tokenu lub przekierowanie do logowania.

## Częste błędy

- Zwracanie `200` z `{ "error": "..." }` w body: łamie cache, monitoring i logikę klienta.
- Mylenie `401` z `403`.

## Pytania

### Różnica między 401 a 403? {#http-status-q1}

`401 Unauthorized` oznacza brak lub nieważne uwierzytelnienie (serwer nie wie, kim jesteś). `403 Forbidden` oznacza, że wiadomo, kim jesteś, ale nie masz uprawnień. Na `401` można spróbować się zalogować lub odświeżyć token; na `403` ponowienie nic nie da.

### Kiedy 201, a kiedy 204? {#http-status-q2}

`201 Created` po utworzeniu zasobu (zwykle `POST`), najlepiej z nagłówkiem `Location`. `204 No Content` gdy operacja się udała, ale nie ma czego zwrócić (np. `DELETE`).

### Co oznacza 304? {#http-status-q3}

Zasób się nie zmienił od wersji, którą klient ma w cache (walidacja przez `ETag`/`If-None-Match` lub `Last-Modified`). Serwer nie wysyła body, oszczędzając transfer.

## Quiz

### Użytkownik jest zalogowany, ale nie ma uprawnień do zasobu. Jaki status? {#http-status-z1}

- [ ] 401
- [x] 403
- [ ] 404
- [ ] 400

403 Forbidden: tożsamość znana, brak uprawnień. 401 to brak uwierzytelnienia.

### Po poprawnym `DELETE /offers/42` bez treści odpowiedzi serwer zwraca zwykle: {#http-status-z2}

- [ ] 200 OK z pustym JSON
- [x] 204 No Content
- [ ] 201 Created
- [ ] 304 Not Modified

204 oznacza sukces bez body.
