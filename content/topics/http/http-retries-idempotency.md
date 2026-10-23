---
title: "Błędy, timeouty, ponowienia i idempotencja"
level: senior
tags:
  - retry
  - backoff
  - idempotencja
  - Idempotency-Key
  - timeout
  - Retry-After
summary: Ponawiaj tylko błędy przejściowe i tylko żądania, których powtórzenie nie zmieni wyniku. Używaj timeoutu, wykładniczego backoffu z jitterem i limitu prób, a `POST` zabezpiecz kluczem idempotencji.
sources:
  - title: "MDN: Window.fetch()"
    url: https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch
  - title: "MDN: AbortSignal.timeout()"
    url: https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static
  - title: "MDN: Retry-After"
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Retry-After
  - title: "IETF draft: The Idempotency-Key HTTP Header Field"
    url: https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/
  - title: "Amazon Builders' Library: Timeouts, retries, and backoff with jitter"
    url: https://builder.aws.com/content/3EumjoZascWd1oZiEgL8ORlv3qE/timeouts-retries-and-backoff-with-jitter
  - title: "TanStack Query: Query Retries"
    url: https://tanstack.com/query/latest/docs/framework/react/guides/query-retries
---

## Wyjaśnienie

Klient widzi trzy rodzaje porażek i każdą obsługuje inaczej:

| Rodzaj | Jak wygląda w `fetch` | Ponawiać? |
|---|---|---|
| Błąd sieci | Promise odrzucony: `TypeError` (brak sieci, DNS, CORS), `TimeoutError` lub `AbortError` | zwykle tak, jeśli żądanie jest idempotentne |
| Błąd HTTP | Promise spełniony, `res.ok === false` | `408`, `429`, `502`, `503`, `504` tak; reszta 4xx nie |
| Błąd domenowy | np. `409` "pokój już zarezerwowany", `422` z listą pól | nie, pokaż użytkownikowi |

Przy błędzie sieci i przy timeoucie nie wiesz, czy serwer wykonał operację. Żądanie mogło dojść, a zgubić się mogła dopiero odpowiedź, więc ponowienie może wykonać operację drugi raz.

`fetch` nie ma własnego limitu czasu. `AbortSignal.timeout(ms)` przerywa żądanie i odrzuca Promise z `TimeoutError`; ręczne anulowanie daje `AbortError`. Oba sygnały łączy `AbortSignal.any([...])`. Wartość timeoutu dobierz do zmierzonych opóźnień (np. p99 z monitoringu).

Automatycznie ponawiaj tylko metody bezpieczne i idempotentne (`GET`, `HEAD`, `OPTIONS`, `PUT`, `DELETE`). Ponowienie `POST` może utworzyć drugie zamówienie albo drugi raz obciążyć kartę.

Przy **wykładniczym backoffie** każda kolejna próba czeka dłużej (np. 500 ms, 1 s, 2 s), do górnej granicy i limitu prób. **Jitter** losuje opóźnienie, żeby tysiące klientów po awarii nie wróciły w tej samej milisekundzie. Ponowienia dokładają obciążenia serwerowi, który już ma problem. Jeśli ponawia każda warstwa (przeglądarka, BFF, serwis), liczba żądań się mnoży, więc ponawiaj w jednym miejscu.

Przy `429 Too Many Requests` i `503 Service Unavailable` serwer może w nagłówku `Retry-After` podać, ile sekund czekać albo do jakiej daty. Ta wartość ma pierwszeństwo przed Twoim backoffem.

Żeby `POST` dało się bezpiecznie powtórzyć, klient generuje **klucz idempotencji** (np. UUID) raz na operację użytkownika i wysyła go w każdej próbie. Serwer zapisuje klucz z wynikiem i przy powtórce zwraca zapisaną odpowiedź zamiast wykonywać operację drugi raz. Nagłówek `Idempotency-Key` opisuje Internet-Draft grupy IETF httpapi (wersja 08, październik 2026). To wciąż projekt, nie RFC. Draft zaleca `400` przy braku wymaganego klucza, `422` przy tym samym kluczu z inną treścią i `409`, gdy żądanie z tym kluczem jeszcze trwa.

