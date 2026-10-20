---
title: Kompresja zasobów tekstowych
priority: high
sources:
  - title: "web.dev: Reduce the size of text resources"
    url: https://web.dev/articles/reduce-network-payloads-using-text-compression
---

HTML, CSS, JS, JSON, SVG i fonty inne niż WOFF2 są wysyłane skompresowane: Brotli (lub zstd) z gzip jako zapasem. Kompresja zmniejsza transfer tekstu zwykle o 70-80%.

## Dlaczego to ważne

- Bundle 600 KB po kompresji to ok. 150 KB; różnica ma bezpośredni wpływ na FCP, LCP i koszt transferu u użytkownika.
- Brotli daje zwykle kilkanaście procent mniejsze pliki niż gzip; zasoby statyczne warto kompresować z najwyższym poziomem już przy buildzie, a dynamiczny HTML niższym, szybszym poziomem.
- Nie kompresuj ponownie formatów już skompresowanych (JPEG, AVIF, WebP, WOFF2, MP4): to strata CPU bez zysku.

## Jak sprawdzić

Kolumna lub nagłówek `Content-Encoding` w Network (włącz "Big request rows", by widzieć rozmiar przed i po kompresji); `curl` z nagłówkiem `Accept-Encoding`.

## Kod

```bash title="Sprawdzenie kompresji z linii poleceń"
# Expect "content-encoding: br" (or zstd/gzip) and "vary: Accept-Encoding"
curl -sI -H 'Accept-Encoding: br, gzip' https://example.pl/assets/app.3f2a9c.js \
  | grep -iE 'content-encoding|content-length|vary'

# Compare raw vs compressed size of a build artifact
ls -lh dist/assets/app.3f2a9c.js
brotli -q 11 -c dist/assets/app.3f2a9c.js | wc -c
```

## Częste błędy

- Kompresja włączona tylko dla HTML, a API zwracające duże JSON-y z listą ofert idą bez kompresji.
