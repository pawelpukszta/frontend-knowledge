---
title: "LCP: Largest Contentful Paint"
level: mid
added: 2026-10-20
tags:
  - LCP
  - obrazy
  - TTFB
  - preload
  - fetchpriority
summary: Czas do wyrenderowania największego elementu treści w viewporcie (zwykle hero image lub nagłówek). Poprawiasz go szybszym serwerem, wcześniejszym wykryciem i szybszym pobraniem głównego zasobu.
sources:
  - title: "web.dev: Largest Contentful Paint (LCP)"
    url: https://web.dev/articles/lcp
  - title: "web.dev: Optimize LCP"
    url: https://web.dev/articles/optimize-lcp
  - title: "web.dev: Fetch Priority API"
    url: https://web.dev/articles/fetch-priority
---

## Wyjaśnienie

Kandydaci na element LCP: `<img>`, `<image>` w SVG, poster `<video>`, element z `background-image`, bloki tekstu.

**LCP dzieli się na 4 części** (to klucz do diagnozy):

1. **TTFB**: czas do pierwszego bajtu HTML.
2. **Resource load delay**: od TTFB do rozpoczęcia pobierania zasobu LCP (czy przeglądarka szybko go "zauważyła"?).
3. **Resource load duration**: czas pobierania zasobu.
4. **Element render delay**: od pobrania do wyrenderowania (blokujący CSS/JS, hydration).

Optymalizacje:

- Obraz LCP w HTML jako `<img>` (nie wstrzykiwany przez JS, nie jako `background-image` w CSS).
- `fetchpriority="high"` na obrazie LCP; `<link rel="preload">` gdy obraz jest wykrywany późno.
- **Nigdy `loading="lazy"` na obrazie LCP.**
- Nowoczesne formaty (AVIF, WebP), `srcset`/`sizes`, CDN z optymalizacją obrazów, `next/image` z `priority`/`preload`.
- Szybki TTFB: cache CDN, SSG/ISR, streaming.
- Mniej blokującego CSS i JS; SSR zamiast CSR dla treści above the fold.

## Kod

```html
<!-- Hero image: discoverable in HTML, high priority, responsive -->
<img
  src="/hero-1200.avif"
  srcset="/hero-800.avif 800w, /hero-1200.avif 1200w, /hero-2000.avif 2000w"
  sizes="100vw"
  width="1200" height="600"
  fetchpriority="high"
  alt="Plaża na Krecie o zachodzie słońca"
/>
```

## Częste błędy

- Lazy loading obrazu w hero.
- Slider/karuzela renderowana przez JS po hydration: obraz LCP pojawia się dopiero po wykonaniu bundla.
- Obraz z innego originu bez `preconnect`.

## Pytania

### Co to jest LCP i jak go poprawić? {#perf-lcp-q1}

Czas wyrenderowania największego elementu treści w viewporcie. Rozkładam go na TTFB, opóźnienie wykrycia zasobu, czas pobrania i opóźnienie renderu, i optymalizuję najdłuższą część: cache/CDN dla TTFB, obraz w HTML z `fetchpriority="high"` lub preload, lżejsze formaty i rozmiary, mniej blokującego CSS/JS.

### Dlaczego nie stosować loading="lazy" na obrazie hero? {#perf-lcp-q2}

Lazy loading opóźnia pobranie do momentu obliczenia layoutu i stwierdzenia, że obraz jest w viewporcie. Dla obrazu LCP oznacza to późniejsze rozpoczęcie pobierania i gorszy wynik.

## Quiz

### Obraz hero ma `loading="lazy"`. Jaki jest efekt? {#perf-lcp-z1}

- [x] Gorszy LCP, bo pobieranie zaczyna się później
- [ ] Lepszy LCP
- [ ] Gorszy CLS
- [ ] Brak efektu

Obraz LCP powinien być ładowany jak najwcześniej, najlepiej z `fetchpriority="high"`.
