---
title: Re-eksporty i barrel files
level: mid
tags:
  - re-export
  - barrel
  - index.ts
  - architektura
summary: "Re-eksport przekazuje eksport dalej z innego modułu. Barrel file (index.ts) zbiera eksporty folderu w jednym miejscu: wygodne, ale potrafi spowolnić build i testy."
sources:
  - title: "MDN: export (re-exporting)"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
  - title: "Marvin Hagemeister: The barrel file debacle"
    url: https://marvinh.dev/blog/speeding-up-javascript-ecosystem-part-7/
  - title: "Next.js: optimizePackageImports"
    url: https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports
---

## Wyjaśnienie

**Składnia re-eksportów:**

- `export { Button } from './Button';`
- `export { default as Button } from './Button';` (default jako named)
- `export * from './utils';` (wszystkie named, bez default)
- `export * as utils from './utils';` (jako namespace)

**Barrel file** to plik (zwykle `index.ts`), który tylko re-eksportuje zawartość folderu, żeby importować z jednego miejsca: `import { Button, Modal } from '@/components'`.

Plusy:

- Krótkie, czyste importy i jedno "publiczne API" modułu (reszta plików jest szczegółem implementacji).

Minusy:

- Import jednej rzeczy może zmusić bundler, Jest/Vitest lub serwer dev do **przetworzenia całego drzewa** re-eksportowanych plików. Wolniejszy dev server, testy i HMR.
- Łatwo o **cykliczne zależności**.
- Tree shaking może zawieść, jeśli któryś moduł ma efekty uboczne.

Rozsądny kompromis: barrel jako publiczne API **granicy modułu/pakietu** (np. `features/booking/index.ts`), ale bez barrelów w każdym folderze i bez `export *` z dużych drzew. Next.js ma opcję `optimizePackageImports` dla bibliotek z barrelami.

## Kod

```ts
// features/booking/index.ts - public API of the feature
export { BookingForm } from './components/BookingForm';
export { useBooking } from './hooks/useBooking';
export type { Booking } from './types';
// internal helpers are NOT exported, so other features cannot depend on them
```

## Częste błędy

- `export *` w barrelu importowanym w wielu miejscach dużej aplikacji: wolne testy i HMR.
- Importowanie z barrelu wewnątrz tego samego modułu (plik w `booking/` importuje z `booking/index`): prosta droga do cyklu.

## Pytania

### Czym jest barrel file i jakie ma wady? {#mod-reexports-barrels-q1}

Plik `index` re-eksportujący zawartość folderu. Upraszcza importy i definiuje publiczne API, ale może spowolnić build, testy i HMR (narzędzia ładują cały graf), sprzyja cyklom i utrudnia tree shaking. Stosuj go na granicach modułów, nie wszędzie.

### Czy export * re-eksportuje default? {#mod-reexports-barrels-q2}

Nie. `export * from` przenosi tylko eksporty nazwane. Default trzeba re-eksportować jawnie: `export { default } from './x'` lub `export { default as X } from './x'`.

## Quiz

### Czy `export * from './mod'` re-eksportuje default export? {#mod-reexports-barrels-z1}

- [ ] Tak
- [x] Nie, tylko eksporty nazwane
- [ ] Tylko w TypeScript
- [ ] Tylko w Node.js

Default trzeba re-eksportować jawnie, np. `export { default as X } from './mod'`.
