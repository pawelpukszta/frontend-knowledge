---
title: "Middleware: funkcja pośrednicząca w pipeline requesta"
level: mid
added: 2026-10-20
tags:
  - middleware
  - Express
  - next()
  - pipeline
  - req
  - res
summary: Middleware to funkcja, która dostaje request i response, może je zmodyfikować, zakończyć odpowiedź albo przekazać sterowanie dalej przez next(). Łańcuch middleware tworzy pipeline obsługi requestu.
flow:
  - Request
  - helmet + CORS
  - express.json()
  - logger
  - auth
  - route handler
  - Response
sources:
  - title: "Express: Using middleware"
    url: https://expressjs.com/en/guide/using-middleware.html
  - title: "Express: Writing middleware"
    url: https://expressjs.com/en/guide/writing-middleware.html
  - title: "Node.js: Anatomy of an HTTP Transaction"
    url: https://nodejs.org/learn/http/anatomy-of-an-http-transaction
---

## Wyjaśnienie

Sygnatura w Express: `(req, res, next) => { ... }`. Middleware może:

1. Wykonać dowolny kod (logowanie, pomiar czasu).
2. Zmodyfikować `req` i `res` (np. dodać `req.user`).
3. **Zakończyć** cykl (`res.status(401).json(...)`).
4. **Przekazać dalej**: `next()`. Bez `next()` i bez odpowiedzi request "zawiśnie".

**Kolejność ma znaczenie**: middleware wykonują się w kolejności rejestracji (`app.use`). Typowy pipeline: bezpieczeństwo (helmet, CORS) → parsowanie body → logowanie → rate limiting → uwierzytelnienie → routing → 404 → obsługa błędów.

Rodzaje w Express: aplikacyjne (`app.use`), routera (`router.use`), dla konkretnej trasy (`app.get('/x', auth, handler)`), wbudowane (`express.json()`, `express.static`), zewnętrzne (`cors`, `helmet`, `morgan`) i **error-handling** (4 argumenty).

To ten sam wzorzec co "chain of responsibility"; podobne koncepcje znajdziesz w Redux middleware, Koa, Fastify hooks, Next.js proxy/middleware.

## Analogia

Linia kontroli na lotnisku: sprawdzenie biletu, kontrola bezpieczeństwa, paszport. Każde stanowisko może Cię przepuścić dalej (next), cofnąć (odpowiedź z błędem) albo dodać coś do Twojej teczki (req.user). Do samolotu (route handler) docierasz dopiero po przejściu wszystkich.

## Kod

```js
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

const app = express();

app.use(helmet());                                  // security headers
app.use(cors({ origin: 'https://app.example.pl' }));
app.use(express.json());                            // parses JSON body into req.body

app.use((req, res, next) => {                       // custom logger
  const start = performance.now();
  res.on('finish', () => console.log(req.method, req.url, res.statusCode, `${(performance.now() - start).toFixed(1)}ms`));
  next();                                           // pass control to the next middleware
});

function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' }); // ends the pipeline
  req.user = verifyToken(token);                    // enrich the request
  next();
}

app.get('/api/bookings', requireAuth, async (req, res) => {
  res.json(await getBookings(req.user.id));
});

app.listen(3000);
```

## Częste błędy

- Zapomniane `next()` lub brak odpowiedzi: request wisi do timeoutu.
- Wywołanie `next()` **po** wysłaniu odpowiedzi: błąd "Cannot set headers after they are sent".
- Zła kolejność: `express.json()` po routach (brak `req.body`), auth po trasach, które miał chronić.

## Pytania

### Czym jest middleware w Node.js/Express? {#node-middleware-q1}

Funkcją `(req, res, next)` wpiętą w pipeline obsługi requestu. Może wykonać kod, zmodyfikować request/response, zakończyć odpowiedź lub przekazać sterowanie dalej przez `next()`. Middleware wykonują się w kolejności rejestracji.

### Co się stanie, gdy middleware nie wywoła next() ani nie wyśle odpowiedzi? {#node-middleware-q2}

Request zostanie bez odpowiedzi i będzie wisiał, aż klient lub serwer przerwie połączenie po timeoucie.

### Podaj przykłady middleware, które piszesz lub konfigurujesz. {#node-middleware-q3}

Parsowanie body (`express.json`), CORS, nagłówki bezpieczeństwa (helmet), logowanie i correlation ID, rate limiting, uwierzytelnienie i autoryzacja, kompresja, obsługa 404 i błędów, cache headers.

## Quiz

### Co musi zrobić middleware w Express, żeby request trafił do kolejnego middleware? {#node-middleware-z1}

- [ ] return true
- [x] Wywołać next()
- [ ] Wywołać res.end()
- [ ] Nic, dzieje się to automatycznie

Bez `next()` lub odpowiedzi request zawiśnie.

### `express.json()` zarejestrowane PO trasach spowoduje: {#node-middleware-z2}

- [x] Brak sparsowanego req.body w tych trasach
- [ ] Błąd przy starcie serwera
- [ ] Podwójne parsowanie
- [ ] Nic, kolejność nie ma znaczenia

Middleware działają w kolejności rejestracji.
