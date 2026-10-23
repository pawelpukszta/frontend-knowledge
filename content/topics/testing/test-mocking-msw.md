---
title: "Mockowanie na granicy systemu: MSW, fabryki danych, fake timers"
level: mid
added: 2026-10-23
tags:
  - MSW
  - mockowanie
  - Vitest
  - fake timers
  - testy
summary: "Mockuj to, czego nie kontrolujesz: sieć (przez MSW), czas i zewnętrzne SDK. Własne komponenty, hooki i `fetch` zostają prawdziwe, a dane testowe budujesz fabrykami."
sources:
  - title: "MSW: Node.js integration"
    url: https://mswjs.io/docs/integrations/node
  - title: "MSW: Network behavior overrides"
    url: https://mswjs.io/docs/best-practices/network-behavior-overrides
  - title: "MSW: Avoid request assertions"
    url: https://mswjs.io/docs/best-practices/avoid-request-assertions
  - title: "MSW: Migration from 2.x to 3.x"
    url: https://mswjs.io/docs/migrations/2.x-to-3.x
  - title: "Kent C. Dodds: Stop mocking fetch"
    url: https://kentcdodds.com/blog/stop-mocking-fetch
  - title: "Vitest: Mocking Requests"
    url: https://vitest.dev/guide/mocking/requests
  - title: "Vitest: Mocking"
    url: https://vitest.dev/guide/mocking
---

## Wyjaśnienie

Mock zastępuje prawdziwy kod, więc każdy mock to fragment aplikacji, którego test już nie sprawdza. Dlatego mockuj na granicy systemu, czyli tam, gdzie kończy się Twój kod: sieć, zegar, losowość, zewnętrzne SDK (analityka, płatności, mapa). Komponenty, hooki, store i klient HTTP zostają prawdziwe.

**MSW (Mock Service Worker)** przechwytuje requesty na poziomie sieci. W przeglądarce robi to Service Worker, w Node (Vitest) interceptory wewnątrz `setupServer` z `msw/node`. Od MSW 3 `http` i `HttpResponse` importujesz z `msw/http`, a nie z głównego pakietu `msw`. Aplikacja nie wie, że rozmawia z mockiem: `fetch`, axios czy TanStack Query działają bez zmian. Tych samych handlerów możesz użyć w testach, w Storybooku i podczas lokalnego developmentu.

Typowy układ w Vitest:

- `src/mocks/handlers.ts`: handlery szczęśliwej ścieżki (`http.get`, `http.post` zwracające `HttpResponse.json(...)`).
- `src/mocks/node.ts`: `setupServer(...handlers)`.
- plik `setupFiles` z konfiguracji Vitest: `server.listen()` w `beforeAll`, `server.resetHandlers()` w `afterEach`, `server.close()` w `afterAll`.

Ustaw `onUnhandledFrame: 'error'` (w MSW 2 opcja nazywała się `onUnhandledRequest`). Request bez handlera wywali test, więc od razu widać literówkę w URL albo zapomniany endpoint.

Przypadki brzegowe nadpisujesz w konkretnym teście przez `server.use(...)`. Nowy handler ma pierwszeństwo, a `resetHandlers()` w `afterEach` usuwa go po teście. Błąd serwera to `new HttpResponse(null, { status: 500 })` albo `HttpResponse.json(body, { status: 422 })`, a zerwane połączenie to `HttpResponse.error()`.

Lepiej sprawdzać ekran niż request. Zamiast `expect(fetch).toHaveBeenCalledWith(...)` sprawdź, co zobaczył użytkownik. Poprawność requestu wymuś w handlerze: jeśli brakuje pola, handler zwraca 400, a test UI pada. Wyjątkiem są requesty bez widocznego efektu, np. analityka.

**Fabryki danych testowych** (test data builders) to funkcje, które zwracają poprawny obiekt z domyślnymi wartościami i pozwalają nadpisać pola: `buildOffer({ price: 0 })`. Test pokazuje tylko to, co jest dla niego istotne, a zmiana kształtu danych wymaga poprawki w jednym miejscu.

Fake timers (`vi.useFakeTimers()`) i `vi.mock` stosuj oszczędnie. Timery mają sens przy debounce, timeoutach sesji czy dacie "dzisiaj" (`vi.setSystemTime`). `vi.mock` (podnoszony na górę pliku) przydaje się dla modułów z efektami ubocznymi, np. SDK analityki. Nie używaj go do zastępowania własnych komponentów i hooków.

## Kod

```ts title="src/mocks i setup Vitest"
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw/http';
import { buildOffer } from '../test/factories';

export const handlers = [
  http.get('/api/offers', () =>
    HttpResponse.json([buildOffer(), buildOffer({ id: '2', city: 'Ateny' })]),
  ),
];

// src/mocks/node.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';
export const server = setupServer(...handlers);

// vitest.setup.ts (referenced in test.setupFiles)
import { server } from './src/mocks/node';
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

```tsx title="Fabryka i nadpisanie handlera w teście"
// src/test/factories.ts
export const buildOffer = (overrides: Partial<Offer> = {}): Offer => ({
  id: '1',
  city: 'Rzym',
  price: 2499,
  available: true,
  ...overrides,
});

