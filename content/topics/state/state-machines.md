---
title: "Maszyny stanów w UI: status zamiast flag"
level: mid
added: 2026-10-23
tags:
  - maszyna stanów
  - useReducer
  - XState
  - status
  - stan
summary: "Zamiast kilku flag (`isLoading`, `isError`, `isSuccess`) trzymaj jeden `status` i opisz, które zdarzenia są dozwolone w którym stanie. Często wystarczy `useReducer`; XState opłaca się przy złożonych, wieloetapowych przepływach."
sources:
  - title: "React: Reacting to Input with State"
    url: https://react.dev/learn/reacting-to-input-with-state
  - title: "React: Extracting State Logic into a Reducer"
    url: https://react.dev/learn/extracting-state-logic-into-a-reducer
  - title: "React: useReducer"
    url: https://react.dev/reference/react/useReducer
  - title: "Kent C. Dodds: Stop using isLoading booleans"
    url: https://kentcdodds.com/blog/stop-using-isloading-booleans
  - title: "Stately: State machines and statecharts"
    url: https://stately.ai/docs/state-machines-and-statecharts
  - title: "Stately: XState React (@xstate/react)"
    url: https://stately.ai/docs/xstate-react
---

## Wyjaśnienie

Trzy flagi `isLoading`, `isError` i `isSuccess` dają 8 kombinacji, a sensowne są cztery: bezczynność, ładowanie, błąd, sukces. Pozostałe, np. `isLoading: true` razem z `isError: true`, to stany niemożliwe, których UI nie umie narysować. Każdy `setIsX` trzeba pamiętać wyłączyć w odpowiednim miejscu, a jeden pominięty kończy się spinnerem obok komunikatu błędu.

Rozwiązanie to jedno pole `status` o skończonej liczbie wartości, np. `'idle' | 'loading' | 'error' | 'success'`. Dane, które istnieją tylko w danym stanie (`error`, `data`), przypinasz do tego wariantu przez discriminated union. Typ i exhaustiveness check opisuje temat o discriminated unions, tu chodzi o zachowanie w czasie.

Maszyna stanów (finite state machine) dokłada do tego przejścia. Ma:

- skończony zbiór stanów, z których aktywny jest dokładnie jeden;
- stan początkowy;
- zdarzenia (np. `SUBMIT`, `RESOLVE`, `REJECT`, `RETRY`);
- przejścia: para (stan, zdarzenie) wyznacza następny stan.

Zdarzenie niedozwolone w danym stanie jest ignorowane. `SUBMIT` w stanie `submitting` nic nie robi, więc podwójne wysłanie formularza znika bez dodatkowej flagi `isSubmitting`. Spóźniona odpowiedź `RESOLVE` po anulowaniu też niczego nie zepsuje.

`useReducer` wystarcza jako prosta maszyna. Reducer sprawdza najpierw `state.status`, potem `event.type`, a dla niedozwolonej pary zwraca ten sam obiekt stanu. React porównuje wynik przez `Object.is` i przy tej samej referencji pomija ponowny render. Reducer musi być czystą funkcją, więc request wysyłasz w event handlerze albo efekcie, a do reducera trafia tylko zdarzenie z wynikiem.

XState i statecharty opłacają się, gdy zwykła maszyna przestaje wystarczać. Pomagają przy stanach zagnieżdżonych i równoległych, timeoutach (przejścia `after`), warunkach (`guard`), anulowaniu wywołań asynchronicznych i wieloetapowych przepływach: checkout, kreator, player wideo, połączenie WebSocket z ponawianiem. Maszynę da się też zwizualizować i omówić z zespołem. Do przełącznika, modala czy pojedynczego pobrania danych to przesada. Do server state lepiej sprawdza się TanStack Query, który sam udostępnia `status`.

## Analogia

Automat z napojami: przyjmuje monety, dopiero potem wybór napoju, a w trakcie wydawania ignoruje przyciski. Nie ma tu stanu "wydaje napój i jednocześnie czeka na monetę", bo projekt automatu go nie przewiduje.

## Kod

```tsx title="useReducer jako maszyna stanów"
type State =
  | { status: 'editing'; error?: string }
  | { status: 'submitting' }
  | { status: 'success'; bookingId: string };

type Event =
  | { type: 'SUBMIT' }
  | { type: 'RESOLVE'; bookingId: string }
  | { type: 'REJECT'; error: string };

function bookingReducer(state: State, event: Event): State {
  switch (state.status) {
    case 'editing':
      return event.type === 'SUBMIT' ? { status: 'submitting' } : state;
    case 'submitting':
      if (event.type === 'RESOLVE') return { status: 'success', bookingId: event.bookingId };
      if (event.type === 'REJECT') return { status: 'editing', error: event.error };
      return state; // a second SUBMIT is ignored
    case 'success':
      return state; // final state
  }
}

function BookingForm() {
  const [state, dispatch] = useReducer(bookingReducer, { status: 'editing' });

  async function handleSubmit(formData: FormData) {
    dispatch({ type: 'SUBMIT' });
    try {
      const { id } = await createBooking(formData);
      dispatch({ type: 'RESOLVE', bookingId: id });
    } catch {
      dispatch({ type: 'REJECT', error: 'Nie udało się zarezerwować' });
    }
  }

  if (state.status === 'success') return <p>Rezerwacja {state.bookingId} gotowa</p>;
  return (
    <form action={handleSubmit}>
      {state.status === 'editing' && state.error && <p role="alert">{state.error}</p>}
      <button disabled={state.status === 'submitting'}>Rezerwuj</button>
    </form>
  );
}
```

