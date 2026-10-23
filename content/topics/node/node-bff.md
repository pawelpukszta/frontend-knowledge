---
title: "BFF (Backend for Frontend): kiedy i jak go budować"
level: senior
tags:
  - BFF
  - architektura
  - Route Handlers
  - Express
  - MSW
  - testy
summary: BFF to serwer, który obsługuje jeden interfejs i należy do zespołu frontu. Opłaca się przy agregacji kilku serwisów, tokenach trzymanych na serwerze i ukrywaniu wewnętrznych API. Handlery mają być cienkie, a logika siedzi w testowalnych modułach.
sources:
  - title: "Sam Newman: Backends For Frontends"
    url: https://samnewman.io/patterns/architectural/bff/
  - title: "Next.js: How to use Next.js as a backend for your frontend"
    url: https://nextjs.org/docs/app/guides/backend-for-frontend
  - title: "Next.js: route.js (Route Handlers)"
    url: https://nextjs.org/docs/app/api-reference/file-conventions/route
  - title: "RFC 10017: OAuth 2.0 for Browser-Based Applications"
    url: https://www.rfc-editor.org/rfc/rfc10017.html
  - title: "MSW: Node.js integration"
    url: https://mswjs.io/docs/integrations/node
  - title: "MSW: Migrating from 2.x to 3.x"
    url: https://mswjs.io/docs/migrations/2.x-to-3.x
---

## Wyjaśnienie

**Backend for Frontend (BFF)** to serwer pośredni dopasowany do jednego interfejsu, np. aplikacji webowej albo mobilnej. Zwykle utrzymuje go ten sam zespół, który robi UI. Przeglądarka rozmawia tylko z BFF, a BFF z serwisami w sieci wewnętrznej.

BFF się opłaca, gdy:

- ekran potrzebuje danych z kilku serwisów. BFF wywołuje je równolegle blisko nich i oddaje jedną odpowiedź, więc telefon na słabym łączu robi jedno żądanie zamiast pięciu;
- odpowiedź trzeba dopasować do klienta: tylko pola potrzebne na ekranie, gotowe formaty, mniejszy payload;
- tokeny OAuth mają zostać na serwerze, a przeglądarka ma dostać tylko cookie `HttpOnly` (RFC 10017 uznaje ten wzorzec za najbezpieczniejszy);
- chcesz ukryć adresy wewnętrznych API i klucze, a na zewnątrz wystawić jedną powierzchnię z autoryzacją i rate limitingiem.

BFF to przesada, gdy jeden backend już zwraca dokładnie to, czego potrzebuje UI, albo gdy zespół nie ma kto utrzymać kolejnego serwisu. Każdy BFF to osobny deploy, monitoring i dodatkowy skok sieciowy. Jeden BFF dzielony przez wiele różnych klientów zwykle puchnie, dlatego Sam Newman proponuje zasadę "jedno doświadczenie, jeden BFF". Reguły biznesowe wspólne dla wielu klientów należą do serwisów domenowych, nie do BFF.

Kod dzielisz na trzy warstwy z zależnościami w jedną stronę: transport → service → adapters.

- **Transport** (Route Handler w Next.js, router w Express): parsuje i waliduje wejście, wywołuje serwis, zamienia wynik na odpowiedź HTTP. Nie zawiera logiki biznesowej.
- **Service**: reguły i agregacja. Nie zna `Request` ani `Response`, zwraca dane albo rzuca błąd domenowy.
- **Adapters**: klienci serwisów downstream. Ustawiają timeouty, walidują to, co przychodzi z zewnątrz, i mapują DTO na typy domeny.

Oczekiwane porażki domenowe (brak zasobu, konflikt, naruszona reguła) to osobne klasy błędów, które jedno miejsce mapuje na 4xx. Nieoczekiwany wyjątek trafia do logu ze szczegółami i identyfikatorem żądania, a klient dostaje ogólne 5xx bez stack trace'a. Gdy serwis downstream nie odpowiada, lepiej pasuje `502` lub `504` niż `500`. Jeśli dana część ekranu nie jest niezbędna, BFF może zwrócić odpowiedź częściową zamiast błędu.

