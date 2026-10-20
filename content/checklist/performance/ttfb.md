---
title: Krótki czas do pierwszego bajtu (TTFB)
priority: medium
sources:
  - title: "web.dev: Optimize TTFB"
    url: https://web.dev/articles/optimize-ttfb
---

Dobry TTFB to do 0,8 s na 75. percentylu. Pomagają CDN, cache na serwerze i brzegu sieci, SSG/ISR, szybsze zapytania do bazy, streaming i unikanie przekierowań.

## Dlaczego to ważne

- TTFB poprzedza wszystko inne: żaden zasób ani piksel nie pojawi się wcześniej, więc wolny backend zjada budżet LCP, zanim frontend ma szansę zadziałać.
- Każde przekierowanie (np. `http` na `https`, potem na `www`, potem na wersję językową) to osobny round-trip, na sieci mobilnej często 100-300 ms.
- Strony generowane dla każdego zapytania od zera (bez cache) przy kampanii lub wyprzedaży last minute obciążają bazę i TTFB rośnie właśnie wtedy, gdy ruch jest najcenniejszy.

## Jak sprawdzić

Zakładka Timing żądania dokumentu w Network ("Waiting for server response"), PageSpeed Insights (field), nagłówek `Server-Timing` widoczny w DevTools.

## Kod

```http title="Odpowiedź z cache na CDN i pomiarem czasu serwera"
HTTP/2 200
content-type: text/html; charset=utf-8
cache-control: public, max-age=0, s-maxage=300, stale-while-revalidate=3600
server-timing: db;dur=38;desc="offers query", render;dur=22, cdn-cache;desc=HIT
age: 41
```

## Częste błędy

- Mierzenie TTFB tylko z serwera w tym samym regionie co aplikacja; użytkownik z Polski łączący się z backendem w USA ma zupełnie inny wynik.
