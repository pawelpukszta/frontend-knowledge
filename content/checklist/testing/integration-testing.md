---
title: Testy integracyjne kluczowych procesów
priority: high
---

Testy wielu jednostek razem: komponent renderowany z prawdziwymi hookami, routerem i stanem, a sieć zastąpiona na granicy przez MSW; po stronie serwera trasa API z prawdziwą (testową) bazą danych. Na froncie dają najlepszy stosunek pewności do kosztu.

## Dlaczego to ważne

- Większość błędów powstaje na stykach: komponent dostaje inny kształt danych, cache TanStack Query nie unieważnia się po mutacji, formularz nie obsługuje odpowiedzi 422.
- Testy pisane z perspektywy użytkownika (role, etykiety, teksty) przeżywają refaktoryzację; zamiana Redux na Zustand nie wymaga ich przepisywania.
- Są wielokrotnie szybsze i stabilniejsze niż E2E, więc mogą pokryć także stany ładowania, pustego wyniku i błędu API, które w E2E trudno wywołać.

## Jak sprawdzić

Każda kluczowa ścieżka (wyszukiwanie, filtrowanie, koszyk, formularz rezerwacji) ma testy integracyjne dla sukcesu, pustego wyniku i błędu; uruchamiane w CI razem z testami jednostkowymi.

## Kod

```tsx title="src/features/search/search-page.test.tsx"
import { afterAll, afterEach, beforeAll, expect, test } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/render-with-providers'; // QueryClient, router, i18n
import { SearchPage } from './search-page';

const server = setupServer(
  http.get('/api/offers', ({ request }) => {
    const destination = new URL(request.url).searchParams.get('destination');
    return HttpResponse.json([{ id: '1', title: `Hotel Lindos, ${destination}`, price: 3499 }]);
  }),
);
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('shows offers for the chosen destination', async () => {
  const user = userEvent.setup();
  renderWithProviders(<SearchPage />);
  await user.type(screen.getByRole('combobox', { name: 'Dokąd jedziesz?' }), 'Rodos');
  await user.click(screen.getByRole('button', { name: 'Szukaj' }));
  expect(await screen.findByRole('heading', { name: /Hotel Lindos, Rodos/ })).toBeInTheDocument();
});
```

## Częste błędy

- Test integracyjny, który mockuje wszystkie moduły poza testowanym komponentem; to w praktyce test jednostkowy z gorszą czytelnością.
