---
title: "Wzorce projektowe w JS i React"
level: senior
added: 2026-10-23
tags:
  - wzorce projektowe
  - Observer
  - Strategy
  - Adapter
  - Facade
  - Command
summary: "Klasyczne wzorce z katalogu GoF żyją na froncie pod innymi nazwami: subskrypcja store'a to Observer, mapa walidatorów to Strategy, custom hook ukrywający kilka API to Facade. Nazwa wzorca pomaga, gdy skraca rozmowę, a szkodzi, gdy dokłada klasy tam, gdzie wystarczy funkcja."
sources:
  - title: "Refactoring.Guru: Design Patterns Catalog"
    url: https://refactoring.guru/design-patterns/catalog
  - title: "Refactoring.Guru: Strategy"
    url: https://refactoring.guru/design-patterns/strategy
  - title: "patterns.dev: Observer Pattern"
    url: https://www.patterns.dev/vanilla/observer-pattern
  - title: "React: useSyncExternalStore"
    url: https://react.dev/reference/react/useSyncExternalStore
---

## Wyjaśnienie

Wzorce z książki "Design Patterns" (Gang of Four) opisano dla języków z klasami. W JavaScript funkcje są wartościami, więc wiele wzorców kurczy się do jednej funkcji albo obiektu. Warto je znać, bo dają wspólny język: "to jest Adapter na SDK płatności" mówi recenzentowi więcej niż akapit opisu.

| Wzorzec | Idea | Gdzie go spotkasz na froncie |
| --- | --- | --- |
| Observer | obiekt powiadamia subskrybentów o zmianie | `EventTarget`, subskrypcja store'a (Zustand, Redux), `useSyncExternalStore` |
| Strategy | wymienne algorytmy za wspólnym interfejsem | mapa walidatorów lub rendererów zamiast `switch` |
| Adapter | dopasowuje obce API do interfejsu aplikacji | wrapper na SDK analityki lub płatności |
| Facade | prosty interfejs nad kilkoma podsystemami | custom hook `useCheckout` łączący API, store i analitykę |
| Decorator | dokłada zachowanie bez zmiany oryginału | funkcja wyższego rzędu `withRetry(fetchFn)`, HOC `withErrorBoundary` |
| State | zachowanie zależy od bieżącego stanu | maszyna stanów (XState), reducer z unią `status` |
| Command | akcja jako obiekt, który można zapisać | undo/redo, kolejka akcji offline, akcje Reduxa |

Observer: `subscribe` zwraca funkcję do wypisania się, a store wywołuje słuchaczy po zmianie. React podłącza się do takiego źródła przez `useSyncExternalStore`. Dokumentacja React przypomina, że `getSnapshot` musi zwracać tę samą wartość, dopóki stan się nie zmienił. Inaczej komponent wpada w pętlę renderów.

Adapter i Facade łatwo pomylić. Adapter zmienia kształt jednego API, żeby pasował do interfejsu, którego oczekuje aplikacja. Gdy zmienisz dostawcę analityki, przepisujesz tylko adapter. Facade upraszcza: hook `useCheckout` zwraca `{ total, pay, isPaying }`, a pod spodem woła zapytanie, store koszyka i bramkę płatności.

Decorator w JS to zwykle funkcja wyższego rzędu (osobny temat). W React hooki w większości zastąpiły HOC-i. Zostały tam, gdzie trzeba owinąć drzewo, na przykład error boundary.

State: zamiast flag `isLoading`, `isError`, `isSuccess`, które mogą być prawdziwe naraz, trzymasz jeden `status` i dozwolone przejścia. Biblioteka XState robi z tego pełną maszynę stanów z diagramem.

Command zamienia akcję w obiekt z `execute` i `undo`. Stos takich obiektów daje undo w edytorze, a kolejka pozwala wysłać akcje użytkownika po powrocie sieci.

Kiedy nazwa wzorca szkodzi: gdy pojawia się `PaymentStrategyFactory` z interfejsem i trzema klasami dla trzech funkcji po dwie linie. Refactoring.Guru sam zauważa, że w językach z funkcjami jako wartościami Strategy często sprowadza się do przekazania funkcji. Nazwij wzorzec w rozmowie lub w PR, jeśli pomaga zrozumieć kod. Nie dokładaj go w kodzie dla samej nazwy.

## Kod

```ts title="Observer: store + useSyncExternalStore"
import { useSyncExternalStore } from 'react';

export function createStore<T>(initial: T) {
  let state = initial;
  const listeners = new Set<() => void>();
  return {
    getSnapshot: () => state,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener); // unsubscribe
    },
    setState(next: T) {
      state = next; // always a new value, so Object.is sees the change
      listeners.forEach((notify) => notify());
    },
  };
}

export const cartStore = createStore<CartItem[]>([]);
export const useCart = () => useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot);
```

