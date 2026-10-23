---
title: "Optymalizacja ładowania: lazy loading, preload, prefetch, obrazy"
level: mid
added: 2026-10-20
tags:
  - lazy loading
  - preload
  - prefetch
  - preconnect
  - obrazy
  - fonty
summary: Ładuj najpierw to, co krytyczne, a resztę później. Resource hints mówią przeglądarce, co pobrać wcześniej, a lazy loading odkłada to, czego nie widać.
sources:
  - title: "web.dev: Preload critical assets"
    url: https://web.dev/articles/preload-critical-assets
  - title: "web.dev: Browser-level image lazy loading"
    url: https://web.dev/articles/browser-level-image-lazy-loading
  - title: "MDN: rel=preload"
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preload
  - title: "Chrome: Speculation Rules API (prerender pages)"
    url: https://developer.chrome.com/docs/web-platform/prerender-pages
---

## Wyjaśnienie

**Resource hints:**

- `<link rel="preconnect" href="https://cdn...">`: nawiąż połączenie (DNS, TCP, TLS) z ważnym originem zawczasu.
- `<link rel="dns-prefetch">`: tylko DNS, tańsze.
- `<link rel="preload" as="image|font|script">`: pobierz **teraz** zasób potrzebny na **tej** stronie, który zostałby odkryty późno (font z CSS, obraz LCP z JS). Fonty wymagają `crossorigin`.
- `<link rel="prefetch">`: pobierz z niskim priorytetem zasób dla **kolejnej** nawigacji.
- **Speculation Rules API**: prerender lub prefetch całych stron, na które użytkownik prawdopodobnie przejdzie.
- `fetchpriority="high|low"`: korekta priorytetu.

**Lazy loading:**

- Obrazy i iframe poniżej zgięcia: `loading="lazy"`.
- Komponenty i trasy: dynamic import, `React.lazy`, `next/dynamic`.
- Skrypty third-party (czaty, mapy): ładuj po interakcji lub w idle ("facade pattern").

**Obrazy:** AVIF/WebP, `srcset` i `sizes`, wymiary, kompresja, CDN obrazów, `decoding="async"`.

**Kompresja i transfer:** Brotli/gzip, HTTP/2 lub HTTP/3, cache z hashami plików.

## Kod

```html
<link rel="preconnect" href="https://images.example-cdn.com" crossorigin />
<link rel="preload" href="/fonts/brand.woff2" as="font" type="font/woff2" crossorigin />
<link rel="prefetch" href="/checkout.js" />

<img src="/gallery-3.webp" loading="lazy" width="600" height="400" alt="Basen hotelowy" />

<script type="speculationrules">
{ "prerender": [{ "where": { "href_matches": "/oferta/*" }, "eagerness": "moderate" }] }
</script>
```

## Częste błędy

- Preload zbyt wielu zasobów: konkurują o łącze i spowalniają to, co naprawdę ważne.
- Preload bez późniejszego użycia (ostrzeżenie w konsoli).
- Lazy loading wszystkiego, łącznie z hero.

## Pytania

### Różnica między preload a prefetch? {#perf-loading-optimizations-q1}

`preload` pobiera z wysokim priorytetem zasób potrzebny na bieżącej stronie, który przeglądarka odkryłaby późno. `prefetch` pobiera z niskim priorytetem zasób, który prawdopodobnie przyda się przy kolejnej nawigacji.

### Co to jest preconnect i kiedy go użyć? {#perf-loading-optimizations-q2}

Wskazówka, by z wyprzedzeniem nawiązać połączenie (DNS, TCP, TLS) z innym originem. Warto dla 1-3 krytycznych domen (CDN obrazów, API, fonty), z których zasoby są potrzebne od razu.

### Jak zoptymalizować obrazy na stronie z ofertami? {#perf-loading-optimizations-q3}

Nowoczesne formaty (AVIF/WebP) przez CDN obrazów, responsywne `srcset`/`sizes`, wymiary lub `aspect-ratio` (CLS), `fetchpriority="high"` dla obrazu LCP, `loading="lazy"` dla galerii poniżej zgięcia, kompresja jakości dopasowana do treści.

## Quiz

### Który hint pobiera zasób dla KOLEJNEJ nawigacji z niskim priorytetem? {#perf-loading-optimizations-z1}

- [ ] preload
- [x] prefetch
- [ ] preconnect
- [ ] fetchpriority="high"

`prefetch` jest dla przyszłych stron, `preload` dla bieżącej.
