---
title: Bez adresów 4xx w sitemap
priority: high
---

Sitemap zawiera tylko adresy zwracające 200, bez 404, 410, 5xx i przekierowań. Generuj ją automatycznie z aktualnych danych, a nie ręcznie.

## Dlaczego to ważne

- Google traktuje sitemap jako podpowiedź; gdy duża część adresów to błędy, plik traci na wartości i nowe strony są odkrywane wolniej.
- Każdy martwy adres to zmarnowane zapytanie robota i kolejna pozycja w raporcie błędów Search Console, która zasłania prawdziwe problemy.
- Statyczny plik wygenerowany przy wdrożeniu dezaktualizuje się, gdy oferty wygasają codziennie.

## Jak sprawdzić

Crawler w trybie listy dla adresów z sitemap; prosty skrypt w CI (poniżej) dla mniejszych serwisów.

## Kod

```bash title="Statusy adresów z sitemap"
curl -s https://example.pl/sitemap.xml \
  | grep -oP '(?<=<loc>)[^<]+' \
  | while read -r url; do
      code=$(curl -s -o /dev/null -w '%{http_code}' "$url")
      # Anything other than 200 should not be listed
      [ "$code" != "200" ] && echo "$code $url"
    done
```

## Częste błędy

- Wygasłe oferty zostają w sitemap, bo generator nie filtruje po dacie wyjazdu.
- Adresy przekierowujące (301) po zmianie slugów zamiast nowych adresów docelowych.
