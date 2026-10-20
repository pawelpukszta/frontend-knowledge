---
title: Animacje przez transform i opacity
priority: high
sources:
  - title: "web.dev: Stick to compositor-only properties"
    url: https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count
---

Te właściwości mogą być obsłużone przez compositor na GPU, bez layoutu i paintu. Animacje `top`, `width`, `margin` wymuszają przeliczenia w każdej klatce.

## Dlaczego to ważne

- Przy 60 klatkach na sekundę przeglądarka ma ok. 16 ms na klatkę; animacja `height` czy `left` wymusza layout całej strony i na tańszych telefonach gubi klatki.
- Animacje na compositorze działają płynnie nawet wtedy, gdy główny wątek jest zajęty JavaScriptem.
- Ciężkie animacje zabierają czas głównemu wątkowi i mogą pogorszyć INP (próg dobrego wyniku 200 ms).

## Jak sprawdzić

DevTools Performance (fioletowe bloki Layout podczas animacji), panel Rendering: Paint flashing i Frame Rendering Stats.

## Kod

```css title="Źle"
.drawer { left: -320px; transition: left 300ms; }
.drawer.is-open { left: 0; }
```

```css title="Dobrze"
.drawer { transform: translateX(-100%); transition: transform 300ms ease-out; }
.drawer.is-open { transform: translateX(0); }

@media (prefers-reduced-motion: reduce) {
  .drawer { transition: none; }
}
```

## Częste błędy

- `will-change: transform` na dziesiątkach elementów "na wszelki wypadek"; każda warstwa zużywa pamięć GPU.
