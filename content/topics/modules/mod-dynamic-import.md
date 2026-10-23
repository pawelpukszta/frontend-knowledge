---
title: Dynamic import() i code splitting
level: mid
added: 2026-10-20
tags:
  - dynamic import
  - lazy
  - code splitting
  - React.lazy
summary: import() ładuje moduł w runtime i zwraca Promise. Bundler tworzy z niego osobny chunk, który pobierany jest dopiero, gdy jest potrzebny.
sources:
  - title: "MDN: import()"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import
  - title: "React: lazy"
    url: https://react.dev/reference/react/lazy
  - title: "web.dev: Code splitting with dynamic imports"
    url: https://web.dev/articles/reduce-javascript-payloads-with-code-splitting
---

## Wyjaśnienie

- `import('./heavy.js')` zwraca Promise z obiektem modułu. Można go użyć w dowolnym miejscu, także warunkowo.
- Bundlery (Vite, webpack, Turbopack) traktują `import()` jako **punkt podziału** i tworzą osobny plik JS (chunk).
- **React**: `React.lazy(() => import('./Map'))` + `<Suspense fallback>`. **Next.js**: `next/dynamic`.
- Dobre kandydatury: ciężkie biblioteki (mapy, edytory, wykresy), modale, trasy/strony, funkcje dostępne po interakcji.

## Kod

```tsx
import { lazy, Suspense, useState } from 'react';

const OfferMap = lazy(() => import('./OfferMap')); // separate chunk

export function OfferDetails() {
  const [showMap, setShowMap] = useState(false);
  return (
    <>
      <button onClick={() => setShowMap(true)}>Pokaż mapę</button>
      {showMap && (
        <Suspense fallback={<p>Ładowanie mapy...</p>}>
          <OfferMap />
        </Suspense>
      )}
    </>
  );
}

// Load a heavy lib only on demand
async function exportPdf() {
  const { jsPDF } = await import('jspdf');
  new jsPDF().save('oferta.pdf');
}
```

## Częste błędy

- Dzielenie na zbyt małe chunki: wiele requestów i waterfall. Dziel przy granicach tras i dużych funkcji.
- Lazy loading komponentu widocznego od razu (above the fold): pogarsza LCP.

## Pytania

### Czym jest code splitting i jak go zrobić w React? {#mod-dynamic-import-q1}

Podział bundla na mniejsze pliki ładowane na żądanie, aby zmniejszyć ilość JS na starcie. W React: `React.lazy` + `Suspense` (lub `next/dynamic`), a na poziomie tras robią to frameworki automatycznie.

### Co zwraca import()? {#mod-dynamic-import-q2}

Promise, który spełnia się obiektem modułu (namespace), np. `{ default, namedExport }`.

## Quiz

### Co zwraca wyrażenie `import('./chart.js')`? {#mod-dynamic-import-z1}

- [ ] Moduł synchronicznie
- [x] Promise z obiektem modułu
- [ ] Funkcję ładującą
- [ ] Ścieżkę do chunka

Dynamic import jest asynchroniczny i zwraca Promise spełniony obiektem modułu.
