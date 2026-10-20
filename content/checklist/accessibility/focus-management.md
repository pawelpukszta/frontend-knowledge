---
title: Zarządzanie focusem przy dynamicznych zmianach
priority: high
---

Po otwarciu modala, zmianie trasy w SPA czy usunięciu elementu focus trafia w sensowne miejsce (np. na `h1` nowej strony), a nie "w próżnię" na `body`.

## Dlaczego to ważne

- Po nawigacji w SPA focus zostaje na klikniętym linku lub spada na `body`; użytkownik czytnika nie dostaje sygnału, że treść się zmieniła.
- Gdy usuwany element miał focus, następny Tab zaczyna od początku strony; użytkownik musi przejść całe menu jeszcze raz.
- Natywny `<dialog>` otwarty przez `showModal()` sam przenosi focus do środka, blokuje tło i obsługuje Escape; własne modale muszą to odtworzyć ręcznie.

## Jak sprawdzić

Wykonaj akcje klawiaturą i obserwuj `document.activeElement` (Live expression w DevTools).

## Kod

```tsx title="Next.js App Router: focus na h1 po zmianie trasy"
"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Render once in the root layout
export function RouteFocus() {
  const pathname = usePathname();
  const isFirstLoad = useRef(true);
  useEffect(() => {
    if (isFirstLoad.current) { isFirstLoad.current = false; return; } // do not move focus on initial load
    const heading = document.querySelector<HTMLElement>("main h1");
    if (!heading) return;
    heading.tabIndex = -1; // focusable by script, not in Tab order
    heading.focus();
  }, [pathname]);
  return null;
}
```

## Częste błędy

- Po usunięciu pozycji z koszyka nie przenosisz focusu na następną pozycję lub nagłówek koszyka.
- Po zamknięciu własnego modala focus nie wraca do przycisku, który go otworzył.
