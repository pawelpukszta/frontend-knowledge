---
title: Bez starego JS dla nowych przeglądarek
priority: medium
---

Transpilacja do ES5 i polyfille dla funkcji wspieranych od lat zwiększają bundle i spowalniają wykonanie. Ustaw nowoczesny target (Browserslist, Baseline) i ewentualnie osobny bundle dla starych przeglądarek.

## Dlaczego to ważne

- Polyfille i transpilowane klasy, `async`/`await` czy spread potrafią dodać kilkadziesiąt KB, które nowoczesne przeglądarki pobierają, ale nigdy nie używają.
- Natywna składnia jest zwykle szybsza w wykonaniu niż jej transpilowany odpowiednik.
- Baseline "widely available" to wspólny, rozumiany przez narzędzia cel; Vite 7 używa go domyślnie jako `build.target`.

## Jak sprawdzić

Insight o starszym JavaScript w Lighthouse, wyszukanie w bundlu typowych polyfilli (np. `regeneratorRuntime`, `core-js`), `npx browserslist` do podglądu docelowych przeglądarek.

## Kod

```json title="package.json"
{
  "browserslist": [
    "baseline widely available"
  ]
}
```

```ts title="vite.config.ts"
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'baseline-widely-available', // default since Vite 7; avoid 'es2015'
  },
});
```

## Częste błędy

- Pozostawiony z dawnych lat `@babel/preset-env` z `useBuiltIns: 'entry'` i całym `core-js` dołączanym do każdego bundla.
