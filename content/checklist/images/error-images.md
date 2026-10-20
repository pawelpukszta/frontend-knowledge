---
title: Obsługa błędów ładowania obrazów
priority: low
---

Przy błędzie pokaż placeholder lub obraz zastępczy (`onerror` z `this.onerror = null`, żeby uniknąć pętli) zamiast ikony zepsutego obrazka.

## Dlaczego to ważne

- Ikona zepsutego obrazka i rozjechany układ karty wyglądają na błąd całego serwisu; neutralny placeholder w kolorach marki utrzymuje spójny wygląd.
- Obrazy z zewnętrznych źródeł (systemy touroperatorów, CDN partnerów) bywają niedostępne niezależnie od Ciebie.
- Bez wyzerowania handlera brak pliku zastępczego wywołuje nieskończoną pętlę zapytań.

## Jak sprawdzić

Zablokuj adres obrazu w DevTools (Network request blocking) i sprawdź, czy karta pokazuje placeholder i zachowuje wymiary.

## Kod

```html title="Czysty HTML"
<img
  src="https://cdn.partner.example/hotels/48213/main.jpg"
  alt="Hotel Aegean Blue, widok z plaży"
  width="400" height="300"
  onerror="this.onerror = null; this.src = '/img/placeholder-hotel.svg';" />
```

```tsx title="React"
import { useState } from 'react';

const FALLBACK = '/img/placeholder-hotel.svg';

export function HotelImage({ src, alt }: { src: string; alt: string }) {
  const [current, setCurrent] = useState(src);
  return (
    <img
      src={current}
      alt={alt}
      width={400}
      height={300}
      // Switch only once, so a missing fallback cannot cause a loop
      onError={() => setCurrent((prev) => (prev === FALLBACK ? prev : FALLBACK))}
    />
  );
}
```

## Częste błędy

- Zastępowanie obrazu pustym `alt=""` po błędzie; informacja o treści znika także dla czytników.
