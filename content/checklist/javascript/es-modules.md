---
title: Moduły ES (import/export)
priority: high
---

Statyczne importy umożliwiają tree shaking, analizę zależności i lepsze narzędzia. CommonJS tylko tam, gdzie wymaga go środowisko.

## Dlaczego to ważne

- Bundler zna strukturę `import`/`export` przed uruchomieniem kodu, więc może usunąć nieużywane eksporty; z `require()` musi dołączyć cały moduł.
- ESM jest standardem przeglądarek i Node.js (22/24 LTS), a Node od wersji 22.12 pozwala nawet na `require()` modułów ESM, co ułatwia migrację.
- Statyczne importy pozwalają edytorom i TypeScriptowi bezpiecznie zmieniać nazwy i znajdować nieużywany kod.

## Jak sprawdzić

Przegląd `package.json` (`"type": "module"`, pole `exports`) i importów; wyszukaj `require(` i `module.exports` w kodzie aplikacji.

## Kod

```js title="Źle"
const _ = require("lodash"); // pulls the whole library
module.exports = { formatPrice };
```

```js title="Dobrze"
import { debounce } from "lodash-es"; // tree-shakeable named import
export function formatPrice(amount) {
  return new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(amount);
}
```

```json title="package.json"
{
  "type": "module",
  "exports": { ".": "./dist/index.js" },
  "sideEffects": false
}
```

## Częste błędy

- Barrel files (`index.ts` reeksportujące wszystko), które utrudniają tree shaking i spowalniają build.
