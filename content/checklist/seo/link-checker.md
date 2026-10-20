---
title: Regularne sprawdzanie linków
priority: medium
---

Automatyczne sprawdzanie wszystkich linków (wewnętrznych i zewnętrznych) wychwytuje błędy, zanim zrobią to użytkownicy.

## Dlaczego to ważne

- Linki psują się "same": partnerzy zmieniają adresy, oferty wygasają, CMS zmienia slugi; ręczna kontrola nie skaluje się powyżej kilkudziesięciu stron.
- Sprawdzanie na pull requeście łapie zepsute linki w nowych treściach, zanim trafią na produkcję.
- Harmonogram (np. raz w tygodniu) z raportem dla zespołu wychwytuje zmiany po stronie serwisów zewnętrznych, na które nie masz wpływu.

## Jak sprawdzić

Crawler w harmonogramie lub narzędzie typu lychee w CI.

## Kod

```yaml title=".github/workflows/links.yml"
name: Link check
on:
  pull_request:
  schedule:
    - cron: "0 6 * * 1" # every Monday 06:00 UTC
jobs:
  lychee:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: lycheeverse/lychee-action@v2
        with:
          # Check content sources; skip sites that block bots
          args: --no-progress --exclude 'linkedin\.com' './content/**/*.md'
          fail: true
```

## Częste błędy

- Raport z crawlera, którego nikt nie czyta, bo nie trafia do żadnego kanału zespołu.
