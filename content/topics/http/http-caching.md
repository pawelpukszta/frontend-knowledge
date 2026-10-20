---
title: "Cache HTTP: Cache-Control, ETag"
level: senior
tags:
  - cache
  - Cache-Control
  - ETag
  - CDN
  - stale-while-revalidate
summary: Nagłówki cache decydują, czy przeglądarka i CDN mogą użyć zapisanej odpowiedzi. Dobrze ustawiony cache to najtańsza optymalizacja wydajności.
sources:
  - title: "MDN: HTTP caching"
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching
  - title: "MDN: Cache-Control"
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control
  - title: "web.dev: Love your cache"
    url: https://web.dev/articles/love-your-cache
---

## Wyjaśnienie

- **`Cache-Control: max-age=31536000, immutable`**: dla plików z hashem w nazwie (`app.3f9a1c.js`). Po zmianie treści zmienia się nazwa, więc można cache'ować "na zawsze".
- **`Cache-Control: no-cache`**: można zapisać, ale **trzeba zwalidować** z serwerem przed użyciem (typowo dla HTML).
- **`no-store`**: nie zapisuj wcale (dane wrażliwe).
- **`private` / `public`**: tylko przeglądarka / także CDN i proxy.
- **`s-maxage`**: czas życia w CDN.
- **`stale-while-revalidate=60`**: podaj starą wersję od razu i odśwież w tle.
- **Walidacja**: serwer wysyła `ETag` (hash wersji). Przeglądarka pyta `If-None-Match: "abc"`, serwer odpowiada `304 Not Modified` bez body.

Typowa strategia: HTML `no-cache`, statyczne assety z hashem `immutable` na rok, API krótko lub wcale, w zależności od danych.

## Pytania

### Jaka jest różnica między no-cache a no-store? {#http-caching-q1}

`no-cache` pozwala zapisać odpowiedź, ale przed każdym użyciem trzeba ją zwalidować z serwerem (może wrócić `304`). `no-store` zabrania zapisywania w ogóle.

### Jak cache'ować pliki JS i CSS po buildzie? {#http-caching-q2}

Bundler dodaje hash treści do nazwy pliku, więc można ustawić `Cache-Control: public, max-age=31536000, immutable`. HTML, który do nich linkuje, cache'ujemy krótko lub z walidacją, żeby po deployu pobrał nowe nazwy.
