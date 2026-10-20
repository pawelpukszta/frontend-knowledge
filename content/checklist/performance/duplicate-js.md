---
title: Bez zduplikowanych bibliotek JS
priority: medium
---

Dwie wersje tej samej biblioteki (np. lodash 4.17 i lodash-es, dwie wersje React Query lub date-fns) w bundlu to marnowane kilobajty. Deduplikuj zależności i ujednolicaj wersje.

## Dlaczego to ważne

- Duplikaty powstają po cichu przez zależności przechodnie; jeden pakiet może dorzucić kilkadziesiąt KB, których nikt świadomie nie dodał.
- Dwie kopie bibliotek ze stanem (React, React Query, biblioteki kontekstu) to nie tylko waga, ale też subtelne błędy: dwa konteksty, dwa cache.
- Każda zduplikowana kopia jest osobno parsowana i wykonywana, więc koszt pojawia się także w TBT i INP.

## Jak sprawdzić

Bundle analyzer (te same nazwy pakietów w kilku miejscach), insight o zduplikowanym JavaScript w Lighthouse, `npm ls <pakiet>` lub `pnpm why <pakiet>`.

## Kod

```bash title="Wykrycie i usunięcie duplikatów"
npm ls date-fns          # shows every version in the dependency tree
npm dedupe               # hoists compatible versions into one copy
pnpm why @tanstack/react-query
```

```json title="package.json: wymuszenie jednej wersji"
{
  "overrides": {
    "date-fns": "^4.1.0"
  },
  "pnpm": {
    "overrides": { "date-fns": "^4.1.0" }
  }
}
```

## Częste błędy

- Używanie jednocześnie `moment`, `dayjs` i `date-fns` w różnych częściach aplikacji.