```ts title="Strategy i Adapter"
// Strategy: Record forces a validator for every payment method
const validators: Record<PaymentMethod, (form: PaymentForm) => string | null> = {
  card: (f) => (isValidCardNumber(f.cardNumber) ? null : 'Nieprawidłowy numer karty'),
  blik: (f) => (/^\d{6}$/.test(f.blikCode) ? null : 'Kod BLIK ma 6 cyfr'),
  transfer: () => null,
};
export const validatePayment = (f: PaymentForm) => validators[f.method](f);

// Adapter: the app depends on this interface, not on the vendor SDK
export interface Analytics {
  track(event: string, props?: Record<string, unknown>): void;
}
export const analytics: Analytics = {
  track: (event, props = {}) => vendorSdk.logEvent({ name: event, params: props }),
};
```

## Częste błędy

- Klasy, fabryki i interfejsy przepisane 1:1 z Javy tam, gdzie wystarczy funkcja albo obiekt z funkcjami.
- `getSnapshot`, który przy każdym wywołaniu zwraca nowy obiekt lub tablicę. React uzna to za zmianę i będzie renderował w kółko.
- Observer bez wypisania się: subskrypcja w `useEffect` bez funkcji czyszczącej zostawia wyciek pamięci i wywołania na odmontowanym komponencie.
- Wywoływanie SDK zewnętrznego dostawcy bezpośrednio w 40 komponentach. Zmiana dostawcy albo wyłączenie go w testach wymaga wtedy zmian w 40 plikach.

## Pytania

### Zmapuj trzy klasyczne wzorce na coś, czego używasz na froncie. {#sr-design-patterns-q1}

Observer: store (Zustand, Redux albo własny) trzyma listę subskrybentów i powiadamia ich o zmianie, a komponent podpina się przez `useSyncExternalStore` lub hook biblioteki. To samo robi `EventTarget` w DOM. Strategy: walidację formularza płatności trzymam w obiekcie `Record<PaymentMethod, Validator>` zamiast w `switch`, więc nowa metoda płatności to nowy wpis, a TypeScript pilnuje, żeby żadnej nie pominąć. Adapter: SDK analityki owijam w interfejs `Analytics` z jedną metodą `track`. Komponenty znają tylko ten interfejs, w testach podaję atrapę, a zmiana dostawcy dotyczy jednego pliku.

### Czym różni się Adapter od Facade? {#sr-design-patterns-q2}

Adapter tłumaczy jeden interfejs na inny, którego oczekuje kod klienta, na przykład `vendorSdk.logEvent({ name, params })` na `analytics.track(event, props)`. Zakres funkcji zostaje ten sam, zmienia się kształt. Facade daje prostsze wejście do kilku podsystemów naraz. Hook `useCheckout` łączy zapytanie o koszyk, mutację płatności i zdarzenie analityczne, a komponent widzi tylko `{ total, pay, isPaying }`.

### Kiedy nazwanie wzorca pomaga, a kiedy tylko dodaje szumu? {#sr-design-patterns-q3}

Pomaga w komunikacji. Zdanie "to jest Adapter, reszta aplikacji nie importuje SDK" w opisie PR od razu mówi, jakiej reguły pilnować. Pomaga też przy projektowaniu, bo wzorzec przypomina o znanych pułapkach, na przykład o wypisywaniu się z Observera. Szkodzi, gdy nazwa wymusza ceremonię: klasa `ValidationStrategy`, fabryka i rejestr dla trzech funkcji. W JS wiele wzorców to po prostu funkcja przekazana jako argument. Zaczynam od najprostszego kodu, a nazwę wzorca dodaję, gdy kształt już jest i nazwa ułatwia rozmowę.

### Jak zaimplementujesz undo w edytorze? {#sr-design-patterns-q4}

Wzorcem Command: każda zmiana to obiekt z `execute` i `undo`. Wykonane komendy trafiają na stos `done`, cofnięte na stos `undone`, a nowa komenda czyści `undone`. Alternatywą są niemutowalne snapshoty stanu (lista poprzednich stanów), prostsze przy małym stanie, ale droższe pamięciowo przy dużym dokumencie.

```ts
interface Command { execute(): void; undo(): void }

const done: Command[] = [];
const undone: Command[] = [];

export function run(cmd: Command) { cmd.execute(); done.push(cmd); undone.length = 0; }
export function undo() { const cmd = done.pop(); if (cmd) { cmd.undo(); undone.push(cmd); } }
export function redo() { const cmd = undone.pop(); if (cmd) { cmd.execute(); done.push(cmd); } }
```

## Quiz

### Hook `useSyncExternalStore` łączy React z zewnętrznym źródłem danych według wzorca: {#sr-design-patterns-z1}

- [ ] Adapter
- [x] Observer
- [ ] Command
- [ ] Facade

Komponent subskrybuje store przez `subscribe` i dostaje powiadomienie o każdej zmianie, czyli działa jak obserwator.

### Obiekt `Record<PaymentMethod, Validator>` zastępujący `switch` po metodzie płatności to przykład wzorca: {#sr-design-patterns-z2}

- [x] Strategy
- [ ] Decorator
- [ ] State
- [ ] Observer

Każdy walidator to wymienny algorytm za wspólnym interfejsem, wybierany w czasie działania programu.