Gdy klient ponawia, serwer może dostać tę samą operację więcej niż raz. Taka gwarancja to dostarczenie **at-least-once** ("co najmniej raz"). Efekt "dokładnie raz" osiąga się deduplikacją po stronie odbiorcy: po kluczu idempotencji, identyfikatorze wiadomości albo unikalnym indeksie w bazie. Tak samo obsługuje się webhooki i kolejki.

TanStack Query domyślnie ponawia query 3 razy w przeglądarce i 0 razy na serwerze, z opóźnieniem `Math.min(1000 * 2 ** attempt, 30000)` (1 s, 2 s, 4 s, bez jittera). Mutacje domyślnie się nie ponawiają. Domyślnie ponawiany jest każdy błąd, także `404`, więc warto podać własną funkcję `retry`.

## Kod

```ts title="fetch z timeoutem, backoffem i kluczem idempotencji"
const RETRYABLE = new Set([408, 429, 502, 503, 504]);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function request(url: string, init: RequestInit = {}, maxAttempts = 4) {
  const method = (init.method ?? 'GET').toUpperCase();
  const headers = new Headers(init.headers);
  // One key per user action, reused by every attempt
  if (method === 'POST' && !headers.has('Idempotency-Key')) {
    headers.set('Idempotency-Key', `"${crypto.randomUUID()}"`);
  }
  if (method === 'PATCH') maxAttempts = 1; // not idempotent and no key: never retry

  for (let attempt = 0; ; attempt++) {
    let res: Response | undefined;
    try {
      res = await fetch(url, { ...init, headers, signal: AbortSignal.timeout(5000) });
      if (!RETRYABLE.has(res.status)) return res; // success, 4xx and domain errors go to the caller
    } catch (err) {
      if (attempt + 1 >= maxAttempts) throw err; // network error or TimeoutError
    }
    if (res && attempt + 1 >= maxAttempts) return res;

    const retryAfter = Number(res?.headers.get('Retry-After')); // 0 without the header, NaN for an HTTP date
    const cap = Math.min(500 * 2 ** attempt, 10_000);
    await sleep(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : Math.random() * cap); // full jitter
  }
}
```

```ts title="TanStack Query: bez ponawiania błędów klienta"
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // HttpError: our own class thrown by the fetch wrapper when !res.ok
        if (error instanceof HttpError && error.status < 500 && ![408, 429].includes(error.status)) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});
```

## Częste błędy

- Nowy klucz idempotencji w każdej próbie. Wtedy serwer widzi każdą próbę jako nową operację.
- Ponawianie `400`, `401`, `403` czy `422`: ten sam błąd wróci, a użytkownik dłużej czeka.
- Ponowienia bez jittera i limitu. Po awarii wszyscy klienci uderzają w serwer jednocześnie i przeciążają go dalej.
- Traktowanie timeoutu jak "nic się nie stało". Operacja mogła się wykonać, więc bez idempotencji ponowienie zrobi ją drugi raz.

## Pytania

### Jak zdebugujesz wywołanie API, które zawodzi w 1% przypadków? {#http-retries-idempotency-q1}

Najpierw zbieram dane zamiast zgadywać. W monitoringu frontu (np. Sentry, RUM) rozdzielam porażki na błędy sieci, timeouty, konkretne statusy HTTP i błędy domenowe, bo każda grupa ma inną przyczynę. Dokładam do żądań identyfikator korelacji (np. `X-Request-Id`), żeby połączyć log z przeglądarki z logami i tracingiem backendu. Potem szukam wspólnego mianownika: czas trwania bliski timeoutowi (wolny p99), jedna instancja albo region, okno po deployu, duże payloady, wygasający token i wyścig z jego odświeżeniem, `429` z limitów, nieudany preflight CORS. Przy losowych `502` sprawdzam niezgodne timeouty keep-alive między load balancerem a serwerem. Lokalnie odtwarzam problem przez "Copy as cURL" z DevTools puszczone w pętli albo throttling sieci. Na koniec naprawiam przyczynę; ponowienia z backoffem dodaję tylko dla błędów naprawdę przejściowych i mierzę, jak często się uruchamiają, żeby nie zamiotły problemu pod dywan.

