---
title: Poprawne nagłówki Content-Type
priority: medium
---

`text/html; charset=utf-8`, `text/css`, `text/javascript`, `application/xml` itd. Błędny typ może zablokować zasób (przy `nosniff`) lub zmienić sposób jego przetwarzania.

## Dlaczego to ważne

- Z nagłówkiem `X-Content-Type-Options: nosniff` przeglądarka odrzuci skrypt lub arkusz z błędnym typem (np. `text/plain`), a strona straci style lub interaktywność.
- Brak `charset=utf-8` w nagłówku lub `<meta charset>` może zepsuć polskie znaki ("zażółć" zamienia się w krzaki).
- Skrypty modułowe (`type="module"`) wymagają poprawnego typu JavaScript nawet bez `nosniff`; inaczej się nie wykonają.

## Jak sprawdzić

`curl -I` dla typowych zasobów; zakładka Network (kolumna Type i ostrzeżenia w konsoli).

## Kod

```bash
for path in / /assets/app.css /assets/app.js /sitemap.xml /robots.txt; do
  printf '%-20s ' "$path"
  curl -sI "https://example.pl$path" | grep -i '^content-type' | tr -d '\r'
done
# Expected: text/html; charset=utf-8 | text/css | text/javascript
#           application/xml | text/plain
```

## Częste błędy

- Serwer zwracający `application/octet-stream` dla plików `.mjs` lub `.webmanifest`.
