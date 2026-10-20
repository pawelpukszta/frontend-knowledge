---
title: Custom properties jako design tokeny
priority: high
sources:
  - title: "MDN: Using CSS custom properties"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties
---

Kolory, odstępy, typografia i promienie jako zmienne CSS (`--color-primary`). Działają w runtime, więc ułatwiają motywy (np. ciemny) i spójność.

## Dlaczego to ważne

- Zmiana koloru marki w jednym miejscu zmienia go w całej aplikacji; bez tokenów trzeba szukać dziesiątek wartości `#0b5fff` i ich wariantów.
- W przeciwieństwie do zmiennych SCSS custom properties istnieją w przeglądarce, więc tryb ciemny, motyw partnera czy wariant komponentu to tylko nadpisanie zmiennych.
- Tokeny są wspólnym językiem z projektantami (Figma Variables) i ograniczają liczbę "prawie takich samych" odcieni i odstępów.

## Jak sprawdzić

Wyszukaj powtarzające się wartości "na sztywno" w arkuszach (np. Stylelint `color-no-hex` poza plikiem tokenów); w DevTools Computed widać, skąd pochodzi wartość zmiennej.

## Kod

```css
:root {
  --color-brand: oklch(55% 0.2 255);
  --color-text: oklch(25% 0.02 255);
  --space-2: 0.5rem;
  --space-4: 1rem;
  --radius-md: 0.5rem;
}
.btn {
  /* Component-level token with a global fallback */
  background: var(--btn-bg, var(--color-brand));
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
}
.btn--partner { --btn-bg: oklch(60% 0.15 145); }
```

## Częste błędy

- Tokeny nazwane wartością (`--blue-500` używany wszędzie) zamiast rolą (`--color-link`), przez co motyw ciemny wymaga zmiany nazw.
