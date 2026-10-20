---
title: import type dla importów samych typów
priority: low
---

`import type { User }` gwarantuje usunięcie importu przy kompilacji (ważne przy izolowanej transpilacji esbuild/SWC i `verbatimModuleSyntax`).

## Dlaczego to ważne

- Narzędzia transpilujące plik po pliku (esbuild, SWC, Babel) nie wiedzą, czy importowana nazwa jest typem; bez `import type` import może zostać w JS i wywołać błąd lub zbędny efekt uboczny.
- Node.js 24 (oraz 22 od wersji 22.18) uruchamia pliki `.ts` przez usuwanie typów; import typu bez słowa `type` kończy się błędem, bo moduł nie ma takiego eksportu w runtime.
- Czytelnik od razu widzi, które zależności są tylko typami, a które naprawdę trafiają do bundla.

## Jak sprawdzić

typescript-eslint (`consistent-type-imports`) z autopoprawką oraz `verbatimModuleSyntax: true` w `tsconfig.json`.

## Kod

```ts title="Źle"
import { Booking, createBooking } from "./booking"; // Booking is only a type
```

```ts title="Dobrze"
import type { Booking } from "./booking";
import { createBooking } from "./booking";
// or inline:
import { createBooking, type Booking } from "./booking";
```

## Częste błędy

- Inline `type` przy wszystkich nazwach (`import { type A, type B }`), co z `verbatimModuleSyntax` zostawia pusty import z efektami ubocznymi; wtedy użyj `import type`.
