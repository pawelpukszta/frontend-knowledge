---
title: "Metody HTTP: GET, POST, PUT, PATCH, DELETE"
level: mid
added: 2026-10-20
tags:
  - GET
  - POST
  - PUT
  - PATCH
  - DELETE
  - idempotencja
summary: Metoda mówi, co chcesz zrobić z zasobem. Ważne cechy to bezpieczeństwo (nie zmienia danych) i idempotentność (powtórzenie daje ten sam efekt).
sources:
  - title: "MDN: HTTP request methods"
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods
  - title: "MDN Glossary: Idempotent"
    url: https://developer.mozilla.org/en-US/docs/Glossary/Idempotent
  - title: "MDN Glossary: Safe (HTTP Methods)"
    url: https://developer.mozilla.org/en-US/docs/Glossary/Safe/HTTP
---

## Wyjaśnienie

| Metoda | Znaczenie | Safe | Idempotentna | Body |
|---|---|---|---|---|
| `GET` | pobierz zasób | tak | tak | nie |
| `POST` | utwórz / wykonaj akcję | nie | **nie** | tak |
| `PUT` | zastąp cały zasób (lub utwórz pod znanym URL) | nie | tak | tak |
| `PATCH` | zmień część zasobu | nie | nie gwarantowana | tak |
| `DELETE` | usuń zasób | nie | tak | zwykle nie |
| `HEAD` | jak GET, bez body | tak | tak | nie |
| `OPTIONS` | jakie metody są dozwolone (CORS preflight) | tak | tak | nie |

- **Safe**: nie zmienia stanu na serwerze (tylko odczyt).
- **Idempotentna**: wykonanie N razy daje ten sam stan co jeden raz. `DELETE /offers/1` dwa razy: zasób nadal usunięty. `POST /orders` dwa razy: dwa zamówienia.

Dlaczego to ważne: przeglądarki, proxy i biblioteki mogą **ponawiać** idempotentne zapytania. Dla płatności i zamówień przez `POST` stosuje się nagłówek **`Idempotency-Key`**, żeby ponowienie nie utworzyło duplikatu.

## Kod

```http
GET    /offers          -> list
GET    /offers/42       -> one offer
POST   /offers          -> create (201 Created + Location header)
PUT    /offers/42       -> replace whole offer
PATCH  /offers/42       -> { "price": 1999 } partial update
DELETE /offers/42       -> 204 No Content
```

## Pytania

### Czym różni się PUT od PATCH? {#http-methods-q1}

`PUT` zastępuje cały zasób wysłaną reprezentacją (brakujące pola mogą zostać wyczyszczone) i jest idempotentny. `PATCH` wysyła tylko zmiany i nie musi być idempotentny (np. "zwiększ licznik o 1").

### Co oznacza idempotentność i które metody ją mają? {#http-methods-q2}

Powtórzenie zapytania daje taki sam efekt na serwerze jak jednorazowe wykonanie. Idempotentne: `GET`, `HEAD`, `OPTIONS`, `PUT`, `DELETE`. Nieidempotentne: `POST`, zwykle `PATCH`.

### Czy GET może mieć body? {#http-methods-q3}

Specyfikacja nie nadaje mu znaczenia i wiele serwerów, proxy oraz `fetch` w przeglądarce go nie obsługuje. Parametry dla GET przekazuje się w query string.

## Quiz

### Która metoda HTTP NIE jest idempotentna? {#http-methods-z1}

- [ ] PUT
- [ ] DELETE
- [x] POST
- [ ] GET

Dwa identyczne `POST /orders` utworzą dwa zamówienia.

### Czym różni się PATCH od PUT? {#http-methods-z2}

- [x] PATCH zmienia część zasobu, PUT zastępuje cały zasób
- [ ] PATCH usuwa zasób
- [ ] PUT nie ma body
- [ ] Nie ma różnicy

PUT to pełna reprezentacja, PATCH to częściowa zmiana.
