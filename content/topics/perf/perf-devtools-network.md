---
title: "DevTools: zakładka Network"
level: mid
added: 2026-10-20
tags:
  - DevTools
  - Network panel
  - waterfall
  - throttling
  - cache
summary: "Pokazuje każde zapytanie sieciowe: kolejność, czas, rozmiar, priorytet i nagłówki. Podstawowe narzędzie do debugowania API, cache i wolnego ładowania."
sources:
  - title: "Chrome DevTools: Network features reference"
    url: https://developer.chrome.com/docs/devtools/network/reference
  - title: "Chrome DevTools: Inspect network activity"
    url: https://developer.chrome.com/docs/devtools/network
---

## Wyjaśnienie

Najważniejsze funkcje:

- **Waterfall**: oś czasu zapytań. Szukaj **łańcuchów zależności** (zasób odkrywany dopiero po pobraniu innego) i długich bloków oczekiwania.
- **Timing** (po kliknięciu zapytania): Queueing, Stalled, DNS Lookup, Initial connection, SSL, Request sent, **Waiting for server response (TTFB)**, Content Download.
- **Throttling** (Fast 4G, Slow 4G, 3G, offline) i **Disable cache**.
- Kolumny do włączenia: **Priority**, **Protocol** (h2/h3), **Initiator** (kto wywołał request), Size (transferred vs resource: kompresja, cache).
- **Filtry**: Fetch/XHR, JS, CSS, Img, Doc; wyszukiwanie po treści.
- Nagłówki i **Response/Preview**, zakładka **Cookies**.
- **Preserve log** (logi po przeładowaniu i przekierowaniach).
- **Request blocking** i **Local overrides** (podmiana odpowiedzi API lub plików bez zmiany serwera).
- **Copy as fetch / cURL** i eksport **HAR** do zgłoszeń błędów.

Status "(memory cache)" / "(disk cache)" w kolumnie Size oznacza odpowiedź z cache.

## Pytania

### Jak sprawdzisz, czy zasób jest serwowany z cache? {#perf-devtools-network-q1}

W Network w kolumnie Size pojawi się "(memory cache)" lub "(disk cache)", albo status `304` przy walidacji. W nagłówkach odpowiedzi sprawdzam `Cache-Control`, `ETag`, `Age` i nagłówki CDN (np. `x-cache: HIT`).

### Jak znaleźć przyczynę długiego ładowania zasobu? {#perf-devtools-network-q2}

Kliknąć zapytanie i zakładkę Timing. Długie "Waiting for server response" oznacza wolny serwer (TTFB), długie "Content Download" duży plik lub wolną sieć, "Queueing/Stalled" limity połączeń lub priorytety. W waterfall sprawdzam też, czy zasób nie jest odkrywany za późno (Initiator).
