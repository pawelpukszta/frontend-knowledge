---
title: "Custom properties: zmienne CSS, @property i motywy"
level: mid
tags:
  - custom properties
  - "@property"
  - dark mode
  - light-dark
  - design tokens
summary: Custom properties (`--color`) żyją w przeglądarce, podlegają kaskadzie i dziedziczeniu, więc nadają się do motywów i design tokenów. `@property` dodaje im typ, wartość początkową i możliwość animacji.
sources:
  - title: "MDN: Using CSS custom properties (variables)"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
  - title: "MDN: @property"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/@property
  - title: "MDN: light-dark()"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark
  - title: "MDN: color-scheme"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme
  - title: "web.dev: CSS color-scheme-dependent colors with light-dark()"
    url: https://web.dev/articles/light-dark
---

## Wyjaśnienie

Custom property to właściwość CSS, której nazwa zaczyna się od `--`. Odczytujesz ją przez `var(--nazwa)`. Różnica względem zmiennych Sass (opisana w temacie o preprocesorach) sprowadza się do tego, że Sass podstawia wartość przy kompilacji, a custom property istnieje w przeglądarce. Wynikają z tego cechy, których Sass nie da:

- **Kaskada i dziedziczenie.** Wartość ustawiona na `:root` jest widoczna w całym dokumencie, a nadpisana na `.card` tylko w tej karcie i jej potomkach. Zwykła custom property zawsze dziedziczy.
- **Zmiana w runtime.** Możesz ją nadpisać w media query, w `:hover`, w kontenerze albo z JavaScriptu i wszystkie miejsca użycia przeliczą się same.
- **Wielkość liter ma znaczenie**: `--Color` i `--color` to dwie różne właściwości.

**Fallback.** `var(--x, red)` użyje `red`, gdy `--x` nie jest zdefiniowana. Wszystko po pierwszym przecinku jest fallbackiem, więc `var(--font, Inter, sans-serif)` daje fallback `Inter, sans-serif`. Kilka poziomów zapisujesz przez zagnieżdżenie: `var(--a, var(--b, pink))`. Uwaga: przeglądarka nie zna typu zwykłej custom property. Gdy `--x: 16px` trafi do `color`, deklaracja jest nieprawidłowa dopiero w momencie obliczania wartości (invalid at computed-value time). Fallback z `var()` się wtedy nie włączy; `color` dostanie wartość odziedziczoną albo początkową.

**`@property`** rejestruje właściwość z typem: `syntax` (np. `"<color>"`, `"<length>"`, `"<angle>"`), `inherits` i `initial-value`. `syntax` i `inherits` są obowiązkowe, a `initial-value` też, chyba że `syntax` to `"*"`. Zyski: błędna wartość nie psuje stylu, bo zostaje `initial-value`; można wyłączyć dziedziczenie; przeglądarka wie, jak interpolować wartość, więc da się ją animować (np. kąt gradientu). `@property` jest w Baseline 2024 (od lipca 2024 w aktualnych wersjach przeglądarek).

**Motyw ciemny.**

- `prefers-color-scheme: dark` to media query z preferencją systemu.
- `color-scheme: light dark` na `:root` mówi przeglądarce, że strona obsługuje oba schematy. Wtedy pola formularzy, scrollbary i tło płótna też zmieniają kolor. Działa we wszystkich przeglądarkach od 2022 roku. Warto dodać `<meta name="color-scheme" content="light dark">`, żeby uniknąć białego błysku przy ładowaniu.
- `light-dark(jasny, ciemny)` wybiera kolor według aktywnego `color-scheme`, bez osobnego media query. Wymaga ustawionego `color-scheme`. Jest w Baseline 2024 (od maja 2024), więc w starszych przeglądarkach potrzebny jest fallback. Przełącznik motywu w UI sprowadza się wtedy do zmiany `color-scheme` na `light` lub `dark`.

**Design tokens w warstwach.** Duże systemy dzielą zmienne na trzy poziomy:

1. **Prymitywne**: surowa paleta i skala, np. `--blue-600`, `--space-4`. Nie używasz ich w komponentach.
2. **Semantyczne**: znaczenie, np. `--color-bg`, `--color-text`, `--color-danger`. Tu mieszka motyw: dark mode podmienia tylko ten poziom.
3. **Komponentowe**: np. `--button-bg`, domyślnie wskazujące na token semantyczny. Wariant komponentu nadpisuje jedną zmienną zamiast całej reguły.

**Zmiana z JavaScriptu.** `element.style.setProperty('--x', value)` ustawia wartość inline, `getComputedStyle(el).getPropertyValue('--x')` ją odczytuje. Dobrze sprawdza się do wartości liczonych w JS, takich jak wysokość nagłówka czy pozycja kursora: skrypt ustawia jedną zmienną, a reguły CSS same decydują, gdzie jej użyć.

## Kod

