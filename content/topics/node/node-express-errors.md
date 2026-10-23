---
title: Obsługa błędów w Express (error middleware)
level: mid
added: 2026-10-20
tags:
  - error handling
  - Express 5
  - async errors
  - next(err)
summary: Middleware z czterema argumentami (err, req, res, next) obsługuje błędy. Rejestrujesz go na końcu. W Express 5 odrzucone Promise z async handlerów trafiają do niego automatycznie.
sources:
  - title: "Express: Error handling"
    url: https://expressjs.com/en/guide/error-handling.html
  - title: "Express: Migrating to Express 5"
    url: https://expressjs.com/en/guide/migrating-5.html
---

## Wyjaśnienie

- Błąd przekazujesz przez `next(err)` lub `throw` w kodzie synchronicznym.
- **Express 5**: `async` handler, który rzuci błąd lub zwróci odrzucony Promise, automatycznie wywoła error middleware. W Express 4 trzeba było łapać błędy ręcznie (`try/catch` + `next(err)` lub `express-async-errors`).
- Error middleware rejestruj **po** wszystkich trasach, razem z handlerem 404.
- Nie wysyłaj stack trace na produkcji; loguj szczegóły (Sentry, logger), a klientowi zwróć spójny format błędu.

## Kod

```js
app.get('/api/offers/:id', async (req, res) => {
  const offer = await findOffer(req.params.id);  // Express 5: rejection goes to the error handler
  if (!offer) throw new NotFoundError('Offer not found');
  res.json(offer);
});

app.use((req, res) => res.status(404).json({ title: 'Not Found', status: 404 })); // 404 handler

// Error handler: 4 arguments, registered last
app.use((err, req, res, next) => {
  logger.error({ err, path: req.path });
  const status = err.status ?? 500;
  res.status(status).json({
    title: status === 500 ? 'Internal Server Error' : err.message,
    status,
  });
});
```

## Pytania

### Jak Express rozpoznaje middleware do obsługi błędów? {#node-express-errors-q1}

Po liczbie parametrów: funkcja z czterema argumentami `(err, req, res, next)`. Trafia do niej błąd przekazany przez `next(err)`, rzucony synchronicznie lub (w Express 5) z odrzuconego Promise.

### Co zmienił Express 5 w obsłudze błędów? {#node-express-errors-q2}

Obsługę błędów asynchronicznych: odrzucone Promise z handlerów i middleware są automatycznie przekazywane do error middleware, bez ręcznego `try/catch` i `next(err)`.

## Quiz

### Jak Express rozpoznaje error-handling middleware? {#node-express-errors-z1}

- [ ] Po nazwie funkcji errorHandler
- [x] Po czterech parametrach (err, req, res, next)
- [ ] Po rejestracji przez app.error()
- [ ] Po tym, że jest async

Error middleware ma cztery argumenty i rejestruje się go na końcu.
