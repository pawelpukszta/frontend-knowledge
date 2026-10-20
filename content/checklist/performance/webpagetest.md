---
title: Analiza w WebPageTest
priority: high
sources:
  - title: WebPageTest
    url: https://www.webpagetest.org/
---

Waterfall, filmstrip i testy z realnych lokalizacji, przeglądarek i profili sieci pokazują wąskie gardła ładowania niewidoczne lokalnie. Porównuj wersje przed i po zmianie.

## Dlaczego to ważne

- Waterfall pokazuje dokładnie, który zasób czeka na który; widać łańcuchy, późno odkryte obrazy i blokujące skrypty firm trzecich.
- Filmstrip i wideo z ładowania przemawiają do biznesu lepiej niż liczby: widać, ile sekund klient patrzy na pusty ekran.
- Test z lokalizacji bliskiej użytkownikom (np. Frankfurt dla Polski) uwzględnia realne opóźnienia sieci i działanie CDN.

## Jak sprawdzić

Test z lokalizacji bliskiej użytkownikom (np. Europa) na profilu mobilnym (4G), co najmniej 3 przebiegi, z analizą first view i repeat view.

## Kod

```bash title="Test przez API WebPageTest"
# Location ids: see https://www.webpagetest.org/getLocations.php
curl -s "https://www.webpagetest.org/runtest.php?url=https://example.pl/wakacje/grecja\
&location=ec2-eu-central-1:Chrome.4G&runs=3&fvonly=0&mobile=1&f=json" \
  -H "X-WPT-API-KEY: $WPT_API_KEY" | jq -r '.data.userUrl'
```

## Częste błędy

- Analiza tylko pierwszej wizyty: repeat view pokazuje, czy cache przeglądarki w ogóle działa.
