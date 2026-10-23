---
title: React Compiler
level: senior
added: 2026-10-20
tags:
  - React Compiler
  - memoization
  - build
  - Rules of React
summary: Narzędzie działające w czasie buildu, które automatycznie memoizuje komponenty i hooki. Zastępuje większość ręcznego useMemo, useCallback i memo.
sources:
  - title: "React: React Compiler"
    url: https://react.dev/learn/react-compiler
  - title: "React: Rules of React"
    url: https://react.dev/reference/rules
  - title: "Next.js: reactCompiler"
    url: https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler
---

## Wyjaśnienie

- Działa jako plugin Babel (także w Vite, Next.js, Expo). W Next.js włączasz opcją `reactCompiler: true`.
- Analizuje kod i wstawia memoizację na poziomie pojedynczych wartości i fragmentów JSX, dokładniej niż zrobiłby to człowiek.
- Wymaga przestrzegania **Rules of React**: komponenty i hooki muszą być czyste, bez mutowania props, stanu i wartości zwracanych przez hooki. Komponenty łamiące zasady są pomijane.
- Plugin ESLint `eslint-plugin-react-hooks` zawiera reguły wykrywające problemy, które uniemożliwiają kompilację.

Decyzja dla zespołu: włączenie kompilatora w istniejącym projekcie. Za: mniej ręcznej optymalizacji, mniej błędów z zależnościami, lepsza domyślna wydajność. Przeciw: zależność od kroku buildu, potrzeba naprawy kodu łamiącego zasady, trudniejsze debugowanie nietypowych przypadków. Długofalowo: kod prostszy, a wiedza o memoizacji nadal potrzebna przy analizie problemów.

## Pytania

### Czym jest React Compiler? {#react-compiler-q1}

Kompilatorem działającym w czasie buildu, który automatycznie dodaje memoizację komponentów, wartości i funkcji. Dzięki temu ręczne `memo`, `useMemo` i `useCallback` są potrzebne rzadko.

### Jakie warunki musi spełniać kod, żeby kompilator go zoptymalizował? {#react-compiler-q2}

Przestrzegać Rules of React: czyste komponenty (ten sam input daje ten sam output), brak mutacji props, stanu i wartości z hooków w trakcie renderu, hooki wywoływane na najwyższym poziomie.
