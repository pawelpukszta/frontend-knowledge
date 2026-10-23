---
title: Czym jest REST
level: mid
added: 2026-10-20
tags:
  - REST
  - Fielding
  - zasoby
  - architektura
summary: REST to styl architektury API opisany przez Roya Fieldinga. Operujesz na zasobach identyfikowanych przez URL, używając standardowych metod HTTP i bezstanowej komunikacji.
sources:
  - title: "Roy Fielding: REST (Chapter 5 of dissertation)"
    url: https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm
  - title: "Roy Fielding: Dissertation (PDF)"
    url: https://ics.uci.edu/~fielding/pubs/dissertation/fielding_dissertation.pdf
  - title: "MDN Glossary: REST"
    url: https://developer.mozilla.org/en-US/docs/Glossary/REST
---

## Wyjaśnienie

REST (Representational State Transfer) to **zbiór ograniczeń architektonicznych**, a nie protokół ani standard. Kluczowe założenia:

- **Zasoby (resources)**: wszystko jest zasobem z własnym URL, np. `/offers/42`. URL to rzeczowniki, nie czasowniki (`/offers`, a nie `/getOffers`).
- **Jednolity interfejs**: standardowe metody HTTP opisują akcję (`GET` czyta, `POST` tworzy...), statusy opisują wynik.
- **Reprezentacje**: klient dostaje reprezentację zasobu (zwykle JSON), nie sam zasób.
- **Bezstanowość**: każde zapytanie zawiera komplet informacji potrzebnych do obsługi.
- **Cacheability**: odpowiedzi deklarują, czy można je cache'ować.
- **Client-server** i **system warstwowy** (proxy, CDN, load balancer są przezroczyste dla klienta).
- **HATEOAS**: odpowiedzi zawierają linki do dalszych akcji. W praktyce rzadko stosowane; większość "REST API" to tak naprawdę "RESTful HTTP JSON API".

## Analogia

REST to biblioteka: każda książka (zasób) ma swoją sygnaturę (URL). Czynności są zawsze te same: wypożycz (GET), oddaj nową (POST), wymień egzemplarz (PUT), wycofaj (DELETE). Nie potrzebujesz osobnego okienka na każdą książkę.

## Pytania

### Czym jest REST? {#http-rest-q1}

Stylem architektonicznym dla systemów rozproszonych (Roy Fielding, 2000). API REST modeluje dane jako zasoby pod URL-ami, operuje na nich standardowymi metodami HTTP, jest bezstanowe i korzysta z mechanizmów HTTP, takich jak cache i kody statusu.

### Czy każde JSON API po HTTP jest RESTowe? {#http-rest-q2}

Nie. Wiele API używa HTTP jak RPC (`POST /getUserData`), ignorując semantykę metod i statusów. Mówi się wtedy o "RESTful" w luźnym sensie. Pełny REST wg Fieldinga zakłada m.in. HATEOAS, rzadko spotykany w praktyce.
