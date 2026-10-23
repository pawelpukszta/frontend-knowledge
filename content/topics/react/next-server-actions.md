---
title: "Server Actions, Route Handlers i mutacje w Next.js"
level: mid
tags:
  - Next.js
  - Server Actions
  - use server
  - useActionState
  - Route Handlers
  - bezpieczeństwo
summary: "Server Action to funkcja z `\"use server\"` wywoływana z formularza lub zdarzenia, wykonywana na serwerze przez żądanie POST. Każda akcja jest publicznym endpointem, więc w środku zawsze sprawdzasz sesję, uprawnienia i dane wejściowe."
sources:
  - title: "Next.js: Mutating Data"
    url: https://nextjs.org/docs/app/getting-started/mutating-data
  - title: "Next.js: Server Actions and Mutations"
    url: https://nextjs.org/docs/app/guides/server-actions
  - title: "Next.js: Data Security"
    url: https://nextjs.org/docs/app/guides/data-security
  - title: "Next.js: Route Handlers"
    url: https://nextjs.org/docs/app/getting-started/route-handlers
  - title: "Next.js: Backend for Frontend"
    url: https://nextjs.org/docs/app/guides/backend-for-frontend
  - title: "Next.js: Environment Variables"
    url: https://nextjs.org/docs/app/guides/environment-variables
  - title: "React: useActionState"
    url: https://react.dev/reference/react/useActionState
  - title: "React: useFormStatus"
    url: https://react.dev/reference/react-dom/hooks/useFormStatus
  - title: "TanStack Query: Invalidations from Mutations"
    url: https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations
---

## Wyjaśnienie

**Server Function** to asynchroniczna funkcja wykonywana na serwerze, którą klient wywołuje przez sieć. Gdy używasz jej do mutacji (formularz, przycisk, `startTransition`), nazywa się **Server Action**. Tworzysz ją dyrektywą `"use server"`: na początku funkcji (inline w Server Component) albo na początku pliku, wtedy wszystkie eksporty są akcjami. W Client Component akcji nie zdefiniujesz, ale możesz ją zaimportować z pliku `"use server"` lub dostać w propsach.

Pod spodem kompilator zamienia funkcję w bundlu klienta na referencję (ID akcji), która wysyła `POST` do strony. Next.js obsługuje mutację, unieważnienie cache i nowy payload RSC w jednym żądaniu, więc UI odświeża się bez dodatkowego `fetch`. Klient wysyła akcje po kolei, jedną naraz, dlatego nie nadają się do równoległego pobierania danych.

`<form action={createBooking}>` przekazuje akcji `FormData`. Gdy formularz leży w Server Component, wysłanie działa nawet przed załadowaniem JS. W Client Component React kolejkuje wysłanie do czasu hydracji.

Do formularzy React 19 ma dwa hooki:

- `useActionState(action, initialState)` z pakietu `react` zwraca `[state, formAction, isPending]`. Akcja dostaje `(prevState, formData)` i zwraca nowy stan, np. błędy walidacji. Wcześniej, w wersjach canary, nazywał się `useFormState` i był w `react-dom`.
- `useFormStatus()` z pakietu `react-dom` zwraca `{ pending, data, method, action }` formularza nadrzędnego. Działa tylko w komponencie wyrenderowanym wewnątrz `<form>`, np. w przycisku "Zapisz".

Po mutacji akcja woła `updateTag` (użytkownik od razu widzi zmianę), `revalidateTag(tag, 'max')`, `revalidatePath` albo `redirect`. `redirect` rzuca wyjątek sterujący, więc rewalidację wywołaj przed nim. Różnice między tymi funkcjami opisuje temat o cache w Next.js.

**Route Handler** (`app/api/.../route.ts`) eksportuje funkcje `GET`, `POST` itd. i pracuje na `Request` / `Response`. To zwykły publiczny endpoint HTTP. Wybierasz go do webhooków (Stripe, CMS), publicznego API, klientów spoza React (aplikacja mobilna, inny serwis), callbacków OAuth, odpowiedzi innych niż UI (RSS, pliki) i streamingu. Server Components nie powinny pobierać danych z własnych Route Handlerów, bo to zbędne żądanie HTTP; wołaj źródło danych bezpośrednio.

