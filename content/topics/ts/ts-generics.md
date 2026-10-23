---
title: Generyki (generics)
level: mid
added: 2026-10-20
tags:
  - generics
  - T
  - constraints
  - reużywalność
summary: Generyk to "parametr dla typu". Pozwala napisać funkcję lub komponent raz i zachować pełną informację o typie dla różnych danych.
sources:
  - title: "TypeScript Handbook: Generics"
    url: https://www.typescriptlang.org/docs/handbook/2/generics.html
  - title: Total TypeScript (Matt Pocock)
    url: https://www.totaltypescript.com/
  - title: "Matt Pocock: YouTube"
    url: https://www.youtube.com/@mattpocockuk
---

## Wyjaśnienie

Generyk działa jak argument funkcji, ale na poziomie typów: `T` zostaje "podstawione" konkretnym typem przy użyciu. Zwykle TS **sam wnioskuje** `T` z argumentów.

- **Constraints**: `T extends { id: string }` ogranicza, jakie typy są dozwolone.
- **Domyślny typ**: `<T = string>`.
- **`keyof` + generyk**: `K extends keyof T` pozwala bezpiecznie operować na kluczach obiektu.
- Typowe miejsca: funkcje pomocnicze, hooki (`useState<T>`), komponenty listy/tabeli, klient API (`fetchJson<T>`), utility types.

Reguła: generyk ma sens, gdy **łączy** typy (np. wejście z wyjściem). Jeśli `T` występuje tylko raz, zwykle nie jest potrzebny.

## Analogia

Generyk to pudełko z etykietą "tu włóż cokolwiek". Gdy włożysz książkę, pudełko wie, że wyjmiesz książkę, a nie "coś".

## Kod

```ts
function first<T>(items: T[]): T | undefined {
  return items[0];
}
const n = first([1, 2, 3]);    // number | undefined
const s = first(['a', 'b']);   // string | undefined

// Constraint + keyof
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}
pluck([{ id: 1, city: 'Rzym' }], 'city'); // string[]
// pluck([...], 'country');              // error: not a key

// Generic API helper (note: the type is a promise, not runtime validation)
async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  return res.json() as Promise<T>;
}
```

## Częste błędy

- "Generyk dla generyku": `function log<T>(x: T): void` - `T` użyte raz nic nie daje, wystarczy `unknown`.
- Zbyt skomplikowane typy generyczne, których nikt w zespole nie rozumie. Czytelność też jest wymaganiem.

## Pytania

### Czym są generyki i po co je stosować? {#ts-generics-q1}

Parametry typów, które pozwalają pisać reużywalny kod bez utraty informacji o typie. Zamiast `any` funkcja `first<T>(arr: T[]): T` zachowuje powiązanie: tablica stringów daje string.

### Co robi `extends` w generyku? {#ts-generics-q2}

Nakłada ograniczenie (constraint): `T extends { id: string }` oznacza, że `T` musi mieć co najmniej pole `id` typu string. Dzięki temu w środku funkcji możesz bezpiecznie użyć `item.id`.

### Jak otypować generyczny komponent listy w React? {#ts-generics-q3}

`function List<T>({ items, renderItem }: { items: T[]; renderItem: (item: T) => ReactNode })`. TS wywnioskuje `T` z `items`, a `renderItem` dostanie poprawny typ elementu.