Testuj BFF **na granicy**, tak jak widzi go klient: wywołaj handler żądaniem HTTP i sprawdź status oraz body. Serwisy downstream mockuj na poziomie sieci, np. przez MSW `setupServer`. Takie testy nie zależą od podziału na warstwy, więc przetrwają refaktor. Testy jednostkowe serwisu dopisz tam, gdzie logika jest złożona.

Gdy front stoi na Next.js 16, BFF to Route Handlers (`app/api/**/route.ts`) na Web `Request` i `Response`. Dokumentacja Next.js zaznacza, że Server Components powinny pobierać dane bezpośrednio ze źródła, a nie przez własne Route Handlers. Na hostingu serverless handlery nie współdzielą stanu między żądaniami. Gdy BFF ma być osobnym serwisem, sprawdzi się Express 5, który sam przekazuje błędy z `async` handlerów do error middleware.

## Kod

```ts title="Cienki handler, serwis i adapter (Next.js 16)"
// app/api/trips/[id]/route.ts: transport only
const Params = z.object({ id: z.string().regex(/^\d+$/) });

export async function GET(_req: Request, ctx: RouteContext<'/api/trips/[id]'>) {
  const parsed = Params.safeParse(await ctx.params);
  if (!parsed.success) return Response.json({ title: 'Invalid trip id' }, { status: 400 });
  try {
    return Response.json(await getTripSummary(parsed.data.id));
  } catch (err) {
    return toHttpError(err); // one place maps domain errors to 4xx, the rest to a logged 5xx
  }
}

// server/trips/service.ts: domain logic, no Request/Response
export async function getTripSummary(id: string) {
  const [trip, payment] = await Promise.all([
    booking.getTrip(id),
    payments.getStatus(id).catch(() => null), // optional part: degrade instead of failing
  ]);
  if (!trip) throw new NotFoundError(`Trip ${id} not found`);
  return { id, city: trip.city, nights: trip.nights, paymentStatus: payment ?? 'unknown' };
}

// server/adapters/booking.ts: talks to the downstream service
export async function getTrip(id: string): Promise<Trip | null> {
  const res = await fetch(`${BOOKING_URL}/trips/${id}`, { signal: AbortSignal.timeout(3000) });
  if (res.status === 404) return null;
  if (!res.ok) throw new UpstreamError('booking', res.status);
  return TripDto.parse(await res.json()); // validate external data, map DTO to the domain type
}
```

```ts title="Test na granicy z MSW 3 i Vitest"
import { http, HttpResponse } from 'msw/http';
import { setupServer } from 'msw/node';
import { GET } from '@/app/api/trips/[id]/route';

const server = setupServer(
  http.get('https://booking.internal/trips/:id', () => HttpResponse.json({ city: 'Rzym', nights: 7 })),
  http.get('https://payments.internal/status/:id', () => HttpResponse.json('paid')),
);
beforeAll(() => server.listen({ onUnhandledFrame: 'error' })); // fail on unmocked calls
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const call = (id: string) =>
  GET(new Request(`http://bff.test/api/trips/${id}`), { params: Promise.resolve({ id }) });