Trzecia opcja to mutacja po stronie klienta z TanStack Query (`useMutation`, potem `invalidateQueries`). Ma sens, gdy dane i tak żyją w cache TanStack Query (np. dashboard z pollingiem, optymistyczne aktualizacje list) albo backend jest osobnym API.

Każda akcja to publiczny endpoint `POST`. Sprawdzenie sesji na stronie, która renderuje formularz, akcji nie chroni. Next.js dodaje kilka zabezpieczeń:

- porównuje nagłówek `Origin` z `Host` (lub `X-Forwarded-Host`) i odrzuca żądania z innej domeny; zaufane proxy dopisujesz w `serverActions.allowedOrigins`;
- akceptuje tylko metodę `POST`, a body ma domyślny limit 1 MB (`serverActions.bodySizeLimit`);
- ID akcji są szyfrowane i niedeterministyczne, a nieużywane akcje są usuwane z bundla i nie dostają endpointu;
- zmienne przechwycone przez akcję zdefiniowaną inline są szyfrowane przed wysłaniem do klienta.

Next.js nie sprawdza za Ciebie, kto wywołuje akcję, czy ma prawo do danego rekordu (IDOR) i czy dane mają sens. To robisz w akcji albo w warstwie dostępu do danych z `import 'server-only'`. Zwracaj tylko pola potrzebne UI, nie cały rekord z bazy. Pamiętaj też, że zmienne z prefiksem `NEXT_PUBLIC_` są wklejane do bundla JS w czasie buildu, więc nie trzymaj w nich sekretów.

## Kod

```ts title="app/offers/[id]/actions.ts"
'use server';
import 'server-only';
import { z } from 'zod';
import { updateTag } from 'next/cache';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

const Review = z.object({ offerId: z.uuid(), text: z.string().min(10).max(2000) });
type State = { error?: string; ok?: boolean };

export async function addReview(_prev: State, formData: FormData): Promise<State> {
  const session = await auth();
  if (!session?.user) return { error: 'Zaloguj się, aby dodać opinię.' };

  const parsed = Review.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: 'Opinia musi mieć od 10 do 2000 znaków.' };

  // authorization: only guests who booked this offer may review it
  const booked = await db.booking.findFirst({ where: { offerId: parsed.data.offerId, userId: session.user.id } });
  if (!booked) return { error: 'Możesz ocenić tylko swoją rezerwację.' };

  await db.review.create({ data: { ...parsed.data, userId: session.user.id } });
  updateTag(`offer-${parsed.data.offerId}`);
  return { ok: true };
}
```

```tsx title="app/offers/[id]/review-form.tsx"
'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { addReview } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus(); // reads the parent form
  return <button disabled={pending}>{pending ? 'Wysyłanie...' : 'Dodaj opinię'}</button>;
}

export function ReviewForm({ offerId }: { offerId: string }) {
  const [state, formAction] = useActionState(addReview, {});
  return (
    <form action={formAction}>
      <input type="hidden" name="offerId" value={offerId} />
      <textarea name="text" aria-label="Treść opinii" required minLength={10} />
      {state.error && <p role="alert">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}
```

## Częste błędy

- Brak sprawdzenia sesji i uprawnień w akcji, bo "strona jest dostępna tylko po zalogowaniu". Akcję da się wywołać bezpośrednim `POST`.
- Ufanie danym od klienta: ID właściciela, cena albo cały obiekt w argumentach. Przyjmuj ID rekordu i zmianę, resztę czytaj z bazy na podstawie sesji.
- Wywołanie `useFormStatus` w tym samym komponencie, który renderuje `<form>`. `pending` będzie zawsze `false`.
- Używanie Server Actions do pobierania danych lub do webhooka. Akcje idą po kolei i mają ID zmieniające się między buildami; do tego służą Server Components i Route Handlers.

## Pytania

### Czym różni się Server Action od Route Handlera i kiedy wybierzesz które? {#next-server-actions-q1}

