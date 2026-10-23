---
title: "tsconfig: strict, dodatkowe flagi i migracja dużego projektu"
level: senior
tags:
  - tsconfig
  - strict
  - strictNullChecks
  - migracja
  - wydajność kompilacji
  - TypeScript 7
summary: "`strict: true` włącza rodzinę dziewięciu flag, a kilka wartościowych flag (np. `noUncheckedIndexedAccess`) trzeba dodać ręcznie. Duży projekt migruje się flaga po fladze, a koszt typów mierzy przez `--extendedDiagnostics` i `--generateTrace`."
sources:
  - title: "TSConfig Reference: strict"
    url: https://www.typescriptlang.org/tsconfig/#strict
  - title: "TypeScript Wiki: Performance"
    url: https://github.com/microsoft/TypeScript/wiki/Performance
  - title: "TypeScript blog: Announcing TypeScript 6.0"
    url: https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/
  - title: "TypeScript blog: Announcing TypeScript 7.0"
    url: https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/
  - title: "TypeScript 5.8 release notes: --erasableSyntaxOnly"
    url: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-8.html
  - title: "TypeScript 3.9 release notes: @ts-expect-error"
    url: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html
---

## Wyjaśnienie

**Co włącza `strict`.** Według TSConfig Reference to skrót dla całej rodziny flag:

| Flaga | Co sprawdza |
|---|---|
| `strictNullChecks` | `null` i `undefined` nie pasują do każdego typu; trzeba je obsłużyć |
| `noImplicitAny` | błąd, gdy TS nie zna typu i po cichu przyjąłby `any` |
| `strictFunctionTypes` | kontrawariantne sprawdzanie parametrów funkcji |
| `strictBindCallApply` | typowane `call`, `apply`, `bind` |
| `strictPropertyInitialization` | pola klasy muszą być zainicjalizowane w konstruktorze |
| `strictBuiltinIteratorReturn` | wbudowane iteratory mają typ wyniku końcowego (`TReturn`) `undefined` zamiast `any` |
| `noImplicitThis` | błąd przy `this` o typie `any` |
| `useUnknownInCatchVariables` | zmienna w `catch` ma typ `unknown` |
| `alwaysStrict` | emituje `"use strict"` i parsuje pliki w trybie strict |

Pojedyncze flagi możesz potem wyłączyć. Nowe wersje TS mogą dopisywać do `strict` kolejne sprawdzenia, więc aktualizacja kompilatora czasem przynosi nowe błędy. Od TypeScript 6.0 `strict` jest domyślnie `true`; projekt, który polegał na starym domyślnym `false`, musi to ustawić jawnie.

**Przydatne flagi spoza `strict`:**

- `noUncheckedIndexedAccess`: odczyt przez index signature i `arr[i]` ma typ `T | undefined`. Łapie realne błędy, ale daje dużo nowych komunikatów w istniejącym kodzie.
- `exactOptionalPropertyTypes`: `theme?: 'dark'` nie przyjmuje jawnego `undefined`. Rozróżnia "pola nie ma" od "pole jest `undefined`", co ma znaczenie przy `PATCH` i `Object.keys`.
- `noImplicitOverride`: metoda nadpisująca metodę klasy bazowej musi mieć `override`. Gdy ktoś zmieni nazwę w klasie bazowej, dostajesz błąd zamiast martwego kodu.
- `verbatimModuleSyntax`: importy bez `type` zostają w wyniku, importy z `type` znikają w całości. Zachowanie jest przewidywalne dla esbuild, SWC i Node.
- `erasableSyntaxOnly` (TS 5.8): błąd przy konstrukcjach TS z efektem w runtime, m.in. `enum`, `namespace` z kodem, parameter properties, `import =`. Przydaje się, gdy kod uruchamia Node przez type stripping.

**Migracja z `strict: false`.** Nie włączaj wszystkiego naraz, bo dostaniesz tysiące błędów i nikt nie zrobi review takiego PR-a. Działa podejście flaga po fladze, każda w osobnej serii PR-ów:

