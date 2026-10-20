---
title: Discriminated unions i exhaustiveness check
level: mid
tags:
  - union
  - discriminated union
  - never
  - stan
summary: Unia obiektów ze wspólnym polem-etykietą (np. status) pozwala modelować stany bez niemożliwych kombinacji, a never pilnuje obsługi wszystkich wariantów.
sources:
  - title: "TypeScript Handbook: Discriminated unions"
    url: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions
  - title: "TypeScript Handbook: Exhaustiveness checking"
    url: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
---

## Wyjaśnienie

Zamiast wielu opcjonalnych pól (`isLoading?`, `error?`, `data?`), które pozwalają na absurdalne kombinacje (np. `isLoading: true` i `error` naraz), modelujesz każdy stan osobno. Zasada: **make impossible states impossible**.

Exhaustiveness check: w `default` przypisujesz wartość do `never`. Gdy ktoś doda nowy wariant, kompilator pokaże błąd we wszystkich miejscach, które go nie obsługują.

## Kod

```ts
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; data: T };

function render(state: RequestState<string[]>) {
  switch (state.status) {
    case 'idle': return 'Wpisz frazę';
    case 'loading': return 'Ładowanie...';
    case 'error': return state.error;             // error is available here
    case 'success': return state.data.join(', '); // data is available here
    default: {
      const _exhaustive: never = state; // compile error if a case is missing
      return _exhaustive;
    }
  }
}
```

## Pytania

### Czym jest discriminated union? {#ts-discriminated-unions-q1}

Unia typów obiektowych, które mają wspólne pole z literałem (dyskryminator, np. `status` lub `kind`). Sprawdzenie tego pola zawęża typ do konkretnego wariantu.

### Jak wymusić obsługę wszystkich wariantów unii? {#ts-discriminated-unions-q2}

Exhaustiveness check: w gałęzi `default` przypisać wartość do zmiennej typu `never`. Jeśli jakiś wariant nie jest obsłużony, TS zgłosi błąd kompilacji.

## Quiz

### Po co przypisywać wartość do zmiennej typu never w `default` switcha? {#ts-discriminated-unions-z1}

- [ ] Żeby przyspieszyć kod
- [x] Żeby kompilator wykrył nieobsłużony wariant unii
- [ ] Żeby zignorować błąd
- [ ] Żeby wymusić rzucenie wyjątku

Exhaustiveness check: nowy wariant spowoduje błąd kompilacji.