// OfferList.test.tsx
test('shows a retry button when the offers request fails', async () => {
  server.use(http.get('/api/offers', () => new HttpResponse(null, { status: 500 })));
  const user = userEvent.setup();
  render(<OfferList />);

  await user.click(await screen.findByRole('button', { name: /spróbuj ponownie/i }));
  // the default handler is used again for the retry
  expect(await screen.findByRole('heading', { name: /rzym/i })).toBeInTheDocument();
});
```

## Częste błędy

- `vi.spyOn(globalThis, 'fetch')` z ręcznie sklejoną odpowiedzią (`ok`, `json`) w każdym teście. Kopiujesz backend do testów, a przejście na inny klient HTTP psuje wszystkie testy.
- Mockowanie komponentów dzieci (`vi.mock('./OfferCard')`). Test przechodzi, choć rodzic przekazuje złe propsy, bo nic nie sprawdza ich połączenia.
- Brak `server.resetHandlers()` po teście. Nadpisanie z jednego testu przecieka do następnego i wynik zależy od kolejności.
- Duże obiekty danych wklejone do każdego testu. Nie widać, które pole jest ważne dla scenariusza.

## Pytania

### Kiedy MSW, a kiedy mock `fetch`? {#test-mocking-msw-q1}

MSW wybieram domyślnie w testach komponentów i stron. Przechwytuje requesty na poziomie sieci, więc kod aplikacji działa naprawdę: `fetch`, nagłówki, parsowanie JSON, cache TanStack Query. Handlery piszę raz i używam w wielu testach, a w teście nadpisuję tylko wyjątek przez `server.use`. Ręczny mock `fetch` wiąże test z tym, jak kod robi request, i powiela logikę backendu w każdym teście. Pomija też szczegóły, np. brakujący nagłówek autoryzacji. Spy na `fetch` ma sens w małym teście jednostkowym funkcji, której jedynym zadaniem jest zbudowanie requestu, albo gdy MSW nie da się uruchomić w danym środowisku.

### Dlaczego nie mockować komponentów dzieci? {#test-mocking-msw-q2}

Bo test przestaje sprawdzać integrację, a to ona daje najwięcej pewności. Po zamockowaniu dziecka nie wiesz, czy rodzic przekazuje poprawne propsy i czy dziecko poprawnie wywołuje callback. Test zależy też od struktury drzewa komponentów, więc wydzielenie lub połączenie komponentów go psuje. Mock dziecka ma sens tylko dla ciężkiego, zewnętrznego widgetu, którego jsdom nie wyrenderuje, np. mapy na WebGL albo playera wideo.

### Jak przetestujesz komunikat błędu, gdy API zwraca 500? {#test-mocking-msw-q3}

W teście nadpisuję handler przez `server.use` tak, żeby zwracał 500, renderuję komponent i czekam na komunikat przez `findByRole('alert')` albo na przycisk ponowienia. Domyślne handlery zostają w pliku setup, a `server.resetHandlers()` w `afterEach` usuwa nadpisanie po teście. Utratę sieci symuluję przez `HttpResponse.error()`, wtedy `fetch` rzuca `TypeError`.

```ts
server.use(http.get('/api/offers', () => HttpResponse.error()));
```

### Do czego służą fabryki danych testowych? {#test-mocking-msw-q4}

Fabryka zwraca kompletny, poprawny obiekt domenowy z rozsądnymi wartościami domyślnymi i przyjmuje nadpisania. W teście piszę tylko pola, które mają znaczenie dla scenariusza, np. `buildOffer({ available: false })`, więc od razu widać intencję. Gdy model danych się zmieni, poprawiam jedną fabrykę zamiast dziesiątek testów. Te same fabryki mogą też zwracać dane w handlerach MSW.

## Quiz

### Co robi `server.use()` wywołane wewnątrz testu? {#test-mocking-msw-z1}

- [ ] Zastępuje na stałe wszystkie handlery z `setupServer`
- [x] Dodaje handler z pierwszeństwem przed domyślnymi, do czasu `resetHandlers()`
- [ ] Wyłącza przechwytywanie requestów dla tego testu
- [ ] Rejestruje handler tylko dla następnego requestu

Nadpisanie działa do `server.resetHandlers()`, zwykle wywoływanego w `afterEach`.

### Co najlepiej mockować w teście integracyjnym strony z listą ofert? {#test-mocking-msw-z2}

- [ ] Komponent `OfferCard`, żeby test był szybszy
- [ ] Hook `useOffers` zwracający gotowe dane
- [x] Odpowiedzi API przez handlery MSW
- [ ] Wewnętrzny stan komponentu `OfferList`

Sieć to granica systemu; komponenty i hooki zostają prawdziwe, więc test sprawdza ich współpracę.