```css
:root {
  color-scheme: light dark;
  /* primitive tokens */
  --gray-50: #f7f7f8;
  --gray-900: #1d1d21;
  --blue-600: #2456c7;
  /* semantic tokens: light and dark value in one place */
  --color-bg: light-dark(var(--gray-50), var(--gray-900));
  --color-text: light-dark(var(--gray-900), var(--gray-50));
  --color-accent: var(--blue-600);
}
:root[data-theme="light"] { color-scheme: light; } /* manual override */
:root[data-theme="dark"] { color-scheme: dark; }

body { background: var(--color-bg); color: var(--color-text); }

.button {
  --button-bg: var(--color-accent); /* component token */
  background: var(--button-bg);
  padding: var(--button-padding, 0.5rem 1rem);
}
.button--danger { --button-bg: #c62828; }

@property --angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}
.loader {
  background: conic-gradient(from var(--angle), var(--color-accent), transparent);
  animation: spin 1.5s linear infinite;
}
@keyframes spin { to { --angle: 360deg; } }
```

```js
// Theme toggle: CSS does the rest through color-scheme and light-dark()
document.documentElement.dataset.theme = 'dark';

// Expose a value measured in JS to CSS
const header = document.querySelector('header');
new ResizeObserver(([entry]) => {
  document.documentElement.style.setProperty('--header-height', `${entry.contentRect.height}px`);
}).observe(header);
```

## Częste błędy

- Oczekiwanie, że fallback z `var()` zadziała przy złym typie wartości. Działa tylko, gdy zmienna nie jest zdefiniowana; na typ pomaga `@property`.
- `light-dark()` bez `color-scheme` na `:root`. Funkcja nie wie wtedy, który schemat jest aktywny.
- Animowanie zwykłej custom property przez `@keyframes`. Bez `@property` przeglądarka nie zna typu, więc wartość przeskakuje zamiast płynnie się zmieniać.
- Używanie tokenów prymitywnych (`--blue-600`) bezpośrednio w komponentach. Zmiana motywu wymaga wtedy przeszukania całego kodu.

## Pytania

### Czym różnią się custom properties od zmiennych Sass? {#css-custom-properties-q1}

Zmienna Sass istnieje tylko podczas kompilacji: w wynikowym CSS zostaje sama wartość. Custom property jest zwykłą właściwością CSS w przeglądarce. Podlega kaskadzie i dziedziczeniu, więc można ją nadpisać dla fragmentu drzewa, w media query lub z JavaScriptu, a wszystkie miejsca użycia przeliczą się automatycznie. Dlatego motywy i tokeny robi się na custom properties. Sass zostaje przydatny do rzeczy z czasu budowania, jak pętle i mixiny.

### Jak zrobisz dark mode z możliwością ręcznego przełączenia? {#css-custom-properties-q2}

Na `:root` ustawiam `color-scheme: light dark`, więc domyślnie strona idzie za ustawieniem systemu, a kontrolki formularzy i scrollbary też zmieniają kolor. Tokeny semantyczne definiuję przez `light-dark(jasny, ciemny)`, a komponenty używają tylko tych tokenów. Przełącznik w UI ustawia `data-theme` na `<html>`, a CSS zmienia wtedy `color-scheme` na `light` lub `dark`. Wybór zapisuję w `localStorage` i odczytuję skryptem w `<head>` przed renderem, żeby nie było mignięcia. Dla przeglądarek bez `light-dark()` można dać fallback z `@media (prefers-color-scheme: dark)`.

### Do czego służy `@property`? {#css-custom-properties-q3}

Rejestruje custom property z typem (`syntax`), informacją o dziedziczeniu (`inherits`) i wartością początkową (`initial-value`). Zwykłą custom property przeglądarka traktuje jak ciąg znaków, więc nie umie jej płynnie animować ani odrzucić błędnej wartości. Po rejestracji można animować np. kąt w `conic-gradient` albo procent w gradiencie paska postępu. Przy błędnej wartości zostaje `initial-value`. `inherits: false` przydaje się, gdy zmienna ma dotyczyć tylko jednego elementu, a nie całego poddrzewa.

### Jak zorganizować design tokens w CSS? {#css-custom-properties-q4}

W trzech warstwach. Tokeny prymitywne to paleta i skale (`--blue-600`, `--space-4`). Tokeny semantyczne nadają znaczenie (`--color-text`, `--color-danger`) i tylko one zmieniają się przy motywie. Tokeny komponentowe (`--button-bg`) domyślnie wskazują na semantyczne i pozwalają zrobić wariant przez nadpisanie jednej zmiennej. Komponenty używają tylko tokenów semantycznych i komponentowych. Dzięki temu rebranding to zmiana prymitywów, a dark mode to zmiana warstwy semantycznej.

## Quiz

### `--size: 16px; color: var(--size, red);` Jaki kolor dostanie tekst bez innych reguł? {#css-custom-properties-z1}

- [ ] `red`, bo wartość nie jest kolorem
- [x] Odziedziczony lub początkowy kolor, bo deklaracja jest nieprawidłowa w czasie obliczania
- [ ] Przeglądarka zignoruje `16px` i użyje pierwszego koloru z kaskady w tym samym selektorze
- [ ] `transparent`

Fallback działa tylko dla niezdefiniowanej zmiennej; zła wartość daje invalid at computed-value time.

### Co jest potrzebne, żeby `light-dark()` działało? {#css-custom-properties-z2}

- [ ] `@media (prefers-color-scheme: dark)` wokół reguły
- [x] Ustawiony `color-scheme`, np. `light dark` na `:root`
- [ ] Rejestracja koloru przez `@property`
- [ ] Atrybut `data-theme` na `<html>`

`light-dark()` wybiera wartość według aktywnego `color-scheme` elementu.
