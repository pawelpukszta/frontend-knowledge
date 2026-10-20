---
title: Zminifikowany CSS
priority: high
---

Usunięcie białych znaków i komentarzy oraz skrócenie wartości zmniejsza transfer. Robią to bundlery (Lightning CSS, cssnano).

## Dlaczego to ważne

- CSS blokuje renderowanie, więc każdy zaoszczędzony kilobajt bezpośrednio skraca czas do pierwszego malowania, szczególnie na słabych łączach mobilnych.
- Minifikatory łączą też zduplikowane reguły i skracają wartości (`#ffffff` na `#fff`, `0px` na `0`), czego kompresja Brotli sama nie zrobi.
- Minifikacja i kompresja się uzupełniają: najpierw minifikacja w buildzie, potem Brotli lub gzip na serwerze lub CDN.

## Jak sprawdzić

Podgląd pliku CSS na produkcji (jedna linia, bez komentarzy) i nagłówek `content-encoding` w Network.

## Kod

```ts title="vite.config.ts"
import { defineConfig } from "vite";

export default defineConfig({
  css: { transformer: "lightningcss" },
  build: {
    cssMinify: "lightningcss",
    // Keep source maps for debugging without shipping comments
    sourcemap: true,
  },
});
```

## Częste błędy

- Wyłączenie minifikacji "na chwilę" do debugowania i zapomnienie o niej; do debugowania służą source mapy.
