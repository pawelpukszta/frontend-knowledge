---
title: Bez typu any
priority: medium
---

`any` wyłącza sprawdzanie typów i "zaraża" kolejne wartości. Zamiast tego `unknown` z zawężaniem, generyki lub konkretne typy.

## Dlaczego to ważne

- Każda wartość wyprowadzona z `any` też jest `any`, więc jeden niedookreślony parametr wyłącza kontrolę typów w całym łańcuchu wywołań.
- `unknown` zmusza do sprawdzenia typu przed użyciem, np. w bloku `catch`, gdzie błąd nie musi być obiektem `Error`.
- Refaktoryzacja z `any` jest ryzykowna: kompilator nie wskaże miejsc, które przestały pasować.

## Jak sprawdzić

typescript-eslint (`no-explicit-any`, a z regułami z typami także `no-unsafe-assignment`, `no-unsafe-member-access`).

## Kod

```ts title="Źle"
function getTotal(data: any) {
  return data.items.reduce((sum: any, i: any) => sum + i.price, 0);
}
```

```ts title="Dobrze"
function getTotal(items: readonly { price: number }[]): number {
  return items.reduce((sum, i) => sum + i.price, 0);
}
function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
function first<T>(list: readonly T[]): T | undefined {
  return list[0];
}
```

## Częste błędy

- Zastępowanie `any` przez `as unknown as Foo`, co jest tym samym obejściem w innym przebraniu.
