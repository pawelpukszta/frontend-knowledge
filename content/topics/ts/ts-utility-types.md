---
title: Utility types, mapped i conditional types
level: mid
tags:
  - Partial
  - Pick
  - Omit
  - Record
  - ReturnType
  - mapped types
summary: Wbudowane typy pomocnicze przekształcają istniejące typy, żeby nie powtarzać definicji. Pod spodem to mapped i conditional types.
sources:
  - title: "TypeScript Handbook: Utility Types"
    url: https://www.typescriptlang.org/docs/handbook/utility-types.html
  - title: "TypeScript Handbook: Mapped Types"
    url: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
  - title: "TypeScript Handbook: Conditional Types"
    url: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
---

## Wyjaśnienie

Najczęściej używane:

- `Partial<T>` / `Required<T>`: wszystkie pola opcjonalne / wymagane.
- `Readonly<T>`: pola tylko do odczytu.
- `Pick<T, 'a' | 'b'>` / `Omit<T, 'a'>`: wybór / pominięcie pól.
- `Record<K, V>`: obiekt o kluczach `K` i wartościach `V`.
- `ReturnType<typeof fn>`, `Parameters<typeof fn>`, `Awaited<T>`.
- `NonNullable<T>`, `Exclude<U, X>`, `Extract<U, X>`.
- React: `ComponentProps<typeof Button>`, `ComponentProps<'button'>`.

**Mapped type**: iteracja po kluczach `{ [K in keyof T]: ... }`. **Conditional type**: `T extends U ? X : Y`, z `infer` do "wyciągania" typów.

## Kod

```ts
interface Offer { id: string; title: string; price: number; createdAt: Date }

type OfferDraft = Omit<Offer, 'id' | 'createdAt'>;
type OfferPatch = Partial<OfferDraft>;
type PriceMap = Record<Offer['id'], number>;

// Mapped type
type Nullable<T> = { [K in keyof T]: T[K] | null };

// Conditional type with infer
type ElementOf<T> = T extends (infer U)[] ? U : never;
type N = ElementOf<number[]>; // number

// Types derived from runtime values
const loadOffers = async () => [{ id: '1', price: 99 }];
type Loaded = Awaited<ReturnType<typeof loadOffers>>;
```

## Pytania

### Różnica między Pick i Omit? {#ts-utility-types-q1}

`Pick<T, K>` tworzy typ tylko z wybranych kluczy, `Omit<T, K>` z wszystkich poza wskazanymi. Wybierasz ten, przy którym lista kluczy jest krótsza i stabilniejsza.

### Czym jest mapped type? {#ts-utility-types-q2}

Typ zbudowany przez iterację po kluczach innego typu: `{ [K in keyof T]: NewType }`. Na nim oparte są `Partial`, `Readonly`, `Record`.
