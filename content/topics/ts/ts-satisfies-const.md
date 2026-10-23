---
title: satisfies, as const i asercje (as)
level: senior
added: 2026-10-20
tags:
  - satisfies
  - as const
  - assertion
  - literal types
summary: as wymusza typ (i może skłamać). satisfies sprawdza zgodność z typem, zachowując dokładny typ wartości. as const zamienia wartości w readonly literały.
sources:
  - title: "TypeScript 4.9: The satisfies Operator"
    url: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html
  - title: "TypeScript Handbook: Everyday Types (literal types, assertions)"
    url: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
---

## Wyjaśnienie

- **`as Type` (asercja)**: "zaufaj mi". Wyłącza część sprawdzania. Używaj rzadko, np. przy DOM (`as HTMLInputElement`).
- **`satisfies Type`** (TS 4.9+): sprawdza, czy wartość pasuje do typu, ale **nie poszerza** typu wynikowego. Najlepsze dla obiektów konfiguracyjnych.
- **`as const`**: literały zamiast szerokich typów (`'PLN'` zamiast `string`), wszystko `readonly`. Pozwala wyprowadzić unię z tablicy.
- **Non-null assertion `x!`**: mówi, że wartość nie jest `null`. Kolejne miejsce, gdzie łatwo okłamać kompilator.

## Kod

```ts
type Currency = 'PLN' | 'EUR';

const config = {
  default: 'PLN',
  symbols: { PLN: 'zł', EUR: '€' },
} satisfies { default: Currency; symbols: Record<Currency, string> };
config.symbols.PLN; // exact type preserved, typo would be a compile error

const STATUSES = ['draft', 'published', 'archived'] as const;
type Status = (typeof STATUSES)[number]; // 'draft' | 'published' | 'archived'

const input = document.querySelector('#q') as HTMLInputElement; // assertion
```

## Pytania

### Różnica między satisfies a as? {#ts-satisfies-const-q1}

`as` nadpisuje typ, a kompilator Ci wierzy (możesz przypisać błędne dane). `satisfies` weryfikuje, że wartość spełnia typ, i zostawia dokładniejszy typ wywnioskowany z wartości. `satisfies` jest bezpieczniejszy.

### Do czego służy as const? {#ts-satisfies-const-q2}

Zamienia wartości na najwęższe typy literałowe i `readonly`. Typowe użycie: tablica stałych, z której wyprowadzasz unię typów, oraz obiekty konfiguracyjne.

## Quiz

### Który zapis sprawdza zgodność obiektu z typem, ale zachowuje jego dokładny typ? {#ts-satisfies-const-z1}

- [ ] as
- [x] satisfies
- [ ] as const
- [ ] !

`satisfies` weryfikuje zgodność bez poszerzania typu.