1. `noImplicitAny`: wychodzą miejsca bez typów. Dopisanie ich sprawia, że kolejne flagi mają na czym pracować; z ukrytymi `any` `strictNullChecks` niewiele znajdzie.
2. `strictNullChecks`: najwięcej błędów i najwięcej realnych bugów (`Cannot read properties of undefined`). Zwykle największy etap.
3. Pozostałe flagi z rodziny `strict`, zwykle tanie.
4. Na końcu flagi spoza `strict`, np. `noUncheckedIndexedAccess`.

Przy dużym kodzie pomagają: włączanie flagi per pakiet w monorepo (osobne `tsconfig.json` z `extends`), zasada "nowe pliki muszą przechodzić strict", `// @ts-expect-error` z komentarzem jako tymczasowa łata (w odróżnieniu od `@ts-ignore` zgłosi błąd, gdy problem zniknie) i licznik błędów w CI, który może tylko maleć.

**Koszt typów w czasie budowania.** Złożone typy warunkowe, rekurencyjne i duże unie spowalniają `tsc` i edytor. Mierzysz to tak:

- `tsc --extendedDiagnostics`: czas parsowania, bindowania i sprawdzania typów, liczba plików, pamięć.
- `tsc --generateTrace <dir>`: ślad zdarzeń i lista typów. Analizujesz go pakietem `@typescript/analyze-trace` albo w `about://tracing` w Chrome.
- `tsc --explainFiles`: dlaczego dany plik trafił do kompilacji (np. przypadkowo cały `node_modules` przez zły `include`).

Wiki TS zaleca m.in. `interface extends` zamiast przecięć `&`, jawne typy zwracane przy eksportowanych funkcjach i wydzielanie złożonych typów warunkowych do nazwanych aliasów, które kompilator może cache'ować. `skipLibCheck: true` pomija sprawdzanie plików `.d.ts`.

**TypeScript 7.** Kompilator przepisany na Go, zwykle 8-12 razy szybszy przy pełnym buildzie. Dla tsconfig oznacza to, że opcje oznaczone jako przestarzałe w 6.0 dają twardy błąd. Nie działają już m.in. `target: es5`, `downlevelIteration`, `moduleResolution: node`/`node10`/`classic`, `baseUrl` (ścieżki w `paths` podajesz względem katalogu projektu), `module: amd`/`umd`/`systemjs`/`none`. Nie da się też ustawić `alwaysStrict`, `esModuleInterop` ani `allowSyntheticDefaultImports` na `false`. Domyślne wartości przejęte z 6.0: `strict: true`, `module: esnext`, `types: []` (globalne typy, np. `node`, dopisujesz jawnie), `noUncheckedSideEffectImports: true`. Sensowna kolejność to najpierw usunąć ostrzeżenia o przestarzałych opcjach na 6.0, potem przejść na 7.

## Kod

```json title="tsconfig.json dla aplikacji z bundlerem"
{
  "compilerOptions": {
    "target": "es2022",
    "module": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "verbatimModuleSyntax": true,
    "erasableSyntaxOnly": true,
    "skipLibCheck": true,
    "types": ["vite/client"],
    "noEmit": true
  },
  "include": ["src"]
}
```

```bash title="Gdzie kompilator traci czas"
npx tsc --noEmit --extendedDiagnostics
npx tsc --noEmit --generateTrace ./trace
npx @typescript/analyze-trace ./trace
npx tsc --noEmit --explainFiles > files.txt
```

## Częste błędy

- Włączenie `strict` jednym PR-em i zasypanie błędów `as any` albo `!`. Typy wyglądają na ścisłe, a bugi zostają.
- `@ts-ignore` zamiast `@ts-expect-error` przy migracji. Po naprawie kodu nikt nie wie, że komentarz jest zbędny.
- Brak `tsc --noEmit` w CI, gdy build robi esbuild lub SWC. Te narzędzia nie sprawdzają typów, więc flagi z tsconfig nic nie dają.
- Szukanie przyczyny wolnego `tsc` na ślepo, bez `--extendedDiagnostics` i trace'a.

