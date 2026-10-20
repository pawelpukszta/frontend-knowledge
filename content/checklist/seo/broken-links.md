---
title: Bez zepsutych linków wewnętrznych
priority: high
---

Linki do stron 404 lub 5xx marnują budżet indeksowania i frustrują użytkowników. Po zmianach URL dodaj przekierowania 301, a usunięte treści oznaczaj 404 lub 410 z pomocną stroną.

## Dlaczego to ważne

- Użytkownik, który trafia na 404 w ścieżce zakupowej (np. z listy ofert do szczegółów), zwykle opuszcza serwis; to bezpośrednio utracona rezerwacja.
- Robot traci zapytania na martwe adresy, a strona, której adres się zmienił, nie dostaje sygnałów z linków.
- Linki psują się najczęściej przy zmianie slugów, usuwaniu ofert i migracjach CMS; bez przekierowań i testu w CI problem wraca po każdej zmianie.

## Jak sprawdzić

Crawler (raport 4xx/5xx), regularnie lub w CI.

## Kod

```ts title="server.ts (Express 5)"
import express from "express";
import { findRedirect } from "./redirects"; // old slug -> new path, stored in DB

const app = express();

app.get("/oferty/:slug", async (req, res, next) => {
  const target = await findRedirect(req.params.slug);
  // Removed for good: 410 plus a helpful page with alternatives
  if (target?.gone) return res.status(410).render("offer-expired", { related: target.related });
  // Renamed: one 301 hop straight to the new URL
  if (target) return res.redirect(301, target.path);
  next();
});
```

## Częste błędy

- Zmiana slugu oferty w CMS bez automatycznego przekierowania ze starego adresu.
- Przekierowanie wszystkich usuniętych stron na stronę główną (Google traktuje to jak soft 404).
