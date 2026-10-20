---
title: Krótkie adresy URL
priority: medium
---

Ścieżka najlepiej poniżej ok. 60 znaków i do 4 segmentów; bez dat w treściach "evergreen" i bez identyfikatorów sesji.

## Dlaczego to ważne

- Krótki adres jest czytelny w wynikach i przy udostępnianiu, łatwiej go podyktować przez telefon i wkleić w wiadomość.
- Daty w ścieżce (`/2024/05/kreta`) postarzają treść aktualizowaną co roku i wymuszają przekierowania przy jej odświeżeniu.
- Identyfikatory sesji w URL (`;jsessionid=`, `?sid=`) tworzą nieskończenie wiele duplikatów i mogą ujawnić sesję użytkownika po udostępnieniu linku.

## Jak sprawdzić

Raport długości URL w crawlerze.

## Kod

```txt
Źle:    https://example.pl/kategorie/oferty-wakacyjne/europa/grecja/wyspy/kreta/hotel-olimp-4-gwiazdki?sid=8f3a
Dobrze: https://example.pl/wakacje/grecja/kreta/hotel-olimp

Źle:    https://example.pl/blog/2023/03/14/co-warto-zabrac-ze-soba-na-wakacje-pelna-lista
Dobrze: https://example.pl/blog/co-zabrac-na-wakacje
```

## Częste błędy

- Skracanie istniejących adresów bez planu przekierowań 301.
