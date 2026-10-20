---
title: Subresource Integrity dla skryptów z CDN
priority: high
sources:
  - title: "MDN: Subresource Integrity"
    url: https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity
---

Atrybut `integrity="sha384-..."` (z `crossorigin`) sprawia, że przeglądarka odrzuci plik zmodyfikowany na serwerze CDN.

## Dlaczego to ważne

- Przejęcie CDN lub konta wydawcy uderza we wszystkie strony, które ładują plik; z SRI przeglądarka zablokuje podmieniony skrypt zamiast go wykonać.
- SRI działa tylko dla statycznych, wersjonowanych plików; skryptów generowanych dynamicznie (jak przejęty w 2024 r. polyfill.io) nie da się nim zabezpieczyć, więc lepiej hostować je samodzielnie.
- Dla zasobów z innej domeny potrzebny jest `crossorigin="anonymous"` i nagłówki CORS po stronie CDN, inaczej przeglądarka zablokuje plik.
- PCI DSS 4.0 (wymaganie 6.4.3) nakazuje kontrolę integralności skryptów na stronach płatności; SRI i CSP to podstawowe narzędzia.

## Jak sprawdzić

Sprawdź skrypty i style ładowane z zewnętrznych domen; błąd integralności widać w konsoli, a zablokowany plik w Network.

## Kod

```html
<script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.13/dayjs.min.js"
        integrity="sha384-REPLACE_WITH_BASE64_HASH"
        crossorigin="anonymous"></script>
```

```bash
# Generate the SRI hash for a pinned file version
curl -s https://cdn.jsdelivr.net/npm/dayjs@1.11.13/dayjs.min.js \
  | openssl dgst -sha384 -binary | openssl base64 -A
```

## Częste błędy

- SRI na adresie bez wersji (`@latest`): każda aktualizacja zmienia hash i blokuje skrypt.
