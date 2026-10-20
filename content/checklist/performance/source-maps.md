---
title: Source mapy do debugowania produkcji
priority: medium
---

Mapy źródeł pozwalają czytać stack trace z produkcji w odniesieniu do oryginalnego kodu. Najlepiej generować je jako "hidden" i wgrywać do narzędzia monitoringu (np. Sentry) zamiast publikować, jeśli kod ma pozostać mniej czytelny.

## Dlaczego to ważne

- Bez map błąd z produkcji wskazuje na `app.3f2a9c.js:1:48213`, co przy zminifikowanym kodzie praktycznie uniemożliwia szybką diagnozę.
- Mapy nie spowalniają użytkowników: przeglądarka pobiera je tylko przy otwartych DevTools, a w trybie "hidden" plik JS w ogóle nie zawiera odnośnika do mapy.
- Publiczne mapy ujawniają pełny kod źródłowy z komentarzami, a czasem ścieżki i nazwy wewnętrznych usług; to decyzja, którą warto podjąć świadomie.

## Jak sprawdzić

Stack trace błędu w narzędziu monitoringu wskazuje oryginalny plik i linię; sprawdź, czy na produkcji pliki `.map` nie są publicznie dostępne (o ile tak ustalono).

## Kod

```ts title="vite.config.ts"
import { defineConfig } from 'vite';
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig({
  build: {
    sourcemap: 'hidden', // generate maps without the sourceMappingURL comment
  },
  plugins: [
    sentryVitePlugin({
      org: 'example-travel',
      project: 'web',
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: { filesToDeleteAfterUpload: ['./dist/**/*.map'] }, // do not deploy maps
    }),
  ],
});
```

## Częste błędy

- Wgrywanie map bez powiązania z wersją wydania (release), przez co stack trace wskazuje niewłaściwe linie po kolejnym deployu.