```ts title="Ta sama logika w XState v5 (z timeoutem)"
import { setup } from 'xstate';

export const bookingMachine = setup({
  types: {
    events: {} as { type: 'SUBMIT' } | { type: 'RESOLVE' } | { type: 'REJECT' },
  },
}).createMachine({
  id: 'booking',
  initial: 'editing',
  states: {
    editing: { on: { SUBMIT: 'submitting' } },
    submitting: {
      on: { RESOLVE: 'success', REJECT: 'editing' },
      after: { 15000: 'editing' }, // give up after 15 s
    },
    success: { type: 'final' },
  },
});

// In a component: const [snapshot, send] = useMachine(bookingMachine);
// snapshot.matches('submitting')
```

## Częste błędy

- Dokładanie kolejnej flagi przy każdym nowym wymaganiu (`isRetrying`, `isCancelled`) zamiast nowego stanu.
- Trzymanie `isLoading` obok `status`. Dwa źródła prawdy szybko się rozjeżdżają, a flagę można zawsze wyliczyć: `const isLoading = state.status === 'loading'`.
- Reducer, który obsługuje każde zdarzenie w każdym stanie. Nie pilnuje wtedy przejść i podwójne kliknięcie znów wysyła dwa requesty.
- XState do każdego przełącznika. Koszt nauki i kodu przewyższa zysk, gdy stany są dwa lub trzy.

## Pytania

### Co jest złego w flagach `isLoading`, `isError` i `isSuccess`? {#state-machines-q1}

Trzy niezależne flagi dają osiem kombinacji, a sensowne są cztery. Reszta to stany niemożliwe, np. ładowanie i błąd naraz, które UI renderuje przypadkowo, zależnie od kolejności `if`-ów. Każdą flagę trzeba ręcznie ustawiać i zerować, więc łatwo o błąd. Zamiast tego trzymam jedno pole `status` z wartościami `'idle' | 'loading' | 'error' | 'success'`, a dane i błąd przypinam do odpowiedniego wariantu unii. Flagi, jeśli są wygodne, wyliczam ze `status`.

### Jak zrobić prostą maszynę stanów na `useReducer`? {#state-machines-q2}

Stan ma pole `status`, a zdarzenia to akcje (`SUBMIT`, `RESOLVE`, `REJECT`). W reducerze najpierw rozgałęziam po `state.status`, a w środku po typie zdarzenia. Dozwolone przejście zwraca nowy stan, niedozwolone zwraca ten sam obiekt, więc React pomija render. Efekty uboczne, np. request, zostają w handlerze, bo reducer musi być czysty.

```ts
case 'submitting':
  if (event.type === 'RESOLVE') return { status: 'success', data: event.data };
  return state; // SUBMIT while submitting is ignored
```

### Kiedy sięgnąć po XState, a kiedy to przesada? {#state-machines-q3}

XState opłaca się przy przepływach z wieloma stanami i regułami przejść: checkout w kilku krokach, kreator, player, połączenie z ponawianiem. Pomaga też przy stanach zagnieżdżonych i równoległych, timeoutach (`after`), warunkach (`guard`) i anulowaniu wywołań asynchronicznych. Maszynę da się zwizualizować i przejrzeć z zespołem, a logikę przetestować bez UI. Przy przełączniku, modalu albo pojedynczym pobraniu danych wystarczy `useState` z `status` lub `useReducer`. Do danych z serwera używam TanStack Query zamiast własnej maszyny.

## Quiz

### Ile kombinacji wartości dają trzy niezależne flagi boolean? {#state-machines-z1}

- [ ] 3
- [ ] 4
- [ ] 6
- [x] 8

2 do potęgi 3 to 8, choć sensowne stany ładowania danych są zwykle cztery.

### Co powinien zwrócić reducer-maszyna dla zdarzenia niedozwolonego w bieżącym stanie? {#state-machines-z2}

- [ ] Nowy obiekt z tymi samymi polami
- [x] Ten sam obiekt `state`
- [ ] `undefined`
- [ ] Rzucić wyjątek

Ta sama referencja oznacza brak zmiany, a React przy porównaniu `Object.is` pomija ponowny render.
