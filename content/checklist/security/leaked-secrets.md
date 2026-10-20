---
title: Brak sekretów w kodzie klienta
priority: critical
sources:
  - title: Gitleaks
    url: https://github.com/gitleaks/gitleaks
---

Klucze API, hasła i tokeny w bundlu JS, source mapach, repozytorium czy publicznym `.env` są dostępne dla każdego. Zmienne z prefiksem `NEXT_PUBLIC_` lub `VITE_` trafiają do przeglądarki, więc mogą zawierać tylko wartości publiczne.

## Dlaczego to ważne

- Boty skanują publiczne repozytoria i bundle w poszukiwaniu kluczy chmurowych w ciągu minut od publikacji; wyciek klucza płatności lub AWS oznacza realne koszty.
- Usunięcie sekretu w kolejnym commicie nie wystarcza: zostaje w historii Git i w zbudowanych plikach; jedyna poprawna reakcja to unieważnienie i rotacja klucza.
- Publicznie dostępne `/.env`, `/.git/` lub source mapy z komentarzami to częsta przyczyna wycieków w małych wdrożeniach.

## Jak sprawdzić

Skan repozytorium i historii (gitleaks, GitHub secret scanning z push protection); wyszukaj w zbudowanym bundlu wzorce kluczy; sprawdź `curl -I https://example.pl/.env` i `/.git/config` na produkcji (oczekiwane 404).

## Kod

```txt title=".env"
# Exposed to the browser bundle: public values only
NEXT_PUBLIC_MAPS_KEY=pk_live_restricted_to_example_pl
NEXT_PUBLIC_API_URL=https://api.example.pl

# Server only: never prefix with NEXT_PUBLIC_ or VITE_
PAYMENT_SECRET_KEY=sk_live_...
DATABASE_URL=postgres://...
```

```yaml title=".github/workflows/secrets.yml"
name: secret-scan
on: [push, pull_request]
jobs:
  gitleaks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # scan full history
      - uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          # organization repositories also need GITLEAKS_LICENSE
```

## Częste błędy

- Klucz publiczny (np. do map) bez ograniczeń domeny i zakresu w konsoli dostawcy.
- "Ukrywanie" sekretu przez base64 lub zaciemnienie kodu.
