---
title: Kod ładowany przy zbliżaniu się do viewportu
priority: high
sources:
  - title: "patterns.dev: Import On Visibility"
    url: https://www.patterns.dev/vanilla/import-on-visibility
---

Komponenty poniżej zgięcia (mapa, opinie, sekcja podobnych ofert) są pobierane, gdy zbliżają się do ekranu (IntersectionObserver z `rootMargin`, `React.lazy`, `next/dynamic`), zamiast przy starcie.

## Dlaczego to ważne

- Kod komponentu, którego użytkownik może nigdy nie zobaczyć, nie konkuruje z krytycznymi zasobami i nie wydłuża hydracji.
- Zapas `rootMargin` (np. 300 px) sprawia, że przy normalnym przewijaniu komponent jest gotowy, zanim pojawi się na ekranie.
- Placeholder o docelowej wysokości chroni przed CLS, gdy komponent się doładuje.

## Jak sprawdzić

Network przy przewijaniu: chunk komponentu pojawia się dopiero, gdy sekcja jest blisko viewportu.

## Kod

```tsx
import { lazy, Suspense, useEffect, useRef, useState } from 'react';

const HotelMap = lazy(() => import('./HotelMap'));

export function LazyHotelMap({ lat, lng }: { lat: number; lng: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); io.disconnect(); }
    }, { rootMargin: '300px' });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: 400 }}>
      {visible && <Suspense fallback={<MapSkeleton />}><HotelMap lat={lat} lng={lng} /></Suspense>}
    </div>
  );
}
```

## Częste błędy

- Leniwe ładowanie treści ważnej dla SEO tylko po stronie klienta: roboty mogą jej nie zobaczyć.
