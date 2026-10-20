---
title: type vs interface
level: mid
tags:
  - type
  - interface
  - alias
summary: Oba opisują kształt obiektu. interface można rozszerzać i łączyć (declaration merging), type obsługuje unie, krotki i typy warunkowe.
sources:
  - title: "TypeScript Handbook: Everyday Types (type aliases vs interfaces)"
    url: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
  - title: "TypeScript Handbook: Declaration Merging"
    url: https://www.typescriptlang.org/docs/handbook/declaration-merging.html
---

## Wyjaśnienie

| | `interface` | `type` |
|---|---|---|
| Kształt obiektu | tak | tak |
| Unie, krotki, prymitywy | nie | tak (`type Id = string \| number`) |
| Rozszerzanie | `extends` | `&` (intersection) |
| Declaration merging | tak (dwie deklaracje się łączą) | nie (błąd duplikatu) |
| Mapped / conditional types | nie | tak |

Praktyczna zasada: bądź spójny w projekcie. Częste podejście: `interface` dla publicznych kształtów obiektów (np. props, obiekty z API), `type` dla unii i typów złożonych. Declaration merging przydaje się przy rozszerzaniu typów bibliotek (np. `Window`).

## Kod

```ts
interface User { id: string; name: string }
interface Admin extends User { permissions: string[] }

type Status = 'idle' | 'loading' | 'error' | 'success';
type WithTimestamps<T> = T & { createdAt: Date };

// Declaration merging - extending a global
declare global {
  interface Window { dataLayer: unknown[] }
}
```

## Pytania

### Kiedy type, a kiedy interface? {#ts-type-vs-interface-q1}

`type` gdy potrzebujesz unii, krotek, typów warunkowych lub mapped types. `interface` dla kształtów obiektów, zwłaszcza gdy mają być rozszerzane lub łączone. W codziennym kodzie różnica jest niewielka; ważniejsza jest spójność.

### Czym jest declaration merging? {#ts-type-vs-interface-q2}

Dwie deklaracje `interface` o tej samej nazwie łączą się w jedną. Używane do rozszerzania typów globalnych lub bibliotek (module augmentation).
