---
title: Named exports vs default export
level: mid
added: 2026-10-20
tags:
  - import
  - export
  - named
  - default
summary: Moduł może mieć wiele eksportów nazwanych i najwyżej jeden domyślny. Named exports wymuszają spójne nazwy i lepiej współpracują z narzędziami.
sources:
  - title: "MDN: JavaScript modules"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
  - title: "MDN: export"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
  - title: "javascript.info: Export and Import"
    url: https://javascript.info/import-export
---

## Wyjaśnienie

- **Named export**: `export const formatPrice = ...`. Import w klamrach, z dokładną nazwą: `import { formatPrice } from './price'`. Można zmienić nazwę: `import { formatPrice as fp }`.
- **Default export**: `export default function Button() {}`. Import bez klamer i z **dowolną** nazwą: `import Btn from './Button'`.
- **Namespace import**: `import * as price from './price'` daje obiekt ze wszystkimi eksportami nazwanymi.
- **Import tylko dla efektów ubocznych**: `import './polyfills'`.

Wiele zespołów preferuje **named exports**, bo: nazwa jest taka sama w całym projekcie (łatwiejszy refactor i wyszukiwanie), IDE lepiej podpowiada auto-import, literówka daje błąd zamiast cichego `undefined`. Default export bywa wymagany przez frameworki, np. `page.tsx` w Next.js App Router czy `React.lazy`.

## Kod

```js
// price.js
export const VAT = 0.23;
export function formatPrice(value) { return `${value.toFixed(2)} zł`; }
export default function calculateGross(net) { return net * (1 + VAT); }

// usage
import calculateGross, { formatPrice, VAT as TAX } from './price.js';
import * as price from './price.js';
price.formatPrice(10);
```

## Pytania

### Named vs default export: co wybierasz i dlaczego? {#mod-named-default-q1}

Domyślnie named: spójne nazwy w projekcie, lepszy auto-import i refactor, błędy przy literówkach, łatwe eksportowanie wielu rzeczy. Default tylko tam, gdzie wymaga go framework (np. strony w Next.js, `React.lazy`). Konsekwencja długofalowa: mniej chaosu w nazewnictwie i łatwiejsze automatyczne refaktoryzacje.

### Czy można mieć default i named export w jednym pliku? {#mod-named-default-q2}

Tak. `import Default, { named } from './mod'`. Default to po prostu eksport o nazwie `default`.

## Quiz

### Jak zaimportować default export z pliku `Button.js`? {#mod-named-default-z1}

- [x] import Button from './Button'
- [ ] import { Button } from './Button'
- [ ] import { default } from './Button'
- [ ] import * from './Button'

Default importujesz bez klamer i pod dowolną nazwą.
