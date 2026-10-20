---
title: Właściwa obsługa błędów
priority: high
---

`try/catch` przy operacjach asynchronicznych, obsługa odrzuconych Promise, Error Boundaries w React, czytelne komunikaty dla użytkownika i logowanie błędów do monitoringu.

## Dlaczego to ważne

- `fetch` nie odrzuca Promise przy odpowiedziach 404 czy 500; bez sprawdzenia `response.ok` aplikacja próbuje parsować stronę błędu jako dane i pokazuje puste wyniki zamiast komunikatu.
- Nieobsłużony błąd w komponencie React odmontowuje całe drzewo; bez Error Boundary użytkownik widzi białą stronę w środku procesu rezerwacji.
- Błędy zgłaszane do monitoringu (np. Sentry) z kontekstem (`cause`, trasa, ID rezerwacji) pozwalają naprawić problem, zanim zgłosi go klient.

## Jak sprawdzić

Wymuś błędy API (DevTools Network: blokowanie zapytań, nadpisanie odpowiedzi na 500, tryb offline) i sprawdź, czy UI pokazuje komunikat z możliwością ponowienia.

## Kod

```ts
export async function getOffers(signal?: AbortSignal): Promise<Offer[]> {
  const res = await fetch("/api/offers", { signal });
  if (!res.ok) {
    // fetch resolves on HTTP errors, so throw explicitly
    throw new Error(`Offers request failed: ${res.status}`, { cause: res });
  }
  return OffersSchema.parse(await res.json());
}

// Last-resort reporting for anything not caught elsewhere
window.addEventListener("unhandledrejection", (event) => {
  reportError(event.reason);
});
```

```tsx title="React: granica błędu"
import { ErrorBoundary } from "react-error-boundary";

<ErrorBoundary
  fallback={<p role="alert">Nie udało się wczytać ofert. Odśwież stronę.</p>}
  onError={(error) => reportError(error)}
>
  <OfferList />
</ErrorBoundary>
```

## Częste błędy

- Pusty `catch {}`, który połyka błąd bez logowania i bez informacji dla użytkownika.
- Pokazywanie użytkownikowi surowego `error.message` ze stosu technicznego.
