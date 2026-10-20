---
title: Podział dużych bundli
priority: high
---

Dynamic import, `React.lazy`, podział na trasy. Użytkownik pobiera tylko kod potrzebny na danej stronie.

## Dlaczego to ważne

- Strona główna nie potrzebuje kodu kalendarza cen, mapy hoteli i płatności; jeden duży bundle opóźnia interaktywność wszystkiego.
- Mniejsze bundle krócej się parsują i wykonują, co poprawia LCP i INP na urządzeniach mobilnych.
- Przy podziale zmiana w jednym module unieważnia w cache tylko jego chunk, a nie całą aplikację.

## Jak sprawdzić

Bundle analyzer (np. `@next/bundle-analyzer`, `rollup-plugin-visualizer`), zakładka Coverage w DevTools i rozmiar JS w Network na kluczowych stronach.

## Kod

```tsx
"use client";
import { lazy, Suspense } from "react";
import dynamic from "next/dynamic";

const HotelMap = lazy(() => import("./HotelMap")); // heavy map library
// Next.js: client-only widget, no SSR
const PriceCalendar = dynamic(() => import("./PriceCalendar"), { ssr: false });

export function HotelPage() {
  return (
    <>
      <Suspense fallback={<div className="map-skeleton" aria-busy="true" />}>
        <HotelMap />
      </Suspense>
      <PriceCalendar />
      {/* Load sharing code only on interaction */}
      <button onClick={async () => (await import("./share")).openShareDialog()}>Udostępnij</button>
    </>
  );
}
```

## Częste błędy

- Leniwe ładowanie komponentu widocznego od razu (np. bohatera strony), co opóźnia LCP.
