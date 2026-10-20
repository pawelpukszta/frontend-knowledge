---
title: TypeScript w trybie strict
priority: high
sources:
  - title: "TSConfig: strict"
    url: https://www.typescriptlang.org/tsconfig/#strict
---

`"strict": true` włącza m.in. `strictNullChecks` i `noImplicitAny`, które wyłapują całe klasy błędów runtime w czasie kompilacji.

## Dlaczego to ważne

- Bez `strictNullChecks` typ `User` może być w rzeczywistości `null`, a "Cannot read properties of undefined" to jeden z najczęstszych błędów JS w produkcji.
- Od TypeScript 6.0 `strict` jest domyślnie włączony, ale starsze projekty i skopiowane konfiguracje często mają `false`; zapisz go jawnie.
- Włączenie strict w dojrzałym projekcie jest kosztowne, więc warto to zrobić od początku albo migrować katalog po katalogu.

## Jak sprawdzić

Sprawdź `tsconfig.json` i krok `tsc --noEmit` w CI; build nie może przechodzić z błędami typów.

## Kod

```json title="tsconfig.json"
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "verbatimModuleSyntax": true,
    "target": "es2023",
    "module": "esnext",
    "moduleResolution": "bundler",
    "skipLibCheck": true
  }
}
```

## Częste błędy

- `// @ts-ignore` zamiast naprawy typu; jeśli musisz, użyj `// @ts-expect-error` z komentarzem.
