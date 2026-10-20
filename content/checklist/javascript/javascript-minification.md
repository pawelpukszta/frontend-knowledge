---
title: Zminifikowany JavaScript
priority: high
---

Minifikacja (Terser, esbuild, SWC) zmniejsza rozmiar plików; w połączeniu z kompresją Brotli daje największy efekt.

## Dlaczego to ważne

- JavaScript jest najdroższym zasobem: poza pobraniem trzeba go sparsować i skompilować, co na słabszych telefonach trwa wielokrotnie dłużej niż na laptopie.
- Minifikator skraca nazwy zmiennych, usuwa martwy kod (`if (process.env.NODE_ENV !== "production")`) i komentarze, czego sama kompresja nie zrobi.
- Brotli kompresuje tekst zwykle lepiej niż gzip; minifikacja i kompresja razem potrafią zmniejszyć transfer kilkukrotnie.

## Jak sprawdzić

Podgląd plików JS na produkcji (jedna linia, krótkie nazwy), nagłówek `content-encoding: br` w Network, kolumny Size/Transferred.

## Kod

```bash
# Check compression and transferred size of a production bundle
curl -sI -H "Accept-Encoding: br, gzip" https://example.pl/assets/app.3f9c2a.js | grep -i -E "content-encoding|content-length"

# Production builds minify by default
npx vite build      # minifies JS and CSS by default
npx next build      # SWC minification
```

## Częste błędy

- Wysyłanie source map publicznie bez decyzji; lepiej wgrać je do narzędzia monitoringu i nie serwować użytkownikom.
