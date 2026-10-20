---
title: Bezpieczna komunikacja cross-origin
priority: high
sources:
  - title: "MDN: Window.postMessage()"
    url: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
---

Poprawny CORS po stronie serwera (bez `*` z credentials), sprawdzanie `event.origin` w `postMessage`, wysyłanie `postMessage` z konkretnym targetOrigin zamiast `*`.

## Dlaczego to ważne

- Handler `message` bez sprawdzenia `origin` przyjmie polecenia od każdej strony, która osadzi Twoją w iframe lub otworzy ją w oknie.
- `postMessage(data, "*")` może wysłać token lub dane rezerwacji do okna, które w międzyczasie przekierowano na obcą domenę.
- CORS odbijający dowolny nagłówek `Origin` z `Access-Control-Allow-Credentials: true` pozwala obcym stronom czytać dane zalogowanego użytkownika.

## Jak sprawdzić

Przegląd handlerów `message` i konfiguracji CORS; w Network sprawdź nagłówki `Access-Control-Allow-*` dla zapytania z innej domeny.

## Kod

```js title="Okno nadrzędne i iframe płatności"
const PAYMENT_ORIGIN = "https://pay.example-psp.com";

window.addEventListener("message", (event) => {
  if (event.origin !== PAYMENT_ORIGIN) return; // ignore everyone else
  if (event.data?.type === "payment:success") confirmBooking(event.data.bookingId);
});

paymentFrame.contentWindow.postMessage({ type: "init", amount: 2499 }, PAYMENT_ORIGIN);
```

```ts title="Express 5: CORS z listą dozwolonych domen"
import cors from "cors";

const allowed = new Set(["https://example.pl", "https://partner.example.pl"]);
app.use(cors({
  origin: (origin, cb) => cb(null, !origin || allowed.has(origin)),
  credentials: true,
}));
```

## Częste błędy

- Sprawdzanie origin przez `includes("example.pl")`, które przepuści `example.pl.attacker.com`.
