---
title: Rozsądne mockowanie
priority: medium
---

Mockuj granice systemu (sieć, czas, losowość, API przeglądarki), a nie własne moduły i szczegóły implementacji. Nadmiar mocków daje testy, które przechodzą przy zepsutej aplikacji.

## Dlaczego to ważne

- Mock własnego hooka `useOffers` sprawdza tylko, że mock zwraca to, co mu kazano; błąd w hooku i w mapowaniu danych z API pozostaje niewykryty.
- Asercje `toHaveBeenCalledWith` na wewnętrznych funkcjach pękają przy każdej refaktoryzacji, choć zachowanie się nie zmieniło; zespół przestaje ufać testom.
- Mockowanie na poziomie sieci (MSW) pozwala użyć tych samych handlerów w testach, Storybooku i lokalnym developmencie.

## Jak sprawdzić

Code review testów: każdy `vi.mock` lub `jest.mock` własnego modułu wymaga uzasadnienia; wyszukaj w repozytorium `vi.mock('./` i `vi.mock('@/`.

## Kod

```tsx title="Źle"
// Mocks our own hook: the test passes even if useOffers or the API mapping is broken
vi.mock('./use-offers', () => ({
  useOffers: () => ({ data: [{ id: '1', title: 'Hotel Lindos' }], isLoading: false }),
}));
```

```tsx title="Dobrze"
// Mock only the boundaries: the network (MSW) and the clock
server.use(
  http.get('/api/offers', () => HttpResponse.json([{ id: '1', title: 'Hotel Lindos', price: 3499 }])),
);
// Fake only Date, so Testing Library's async utils keep working
vi.useFakeTimers({ toFake: ['Date'] });
vi.setSystemTime(new Date('2026-06-30T22:30:00+02:00')); // last-minute deadline edge case

renderWithProviders(<OfferList />);
expect(await screen.findByText('Hotel Lindos')).toBeInTheDocument();
expect(screen.getByText('Ostatnia chwila')).toBeInTheDocument();
```

## Częste błędy

- Pełne `vi.useFakeTimers()` razem z `findBy*`, które przez to nigdy się nie rozwiązują.
- Brak `onUnhandledRequest: 'error'` w MSW, przez co niezamockowane zapytania przechodzą po cichu.
