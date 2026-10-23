---
title: Reflow, repaint, composite i layout thrashing
level: senior
added: 2026-10-20
tags:
  - reflow
  - repaint
  - layout thrashing
  - transform
  - will-change
summary: Zmiana geometrii wymusza layout (reflow) i paint, zmiana wyglądu tylko paint, a transform i opacity mogą ominąć oba. Przeplatanie odczytów i zapisów DOM wymusza wielokrotne layouty.
sources:
  - title: "web.dev: Rendering performance"
    url: https://web.dev/articles/rendering-performance
  - title: "web.dev: Avoid large, complex layouts and layout thrashing"
    url: https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing
  - title: "web.dev: Stick to compositor-only properties"
    url: https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count
  - title: "web.dev: content-visibility"
    url: https://web.dev/articles/content-visibility
---

## Wyjaśnienie

Koszt zmiany zależy od etapu pipeline'u, który uruchamia:

- **Layout + Paint + Composite** (najdroższe): `width`, `height`, `top`, `margin`, `font-size`, dodanie elementu do DOM.
- **Paint + Composite**: `color`, `background`, `box-shadow`.
- **Tylko Composite** (najtańsze): `transform`, `opacity` (gdy element ma własną warstwę).

Animacje rób przez `transform` i `opacity`. `will-change: transform` promuje element na osobną warstwę (używaj oszczędnie: każda warstwa zużywa pamięć GPU).

**Forced synchronous layout / layout thrashing**: odczyt właściwości geometrycznej (`offsetHeight`, `getBoundingClientRect()`) po zapisie stylu zmusza przeglądarkę do natychmiastowego layoutu. W pętli to dziesiątki layoutów na klatkę. Rozwiązanie: najpierw wszystkie odczyty, potem wszystkie zapisy; `requestAnimationFrame`; `ResizeObserver`.

Pomocne CSS: `contain: layout paint` i `content-visibility: auto` (przeglądarka pomija renderowanie niewidocznych sekcji).

## Kod

```js
// Layout thrashing: read-write-read-write forces layout on every iteration
cards.forEach((card) => {
  card.style.height = `${card.offsetWidth * 0.75}px`; // read then write, repeatedly
});

// Better: batch reads, then batch writes
const widths = cards.map((c) => c.offsetWidth);
requestAnimationFrame(() => {
  cards.forEach((c, i) => (c.style.height = `${widths[i] * 0.75}px`));
});
```

## Pytania

### Czym różni się reflow od repaint? {#dom-reflow-repaint-q1}

Reflow (layout) to ponowne obliczenie geometrii elementów po zmianie wymiarów, pozycji lub struktury DOM; zwykle pociąga za sobą repaint. Repaint to ponowne malowanie pikseli bez zmiany układu (np. zmiana koloru). Reflow jest droższy.

### Dlaczego animować transform zamiast left/top? {#dom-reflow-repaint-q2}

`left`/`top` wymuszają layout i paint w każdej klatce. `transform` i `opacity` mogą być obsłużone przez compositor na GPU, bez layoutu i paintu, co daje płynne 60 fps i nie obciąża wątku głównego.

### Czym jest layout thrashing? {#dom-reflow-repaint-q3}

Przeplatanie zapisów stylów i odczytów geometrii w pętli, które zmusza przeglądarkę do wielu synchronicznych przeliczeń layoutu w jednej klatce. Naprawia się to grupowaniem odczytów i zapisów.

## Quiz

### Która właściwość CSS przy animacji najczęściej omija layout i paint? {#dom-reflow-repaint-z1}

- [ ] top
- [ ] width
- [x] transform
- [ ] margin

`transform` i `opacity` mogą być obsłużone przez compositor.
