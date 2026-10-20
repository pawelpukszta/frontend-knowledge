---
title: any, unknown, never
level: mid
tags:
  - any
  - unknown
  - never
  - bezpieczeństwo typów
summary: "any wyłącza sprawdzanie typów. unknown to bezpieczny odpowiednik: zanim użyjesz wartości, musisz ją zawęzić. never oznacza wartość, która nie może wystąpić."
sources:
  - title: "TypeScript Handbook: Everyday Types (any)"
    url: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
  - title: "TypeScript Handbook: Narrowing (never type)"
    url: https://www.typescriptlang.org/docs/handbook/2/narrowing.html
---

## Wyjaśnienie

- **`any`**: "wszystko wolno". Wyłącza TS dla tej wartości i "zaraża" inne typy. Unikaj (reguła lint `no-explicit-any`).
- **`unknown`**: "nie wiem, co to jest". Możesz przypisać do niego wszystko, ale żeby coś z nim zrobić, musisz go **zawęzić** (type guard). Idealny dla danych z zewnątrz, `catch (e)` i `JSON.parse`.
- **`never`**: typ bez wartości. Zwracany przez funkcję, która zawsze rzuca błąd; pojawia się w wyczerpanych uniach. Służy do **exhaustiveness checking**.
- **`void`**: funkcja nic istotnego nie zwraca.

## Kod

```ts
function parse(json: string): unknown {
  return JSON.parse(json);
}
const data = parse('{"price": 10}');
// data.price;           // error: 'data' is of type 'unknown'
if (typeof data === 'object' && data !== null && 'price' in data) {
  console.log(data.price); // narrowed, OK
}

try { risky(); } catch (e) {        // e is unknown (useUnknownInCatchVariables)
  if (e instanceof Error) console.error(e.message);
}
```

## Pytania

### Różnica między any a unknown? {#ts-any-unknown-never-q1}

Oba przyjmują dowolną wartość. `any` pozwala na wszystko bez sprawdzania (utrata bezpieczeństwa). `unknown` wymaga zawężenia przed użyciem, więc wymusza sprawdzenie typu. Do danych z zewnątrz używaj `unknown`.

### Do czego służy never? {#ts-any-unknown-never-q2}

Opisuje stan niemożliwy: funkcja, która nigdy nie wraca, lub gałąź po obsłużeniu wszystkich wariantów unii. Przypisanie wartości do `never` w `default` w `switch` daje błąd kompilacji, gdy ktoś doda nowy wariant i go nie obsłuży.

## Quiz

### Który typ wymaga zawężenia przed użyciem wartości? {#ts-any-unknown-never-z1}

- [ ] any
- [x] unknown
- [ ] never
- [ ] object

`unknown` przyjmuje wszystko, ale nie pozwala nic zrobić bez type guarda.
