---
title: "Type guards vs generyki: czym się różnią"
level: mid
added: 2026-10-20
tags:
  - type guard
  - generics
  - porównanie
summary: Generyki działają w czasie kompilacji i zachowują typ, który już znasz. Type guards działają w runtime i odkrywają typ, którego jeszcze nie znasz.
sources:
  - title: "TypeScript Handbook: Generics"
    url: https://www.typescriptlang.org/docs/handbook/2/generics.html
  - title: "TypeScript Handbook: Narrowing"
    url: https://www.typescriptlang.org/docs/handbook/2/narrowing.html
---

## Wyjaśnienie

To dwa różne narzędzia, często mylone, bo oba "robią coś z typami".

| | Generyki | Type guards |
|---|---|---|
| Kiedy działają | tylko compile time | runtime (zwykły JS) + informacja dla TS |
| Problem | "chcę reużywalny kod dla wielu typów bez utraty informacji" | "mam szeroki typ (unia, unknown) i muszę sprawdzić, co to jest" |
| Kierunek | przenoszą typ z wejścia na wyjście | zawężają szeroki typ do węższego |
| Po kompilacji | znikają całkowicie | zostają jako warunki `if` |
| Przykład | `useState<T>`, `first<T>(arr)` | `typeof`, `isUser(x)`, `status === 'error'` |

Często działają razem: generyczny guard `isDefined<T>(x: T | null): x is T` albo generyczny parser z walidacją, który zwraca `T` po sprawdzeniu danych.

## Analogia

Generyk to formularz z polem "wpisz typ": zachowuje to, co już wiesz. Type guard to bramka na lotnisku: sprawdza, kim naprawdę jesteś, zanim wpuści Cię dalej.

## Kod

```ts
// Generic: keeps a known type
function wrap<T>(value: T): { value: T } { return { value }; }

// Type guard: discovers an unknown type at runtime
function isString(x: unknown): x is string { return typeof x === 'string'; }

// Together: generic guard used in filter
function isDefined<T>(x: T | null | undefined): x is T { return x != null; }
const prices = [100, null, 250].filter(isDefined); // number[]
```

## Pytania

### Czym różni się type guard od generyka? {#ts-guards-vs-generics-q1}

Generyk to parametr typu, który działa tylko w czasie kompilacji i przenosi informację o typie (np. z argumentu na wynik). Type guard to kod wykonywany w runtime, który sprawdza wartość i pozwala TS zawęzić typ. Generyk odpowiada na pytanie "jak zachować typ?", guard na "jaki to jest typ?".

### Czy można połączyć oba mechanizmy? {#ts-guards-vs-generics-q2}

Tak. Np. `isDefined<T>(x: T | null): x is T` to generyczny type guard, który w `filter` usuwa `null` i zachowuje typ elementów.

## Quiz

### Najważniejsza różnica między generykami a type guards: {#ts-guards-vs-generics-z1}

- [x] Generyki działają tylko w compile time, type guards wykonują się w runtime
- [ ] Generyki są szybsze w runtime
- [ ] Type guards działają tylko z klasami
- [ ] Nie ma różnicy, to synonimy

Generyki przenoszą informację o typie, guardy sprawdzają wartość w trakcie działania programu.
