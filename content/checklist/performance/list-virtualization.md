---
title: Wirtualizacja długich list i tabel
priority: high
---

Przy setkach lub tysiącach wierszy renderuj tylko widoczne elementy plus mały zapas (TanStack Virtual, react-window). Tysiące elementów w DOM to wolne renderowanie, przewijanie i interakcje.

## Dlaczego to ważne

- Lista 2000 ofert po 30 węzłów każda to 60 000 elementów DOM; każde filtrowanie lub sortowanie przelicza style i layout dla całości, co zabija INP.
- Wirtualizacja utrzymuje w DOM kilkadziesiąt wierszy niezależnie od długości listy, więc pamięć i czas renderowania są stałe.
- Alternatywą bywa paginacja lub "pokaż więcej", często lepsza dla SEO i dostępności; wirtualizacja sprawdza się w tabelach i panelach.

## Jak sprawdzić

Liczba węzłów DOM na liście wyników (`document.querySelectorAll('*').length`), profil przewijania i filtrowania w Performance z throttlingiem CPU.

## Kod

```tsx title="TanStack Virtual"
import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export function BookingsTable({ rows }: { rows: Booking[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56, // row height in px
    overscan: 8,
  });

  return (
    <div ref={parentRef} style={{ height: 600, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((item) => (
          <div key={item.key} style={{ position: 'absolute', top: 0, width: '100%', height: item.size,
                                       transform: `translateY(${item.start}px)` }}>
            <BookingRow booking={rows[item.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Częste błędy

- Wirtualizacja bez zadbania o dostępność: brak `aria-rowcount`/`aria-rowindex` w tabelach i niedziałające wyszukiwanie Ctrl+F po treści.
