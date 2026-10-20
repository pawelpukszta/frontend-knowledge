---
title: Flexbox vs Grid
level: mid
tags:
  - flexbox
  - grid
  - layout
  - subgrid
summary: Flexbox układa elementy w jednym wymiarze (wiersz lub kolumna) i dopasowuje się do treści. Grid układa w dwóch wymiarach według zdefiniowanej siatki.
sources:
  - title: "MDN: Relationship of grid layout to other layout methods"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Relationship_of_grid_layout_with_other_layout_methods
  - title: "CSS-Tricks: A Complete Guide to Flexbox"
    url: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
  - title: "CSS-Tricks: A Complete Guide to CSS Grid"
    url: https://css-tricks.com/snippets/css/complete-guide-grid/
---

## Wyjaśnienie

**Flexbox** (1D, content-first): paski narzędzi, nawigacja, wyrównanie elementów w rzędzie, rozkładanie wolnego miejsca (`flex: 1`), centrowanie.

**Grid** (2D, layout-first): układ strony, galerie, karty w równych kolumnach, obszary nazwane (`grid-template-areas`), nakładanie elementów. **Subgrid** pozwala dzieciom wyrównać się do siatki rodzica (np. równe wysokości sekcji w kartach).

Oba wspierają `gap`. Często łączy się je: Grid na układ, Flexbox wewnątrz komponentów.

## Kod

```css
/* Responsive card grid without media queries */
.offers {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

/* Toolbar: items in a row, last one pushed to the end */
.toolbar { display: flex; align-items: center; gap: 8px; }
.toolbar .spacer { margin-inline-start: auto; }

/* Perfect centering */
.center { display: grid; place-items: center; }
```

## Pytania

### Kiedy Flexbox, a kiedy Grid? {#css-flex-grid-q1}

Flexbox dla układów jednowymiarowych, gdzie rozmiar wynika z treści (nawigacja, przyciski, wyrównanie w wierszu). Grid dla dwuwymiarowych układów o z góry zdefiniowanej strukturze (layout strony, siatka kart, galerie). W praktyce łączy się oba.

### Jak zrobić responsywną siatkę kart bez media queries? {#css-flex-grid-q2}

`grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))`. Przeglądarka sama dopasuje liczbę kolumn do szerokości kontenera.

## Quiz

### Który układ jest dwuwymiarowy (wiersze i kolumny jednocześnie)? {#css-flex-grid-z1}

- [ ] Flexbox
- [x] Grid
- [ ] Float
- [ ] inline-block

Grid definiuje siatkę w dwóch wymiarach, Flexbox działa w jednym.
