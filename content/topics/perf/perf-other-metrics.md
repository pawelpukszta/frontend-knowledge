---
title: FCP, TTFB, TBT, Speed Index, TTI
level: mid
added: 2026-10-20
tags:
  - FCP
  - TTFB
  - TBT
  - Speed Index
  - TTI
  - Lighthouse
summary: Metryki pomocnicze, które pomagają zdiagnozować, dlaczego Core Web Vitals są słabe. TTFB i FCP opisują start ładowania, TBT blokowanie wątku, Speed Index tempo pojawiania się treści.
sources:
  - title: "web.dev: Time to First Byte (TTFB)"
    url: https://web.dev/articles/ttfb
  - title: "web.dev: First Contentful Paint (FCP)"
    url: https://web.dev/articles/fcp
  - title: "web.dev: Total Blocking Time (TBT)"
    url: https://web.dev/articles/tbt
  - title: "Chrome: Lighthouse performance scoring"
    url: https://developer.chrome.com/docs/lighthouse/performance/performance-scoring
---

## Wyjaśnienie

| Metryka | Co mierzy | Dobry wynik |
|---|---|---|
| **TTFB** (Time to First Byte) | od żądania do pierwszego bajtu odpowiedzi (DNS, TCP, TLS, serwer) | ≤ 0,8 s |
| **FCP** (First Contentful Paint) | pierwszy wyrenderowany tekst lub obraz | ≤ 1,8 s |
| **TBT** (Total Blocking Time) | suma "nadwyżek" long tasks ponad 50 ms (lab) | ≤ 200 ms |
| **Speed Index** | jak szybko wizualnie wypełnia się viewport (lab) | ≤ 3,4 s (mobile) |
| **TTI** (Time to Interactive) | kiedy strona jest stabilnie interaktywna | usunięta z wyniku Lighthouse 10 |

- TTFB i FCP są "diagnostyczne": słaby TTFB automatycznie pogarsza FCP i LCP.
- W wyniku Lighthouse największe wagi mają TBT, LCP i CLS; FCP i Speed Index mniejsze.
- TTI zastąpiono TBT i INP, bo słabo korelował z odczuciami użytkowników.

## Pytania

### Czym jest TTFB i co na niego wpływa? {#perf-other-metrics-q1}

Czas od wysłania żądania do otrzymania pierwszego bajtu odpowiedzi. Składają się na niego przekierowania, DNS, nawiązanie połączenia (TCP, TLS), czas przetwarzania na serwerze i odległość od serwera. Poprawiasz go przez CDN, cache, SSG/ISR, szybsze zapytania do bazy, streaming.

### FCP vs LCP? {#perf-other-metrics-q2}

FCP to pierwszy moment, gdy cokolwiek z treści (tekst, obraz) pojawia się na ekranie. LCP to moment wyrenderowania największego elementu, czyli zwykle głównej treści. FCP mówi "coś się dzieje", LCP "widać to, po co przyszedłem".
