---
title: "Preprocesory CSS: Sass/SCSS, Less i PostCSS"
level: mid
tags:
  - Sass
  - SCSS
  - Less
  - PostCSS
  - preprocesor
  - mixin
  - "@use"
summary: Preprocesor to język kompilowany do zwykłego CSS, który dodaje zmienne, zagnieżdżanie, mixiny, funkcje i moduły. Najpopularniejszy jest Sass (składnia SCSS). PostCSS to z kolei narzędzie do transformacji gotowego CSS wtyczkami.
sources:
  - title: "Sass: Documentation"
    url: https://sass-lang.com/documentation/
  - title: "Sass: @use"
    url: https://sass-lang.com/documentation/at-rules/use/
  - title: "Sass: Breaking change: @import and global built-in functions"
    url: https://sass-lang.com/documentation/breaking-changes/import/
  - title: "MDN Glossary: CSS preprocessor"
    url: https://developer.mozilla.org/en-US/docs/Glossary/CSS_preprocessor
  - title: PostCSS
    url: https://postcss.org/
  - title: Less
    url: https://lesscss.org/
---

## Wyjaśnienie

**Sass/SCSS** (standard branżowy, implementacja Dart Sass):

- Zmienne `$color`, zagnieżdżanie z `&`, **mixiny** (`@mixin` / `@include`), **dziedziczenie** `@extend` i placeholdery `%`, funkcje, pętle `@each` / `@for`, warunki `@if`, operacje matematyczne.
- **System modułów**: `@use` i `@forward` z przestrzeniami nazw. Stare `@import` jest **przestarzałe** (Dart Sass 1.80+) i zostanie usunięte w Dart Sass 3.0.
- Składnia `.scss` (nadzbiór CSS, klamry) i starsza `.sass` (wcięcia).
- LibSass i node-sass są wycofane; używa się pakietu `sass` (Dart Sass). Vite i Next.js obsługują go po instalacji paczki.

**Less**: podobne możliwości (zmienne `@color`, mixiny jako klasy); dziś rzadziej wybierany, spotykany w starszych projektach (np. Bootstrap 3, Ant Design).

**PostCSS**: nie jest preprocesorem w tradycyjnym sensie, tylko platformą wtyczek działającą na drzewie CSS: **Autoprefixer** (prefiksy przeglądarek), `postcss-preset-env` (nowe funkcje CSS dla starszych przeglądarek), minifikacja (cssnano), a także Tailwind CSS.

**Czy preprocesor jest dziś potrzebny?** Natywny CSS ma już zmienne (custom properties, działające w runtime i z kaskadą), zagnieżdżanie, `@layer`, `color-mix()`, `calc()`. Sass nadal daje mixiny, pętle, funkcje i moduły w czasie buildu, przydatne w dużych design systemach. Decyzja: nowy projekt z Tailwind lub CSS Modules często nie potrzebuje Sass. Za Sass: dojrzałe narzędzia i generowanie wariantów. Przeciw: dodatkowy krok buildu i zmienne tylko w czasie kompilacji. Długofalowo: im więcej robi natywny CSS, tym mniej kodu zależy od preprocesora.

## Kod

```scss
// _tokens.scss
@use 'sass:map';
$breakpoints: (sm: 640px, md: 768px, lg: 1024px);

@mixin up($bp) {
  @media (min-width: map.get($breakpoints, $bp)) { @content; }
}

// card.scss
@use 'tokens' as t;

.card {
  padding: 1rem;
  &__title { font-weight: 600; }          // BEM element: .card__title
  &:hover { box-shadow: 0 2px 8px rgb(0 0 0 / 10%); }
  @include t.up(md) { padding: 2rem; }
}

@each $status, $color in (available: green, sold-out: gray) {
  .badge--#{$status} { color: $color; }  // generates two classes
}
```

## Pytania

### Czym są preprocesory CSS? {#css-preprocessors-q1}

Językami (np. Sass/SCSS, Less), które rozszerzają CSS o zmienne, zagnieżdżanie, mixiny, funkcje, pętle i moduły, a następnie są kompilowane do zwykłego CSS w czasie budowania. Poprawiają organizację i reużywalność stylów. Przeglądarka dostaje wyłącznie wynikowy CSS.

### Czym różnią się zmienne Sass od zmiennych CSS? {#css-preprocessors-q2}

Zmienne Sass (`$color`) istnieją tylko w czasie kompilacji i są podstawiane jako wartości. Custom properties (`--color`) działają w przeglądarce: podlegają kaskadzie i dziedziczeniu, można je zmieniać w media queries, per komponent i z JavaScriptu (np. motyw ciemny).

### Czym jest PostCSS? {#css-preprocessors-q3}

Narzędziem, które parsuje CSS do drzewa i przepuszcza je przez wtyczki: Autoprefixer, postcss-preset-env, minifikacja, Tailwind. Działa na CSS po lub zamiast preprocesora; w wielu projektach jest skonfigurowany domyślnie przez bundler.

## Quiz

### Zmienne Sass ($color) w odróżnieniu od custom properties (--color): {#css-preprocessors-z1}

- [x] Istnieją tylko w czasie kompilacji
- [ ] Działają w runtime i podlegają kaskadzie
- [ ] Można je zmieniać z JavaScriptu
- [ ] Są szybsze w przeglądarce

Po kompilacji zostają tylko wartości; custom properties żyją w przeglądarce.
