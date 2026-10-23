---
title: REST vs GraphQL
level: mid
added: 2026-10-20
tags:
  - REST
  - GraphQL
  - porównanie
  - overfetching
summary: REST to wiele endpointów o stałym kształcie, proste cache HTTP. GraphQL to jeden endpoint i elastyczne zapytania, bez overfetchingu, ale z bardziej złożoną infrastrukturą.
sources:
  - title: "GraphQL: Learn"
    url: https://graphql.org/learn/
  - title: "MDN: HTTP Overview"
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview
---

## Wyjaśnienie

| | REST | GraphQL |
|---|---|---|
| Endpointy | wiele (`/offers`, `/users`) | zwykle jeden (`/graphql`) |
| Kształt odpowiedzi | ustala serwer | ustala klient |
| Over/underfetching | częsty (za dużo pól lub kilka requestów) | eliminowany |
| Cache HTTP / CDN | naturalny (GET + URL) | trudniejszy (POST); cache po stronie klienta (Apollo) lub persisted queries |
| Typowanie | opcjonalnie (OpenAPI) | wbudowany schemat |
| Wersjonowanie | `/v1`, `/v2` | ewolucja schematu, deprecacja pól |
| Upload plików, statusy | proste | wymaga konwencji |
| Ryzyka | wiele round-tripów | złożone zapytania obciążające serwer, N+1, trudniejszy rate limiting |

**Kiedy REST**: proste CRUD, publiczne API, mocne wykorzystanie cache CDN, mały zespół.
**Kiedy GraphQL**: wiele klientów (web, mobile) z różnymi potrzebami, złożone relacje danych, szybka ewolucja UI.

Alternatywy: **BFF** (Backend for Frontend), **tRPC** (typowane RPC w monorepo TS).

## Pytania

### Jakie są główne różnice między REST a GraphQL? {#http-rest-vs-graphql-q1}

REST udostępnia wiele zasobów pod różnymi URL-ami o stałym kształcie odpowiedzi i dobrze współpracuje z cache HTTP. GraphQL ma jeden endpoint i schemat, a klient sam wybiera pola, co eliminuje over- i underfetching kosztem bardziej złożonego cache, zabezpieczeń (limity złożoności) i infrastruktury.

### Czym są overfetching i underfetching? {#http-rest-vs-graphql-q2}

Overfetching: endpoint zwraca więcej danych, niż potrzebujesz. Underfetching: jeden endpoint nie wystarcza i musisz wykonać kilka zapytań (waterfall). GraphQL rozwiązuje oba, pozwalając pobrać dokładnie potrzebne dane w jednym zapytaniu.

### Co wybrałbyś dla nowego projektu i dlaczego? {#http-rest-vs-graphql-q3}

Zależy od kontekstu. Dla prostego CRUD z jednym klientem REST (plus OpenAPI dla typów): mniej infrastruktury, cache CDN. Dla wielu klientów i złożonego grafu danych GraphQL. Konsekwencje długofalowe: GraphQL wymaga inwestycji w narzędzia i monitoring zapytań, REST może wymagać BFF przy rosnącej liczbie ekranów.

## Quiz

### Główna zaleta GraphQL względem REST to: {#http-rest-vs-graphql-z1}

- [ ] Lepszy cache HTTP w CDN
- [x] Klient pobiera dokładnie potrzebne pola w jednym zapytaniu
- [ ] Brak potrzeby schematu
- [ ] Brak potrzeby serwera

GraphQL eliminuje over- i underfetching. Cache HTTP jest za to prostszy w REST.
