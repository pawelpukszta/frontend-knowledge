---
title: "Storage w przeglądarce: cookies, localStorage, sessionStorage, IndexedDB"
level: mid
added: 2026-10-20
tags:
  - localStorage
  - sessionStorage
  - cookies
  - IndexedDB
summary: Cookies są wysyłane z każdym requestem i mogą być httpOnly. localStorage trwa do usunięcia, sessionStorage do zamknięcia karty. IndexedDB to asynchroniczna baza na większe dane.
sources:
  - title: "MDN: Web Storage API"
    url: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
  - title: "MDN: Using HTTP cookies"
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies
  - title: "MDN: IndexedDB API"
    url: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
---

## Wyjaśnienie

| | Pojemność | Czas życia | Wysyłane do serwera | Dostęp z JS | API |
|---|---|---|---|---|---|
| Cookies | ok. 4 KB | `Expires`/`Max-Age` lub sesja | tak, automatycznie | nie, gdy `HttpOnly` | string |
| localStorage | ok. 5-10 MB | do usunięcia | nie | tak | synchroniczne |
| sessionStorage | ok. 5 MB | do zamknięcia karty | nie | tak | synchroniczne |
| IndexedDB | duża (zależna od dysku) | do usunięcia | nie | tak | asynchroniczne, transakcje |
| Cache API | duża | do usunięcia | nie | tak (głównie Service Worker) | Request/Response |

Atrybuty cookies: `HttpOnly` (niedostępne z JS, ochrona przed kradzieżą przez XSS), `Secure` (tylko HTTPS), `SameSite=Lax/Strict/None` (ochrona przed CSRF).

`localStorage` jest synchroniczne (blokuje wątek przy dużych danych) i dostępne dla każdego skryptu na stronie, więc nie trzymaj w nim tokenów sesyjnych ani danych wrażliwych.

## Pytania

### localStorage vs sessionStorage vs cookies? {#dom-storage-q1}

Cookies są małe i automatycznie dołączane do requestów (sesja, auth), mogą być `HttpOnly`. `localStorage` przechowuje dane bez limitu czasu, `sessionStorage` do zamknięcia karty; oba tylko po stronie klienta, synchroniczne, ok. 5 MB.

### Gdzie trzymać token uwierzytelniający? {#dom-storage-q2}

Najbezpieczniej w cookie `HttpOnly; Secure; SameSite`, bo skrypt (także złośliwy przez XSS) go nie odczyta. `localStorage` jest dostępny dla każdego JS na stronie. Wybór pociąga konieczność ochrony przed CSRF (SameSite, tokeny CSRF).

## Quiz

### Która przestrzeń nie jest dostępna z JavaScriptu, gdy ma odpowiednią flagę? {#dom-storage-z1}

- [ ] localStorage
- [ ] sessionStorage
- [x] Cookie z flagą HttpOnly
- [ ] IndexedDB

`HttpOnly` blokuje dostęp przez `document.cookie`.