## Pytania

### Masz duży projekt ze strict: false. Co włączasz najpierw i dlaczego? {#ts-tsconfig-strict-q1}

Najpierw `noImplicitAny`, bo pokazuje miejsca, gdzie TS nie zna typu. Dopóki są tam ukryte `any`, kolejne flagi niewiele wykryją. Potem `strictNullChecks`: daje najwięcej błędów, ale też łapie najczęstszy bug produkcyjny, czyli odczyt z `undefined`. Każdą flagę włączam osobno i naprawiam w małych PR-ach, np. katalog po katalogu albo pakiet po pakiecie w monorepo. Tymczasowo używam `@ts-expect-error` z opisem i pilnuję w CI, żeby liczba błędów tylko malała. Nowy kod od razu musi przechodzić nowe flagi. Na końcu dokładam pozostałe flagi z `strict` i `noUncheckedIndexedAccess`.

### Co dokładnie włącza `strict: true`? {#ts-tsconfig-strict-q2}

Całą rodzinę flag strict: `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `strictBuiltinIteratorReturn`, `noImplicitThis`, `useUnknownInCatchVariables` i `alwaysStrict`. Każdą można potem osobno wyłączyć. Do rodziny mogą dochodzić nowe flagi w kolejnych wersjach. `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` i `noImplicitOverride` nie są częścią `strict`, więc trzeba je dodać ręcznie.

### Kompilacja TS trwa coraz dłużej. Jak znajdziesz przyczynę? {#ts-tsconfig-strict-q3}

Zaczynam od `tsc --extendedDiagnostics`, żeby zobaczyć, czy czas idzie na sprawdzanie typów, czy np. na zbyt dużą liczbę plików. Jeśli plików jest za dużo, `--explainFiles` pokaże, skąd się wzięły. Jeśli winne jest sprawdzanie typów, uruchamiam `--generateTrace` i analizuję wynik `@typescript/analyze-trace`, który wskazuje najdroższe pliki i typy. Typowe poprawki: jawne typy zwracane w eksportach, `interface extends` zamiast dużych przecięć, uproszczenie rekurencyjnych typów warunkowych, `skipLibCheck`. Przy bardzo dużym repo pomaga też podział na projekty z `references` i `incremental`.

### Co TypeScript 7 zmienia w konfiguracji projektu? {#ts-tsconfig-strict-q4}

TS 7 to kompilator napisany w Go, zwykle 8-12 razy szybszy przy pełnym buildzie; semantyka języka się nie zmienia. Opcje oznaczone jako przestarzałe w 6.0 dają w 7.0 twardy błąd: m.in. `target: es5`, `baseUrl`, `moduleResolution: node10` i `classic`, moduły `amd`/`umd`/`systemjs`. Domyślne wartości są takie jak w 6.0, np. `strict: true` i `types: []`, więc globalne typy jak `node` trzeba wpisać jawnie. Migrację robi się więc przez 6.0: najpierw usuwasz ostrzeżenia o przestarzałych opcjach, potem zmieniasz wersję.

## Quiz

### Która flaga NIE jest włączana przez `strict: true`? {#ts-tsconfig-strict-z1}

- [ ] `strictNullChecks`
- [ ] `useUnknownInCatchVariables`
- [x] `noUncheckedIndexedAccess`
- [ ] `strictPropertyInitialization`

`noUncheckedIndexedAccess` trzeba włączyć ręcznie; pozostałe należą do rodziny strict.

### Czym `@ts-expect-error` różni się od `@ts-ignore` podczas migracji? {#ts-tsconfig-strict-z2}

- [ ] `@ts-expect-error` działa tylko w plikach `.d.ts`
- [x] `@ts-expect-error` zgłasza błąd, gdy w następnej linii nie ma już błędu
- [ ] `@ts-ignore` wyłącza sprawdzanie całego pliku
- [ ] Nie ma różnicy, to aliasy

Dzięki temu nieaktualne komentarze same się zgłaszają po naprawie kodu.
