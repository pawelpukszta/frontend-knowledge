---
title: Server state vs client state (TanStack Query)
level: mid
tags:
  - TanStack Query
  - React Query
  - cache
  - server state
summary: "Dane z API to nie jest zwykły stan aplikacji: są współdzielone, mogą się zdezaktualizować i wymagają cache. TanStack Query zarządza nimi za Ciebie."
sources:
  - title: "TanStack Query: Overview"
    url: https://tanstack.com/query/latest/docs/framework/react/overview
  - title: "TanStack Query: Important Defaults"
    url: https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults
  - title: "TkDodo: Practical React Query"
    url: https://tkdodo.eu/blog/practical-react-query
---

## Wyjaśnienie

**Client state**: należy do przeglądarki (otwarty modal, filtry, motyw). **Server state**: kopia danych z serwera (oferty, profil), która może być nieaktualna.

Server state wymaga: cache, deduplikacji zapytań, odświeżania w tle, ponowień, paginacji, optymistycznych aktualizacji, invalidacji po mutacjach. Ręcznie w `useEffect` + `useState` to dużo kodu i błędów (race conditions, brak cache).

**TanStack Query** (dawniej React Query):

- `useQuery({ queryKey, queryFn })`: pobieranie z cache i statusami (`isPending`, `isError`, `data`).
- **Query key** to identyfikator cache, np. `['offers', { city }]`.
- **`staleTime`**: jak długo dane są "świeże" (bez refetchu). **`gcTime`**: jak długo nieużywane dane zostają w pamięci.
- **Stale-while-revalidate**: najpierw pokazuje dane z cache, potem odświeża w tle.
- `useMutation` + `queryClient.invalidateQueries` po zapisie.

Efekt: w wielu aplikacjach po przeniesieniu danych z API do TanStack Query w globalnym store zostaje bardzo niewiele.

## Kod

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function Offers({ city }: { city: string }) {
  const { data, isPending, isError } = useQuery({
    queryKey: ['offers', { city }],
    queryFn: ({ signal }) => fetch(`/api/offers?city=${city}`, { signal }).then((r) => r.json()),
    staleTime: 60_000,
  });
  if (isPending) return <p>Ładowanie...</p>;
  if (isError) return <p>Błąd</p>;
  return <OfferList offers={data} />;
}

function useBookOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fetch(`/api/bookings`, { method: 'POST', body: JSON.stringify({ id }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['offers'] }),
  });
}
```

## Pytania

### Czym różni się server state od client state? {#state-server-state-q1}

Client state jest w pełni kontrolowany przez aplikację (UI, filtry). Server state to kopia danych należących do serwera: asynchroniczna, współdzielona z innymi użytkownikami i mogąca się zdezaktualizować. Wymaga cache, synchronizacji i invalidacji.

### Co to jest staleTime i gcTime? {#state-server-state-q2}

`staleTime`: czas, przez który dane są uznawane za świeże i nie są pobierane ponownie. `gcTime` (dawniej `cacheTime`): czas, przez który nieużywane dane zostają w cache, zanim zostaną usunięte.

### Dlaczego nie trzymać odpowiedzi API w Redux lub Zustand? {#state-server-state-q3}

Musiałbyś ręcznie napisać cache, deduplikację, refetch, ponowienia i obsługę race conditions. Narzędzia do server state robią to deklaratywnie. Globalny store zostaje dla prawdziwego stanu klienta.

## Quiz

### Gdzie najlepiej trzymać dane pobrane z API (lista ofert)? {#state-server-state-z1}

- [ ] W Context
- [ ] W localStorage
- [x] W narzędziu do server state, np. TanStack Query
- [ ] W zmiennej globalnej window

Server state wymaga cache, refetchu i invalidacji, które zapewnia TanStack Query.