test('returns a partial summary when payments are down', async () => {
  server.use(http.get('https://payments.internal/status/:id', () => new HttpResponse(null, { status: 503 })));
  const res = await call('42');
  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({ city: 'Rzym', paymentStatus: 'unknown' });
});
```

## Częste błędy

- Logika biznesowa w handlerze: nie da się jej przetestować bez HTTP ani użyć ponownie.
- Przepuszczanie odpowiedzi serwisów 1:1 do klienta. Wyciekają wewnętrzne pola, a front zależy od kształtu cudzego API.
- Sekwencyjne `await` dla niezależnych wywołań downstream zamiast `Promise.all`.
- Brak timeoutów w adapterach: jeden wolny serwis blokuje cały BFF.

## Pytania

### Odziedziczyłeś BFF, w którym każdy handler ma 200 linii. Jak go przebudujesz? {#node-bff-q1}

Zaczynam od siatki bezpieczeństwa: testy na granicy dla najważniejszych endpointów, z serwisami downstream zamockowanymi w MSW. Sprawdzają status i body, więc nie zależą od struktury kodu i pilnują zachowania przy refaktorze. Potem idę endpoint po endpoincie, małymi PR-ami, bez przepisywania wszystkiego naraz. Najpierw wyciągam adaptery: wywołania `fetch`, timeouty, walidację i mapowanie DTO. Następnie wydzielam serwis z regułami i błędami domenowymi. W handlerze zostaje parsowanie, walidacja, wywołanie serwisu i odpowiedź, a mapowanie błędów na statusy przenoszę w jedno miejsce. Kierunek zależności (transport → service → adapters) wymuszam regułą lintera, np. `no-restricted-imports`. Przy okazji sprawdzam, czy część logiki nie jest wspólna dla wielu klientów; jeśli tak, jej miejsce jest w serwisie domenowym.

### Kiedy BFF się opłaca, a kiedy jest przesadą? {#node-bff-q2}

Opłaca się, gdy ekran składa dane z kilku serwisów, bo BFF agreguje je blisko źródła i oddaje jedną odpowiedź. Pomaga też, gdy różne klienty potrzebują różnych kształtów danych, gdy tokeny mają zostać na serwerze, a przeglądarka ma dostać tylko cookie `HttpOnly`, i gdy chcesz ukryć wewnętrzne API. Daje też zespołowi frontu niezależność, bo może zmieniać API razem z UI. Przesadą jest, gdy jeden backend już zwraca to, czego potrzebuje widok, a zespół jest mały. Każdy BFF to kolejny serwis do wdrażania i monitorowania oraz dodatkowy skok sieciowy.

### Jak w BFF mapować błędy na statusy HTTP? {#node-bff-q3}

Rozdzielam błędy oczekiwane od nieoczekiwanych. Oczekiwane to porażki domenowe: brak zasobu (`404`), konflikt stanu (`409`), naruszona reguła albo zła walidacja (`400` lub `422`). Rzucam je jako własne klasy błędów, a jedna funkcja albo error middleware w Express 5 zamienia je na statusy i spójny format, np. Problem Details. Nieoczekiwane wyjątki loguję ze szczegółami i identyfikatorem żądania, a klientowi zwracam ogólne `500` bez stack trace'a. Awarię serwisu downstream sygnalizuje `502` albo `504`. Jeśli brakujące dane nie są niezbędne, zwracam odpowiedź częściową z jasno oznaczonym brakiem.

### Jak testować BFF? {#node-bff-q4}

Głównie na granicy: wywołuję handler (w Next.js bezpośrednio funkcję `GET` z obiektem `Request`, w Express np. przez supertest) i sprawdzam status oraz body. Serwisy downstream mockuję na poziomie sieci przez MSW, więc kod adapterów, timeouty i mapowanie DTO też są testowane. Nieobsłużone żądania ustawiam jako błąd, żeby test nie wyszedł przypadkiem do prawdziwej sieci. Przez `server.use` nadpisuję handlery w pojedynczych testach i sprawdzam ścieżki awaryjne: `503` z serwisu, timeout, niepoprawny JSON. Testy jednostkowe dopisuję tylko dla serwisów ze złożoną logiką.

## Quiz

### Która warstwa BFF powinna znać obiekty `Request` i `Response`? {#node-bff-z1}

- [x] Tylko warstwa transportowa (Route Handler, router Express)
- [ ] Warstwa serwisu, bo to ona decyduje o statusie
- [ ] Adaptery, bo wykonują `fetch`
- [ ] Wszystkie warstwy, żeby uniknąć mapowania

Serwis zwraca dane lub rzuca błąd domenowy, a o HTTP po stronie klienta decyduje tylko transport.

### Serwis płatności zwraca `503`, a ekran podróży może się bez tej informacji obejść. Co powinien zrobić BFF? {#node-bff-z2}

- [ ] Zwrócić klientowi `500`
- [ ] Przekazać klientowi `503` z serwisu płatności
- [x] Zwrócić `200` z pozostałymi danymi i polem płatności oznaczonym jako nieznane
- [ ] Ponawiać wywołanie bez limitu, aż serwis wróci

Niezbędne dane są dostępne, więc odpowiedź częściowa daje użytkownikowi więcej niż błąd całego ekranu.
