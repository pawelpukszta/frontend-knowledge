---
title: "DevTools: zakładka Performance"
level: mid
added: 2026-10-20
tags:
  - DevTools
  - Performance panel
  - profiling
  - flame chart
  - long tasks
summary: "Nagrywa, co przeglądarka robi w czasie: wykonanie JS, style, layout, paint. Pokazuje live Core Web Vitals, long tasks i przyczyny wolnych interakcji."
sources:
  - title: "Chrome DevTools: Analyze runtime performance"
    url: https://developer.chrome.com/docs/devtools/performance
  - title: "Chrome DevTools: Performance panel overview"
    url: https://developer.chrome.com/docs/devtools/performance/overview
  - title: "Chrome DevTools: Performance features reference"
    url: https://developer.chrome.com/docs/devtools/performance/reference
---

## Wyjaśnienie

Codzienny workflow:

1. Otwórz DevTools → **Performance**. Widok startowy pokazuje **live metrics**: LCP, CLS i INP mierzone lokalnie w trakcie korzystania ze strony (z elementem LCP i listą interakcji).
2. Włącz **CPU throttling** (np. 4x lub 6x) i throttling sieci, żeby symulować przeciętny telefon.
3. Nagraj: **Record and reload** (ładowanie strony) lub **Record** + wykonaj interakcję (INP).
4. Analizuj:
   - **Main track (flame chart)**: szare bloki z czerwonym trójkątem to **long tasks** (> 50 ms). Szerokość = czas; niżej są wywołane funkcje.
   - Kolory: **żółty** = scripting, **fioletowy** = rendering (style, layout), **zielony** = painting, **niebieski** = loading.
   - Ścieżki **Interactions** (fazy INP), **Timings** (LCP, FCP), **Layout shifts** (CLS), **Network**.
   - Panel **Insights**: gotowe podpowiedzi (np. rozbicie LCP, render-blocking requests, forced reflow).
   - Zakładki dolne: **Summary**, **Bottom-up** (co zajęło najwięcej czasu łącznie), **Call tree**.
5. Popraw i nagraj ponownie, porównując wyniki.

Uzupełnienie dla React: **React DevTools Profiler** (które komponenty i dlaczego się renderowały, opcja "Highlight updates").

## Pytania

### Jak zdiagnozujesz wolne kliknięcie na stronie? {#perf-devtools-performance-q1}

DevTools Performance z throttlingiem CPU, nagranie interakcji, znalezienie jej na ścieżce Interactions i podział na input delay, processing i presentation delay. W flame chart szukam long tasks i funkcji, które je tworzą (Bottom-up). W React dodatkowo Profiler, żeby sprawdzić zbędne re-rendery.

### Co oznaczają kolory w panelu Performance? {#perf-devtools-performance-q2}

Żółty to wykonanie JavaScriptu, fioletowy to rendering (przeliczanie stylów i layout), zielony to painting i compositing, niebieski to ładowanie i parsowanie HTML.

## Quiz

### Żółte bloki w zakładce Performance oznaczają: {#perf-devtools-performance-z1}

- [x] Wykonywanie JavaScriptu (scripting)
- [ ] Painting
- [ ] Ładowanie sieci
- [ ] Layout

Żółty = scripting, fioletowy = rendering, zielony = painting.