Server Action to funkcja, którą wywołujesz z komponentu React: z `action` formularza, z `formAction` przycisku albo z handlera w `startTransition`. Next.js sam tworzy dla niej endpoint `POST` z ID zmieniającym się między buildami. W jednej odpowiedzi odsyła wynik akcji i odświeżony UI po rewalidacji. Działa też progressive enhancement formularzy. Route Handler (`route.ts`) to zwykły endpoint HTTP ze stałym URL, dowolną metodą i pełną kontrolą nad `Request` i `Response`. Akcję wybieram do mutacji z własnego UI: zapis formularza, polubienie, zmiana ustawień. Route Handler wybieram do webhooków, publicznego API, klientów spoza React (aplikacja mobilna), callbacków OAuth, plików, RSS i streamingu odpowiedzi. W obu przypadkach sprawdzam auth i waliduję wejście, bo oba są publicznie osiągalne.

### Jak Next.js chroni Server Actions i czego nie robi za Ciebie? {#next-server-actions-q2}

Akcje przyjmują tylko `POST`, a Next.js porównuje nagłówek `Origin` z `Host` i odrzuca żądania z obcej domeny. Razem z domyślnym `SameSite=Lax` cookies chroni to przed typowym CSRF. ID akcji są szyfrowane i niedeterministyczne, nieużywane akcje znikają z bundla, a zmienne z domknięcia są szyfrowane. Body ma limit 1 MB. Next.js nie sprawdza jednak tożsamości ani uprawnień. Nie waliduje też danych i nie ogranicza tego, co akcja zwraca. W każdej akcji trzeba więc sprawdzić sesję, sprawdzić, czy użytkownik może zmienić ten konkretny rekord (ochrona przed IDOR), zwalidować wejście (np. Zod) i zwrócić tylko potrzebne pola.

### Do czego służą `useActionState` i `useFormStatus` i skąd się je importuje? {#next-server-actions-q3}

`useActionState` pochodzi z `react`. Opakowuje akcję i trzyma jej ostatni wynik jako stan. Zwraca `[state, formAction, isPending]`, a akcja dostaje `(prevState, formData)`. Typowo zwraca błędy walidacji, które pokazujesz przy formularzu. `useFormStatus` pochodzi z `react-dom`. Zwraca stan wysyłania formularza nadrzędnego (`pending`, `data`, `method`), więc musi być wywołany w komponencie wewnątrz `<form>`, np. w przycisku. Dzięki temu przycisk "Zapisz" może się sam zablokować bez przekazywania propsów.

### Kiedy zamiast Server Action wybierzesz mutację po stronie klienta z TanStack Query? {#next-server-actions-q4}

Gdy dane już żyją w cache TanStack Query po stronie klienta: dashboard z pollingiem, nieskończona lista, edycja w tabeli z optymistycznymi aktualizacjami i rollbackiem. Wtedy `useMutation` i `invalidateQueries` aktualizują ten sam cache, z którego czyta UI. Drugi przypadek to backend jako osobne API (np. Java, Go), wspólne dla web i mobile; dodatkowa warstwa akcji niewiele daje. Server Action jest prostsza, gdy dane renderują Server Components: jedna funkcja robi zapis i rewalidację, a formularz działa bez JS.

## Quiz

### Z którego pakietu importujesz `useFormStatus`? {#next-server-actions-z1}

- [ ] `react`
- [x] `react-dom`
- [ ] `next/navigation`
- [ ] `next/form`

`useFormStatus` jest w `react-dom`, a `useActionState` w `react`.

### Strona `/admin` przekierowuje niezalogowanych w Server Component. Czy Server Action zdefiniowana na tej stronie też jest chroniona? {#next-server-actions-z2}

- [ ] Tak, bo akcja dziedziczy kontekst strony
- [ ] Tak, bo ID akcji jest zaszyfrowane
- [x] Nie, akcję da się wywołać bezpośrednim żądaniem POST, więc musi sama sprawdzić sesję i uprawnienia
- [ ] Nie, ale wystarczy matcher w `proxy.ts`

Akcja jest osobnym punktem wejścia; sprawdzenie na poziomie strony steruje tylko tym, jakie UI się wyrenderuje.
