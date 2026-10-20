---
title: Bez stack trace w odpowiedziach produkcyjnych
priority: high
sources:
  - title: "OWASP: Error Handling Cheat Sheet"
    url: https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html
---

Szczegóły błędów (ścieżki plików, wersje bibliotek, zapytania SQL) pomagają atakującym. Użytkownik dostaje ogólny komunikat z identyfikatorem zdarzenia, a szczegóły trafiają do logów i systemu monitoringu.

## Dlaczego to ważne

- Stack trace zdradza framework, wersje i strukturę katalogów; atakujący od razu wie, której znanej podatności szukać (OWASP: rekonesans ułatwiony przez obsługę błędów).
- Domyślny handler Express dołącza stack trace do odpowiedzi, gdy `NODE_ENV` nie jest ustawione na `production`; zapomniana zmienna środowiskowa wystarczy do wycieku.
- Identyfikator błędu w odpowiedzi pozwala obsłudze klienta znaleźć zdarzenie w logach bez ujawniania szczegółów.

## Jak sprawdzić

Wywołaj błąd API na produkcji (np. niepoprawne dane, nieistniejący identyfikator) i sprawdź treść odpowiedzi oraz nagłówki (`X-Powered-By`, `Server`).

## Kod

```js title="Express 5: globalny handler błędów"
import { randomUUID } from 'node:crypto';

app.disable('x-powered-by');

// Express 5 forwards rejected promises from async handlers here automatically
app.use((err, req, res, next) => {
  const errorId = randomUUID();
  logger.error({ errorId, err, path: req.path }); // full details only in logs
  const status = err.status ?? 500;
  // http-errors style: expose is true only for safe, client-facing 4xx messages
  const title = status < 500 && err.expose ? err.message : 'Wystąpił błąd. Spróbuj ponownie.';
  res.status(status).type('application/problem+json').json({
    title,
    status,
    errorId, // quote this when contacting support
  });
});
```

## Częste błędy

- Zwracanie `err.message` z bazy danych wprost do klienta (np. treść zapytania SQL).
- Source mapy publicznie dostępne na produkcji razem z niezminifikowanymi komunikatami wewnętrznymi.
