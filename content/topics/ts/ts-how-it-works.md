---
title: "Jak działa TypeScript: kompilacja i type erasure"
level: mid
added: 2026-10-20
tags:
  - kompilacja
  - tsc
  - type erasure
  - build
summary: TypeScript to JavaScript z typami sprawdzanymi w czasie developmentu. Po kompilacji typy znikają, a w przeglądarce lub na produkcji działa czysty JS.
flow:
  - Kod .ts
  - Type checking (tsc, IDE)
  - Usunięcie typów (esbuild / SWC / tsc)
  - Czysty .js
  - Przeglądarka / Node.js
sources:
  - title: "TypeScript Handbook: The Basics (erased types)"
    url: https://www.typescriptlang.org/docs/handbook/2/basic-types.html
  - title: TypeScript for JavaScript Programmers
    url: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
  - title: "Node.js: Running TypeScript natively"
    url: https://nodejs.org/api/typescript.html
  - title: "TypeScript blog: Announcing TypeScript 7.0"
    url: https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/
---

## Wyjaśnienie

1. Piszesz kod `.ts` / `.tsx`.
2. **Type checker** (`tsc`, także w IDE) analizuje typy i zgłasza błędy. Nic nie uruchamia.
3. **Transpilacja** usuwa adnotacje typów i ewentualnie obniża składnię (np. do ES2019). W nowoczesnych projektach robią to szybkie narzędzia: esbuild (Vite), SWC (Next.js), Babel. One **nie sprawdzają typów**, tylko je wycinają, dlatego w CI osobno uruchamia się `tsc --noEmit`.
4. Na produkcji działa **zwykły JavaScript**. Typy nie istnieją w runtime (**type erasure**).

Konsekwencje:

- TS nie waliduje danych z API w runtime. Jeśli backend zwróci co innego niż typ, TS tego nie zauważy. Do walidacji granic systemu służą biblioteki jak **Zod** czy **Valibot**.
- Nie da się zrobić `if (x instanceof MyInterface)`: interfejsy nie istnieją w JS.
- Konstrukcje z efektem w runtime (`enum`, `namespace`, parameter properties) generują kod. Dlatego nowoczesne zalecenia (i tryb `erasableSyntaxOnly`) preferują unie literałów zamiast `enum`.
- Node.js (od 22.18 / 23.6) uruchamia pliki `.ts` bezpośrednio, usuwając typy ("type stripping"), ale ich nie sprawdza.
- **TypeScript 7** (lipiec 2026) to kompilator przepisany na Go (projekt "Corsa"): pełne buildy i sprawdzanie typów są ok. 8-12 razy szybsze. Zasady języka się nie zmieniły.

## Kod

```ts
// Source (.ts)
interface Offer { id: number; price: number }
const format = (o: Offer): string => `${o.price} zł`;

// Output (.js) - types are gone
// const format = (o) => `${o.price} zł`;
```

## Częste błędy

- Traktowanie typów jako walidacji danych z zewnątrz (`as User` na odpowiedzi API).
- Brak `tsc --noEmit` w CI, gdy build używa esbuild/SWC: błędy typów przechodzą na produkcję.

## Pytania

### Czy TypeScript działa w przeglądarce? {#ts-how-it-works-q1}

Nie. Przeglądarka wykonuje JavaScript. TS jest kompilowany do JS, a typy są usuwane (type erasure). Służą tylko w czasie developmentu i budowania.

### Czy TypeScript chroni przed błędnymi danymi z API? {#ts-how-it-works-q2}

Nie w runtime. Typ to obietnica, której TS nie sprawdza po kompilacji. Na granicach systemu (API, formularze, localStorage) waliduje się dane biblioteką typu Zod, z której można też wyprowadzić typ (`z.infer`).

### Dlaczego Vite nie zgłasza błędów typów przy buildzie? {#ts-how-it-works-q3}

Vite używa esbuild do samego usuwania typów, bez type checkingu (dla szybkości). Sprawdzanie typów uruchamia się osobno: `tsc --noEmit`, w IDE, w CI lub pluginem.

## Quiz

### Co dzieje się z typami TypeScript po kompilacji? {#ts-how-it-works-z1}

- [ ] Są sprawdzane w runtime przez przeglądarkę
- [x] Są usuwane, zostaje czysty JavaScript
- [ ] Zamieniają się w komentarze JSDoc
- [ ] Trafiają do osobnego pliku, który ładuje przeglądarka

Type erasure: typy służą tylko w czasie developmentu i budowania.
