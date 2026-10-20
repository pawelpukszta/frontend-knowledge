---
title: Type guards i narrowing
level: mid
tags:
  - type guard
  - narrowing
  - typeof
  - instanceof
  - in
  - predicate
summary: Type guard to sprawdzenie w runtime, dzięki któremu TS zawęża typ w danym bloku kodu. Zamienia "może być A lub B" na "tu na pewno jest A".
sources:
  - title: "TypeScript Handbook: Narrowing"
    url: https://www.typescriptlang.org/docs/handbook/2/narrowing.html
  - title: "TypeScript Handbook: Creating Types from Types"
    url: https://www.typescriptlang.org/docs/handbook/2/types-from-types.html
  - title: "TypeScript 5.5: Inferred Type Predicates"
    url: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-5.html
---

## Wyjaśnienie

**Narrowing** to zawężanie szerokiego typu (np. `string | number`) do węższego na podstawie analizy przepływu kodu. Wbudowane type guards:

- `typeof x === 'string'` dla prymitywów.
- `x instanceof Date` dla klas.
- `'swim' in animal` dla sprawdzenia właściwości.
- Porównanie z literałem / `===`, sprawdzenie truthiness, `Array.isArray`.
- **Discriminated unions**: sprawdzenie wspólnego pola `kind`/`type`.

**Własny type guard (type predicate)**: funkcja zwracająca `x is Type`. **Assertion function**: `asserts x is Type` rzuca błąd, jeśli warunek nie jest spełniony. Od TS 5.5 proste predykaty są wnioskowane automatycznie, np. w `.filter(x => x !== null)`.

Pamiętaj: type guard to **zwykły kod JS wykonywany w runtime**. TS ufa, że Twoja funkcja `isUser` sprawdza to, co deklaruje. Błędny predykat okłamie kompilator.

## Kod

```ts
type Offer = { kind: 'hotel'; stars: number } | { kind: 'flight'; airline: string };

function describe(o: Offer) {
  if (o.kind === 'hotel') return `${o.stars}*`; // o: hotel variant
  return o.airline;                             // o: flight variant
}

// Custom type predicate
interface User { id: string; email: string }
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' && value !== null &&
    'id' in value && typeof value.id === 'string' &&
    'email' in value && typeof value.email === 'string'
  );
}

// Assertion function
function assertDefined<T>(v: T, msg: string): asserts v is NonNullable<T> {
  if (v == null) throw new Error(msg);
}

const ids = [1, null, 3].filter((x) => x !== null); // number[] (TS 5.5+)
```

## Pytania

### Czym jest type guard? {#ts-type-guards-q1}

Wyrażenie lub funkcja sprawdzająca typ w runtime, po której TS zawęża typ w danym bloku. Wbudowane: `typeof`, `instanceof`, `in`, porównania z literałami. Własne: funkcje z typem zwracanym `x is T`.

### Czym jest type predicate i jakie ma ryzyko? {#ts-type-guards-q2}

Typ zwracany `value is User` informuje TS, że gdy funkcja zwraca `true`, argument jest typu `User`. Ryzyko: TS nie weryfikuje implementacji. Jeśli sprawdzenie jest niepełne, kompilator przyjmie fałszywe założenie.

### Czym różni się `is` od `asserts`? {#ts-type-guards-q3}

`x is T` zwraca boolean i zawęża typ w gałęzi `if`. `asserts x is T` nic nie zwraca, tylko rzuca błąd, gdy warunek nie jest spełniony; po jej wywołaniu typ jest zawężony w dalszym kodzie.

## Quiz

### Co zwraca funkcja będąca własnym type guardem? {#ts-type-guards-z1}

- [ ] `asserts x is T`
- [x] `x is T` (boolean w runtime)
- [ ] `T`
- [ ] `never`

Type predicate `x is T` to boolean, po którym TS zawęża typ w gałęzi `if`.
