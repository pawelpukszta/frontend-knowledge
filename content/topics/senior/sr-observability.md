---
title: Monitoring i observability na froncie
level: senior
tags:
  - observability
  - monitoring
  - Sentry
  - RUM
  - logi
  - alerty
summary: "Musisz wiedzieć, co dzieje się u użytkowników: błędy JS, wydajność (RUM), zachowanie w kluczowych ścieżkach. Bez tego dowiadujesz się o problemach z reklamacji."
sources:
  - title: "Sentry: JavaScript docs"
    url: https://docs.sentry.io/platforms/javascript/
  - title: "OpenTelemetry: Browser"
    url: https://opentelemetry.io/docs/languages/js/getting-started/browser/
  - title: "React: Error boundaries"
    url: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
---

## Wyjaśnienie

- **Error tracking**: Sentry, Datadog, Bugsnag. Zbieranie wyjątków z source maps (wgrywanych do narzędzia, niekoniecznie publicznych), release tracking, powiązanie z deployem.
- **RUM**: Core Web Vitals od prawdziwych użytkowników (`web-vitals`, narzędzia APM) z podziałem na strony, urządzenia i wersje.
- **Logi i tracing**: correlation/trace ID przekazywany z frontu do backendu (OpenTelemetry), żeby prześledzić żądanie przez system.
- **Metryki biznesowe**: konwersja lejka, porzucenia, błędy płatności.
- **Alerty** na skoki błędów i regresje wydajności po wdrożeniu; **feature flags** do szybkiego wycofania.
- W React: **Error Boundaries** przechwytują błędy renderu i pokazują fallback zamiast białego ekranu.

Monitoring odpowiada na "czy coś jest nie tak?", observability na "dlaczego?", dzięki bogatemu kontekstowi (release, użytkownik, urządzenie, ślad akcji).

## Pytania

### Jak monitorujesz aplikację front-end na produkcji? {#sr-observability-q1}

Error tracking z source maps i powiązaniem z wydaniami (np. Sentry), RUM dla Core Web Vitals, trace ID przekazywane do backendu, metryki biznesowe kluczowych ścieżek i alerty po wdrożeniach. Error Boundaries w React zapobiegają białemu ekranowi, a feature flags pozwalają szybko wyłączyć problematyczną funkcję.

### Czym różni się monitoring od observability? {#sr-observability-q2}

Monitoring śledzi znane metryki i alarmuje, gdy przekroczą progi. Observability to zdolność zrozumienia nieznanych problemów na podstawie danych (logi, metryki, trace'y z kontekstem), bez dopisywania nowego kodu.
