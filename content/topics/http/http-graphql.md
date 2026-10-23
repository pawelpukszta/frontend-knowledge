---
title: "GraphQL: podstawy"
level: mid
added: 2026-10-20
tags:
  - GraphQL
  - query
  - mutation
  - schema
  - resolver
summary: GraphQL to język zapytań do API z jednym endpointem. Klient sam opisuje, jakich pól potrzebuje, a silnie typowany schemat definiuje, co jest dostępne.
sources:
  - title: "GraphQL: Learn"
    url: https://graphql.org/learn/
  - title: "GraphQL: Queries"
    url: https://graphql.org/learn/queries/
---

## Wyjaśnienie

- **Schema**: typy danych i dostępne operacje, zdefiniowane po stronie serwera (SDL).
- **Query**: odczyt. **Mutation**: zapis. **Subscription**: dane w czasie rzeczywistym.
- **Resolvers**: funkcje na serwerze, które pobierają dane dla poszczególnych pól.
- Zwykle jeden endpoint `POST /graphql`; odpowiedź ma kształt zapytania.
- Błędy zwracane w polu `errors`, często ze statusem `200`.
- Klienci: Apollo Client, urql, Relay; generowanie typów TS przez GraphQL Codegen.

## Kod

```graphql
query OfferPage($id: ID!) {
  offer(id: $id) {
    title
    price
    hotel { name stars }
    reviews(first: 3) { rating text }
  }
}

mutation Book($offerId: ID!) {
  createBooking(offerId: $offerId) { id status }
}
```

## Pytania

### Czym jest GraphQL? {#http-graphql-q1}

Językiem zapytań i runtime'em dla API. Serwer publikuje silnie typowany schemat, a klient w jednym zapytaniu pobiera dokładnie te pola i relacje, których potrzebuje, zwykle przez jeden endpoint.

### Czym jest problem N+1 w GraphQL? {#http-graphql-q2}

Resolver pola listy wywołuje osobne zapytanie do bazy dla każdego elementu (1 zapytanie o listę + N zapytań o szczegóły). Rozwiązuje się to batchingiem, np. DataLoader.