### Które żądania można bezpiecznie ponowić automatycznie? {#http-retries-idempotency-q2}

Te, których powtórzenie nie zmieni stanu bardziej niż jedno wykonanie: metody bezpieczne i idempotentne, czyli `GET`, `HEAD`, `OPTIONS`, `PUT` i `DELETE`. Ponawiam je przy błędach przejściowych: błąd sieci, timeout, `408`, `429`, `502`, `503`, `504`. Pozostałych 4xx nie ponawiam, bo problem leży w samym żądaniu. `POST` i zwykle `PATCH` ponawiam tylko wtedy, gdy serwer obsługuje klucz idempotencji albo inną deduplikację. Sama metoda HTTP to deklaracja; liczy się to, czy implementacja na serwerze faktycznie jest idempotentna.

### Jak sprawić, żeby ponowienie POST nie utworzyło duplikatu? {#http-retries-idempotency-q3}

Przez klucz idempotencji. Klient generuje UUID raz na operację użytkownika, np. przy kliknięciu "Zapłać", i wysyła go w nagłówku `Idempotency-Key` w każdej próbie. Serwer w transakcji zapisuje klucz razem z wynikiem. Gdy ten sam klucz przyjdzie ponownie, zwraca zapisaną odpowiedź bez wykonywania operacji. Ten sam klucz z inną treścią żądania to błąd (`422` według draftu IETF), a równoległe żądanie z kluczem w trakcie obsługi dostaje `409`. Klucze przechowuje się przez określony czas, który API powinno udokumentować. Nagłówek jest opisany w drafcie IETF, który nie jest jeszcze RFC.

```http
POST /api/payments HTTP/1.1
Content-Type: application/json
Idempotency-Key: "8e03978e-40d5-43e8-bc93-6894a57f9324"

{ "bookingId": 42, "amount": 1999 }
```

### Po co jitter i Retry-After w strategii ponowień? {#http-retries-idempotency-q4}

Wykładniczy backoff wydłuża przerwy między próbami, żeby nie dobijać przeciążonego serwera. Bez jittera klienci, którzy dostali błąd w tej samej chwili, ponawiają też w tej samej chwili i tworzą kolejne szczyty ruchu. Jitter losuje opóźnienie i rozkłada te próby w czasie. Do tego dochodzi górna granica opóźnienia i limit prób, żeby błąd w końcu dotarł do użytkownika. `Retry-After` przy `429` i `503` to informacja wprost od serwera, kiedy wrócić, więc ma pierwszeństwo przed własnym wyliczeniem. Ponawiać warto w jednej warstwie, bo ponowienia w kilku warstwach naraz mnożą liczbę żądań.

## Quiz

### Klient wysłał `POST /payments`, dostał timeout i ponawia żądanie. Co chroni przed podwójną płatnością? {#http-retries-idempotency-z1}

- [ ] Krótszy timeout w `AbortSignal.timeout`
- [ ] Zmiana metody na `PUT` tylko w ponowieniu
- [x] Ten sam klucz `Idempotency-Key` w obu próbach i deduplikacja na serwerze
- [ ] Nowy UUID w nagłówku `Idempotency-Key` przy każdej próbie

Serwer rozpoznaje powtórkę tylko wtedy, gdy obie próby niosą ten sam klucz.

### Jakie są domyślne ponowienia w TanStack Query w przeglądarce? {#http-retries-idempotency-z2}

- [x] Query: 3 ponowienia z wykładniczym opóźnieniem; mutacje: brak ponowień
- [ ] Query i mutacje: 3 ponowienia
- [ ] Query: brak ponowień; mutacje: 3 ponowienia
- [ ] Query: nieskończenie wiele ponowień co 1 s

Query domyślnie ponawiają 3 razy (1 s, 2 s, 4 s, maksymalnie 30 s), a mutacje mają `retry: 0`.
