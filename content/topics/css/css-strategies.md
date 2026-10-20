---
title: "Strategie stylowania: CSS Modules, Tailwind, CSS-in-JS, Sass"
level: senior
tags:
  - Tailwind
  - CSS Modules
  - CSS-in-JS
  - Sass
  - SCSS
  - BEM
summary: Każde podejście inaczej rozwiązuje zasięg nazw, reużywalność i wydajność. Wybór zależy od zespołu, design systemu i architektury renderowania (np. Server Components).
sources:
  - title: "Tailwind CSS: Styling with utility classes"
    url: https://tailwindcss.com/docs/styling-with-utility-classes
  - title: "GitHub: CSS Modules"
    url: https://github.com/css-modules/css-modules
  - title: "Sass: Documentation"
    url: https://sass-lang.com/documentation/
  - title: "MDN: CSS nesting"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting
---

## Wyjaśnienie

| Podejście | Plusy | Minusy |
|---|---|---|
| **CSS Modules** | lokalny zasięg klas, zwykły CSS, zero runtime | osobne pliki, dzielenie tokenów przez zmienne CSS |
| **Tailwind CSS** | szybki development, spójność z tokenami, mały CSS (tylko użyte klasy) | "gęste" className, krzywa nauki, potrzeba konwencji (`cva`, `tailwind-merge`) |
| **Runtime CSS-in-JS** (styled-components, Emotion) | style obok komponentu, dynamiczne wartości | koszt w runtime, problemy z Server Components i streamingiem |
| **Zero-runtime CSS-in-JS** (vanilla-extract, Panda, StyleX) | typowane style, brak kosztu runtime | krok buildu, mniejszy ekosystem |
| **Sass/SCSS** | zmienne, mixiny, zagnieżdżanie, dojrzałe | natywny CSS ma już zmienne i zagnieżdżanie; globalny zasięg (BEM) |

Nowoczesny natywny CSS: zmienne (custom properties), **nesting**, `@layer`, `:has()`, container queries, `color-mix()`. Wiele powodów używania preprocesorów zniknęło.

## Pytania

### Jakie podejście do stylowania wybrałbyś do nowej aplikacji Next.js? {#css-strategies-q1}

Zależy od zespołu i design systemu. Tailwind lub CSS Modules dobrze działają z Server Components (brak runtime). Tailwind: szybkie iteracje i spójne tokeny kosztem czytelności klas. CSS Modules: zwykły CSS i lokalny zasięg, ale więcej plików. Runtime CSS-in-JS odradzam w RSC ze względu na koszt i ograniczenia. Długofalowo liczy się spójność tokenów niezależnie od narzędzia.

### Dlaczego runtime CSS-in-JS traci popularność? {#css-strategies-q2}

Generuje style w trakcie renderu (koszt CPU, gorszy INP), wymaga dodatkowej konfiguracji przy SSR i słabo współpracuje z React Server Components i streamingiem. Alternatywy zero-runtime i Tailwind dają podobne DX bez tych kosztów.
