---
title: Projektowanie endpointów REST
level: senior
added: 2026-10-20
tags:
  - API design
  - paginacja
  - wersjonowanie
  - filtrowanie
summary: "Dobre REST API jest przewidywalne: rzeczowniki w liczbie mnogiej, zagnieżdżenie dla relacji, query string do filtrowania i paginacji, spójny format błędów."
sources:
  - title: "Microsoft: Web API design best practices"
    url: https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design
  - title: "RFC 9457: Problem Details for HTTP APIs"
    url: https://www.rfc-editor.org/rfc/rfc9457
  - title: OpenAPI Initiative
    url: https://www.openapis.org/
---

## Wyjaśnienie

- **Nazwy**: `/offers`, `/offers/42`, `/offers/42/reviews`. Rzeczowniki w liczbie mnogiej, kebab-case.
- **Filtrowanie, sortowanie**: `/offers?city=rzym&sort=-price&minPrice=1000`.
- **Paginacja**: offset (`?page=2&limit=20`, proste, ale niestabilne przy zmianach danych) lub **cursor** (`?cursor=abc`, stabilne i wydajne dla infinite scroll).
- **Wersjonowanie**: w URL (`/v1/offers`) lub nagłówku. Zmiany łamiące kontrakt = nowa wersja.
- **Spójny format błędów**, np. standard **Problem Details (RFC 9457)**: `{ type, title, status, detail }`.
- **Akcje, które nie pasują do CRUD**: sub-zasób (`POST /orders/42/cancellation`) zamiast `POST /cancelOrder`.
- **Kontrakt**: OpenAPI (Swagger) pozwala generować typy TS i klienta, co eliminuje ręczne pisanie typów odpowiedzi.

## Pytania

### Offset czy cursor pagination? {#http-rest-design-q1}

Offset (`page`, `limit`) jest prosty i pozwala skoczyć do strony N, ale przy dodawaniu danych elementy się duplikują lub znikają, a duże offsety są wolne w bazie. Cursor wskazuje "od którego elementu" i jest stabilny i wydajny, idealny do infinite scroll, ale nie pozwala skoczyć do dowolnej strony. Wybór zależy od UX.

### Jak front może korzystać z kontraktu API? {#http-rest-design-q2}

Z opisu OpenAPI generuje się typy TypeScript i klienta (np. openapi-typescript, orval). Dzięki temu zmiana w API od razu daje błąd kompilacji na froncie, zamiast błędu w runtime.
