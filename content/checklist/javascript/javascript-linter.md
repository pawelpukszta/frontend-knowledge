---
title: Linter dla JavaScript
priority: medium
---

ESLint (z typescript-eslint, regułami React Hooks, jsx-a11y) wykrywa błędy, zanim trafią do code review. Uruchamiany w edytorze, pre-commit i CI.

## Dlaczego to ważne

- Reguły React Hooks wyłapują brakujące zależności `useEffect` i warunkowe wywołania hooków, które dają trudne do odtworzenia błędy.
- Reguły z informacją o typach (np. `no-floating-promises`) znajdują nieobsłużone Promise, czyli ciche błędy w produkcji.
- Automatyczne reguły zwalniają code review z dyskusji o oczywistościach i pozwalają skupić się na logice i architekturze.

## Jak sprawdzić

Krok lint w pipeline CI (`eslint . --max-warnings 0`) i lint-staged w pre-commit; od ESLint 9 konfiguracja w formacie flat (`eslint.config.js`).

## Kod

```js title="eslint.config.js"
import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default defineConfig([
  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  jsxA11y.flatConfigs.recommended,
  {
    languageOptions: { parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname } },
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-floating-promises": "error",
    },
  },
]);
```

## Częste błędy

- Masowe `// eslint-disable-next-line` bez komentarza z uzasadnieniem.
